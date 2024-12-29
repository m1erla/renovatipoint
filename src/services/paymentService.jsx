import api from "../utils/api";
import expertService from "./expertService";

const setupSepaPayment = async (sepaPaymentData) => {
  const token = localStorage.getItem("accessToken"); // Retrieve JWT from localStorage
  const response = await api.post(
    `/api/v1/experts/setup-sepa`,
    sepaPaymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT token
      },
    }
  );
  return response.data;
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
    const response = await expertService.getPaymentInfo(expertId);

    if (!response.ok) {
      throw new Error("Failed to check payment setup");
    }

    const data = await response.json();
    return {
      hasPaymentSetup: data.hasPaymentSetup,
      stripeCustomerId: data.stripeCustomerId,
    };
  } catch (error) {
    console.error("Error checking payment setup:", error);
    throw error;
  }
};

// const chargeExpert = async (expertId, amount, reason) => {
//   try {
//     // First check if expert has payment setup
//     const paymentSetup = await checkExpertPaymentSetup(expertId);

//     if (!paymentSetup.hasPaymentSetup) {
//       throw new Error("Expert has not set up payment information");
//     }

//     // Process the charge
//     const response = await api.post("/api/v1/payments/charge", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//       body: JSON.stringify({
//         customerId: paymentSetup.stripeCustomerId,
//         amount: amount,
//         reason: reason,
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Payment failed");
//     }

//     const result = await response.json();

//     // Handle different payment states
//     if (result.requiresAction) {
//       // Handle additional actions if needed
//       return { status: "requires_action", ...result };
//     }

//     return { status: "succeeded", ...result };
//   } catch (error) {
//     console.error("Payment processing error:", error);
//     throw error;
//   }
// };

// Ödeme servisi için hata yönetimi geliştirmeleri
const chargeExpert = async (expertId, amount, reason) => {
  try {
    // First get the expert's payment information
    const expertInfo = await expertService.getPaymentInfo(expertId);

    if (!expertInfo.hasPaymentSetup || !expertInfo.stripeCustomerId) {
      throw new Error("Expert has not set up payment information");
    }

    // Create the charge using the expert's Stripe customer ID
    const response = await api.post("/api/v1/payments/charge", null, {
      params: {
        customerId: expertInfo.stripeCustomerId, // Use the actual Stripe customer ID
        amount: amount,
        reason: reason,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Payment processing error:", error);
    throw new Error(
      error.response?.data?.message || "Payment processing failed"
    );
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
const processContactInfoPayment = async (expertId, amount) => {
  try {
    // Get expert's payment info first
    const paymentInfo = await expertService.getPaymentInfo(expertId);

    if (!paymentInfo.hasPaymentSetup) {
      throw new Error("Expert has not set up payment information");
    }

    // Process the payment using the existing payment service
    const paymentResult = await chargeExpert(
      paymentInfo.stripeCustomerId,
      amount,
      "CONTACT_INFO_SHARE"
    );

    return paymentResult;
  } catch (error) {
    console.error("Error processing contact info payment:", error);
    throw error;
  }
};
export default {
  setupSepaPayment,
  createSepaPaymentIntent,
  chargeExpert,
  checkExpertPaymentSetup,
  checkExpertPaymentEligibility,
  processContactInfoPayment,
};

// const chargeExpert = async (customerId, amount, reason) => {
//   try {
//     // Create URL with query parameters
//     const url = `/api/v1/payments/charge?customerId=${encodeURIComponent(
//       customerId
//     )}&amount=${encodeURIComponent(amount)}`;

//     const response = await api.post(url, null, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Payment error:", error);
//     throw error;
//   }
// };
