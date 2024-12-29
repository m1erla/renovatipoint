import api from "../utils/api";

const RequestService = {
  createRequest: async (adId) => {
    try {
      const response = await api.post(
        "/api/v1/requests",
        { adId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  },
  acceptRequest: async (requestId) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      const response = await api.put(
        `/api/v1/requests/${requestId}/accept`,
        {}, // Send userId as a JSON object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error accepting request or creating chat:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  },
  getRequestsByAdOwner: async (userId) => {
    const token = localStorage.getItem("accessToken");

    const response = await api.get(`/api/v1/requests/ads/owner/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getExpertRequests: async (expertId) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await api.get(`/api/v1/requests/expert/${expertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching user requests", error);
      throw new Error("Failed to fetch user requests");
    }
  },

  getUserRequests: async (userId) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await api.get(`/api/v1/requests/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching user requests", error);
      throw new Error("Failed to fetch user requests");
    }
  },

  rejectRequest: async (requestId, userId) => {
    const response = await api.put(
      `/api/v1/requests/${requestId}/reject`,
      { userId }, // Send userId in the request body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  },
  completeRequest: async (requestId) => {
    const response = await api.put(`/api/v1/requests/${requestId}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to accept request");
    }
    return response.json();
  },
  cancelRequest: async (requestId) => {
    const response = await api.put(`/api/v1/requests/${requestId}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to accept request");
    }
    return response.json();
  },
};

export default RequestService;
