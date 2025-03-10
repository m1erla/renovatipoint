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
  CircularProgress,
} from "@mui/material";
import { Alert } from "@mui/material";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import RefreshIcon from "@mui/icons-material/Refresh";
import { paymentService } from "../../services/paymentService";

function SetupSepaPayment() {
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const sepaData = {
        iban,
        bic,
        bankName,
      };

      const response = await paymentService.setupSepaPayment(sepaData);

      if (response.success) {
        setSuccess(true);
        toast.success("SEPA ödeme kurulumu başarıyla tamamlandı!");
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/expert-profile");
        }, 2000);
      } else {
        setError(response.error || "SEPA kurulumu sırasında bir hata oluştu");
        toast.error(
          response.error || "SEPA kurulumu sırasında bir hata oluştu"
        );
      }
    } catch (error) {
      console.error("SEPA setup error:", error);
      setError(
        error.response?.data?.message ||
          "SEPA ödeme kurulumu sırasında bir hata oluştu."
      );
      toast.error(
        error.response?.data?.message ||
          "SEPA ödeme kurulumu sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndSetupSepa = async () => {
    try {
      setLoading(true);

      const sepaData = {
        iban,
        bic,
        bankName,
      };

      const result = await paymentService.resetAndSetupSepaPayment(sepaData);

      if (result.success) {
        toast.success("SEPA ödeme kurulumu başarıyla yenilendi!");
        navigate("/expert-profile");
      } else {
        toast.error(result.error || "SEPA kurulumu sırasında bir hata oluştu");
      }
    } catch (error) {
      console.error("SEPA kurulum hatası:", error);
      toast.error(error.message || "SEPA kurulumu sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "EXPERT") {
    return (
      <Container maxWidth="sm" sx={{ mt: 12, mb: 8 }}>
        <Alert severity="error">
          Bu sayfaya erişmek için uzman olarak giriş yapmanız gerekmektedir.
        </Alert>
      </Container>
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
          SEPA Ödeme Kurulumu
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
                label="Banka Adı"
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
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Ödeme Kurulumunu Tamamla"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
            SEPA ödeme kurulumu başarıyla tamamlandı! Profil sayfasına
            yönlendiriliyorsunuz...
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default SetupSepaPayment;
