import api from "../utils/api";

const getCurrentUserInfo = async () => {
  try {
    const response = await fetch("/api/v1/users/current", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user information");
    }

    const userData = await response.json();
    return {
      name: userData.name,
      phone: userData.phoneNumber, // Assuming this matches your User entity field
      email: userData.email,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Could not retrieve user information");
  }
};

const updateUserInfo = async (userInfo) => {
  try {
    const response = await fetch("/api/v1/users/current", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error("Failed to update user information");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user info:", error);
    throw new Error("Could not update user information");
  }
};

const getProfile = async () => {
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
  const response = await api.get(`/api/v1/users/response`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send the token in the Authorization header
    },
  });
  return response.data;
};

const getUserProfile = async () => {
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await api.get(`/api/v1/users/response`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send the token in the Authorization header
    },
  });

  return response.data;
};

const registerUser = async (data) => {
  const response = await api.post(`/api/v1/auth/register`, data);
  return response.data;
};
const getUserProfileById = async (userId) => {
  const token = localStorage.getItem("accessToken"); // Retrieve JWT from localStorage
  const response = await api.get(`/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getCurrentUserInfo,
  updateUserInfo,
  registerUser,
  getProfile,
  getUserProfileById,
  getUserProfile,
};
