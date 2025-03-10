import api from "../utils/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }
  return { Authorization: `Bearer ${token}` };
};

const getCurrentUserInfo = async () => {
  try {
    const response = await api.get("/api/v1/users/current", {
      headers: getAuthHeader(),
    });
    return {
      name: response.data.name,
      phone: response.data.phoneNumber,
      email: response.data.email,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Could not retrieve user information");
  }
};

const updateUserInfo = async (userInfo) => {
  try {
    const response = await api.put("/api/v1/users/update", userInfo, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw new Error("Could not update user information");
  }
};

const getProfile = async () => {
  const response = await api.get("/api/v1/users/response", {
    headers: getAuthHeader(),
  });
  return response.data;
};

const getUserProfile = async () => {
  const response = await api.get("/api/v1/users/response", {
    headers: getAuthHeader(),
  });
  return response.data;
};

const getUserProfileById = async (userId) => {
  const response = await api.get(`/api/v1/users/${userId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default {
  getCurrentUserInfo,
  updateUserInfo,
  getProfile,
  getUserProfileById,
  getUserProfile,
};
