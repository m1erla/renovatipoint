import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Grid,
  Box,
} from "@mui/material";
import { Alert } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../Auth/AuthContext";

function SetupSepaPayment() {
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        "/api/v1/experts/setup-sepa",
        { iban, bic, bankName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      localStorage.setItem("stripeCustomerId", response.data.customerId);
      localStorage.setItem(
        "stripePaymentMethodId",
        response.data.paymentMethodId
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/expert-dashboard");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while setting up SEPA payment."
      );
    }
  };

  if (!user || user.role !== "EXPERT") {
    return (
      <Typography>
        You must be logged in as an expert to access this page.
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 12, mb: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffffff",
          p: 6,
          borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 600,
            color: "#2c3e50",
          }}
        >
          Setup SEPA Payment
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="IBAN"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="BIC"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Setup Payment
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ width: "100%", boxShadow: 2 }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ width: "100%", boxShadow: 2 }}
          >
            SEPA payment setup successful! Redirecting to dashboard...
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default SetupSepaPayment;
