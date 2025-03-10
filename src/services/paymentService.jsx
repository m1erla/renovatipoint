import api from "../utils/api";
import expertService from "./expertService";

const setupSepaPayment = async (sepaPaymentData) => {
  try {
    console.log("Debug - Setting up SEPA payment with data:", sepaPaymentData);
    const token = localStorage.getItem("accessToken");

    // Önce Stripe customer ID'yi kontrol et
    const userId = localStorage.getItem("userId");
    let stripeCustomerId = null;

    try {
      const paymentInfo = await api.get(
        `/api/v1/experts/${userId}/payment-info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      stripeCustomerId = paymentInfo.data.stripeCustomerId;
    } catch (error) {
      console.log(
        "No existing payment info found, creating new Stripe customer"
      );
    }

    // Eğer Stripe customer ID yoksa, yeni bir customer oluştur
    if (!stripeCustomerId) {
      const customerResponse = await api.post(
        `/api/v1/experts/create-stripe-customer`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      stripeCustomerId = customerResponse.data.stripeCustomerId;
    }

    // SEPA kurulumunu yap
    const response = await api.post(
      `/api/v1/experts/setup-sepa`,
      {
        ...sepaPaymentData,
        stripeCustomerId: stripeCustomerId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Debug - SEPA setup response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to setup SEPA payment");
    }

    return response.data;
  } catch (error) {
    console.error("Error in SEPA setup:", error);
    throw error;
  }
};

// Yeni fonksiyon: SEPA kurulumunu sıfırla ve yeniden yap
const resetAndSetupSepaPayment = async (sepaPaymentData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    // Önce mevcut payment info'yu al
    const paymentInfo = await api.get(
      `/api/v1/experts/${userId}/payment-info`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // SEPA kurulumunu yeniden yap
    return await setupSepaPayment({
      ...sepaPaymentData,
      forceReset: true, // Backend'e bu isteğin bir reset olduğunu bildir
    });
  } catch (error) {
    console.error("Error in SEPA reset and setup:", error);
    throw error;
  }
};

const createSepaPaymentIntent = async (paymentData) => {
  const response = await api.post(
    `/api/v1/payments/create-sepa-payment-intent`,
    paymentData
  );
  return response.data;
};

const checkExpertPaymentSetup = async (expertId) => {
  try {
    console.log("Debug - Checking expert payment setup for ID:", expertId);
    const response = await api.get(`/api/v1/experts/${expertId}/payment-info`);
    console.log("Debug - Expert payment info response:", response.data);

    // Eğer response.data null ise
    if (!response.data) {
      console.log("Debug - No payment info found");
      return {
        hasPaymentSetup: false,
        stripeCustomerId: null,
        paymentMethodId: null,
      };
    }

    // PaymentInfo nesnesinin tüm gerekli alanlarını kontrol et
    const hasAllRequiredFields =
      response.data.hasPaymentSetup === true && // Özellikle true olmasını kontrol et
      response.data.stripeCustomerId &&
      response.data.paymentMethodId &&
      response.data.iban &&
      response.data.bic &&
      response.data.bankName;

    console.log("Debug - Has all required fields:", hasAllRequiredFields);

    if (!hasAllRequiredFields) {
      let missingFields = [];
      if (!response.data.stripeCustomerId)
        missingFields.push("Stripe Customer ID");
      if (!response.data.paymentMethodId) missingFields.push("Payment Method");
      if (!response.data.iban) missingFields.push("IBAN");
      if (!response.data.bic) missingFields.push("BIC");
      if (!response.data.bankName) missingFields.push("Bank Name");

      console.log("Debug - Missing fields:", missingFields);
    }

    return {
      hasPaymentSetup: hasAllRequiredFields,
      stripeCustomerId: response.data.stripeCustomerId || null,
      paymentMethodId: response.data.paymentMethodId || null,
      iban: response.data.iban || null,
      bic: response.data.bic || null,
      bankName: response.data.bankName || null,
    };
  } catch (error) {
    console.error("Error checking payment setup:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Failed to check expert payment setup"
    );
  }
};

const getPaymentMethods = async () => {
  try {
    console.log("PaymentService: Starting to fetch payment methods...");
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    console.log("PaymentService: Auth state", {
      hasToken: !!token,
      userId: userId,
      tokenFirstChars: token ? token.substring(0, 10) + "..." : null,
    });

    if (!token || !userId) {
      throw new Error("No access token or user ID found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await api.get(
      `/api/v1/experts/${userId}/payment-info`,
      config
    );

    console.log("PaymentService: Response received:", {
      status: response.status,
      hasData: !!response.data,
      data: response.data,
    });

    // Transform the response to match the expected format
    const paymentMethods = [];

    if (response.data.hasPaymentSetup) {
      // Add SEPA bank account if exists
      paymentMethods.push({
        id: "bank-" + response.data.stripeCustomerId,
        type: "BANK",
        last4: response.data.lastFourDigits,
        bankName: response.data.bankName || "SEPA Account",
        createdAt: new Date().toISOString(),
      });
    }

    return paymentMethods;
  } catch (error) {
    console.error("PaymentService: Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      requestConfig: error.config,
    });

    if (error.response?.status === 401) {
      console.log("PaymentService: 401 error detected, throwing auth error");
      throw new Error("Authentication failed. Please login again.");
    }

    throw error;
  }
};

const handleRemovePaymentMethod = async (methodId, type) => {
  try {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("No access token or user ID found");
    }

    const response = await api.delete(
      `/api/v1/experts/${userId}/payment-method`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          type: type, // 'CARD' or 'BANK'
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error removing payment method:", error);
    throw error;
  }
};

// Ödeme servisi için hata yönetimi geliştirmeleri
const chargeExpert = async (expertId, amount, reason) => {
  try {
    console.log("Debug - Charging expert with ID:", expertId);

    // First get the expert's payment information
    const expertInfo = await expertService.getPaymentInfo(expertId);
    console.log("Debug - Expert payment info:", expertInfo);

    if (
      !expertInfo ||
      !expertInfo.hasPaymentSetup ||
      !expertInfo.stripeCustomerId ||
      !expertInfo.paymentMethodId
    ) {
      throw new Error("Expert has not set up payment information completely");
    }

    // Create the charge using the expert's Stripe customer ID
    const response = await api.post(
      `/api/v1/payments/charge`,
      {
        expertId: expertId,
        stripeCustomerId: expertInfo.stripeCustomerId,
        paymentMethodId: expertInfo.paymentMethodId,
        amount: amount,
        reason: reason,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Debug - Payment response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Payment processing error:", error);
    if (error.response?.data?.message) {
      throw new Error(
        `Payment processing failed: ${error.response.data.message}`
      );
    } else if (error.message) {
      throw new Error(`Payment processing failed: ${error.message}`);
    } else {
      throw new Error("Payment processing failed: Unknown error");
    }
  }
};

const checkExpertPaymentEligibility = async (expertId) => {
  try {
    // Get expert's payment information
    const paymentInfo = await expertService.getPaymentInfo(expertId);

    if (!paymentInfo.hasPaymentSetup) {
      throw new Error("Expert has not set up payment information");
    }

    return paymentInfo;
  } catch (error) {
    console.error("Error checking expert payment eligibility:", error);
    throw error;
  }
};
const processContactInfoPayment = async (expertId) => {
  try {
    console.log(
      "Debug - Processing contact info payment for expert:",
      expertId
    );

    // Token kontrolü
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Session expired. Please login again.");
    }

    if (!expertId) {
      throw new Error("Expert ID is required");
    }

    // Get expert's payment info first
    const paymentInfo = await expertService.getPaymentInfo(expertId);
    console.log("Debug - Expert payment info:", {
      hasPaymentSetup: paymentInfo?.hasPaymentSetup,
      stripeCustomerId: paymentInfo?.stripeCustomerId,
      paymentMethodId: paymentInfo?.paymentMethodId,
    });

    if (
      !paymentInfo ||
      !paymentInfo.hasPaymentSetup ||
      !paymentInfo.stripeCustomerId ||
      !paymentInfo.paymentMethodId
    ) {
      throw new Error("Expert has not set up payment information completely");
    }

    // Process the payment using the expert's payment information
    const paymentResult = await api.post(
      `/api/v1/payments/charge`,
      {
        expertId: expertId,
        stripeCustomerId: paymentInfo.stripeCustomerId,
        paymentMethodId: paymentInfo.paymentMethodId,
        amount: 100, // 1 Euro in cents
        currency: "eur",
        paymentType: "CONTACT_INFO",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Debug - Payment result:", paymentResult.data);

    // Başarı kontrolü - paymentResult.data.success yerine status kontrolü yapıyoruz
    if (!paymentResult.data || !paymentResult.data.paymentIntentId) {
      throw new Error("Invalid payment response");
    }

    // Ödeme durumunu kontrol et
    if (
      paymentResult.data.status === "processing" ||
      paymentResult.data.status === "requires_confirmation"
    ) {
      // Processing durumunda ödeme durumunu kontrol et
      let attempts = 0;
      const maxAttempts = 10; // Daha uzun süre bekle
      let paymentSucceeded = false;

      while (attempts < maxAttempts) {
        // Her status kontrolünde token'ı yeniden al
        const currentToken = localStorage.getItem("accessToken");
        if (!currentToken) {
          throw new Error("Session expired. Please login again.");
        }

        const statusCheck = await api.get(
          `/api/v1/payments/payment-intents/${paymentResult.data.paymentIntentId}/status`,
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Debug - Payment status check:", statusCheck.data);

        if (statusCheck.data.status === "succeeded") {
          paymentSucceeded = true;
          return {
            success: true,
            status: "succeeded",
            requiresAction: false,
            clientSecret: paymentResult.data.clientSecret,
            paymentIntentId: paymentResult.data.paymentIntentId,
          };
        } else if (
          statusCheck.data.status === "failed" ||
          statusCheck.data.status === "canceled"
        ) {
          throw new Error("Payment failed");
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 saniye bekle

        if (attempts >= maxAttempts && !paymentSucceeded) {
          throw new Error("Payment verification timeout");
        }
      }
    } else if (paymentResult.data.status === "succeeded") {
      return {
        success: true,
        status: "succeeded",
        requiresAction: false,
        clientSecret: paymentResult.data.clientSecret,
        paymentIntentId: paymentResult.data.paymentIntentId,
      };
    } else {
      throw new Error("Payment failed: " + paymentResult.data.status);
    }
  } catch (error) {
    console.error("Error processing contact info payment:", error);

    // Token ve yetkilendirme hatalarını kontrol et
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired. Please login again.");
    }

    // Diğer API hataları için
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

const processCompletionPayment = async (expertId, amount) => {
  try {
    console.log("Debug - Processing completion payment for expert:", expertId);
    console.log("Debug - Payment amount:", amount);

    // Token kontrolü
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Session expired. Please login again.");
    }

    if (!expertId) {
      throw new Error("Expert ID is required");
    }

    // Get expert's payment info first
    const paymentInfo = await expertService.getPaymentInfo(expertId);
    console.log("Debug - Expert payment info:", {
      hasPaymentSetup: paymentInfo?.hasPaymentSetup,
      stripeCustomerId: paymentInfo?.stripeCustomerId,
      paymentMethodId: paymentInfo?.paymentMethodId,
    });

    if (
      !paymentInfo ||
      !paymentInfo.hasPaymentSetup ||
      !paymentInfo.stripeCustomerId ||
      !paymentInfo.paymentMethodId
    ) {
      throw new Error("Expert has not set up payment information completely");
    }

    // Process the payment using the existing payment service
    const paymentResult = await api.post(
      `/api/v1/payments/create-sepa-payment-intent`,
      {
        expertId: expertId,
        amount: amount * 100, // Convert to cents
        currency: "eur",
        paymentType: "JOB_COMPLETION",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return paymentResult.data;
  } catch (error) {
    console.error("Error processing completion payment:", error);

    // Token ve yetkilendirme hatalarını kontrol et
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};

const getPaymentReceiptUrl = async (paymentIntentId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Session expired. Please login again.");
    }

    const response = await api.get(
      `/api/v1/payments/receipt/${paymentIntentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting payment receipt URL:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};

const deleteStripeCustomer = async (customerId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Session expired. Please login again.");
    }

    const response = await api.delete(
      `/api/v1/payments/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting stripe customer:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};

const createAndConfirmPayment = async (paymentData) => {
  try {
    const response = await api.post(
      `/api/v1/payments/create-confirm`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating and confirming payment:", error);
    throw error;
  }
};

export const paymentService = {
  setupSepaPayment,
  createSepaPaymentIntent,
  chargeExpert,
  checkExpertPaymentSetup,
  checkExpertPaymentEligibility,
  processContactInfoPayment,
  processCompletionPayment,
  getPaymentMethods,
  handleRemovePaymentMethod,
  getPaymentReceiptUrl,
  deleteStripeCustomer,
  createAndConfirmPayment,
  resetAndSetupSepaPayment,
};
