import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminGuard = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  console.log("AdminGuard check:", {
    isAuthenticated,
    userRole: user?.role,
    path: window.location.pathname,
  });

  if (!isAuthenticated) {
    console.log("AdminGuard: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    console.log("AdminGuard: Not admin role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("AdminGuard: Access granted to admin route");
  return children;
};

export default AdminGuard;
