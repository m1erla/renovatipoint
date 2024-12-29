import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Alert, Box, Grid, Paper, Typography } from "@mui/material";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/v1/users/response", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUser(response.data);
      fetchUserAds(response.data.id);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to load user profile. Please try again.");
    }
  };

  const fetchUserAds = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined");
      setError("Unable to fetch user ads. User ID is missing.");
      return;
    }
    try {
      const response = await api.get(`/api/v1/ads/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Fetched ads:", response.data);
      setAds(response.data.filter((ad) => ad != null));
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      setError("Failed to load user ads. Please try again.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#2c3e50" }}
        >
          User Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "#2c3e50" }}
            >
              Name
            </Typography>
            <Typography sx={{ color: "#34495e" }}>{user.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "#2c3e50" }}
            >
              Email
            </Typography>
            <Typography sx={{ color: "#34495e" }}>{user.email}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
          Your Ads
        </Typography>
        {ads.length === 0 ? (
          <Alert severity="info" sx={{ backgroundColor: "#e3f2fd" }}>
            You haven't posted any ads yet.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {ads.map((ad) => (
              <Grid item xs={12} key={ad?.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: 1,
                    transition: "all 0.3s ease",
                    border: "1px solid #e0e0e0",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#2c3e50" }}
                  >
                    {ad?.title || "Untitled Ad"}
                  </Typography>
                  {ad?.descriptions && (
                    <Typography variant="body1" sx={{ color: "#546e7a" }}>
                      {ad.descriptions}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
