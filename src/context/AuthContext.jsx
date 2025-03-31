import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
import authService from "../services/authService";

export const AuthContext = createContext();

// useAuth hook'u ile AuthContext'e kolay erişim sağlayacağız
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Starting CheckAuth...");
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("No token or userId found");
      }

      // Fetch complete user details
      const userResponse = await api.get("/api/v1/users/response", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("CheckAuth userResponse:", userResponse.data);

      if (userResponse.data) {
        const userData = {
          ...userResponse.data,
          id: userId,
          role: localStorage.getItem("role"),
          email: localStorage.getItem("userEmail"),
        };
        setUser(userData);
        setIsAuthenticated(true);
        // Update API instance
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        console.log("User data not found");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.clear();
      }
    } catch (error) {
      console.error("Auth check detailed error:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Starting login process...");
      const response = await authService.login(email, password);
      console.log("Login response:", response);

      if (!response || !response.accessToken) {
        console.error("Invalid login response:", response);
        throw new Error("Invalid login response - Token not found");
      }

      const { accessToken, userId, role, userEmail } = response;

      if (!accessToken || !userId || !role || !userEmail) {
        console.error("Missing user information:", {
          accessToken,
          userId,
          role,
          userEmail,
        });
        throw new Error("Missing user information");
      }

      // Clear localStorage first
      localStorage.clear();

      // Save new information
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", userEmail);

      // Fetch complete user details after login
      const userResponse = await api.get("/api/v1/users/response", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fullUserData = {
        ...userResponse.data,
        id: userId,
        role: role,
        email: userEmail,
      };

      setUser(fullUserData);
      setIsAuthenticated(true);

      // Update API instance
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return response;
    } catch (error) {
      console.error("Login detailed error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const expertRegister = async (userData) => {
    try {
      const response = await authService.expertRegister(userData);
      return response;
    } catch (error) {
      console.error("Expert register error:", error);
      throw error;
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        expertRegister,
        loading,
        isAuthenticated,
        checkAuth,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
