import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get("/api/requests/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch pending requests:", error);
      setError("Failed to load pending requests. Please try again.");
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await api.put(
        `/api/requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Request accepted successfully! A chat has been created.");
      // You might want to navigate to the chat or update the UI to show the new chat
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error("Failed to accept request:", error);
      setError("Failed to accept request. Please try again.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Pending Requests for Your Ads</h2>
      {pendingRequests.map((request) => (
        <div key={request.id}>
          <h3>Ad: {request.ad.name}</h3>
          <p>Requested by: {request.expert.name}</p>
          <p>Message: {request.message}</p>
          <button onClick={() => handleAccept(request.id)}>
            Accept Request
          </button>
        </div>
      ))}
    </div>
  );
}
