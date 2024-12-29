import {
  Typography,
  Button,
  Grid2,
  Paper,
  Snackbar,
  Alert,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
function ExpertDashboard() {
  const [ads, setAds] = useState([]);
  const [requests, setRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.role === "EXPERT") {
      const stripePaymentMethodId = localStorage.getItem(
        "stripePaymentMethodId"
      );
      if (!stripePaymentMethodId) {
        navigate("/setup-sepa");
      }
    }
    fetchAds();
    fetchRequests();
  }, [user, navigate]);

  if (!user || user.role !== "EXPERT") {
    return (
      <Typography>
        You must be logged in as an expert to view this page.
      </Typography>
    );
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await api.put(
        `
        /api/v1/requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.data) {
        const chatResponse = await api.post(
          `/api/v1/chat/create`,
          {
            userId: response.data.userId,
            expertId: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setRequests(
          requests.map((request) =>
            request.id === requestId
              ? { ...request, status: "ACCEPTED" }
              : request
          )
        );

        setSnackbar({
          open: true,
          message: "Request accepted successfully",
          severity: "success",
        });
        setTimeout(() => {
          navigate(`/chat/${chatResponse.data}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to accept request", error);
      setSnackbar({
        open: true,
        message: "Failed to accept request",
        severity: "error",
      });
    }
  };

  const fetchAds = async () => {
    try {
      const response = await api.get("/api/v1/ads", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setAds(response.data);
    } catch (error) {
      console.error("Failed to fetch ads", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get("/api/v1/requests/expert", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Expert Dashboard</Typography>
      <Button variant="contained" color="primary" href="/create-ad">
        Create New Ad
      </Button>
      <Grid2 container spacing={3}>
        <Grid2 item xs={12} md={6}>
          <Typography variant="h5">Your Ads</Typography>
          {ads.map((ad) => (
            <Paper key={ad.id} style={{ padding: "10px", margin: "10px 0" }}>
              <Typography variant="h6">{ad.title}</Typography>
              <Typography>{ad.description}</Typography>
            </Paper>
          ))}
        </Grid2>
        <Grid2 item xs={12} md={6}>
          <Typography variant="h5">Requests</Typography>
          {requests.map((request) => (
            <Paper
              key={request.id}
              style={{ padding: "10px", margin: "10px 0" }}
            >
              <ListItem key={request.id}>
                <ListItemText
                  primary={`Request from: ${request.userName}`}
                  secondary={`Status: ${request.status}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAcceptRequest(request.id)}
                  disabled={request.status !== "PENDING"}
                >
                  Accept
                </Button>
              </ListItem>
              <Typography variant="h6">
                Request for: {request.adTitle}
              </Typography>
              <Typography>From: {request.userName}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAcceptRequest(request.id)}
                disabled={request.status !== "PENDING"}
              >
                Accept
              </Button>
            </Paper>
          ))}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default ExpertDashboard;
