import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
} from "@mui/material";

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
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        backgroundColor: "#f5f5f7",
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
              color: "#2c3e50",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            }}
          >
            Pending Requests
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Review and manage pending requests from experts
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {pendingRequests.map((request) => (
            <Grid item xs={12} sm={6} lg={4} key={request.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#2c3e50",
                      mb: 1,
                    }}
                  >
                    {request.ad.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requested by: {request.expert.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.02)",
                      p: 2,
                      borderRadius: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{request.message}"
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleAccept(request.id)}
                    sx={{
                      mt: "auto",
                      py: 1.5,
                      backgroundColor: "#2c3e50",
                      "&:hover": {
                        backgroundColor: "#1a252f",
                      },
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 1.5,
                    }}
                  >
                    Accept Request
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
}
