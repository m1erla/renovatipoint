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
  Container,
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
      setLoading(true);
      setError(null);

      const response = await RequestService.completeRequest(requestId);
      console.log("Complete response:", response);

      if (response.chatRoomId) {
        navigate(`/chat/${response.chatRoomId}`);
      } else {
        await fetchRequests(userId, userRole);
      }
    } catch (error) {
      console.error("Error completing request:", error);
      setError(error.response?.data?.message || "Failed to complete request");
    } finally {
      setLoading(false);
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
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#111827" : "#f5f5f7",
        pt: { xs: 8, sm: 9 },
        pb: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === "dark" ? "#fff" : "#2c3e50",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            }}
          >
            Requests
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
            }}
          >
            Manage your requests and communications with experts
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {requests.map((request) => (
            <Grid item xs={12} sm={6} lg={4} key={request.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 8px 24px rgba(0,0,0,0.3)"
                        : "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "divider",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#1f2937"
                      : "background.paper",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#fff" : "#2c3e50",
                      mb: 1,
                    }}
                  >
                    {request.adTitle || "N/A"}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status)}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.7)"
                          : "text.secondary",
                    }}
                  >
                    Expert: {request.expertName || "N/A"}
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleOpenDialog(request)}
                    sx={{
                      mt: "auto",
                      py: 1,
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#fff" : "#2c3e50",
                      borderColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.2)"
                          : "#2c3e50",
                      "&:hover": {
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.3)"
                            : "#1a252f",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(44, 62, 80, 0.04)",
                      },
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.08)",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1f2937" : "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            color: (theme) =>
              theme.palette.mode === "dark" ? "#fff" : "inherit",
          }}
        >
          {selectedRequest?.adTitle || "N/A"}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedRequest && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "text.secondary",
                  }}
                >
                  Status:
                </Typography>
                <Chip
                  label={selectedRequest.status}
                  color={getStatusColor(selectedRequest.status)}
                  size="small"
                />
              </Box>

              <Typography variant="body2">
                <Box
                  component="span"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "text.secondary",
                  }}
                >
                  Requested by:
                </Box>{" "}
                {selectedRequest.expertName || "N/A"}
              </Typography>

              <Typography variant="body2">
                <Box
                  component="span"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "text.secondary",
                  }}
                >
                  Description:
                </Box>{" "}
                {selectedRequest.message || "No description available"}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          {selectedRequest && renderActionButtons(selectedRequest)}
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark" ? "#fff" : "inherit",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
