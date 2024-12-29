import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import adService from "../../services/adService";
import requestService from "../../services/requestService";
import AdRequestButton from "./AdRequestButton";
import api from "../../utils/api";
function AdList() {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await api.get("/api/v1/ads", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setAds(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setError("Failed to load job listings. Please try again.");
    }
  };

  // const handleRequest = async (adId) => {
  //   try {
  //     const response = localStorage.getItem("userId");
  //     await requestService.createRequest(adId);
  //     alert("Request sent successfully!");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error sending request:", error);
  //     alert("Failed to send request. Please try again.");
  //   }
  // };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f7" }}>
      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item xs={12} sm={6} md={4} key={ad.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "#1a1a1a",
                    mb: 2,
                  }}
                >
                  {ad.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {ad.descriptions}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#fff",
                      color: "#666",
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      fontWeight: 500,
                      border: "1px solid #ccc",
                    }}
                  >
                    {ad.categoryName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#fff",
                      color: "#666",
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      fontWeight: 500,
                      border: "1px solid #ccc",
                    }}
                  >
                    {ad.serviceName}
                  </Typography>
                </Box>

                <Box sx={{ mt: "auto" }}>
                  <AdRequestButton adId={ad.id} expertId={ad.userId} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AdList;
