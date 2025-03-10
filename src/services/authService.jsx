import api from "../utils/api";

const login = async (email, password) => {
  try {
    console.log("AuthService: Sending login request...");
    const response = await api.post("/api/v1/auth/authenticate", {
      email,
      password,
    });
    console.log("AuthService: Login response received:", response.data);

    const { accessToken, userId, role, userEmail } = response.data;

    if (!accessToken || !userId || !role || !userEmail) {
      console.error("AuthService: Missing user information:", response.data);
      throw new Error("Missing user information received from server");
    }

    localStorage.clear();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("userEmail", userEmail);

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return response.data;
  } catch (error) {
    console.error("AuthService: Login detailed error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    localStorage.clear();
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

const expertRegister = async (userData) => {
  try {
    const registrationData = {
      ...userData,
      role: "EXPERT",
    };
    const response = await api.post(
      "/api/v1/auth/expertRegister",
      registrationData
    );
    return response.data;
  } catch (error) {
    console.error("Expert register error:", error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("userEmail");
};

const checkAuth = () => {
  try {
    console.log("AuthService: Starting CheckAuth...");
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const userEmail = localStorage.getItem("userEmail");

    console.log("AuthService: Current auth info:", {
      hasToken: !!token,
      hasUserId: !!userId,
      hasRole: !!role,
      hasEmail: !!userEmail,
    });

    if (token && userId && role && userEmail) {
      return { id: userId, role, email: userEmail };
    }

    console.log("AuthService: Missing auth information");
    return null;
  } catch (error) {
    console.error("AuthService: CheckAuth error:", error);
    return null;
  }
};

export default {
  login,
  register,
  expertRegister,
  logout,
  checkAuth,
};
