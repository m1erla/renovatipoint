import api from "../utils/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }
  return { Authorization: `Bearer ${token}` };
};

const getProfile = async () => {
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
  const response = await api.get(`/api/v1/experts/responseExpert`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send the token in the Authorization header
    },
  });
  return response.data;
};
const getExpertProfile = async () => {
  try {
    const response = await api.get(`/api/v1/experts/responseExpert`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
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
const registerExpert = async (expertData) => {
  try {
    // First validate that we have a job title ID
    if (!expertData.jobTitleId) {
      throw new Error("Job title selection is required");
    }

    // Create the registration request with proper job title information
    const registrationData = {
      name: expertData.name,
      surname: expertData.surname,
      email: expertData.email,
      password: expertData.password,
      jobTitleId: expertData.jobTitleId, // Make sure this is being passed
      jobTitleName: expertData.jobTitleName, // Include this for reference
      postCode: expertData.postCode,
      phoneNumber: expertData.phoneNumber,
      address: expertData.address,
      role: "EXPERT", // Explicitly set the role
    };

    console.log("Sending expert registration data:", registrationData); // Debug log

    const response = await api.post(
      "/api/v1/auth/expertRegister",
      registrationData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Expert registration error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to register expert"
    );
  }
};

const getPaymentInfo = async (expertId) => {
  try {
    const response = await api.get(`/api/v1/experts/${expertId}/payment-info`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expert payment info:", error);
    throw error;
  }
};

export default {
  getPaymentInfo,
  registerExpert,
  getProfile,
  getExpertById,
  getExpertProfile,
};
