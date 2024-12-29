import React, { useState } from "react";
import { Button } from "@mui/material";
import RequestService from "../../services/requestService";
import api from "../../utils/api";

export default function AdRequestButton({ adId }) {
  const [error, setError] = useState(null);
  const handleRequest = async (adId) => {
    try {
      const requestData = {
        adId: adId,
        message: "I am interested in this job",
        urgentRequest: false,
      };
      await api.post("/api/v1/requests", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      alert("Job request sent successfully!");
    } catch (error) {
      console.error("Failed to send job request:", error);
      if (error.response && error.response.status === 401) {
        setError(
          "You are not authorized to make this request. Please ensure you are logged in as an expert."
        );
      } else {
        setError("Failed to send job request. Please try again.");
      }
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleRequest}>
      Request This Ad
    </Button>
  );
}
