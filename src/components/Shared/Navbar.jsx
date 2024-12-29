// src/components/Shared/Navbar.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    // Redirect to home page
    navigate("/");
  };

  return (
    <nav style={{ backgroundColor: "#2c3e50", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "#ecf0f1", margin: 0 }}>Payment System</h1>
        </Link>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/" style={{ color: "#ecf0f1", textDecoration: "none" }}>
            Home
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                style={{ color: "#ecf0f1", textDecoration: "none" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{ color: "#ecf0f1", textDecoration: "none" }}
              >
                Register
              </Link>
              <Link
                to="/expert-register"
                style={{ color: "#ecf0f1", textDecoration: "none" }}
              >
                Expert Register
              </Link>
            </>
          ) : (
            <>
              {userRole === "EXPERT" ? (
                <>
                  <Link
                    to="/expert-profile"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    Expert Profile
                  </Link>
                  <Link
                    to="/ads"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    Browse Ads
                  </Link>
                  <Link
                    to="/requests"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    Requests
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/user-profile"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    User Profile
                  </Link>
                  <Link
                    to="/create-ad"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    Create Ad
                  </Link>
                  <Link
                    to="/ads"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    Browse Ads
                  </Link>
                  <Link
                    to="/requests"
                    style={{ color: "#ecf0f1", textDecoration: "none" }}
                  >
                    Requests
                  </Link>
                </>
              )}
              <Link
                to="/chat-rooms"
                style={{ color: "#ecf0f1", textDecoration: "none" }}
              >
                Chat
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  color: "#ecf0f1",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0.5rem 1rem",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
