// src/components/Shared/PrivateRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element: Component }) {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

export default PrivateRoute;
