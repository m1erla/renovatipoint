import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const response = await api.get("/api/v1/users/response", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/v1/auth/authenticate", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error("Invalid email or password");
      }
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/api/v1/auth/register", userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const expertRegister = async (expertData) => {
    try {
      const response = await api.post(
        "/api/v1/auth/expertRegister",
        expertData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, expertRegister, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
