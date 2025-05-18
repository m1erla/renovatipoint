import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const { mode } = useCustomTheme();
  const isDarkMode = mode === "dark";
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Performans için stil hesaplamalarını memoize edelim
  const containerStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      bgcolor: isDarkMode ? "background.default" : "#f8fafc",
      color: isDarkMode ? "text.primary" : "text.primary",
      transition: "background-color 0.3s ease, color 0.3s ease",
    }),
    [isDarkMode]
  );

  const mainContentStyles = useMemo(
    () => ({
      flexGrow: 1,
      p: 3,
      overflow: "auto",
      bgcolor: isDarkMode ? "background.default" : "#f8fafc",
      transition: "background-color 0.3s ease",
    }),
    [isDarkMode]
  );

  return (
    <Box sx={containerStyles}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Sidebar isLoggedIn={isAuthenticated} handleLogout={handleLogout} />
        <Box component="main" sx={mainContentStyles}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
