import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Fade,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";

const PaymentFailure = ({
  amount,
  paymentType,
  errorMessage,
  redirectUrl,
  onRetry,
  onComplete,
}) => {
  const [countdown, setCountdown] = useState(5);
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
          <ErrorOutlineIcon
            sx={{
              fontSize: 64,
              color: "error.main",
              mb: 2,
              animation: "shake 0.5s",
              "@keyframes shake": {
                "0%, 100%": { transform: "translateX(0)" },
                "25%": { transform: "translateX(-5px)" },
                "75%": { transform: "translateX(5px)" },
              },
            }}
          />

          <Typography variant="h5" gutterBottom sx={{ color: "error.main" }}>
            Payment Failed!
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {paymentType === "CONTACT_INFO"
              ? "Failed to share contact information."
              : "Failed to complete the job."}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            {errorMessage || "An error occurred during payment processing."}
          </Typography>

          <Typography variant="h6" sx={{ mb: 3, color: "error.main" }}>
            Amount: €{amount.toFixed(2)}
          </Typography>

          {onRetry && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReplayIcon />}
              onClick={onRetry}
              sx={{ mb: 3 }}
            >
              Try Again
            </Button>
          )}

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
              Returning in {countdown} seconds...
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default PaymentFailure;
