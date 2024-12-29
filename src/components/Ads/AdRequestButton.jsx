import React, { useState } from "react";
import api from "../../utils/api";

export default function AdRequestButton({ adId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const expertEmail = localStorage.getItem("userEmail");

      if (!token || !expertEmail) {
        throw new Error("Authentication information missing");
      }

      const response = await api.post(
        "/api/v1/requests",
        { adId, expertEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Request successful:", response.data);
      alert("Job request sent successfully!");
    } catch (error) {
      console.error("Failed to send job request:", error);
      setError(
        error.response?.data || "Failed to send request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRequest}
        disabled={isLoading}
        style={{
          backgroundColor: "#2c3e50",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? "Sending Request..." : "Request Job"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
