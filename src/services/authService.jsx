import api from "../utils/api";

const login = async (email, password) => {
  try {
    const response = await api.post("/api/v1/auth/authenticate", {
      email,
      password,
    });
    const { accessToken, userId, role, userEmail } = response.data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", userEmail);
    }

    console.log("Login response:", response.data);

    return { accessToken, userId, role, userEmail };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
};

const getCurrentRole = () => {
  return localStorage.getItem("role");
};

export default {
  login,
  logout,
  getCurrentRole,
};
