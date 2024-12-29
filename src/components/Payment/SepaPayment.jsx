import React, { useState } from "react";
import paymentService from "../../services/paymentService";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

function SepaPayment() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      const customerId = localStorage.getItem("customerId"); // Retrieve customerId from localStorage
      const paymentMethodId = localStorage.getItem("paymentMethodId"); // Retrieve paymentMethodId

      if (!customerId || !paymentMethodId) {
        alert(
          "Payment method is not set up. Please set up a SEPA payment method first!"
        );
        return;
      }

      const paymentData = {
        customerId: customerId, // Pass customerId
        paymentMethodId: paymentMethodId, // Pass paymentMethodId
        amount: amount, // Pass the amount
      };
      const response = await paymentService.createSepaPaymentIntent(
        paymentData
      );
      console.log("Payment Initialted", response);

      alert("Payment initiated successfully.");
    } catch (error) {
      console.error("Error initiating payment", error);
    }
  };

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
          SEPA Payment
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f8fafc",
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handlePayment}
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Pay Now
        </Button>
      </Box>
    </Container>
  );
}

export default SepaPayment;
