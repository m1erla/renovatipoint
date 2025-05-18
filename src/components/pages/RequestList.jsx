import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      setError(t("pages.requestList.errors.fetchFailed"));
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await RequestService.acceptRequest(requestId);
      console.log("Accept response:", response);

      const chatRoomId = response.chatRoom?.id || response.chatRoomId;

      if (chatRoomId) {
        navigate(`/chat/${chatRoomId}`);
      } else {
        console.error("No chat room ID in response:", response);
        setError(t("pages.requestList.errors.chatRoomFailed"));
      }

      await fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      setError(error.message || t("pages.requestList.errors.acceptFailed"));
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
      setError(t("pages.requestList.errors.rejectFailed"));
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
      setError(
        error.response?.data?.message ||
          t("pages.requestList.errors.completeFailed")
      );
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
      setError(t("pages.requestList.errors.cancelFailed"));
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
            {t("pages.requestList.actions.accept")}
          </Button>
          <Button onClick={() => handleReject(request.id)} color="secondary">
            {t("pages.requestList.actions.reject")}
          </Button>
        </>
      );
    }
    if (userRole === "EXPERT" && request.status === "ACCEPTED") {
      return (
        <Button onClick={() => handleComplete(request.id)} color="primary">
          {t("pages.requestList.actions.complete")}
        </Button>
      );
    }
    if (
      userRole === "USER" &&
      (request.status === "PENDING" || request.status === "ACCEPTED")
    ) {
      return (
        <Button onClick={() => handleCancel(request.id)} color="secondary">
          {t("pages.requestList.actions.cancel")}
        </Button>
      );
    }
    return (
      <Button
        onClick={() => navigate(`/chat/${request.chatId}`)}
        color="primary"
      >
        {t("pages.requestList.actions.goToChat")}
      </Button>
    );
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4">
        <Alert severity="error">
          {error}
          <Button
            onClick={() => fetchRequests(userId, userRole)}
            className="ml-4"
          >
            {t("common.retry")}
          </Button>
        </Alert>
      </Box>
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
            {t("pages.requestList.title")}
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
            {t("pages.requestList.description")}
          </Typography>
        </Box>

        {requests.length > 0 ? (
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
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {request.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {request.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={t(
                          `pages.requestList.status.${request.status.toLowerCase()}`
                        )}
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="span"
                      >
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      {renderActionButtons(request)}
                      <Button
                        onClick={() => handleOpenDialog(request)}
                        color="info"
                      >
                        {t("pages.requestList.actions.details")}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="text-center py-8">
            <Typography variant="h6" color="textSecondary">
              {t("pages.requestList.noRequests")}
            </Typography>
          </Box>
        )}
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              {t("pages.requestList.dialog.title", { id: selectedRequest.id })}
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedRequest.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("pages.requestList.dialog.status")}:{" "}
                {t(
                  `pages.requestList.status.${selectedRequest.status.toLowerCase()}`
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("pages.requestList.dialog.createdAt")}:{" "}
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                {t("common.close")}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
