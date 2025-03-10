import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Fade,
  CheckCircleIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentConfirmation = ({
  amount,
  paymentType,
  redirectUrl,
  onComplete,
}) => {
  const [countdown, setCountdown] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onComplete) {
            onComplete();
          }
          if (redirectUrl) {
            navigate(redirectUrl);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, redirectUrl, onComplete]);

  return (
    <Fade in={true}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: "center",
            maxWidth: 400,
            width: "90%",
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 64,
              color: "success.main",
              mb: 2,
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
                "50%": {
                  transform: "scale(1.1)",
                  opacity: 0.8,
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            }}
          />

          <Typography variant="h5" gutterBottom sx={{ color: "success.main" }}>
            Payment Successful!
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {paymentType === "CONTACT_INFO"
              ? "Contact information has been shared."
              : "Job has been marked as completed."}
          </Typography>

          <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
            Amount: €{amount.toFixed(2)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Redirecting in {countdown} seconds...
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default PaymentConfirmation;
