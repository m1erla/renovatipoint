import React, { useEffect, useState } from "react";
import expertService from "../../services/expertService";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function ExpertProfile() {
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpertProfile = async () => {
      try {
        const data = await expertService.getExpertProfile();
        setExpert(data);
      } catch (error) {
        console.error("Error fetching expert profile", error);
        setError("Failed to load expert profile. Please try logging in again.");
        if (error.message === "No access token found") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpertProfile();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!expert) return <div>No expert data available</div>;
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#2c3e50", fontWeight: 600, mb: 4 }}
        >
          Welcome, Expert {expert.name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "#2c3e50" }}
            >
              Email
            </Typography>
            <Typography sx={{ color: "#34495e" }}>{expert.email}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "#2c3e50" }}
            >
              Job Title
            </Typography>
            <Typography sx={{ color: "#34495e" }}>
              {expert.jobTitleName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "#2c3e50" }}
            >
              Company Name
            </Typography>
            <Typography sx={{ color: "#34495e" }}>
              {expert.companyName}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "600", color: "#2c3e50" }}
            >
              Chamber of Commerce Number
            </Typography>
            <Typography sx={{ color: "#34495e" }}>
              {expert.chamberOfCommerceNumber}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                bgcolor: "#e3f2fd",
                borderRadius: 1,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <AccountBalanceWalletIcon sx={{ mr: 1, color: "#1976d2" }} />
              <Typography variant="h6" sx={{ color: "#1976d2" }}>
                Balance: €{expert.balance}
              </Typography>
            </Paper>
          </Grid>

          {expert.paymentInfo && (
            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{ p: 3, mt: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#2c3e50", fontWeight: 600 }}
                >
                  Payment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", color: "#2c3e50" }}
                    >
                      IBAN
                    </Typography>
                    <Typography sx={{ color: "#34495e" }}>
                      {expert.paymentInfo.iban}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", color: "#2c3e50" }}
                    >
                      BIC
                    </Typography>
                    <Typography sx={{ color: "#34495e" }}>
                      {expert.paymentInfo.bic}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", color: "#2c3e50" }}
                    >
                      Bank Name
                    </Typography>
                    <Typography sx={{ color: "#34495e" }}>
                      {expert.paymentInfo.bankName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "600", color: "#2c3e50" }}
                    >
                      Stripe Customer ID
                    </Typography>
                    <Typography sx={{ color: "#34495e" }}>
                      {expert.paymentInfo.stripeCustomerId}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>

        {!expert.paymentInfo && (
          <Button
            variant="contained"
            onClick={() => navigate("/payment-setup")}
            sx={{
              mt: 4,
              bgcolor: "#2c3e50",
              color: "white",
              "&:hover": {
                bgcolor: "#34495e",
              },
            }}
          >
            Setup Payment Info
          </Button>
        )}
      </Paper>
    </Box>
  );
}

export default ExpertProfile;
