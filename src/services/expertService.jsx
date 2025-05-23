import api from "../utils/api";
import { mockExperts } from "../../src/services/mockExpertData"
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }
  return { Authorization: `Bearer ${token}` };
};




const getAllExperts = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real scenario, you would fetch from an API:
    // try {
    //   const response = await api.get('/experts');
    //   return response.data;
    // } catch (error) {
    //   console.error('Failed to fetch experts:', error);
    //   throw error;
    // }

    // Return mock data for now
    return mockExperts;
  };

const getExpertProfile = async () => {
  try {
    const response = await api.get(`/api/v1/experts/responseExpert`, {
      headers: getAuthHeader(),
    });

    if (!response.data) {
      throw new Error("No data received from expert profile endpoint");
    }

    return response.data;
  } catch (error) {
    console.error("Expert profile error:", {
      message: error.message,
      response: error.response,
      status: error.response?.status,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
};

const getExpertById = async (expertId) => {
  try {
    const response = await api.get(`/api/v1/experts/${expertId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expert:", error);
    throw error;
  }
};

const getPaymentInfo = async (expertId) => {
  try {
    // Token kontrolü
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    }

    const response = await api.get(`/api/v1/experts/${expertId}/payment-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Debug - Expert payment info response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting expert payment info:", error);

    // 401 hatası kontrolü
    if (error.response?.status === 401) {
      throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    }

    throw error;
  }
};

const createStripeCustomer = async () => {
  try {
    const response = await api.post(
      `/api/v1/experts/create-stripe-customer`,
      null,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating stripe customer:", error);
    throw error;
  }
};

const attachPaymentMethod = async (paymentMethodData) => {
  try {
    const response = await api.post(
      `/api/v1/experts/attach-payment-method`,
      paymentMethodData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error attaching payment method:", error);
    throw error;
  }
};

const updateExpertProfile = async (updateData) => {
  try {
    const response = await api.put(
      `/api/v1/experts/${updateData.id}`,
      updateData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expert profile:", error);
    throw error;
  }
};

export default {
  getPaymentInfo,
  getExpertById,
  getExpertProfile,
  createStripeCustomer,
  attachPaymentMethod,
  updateExpertProfile,
  getAllExperts
};
