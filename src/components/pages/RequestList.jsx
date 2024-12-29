import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import RequestService from "../../services/requestService";
import { useNavigate } from "react-router-dom";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserRole = localStorage.getItem("role");
    setUserId(storedUserId);
    setUserRole(storedUserRole);
    fetchRequests(storedUserId, storedUserRole);
  }, []);

  const fetchRequests = async (userId, userRole) => {
    try {
      let fetchedRequests;
      if (userRole === "USER") {
        fetchedRequests = await RequestService.getRequestsByAdOwner(userId);
      } else if (userRole === "EXPERT") {
        fetchedRequests = await RequestService.getExpertRequests(userId);
      }
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await RequestService.acceptRequest(requestId);
      console.log("Accept response:", response); // Debug log

      // Check both possible chatRoom ID locations
      const chatRoomId = response.chatRoom?.id || response.chatRoomId;

      if (chatRoomId) {
        navigate(`/chat/${chatRoomId}`);
      } else {
        console.error("No chat room ID in response:", response);
        setError("Failed to get chat room ID");
      }

      await fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      setError(error.message || "Failed to accept request");
    } finally {
      setLoading(false);
    }
  };
  const handleReject = async (requestId) => {
    try {
      await RequestService.rejectRequest(requestId, userId);
      fetchRequests(userId, userRole);
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await RequestService.completeRequest(requestId);
      fetchRequests(userId, userRole);
    } catch (error) {
      console.error("Error completing request:", error);
      alert("Failed to complete request. Please try again.");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await RequestService.cancelRequest(requestId);
      fetchRequests(userId, userRole);
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert("Failed to cancel request. Please try again.");
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  const renderActionButtons = (request) => {
    if (userRole === "USER" && request.status === "PENDING") {
      return (
        <>
          <Button onClick={() => handleAccept(request.id)} color="primary">
            Accept
          </Button>
          <Button onClick={() => handleReject(request.id)} color="secondary">
            Reject
          </Button>
        </>
      );
    }
    if (userRole === "EXPERT" && request.status === "ACCEPTED") {
      return (
        <Button onClick={() => handleComplete(request.id)} color="primary">
          Complete
        </Button>
      );
    }
    if (
      userRole === "USER" &&
      (request.status === "PENDING" || request.status === "ACCEPTED")
    ) {
      return (
        <Button onClick={() => handleCancel(request.id)} color="secondary">
          Cancel
        </Button>
      );
    }
    return (
      <Button
        onClick={() => navigate(`/chat/${request.chatId}`)}
        color="primary"
      >
        Go to Chat Room
      </Button>
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
        <Button onClick={fetchRequests}>Retry</Button>
      </Alert>
    );
  }
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} lg={4} key={request.id}>
            <Card
              elevation={1}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  {request.adTitle || "N/A"}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {request.expertName || "N/A"}
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleOpenDialog(request)}
                  sx={{
                    mt: "auto",
                    color: "#2c3e50",
                    borderColor: "#2c3e50",
                    "&:hover": {
                      borderColor: "#1a252f",
                      backgroundColor: "#1a252f",
                      color: "#f5f5f5",
                    },
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          {selectedRequest?.adTitle || "N/A"}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedRequest && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status)}
                  size="small"
                />
              </Box>

              <Typography variant="body2">
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Requested by:
                </Box>{" "}
                {selectedRequest.expertName || "N/A"}
              </Typography>

              <Typography variant="body2">
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Description:
                </Box>{" "}
                {selectedRequest.message || "No description available"}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          {selectedRequest && renderActionButtons(selectedRequest)}
          <Button onClick={handleCloseDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
