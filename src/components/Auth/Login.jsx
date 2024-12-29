import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Snackbar,
  Box,
} from "@mui/material";
import { Alert } from "@mui/material";
import { AuthContext } from "./AuthContext";
import authService from "../../services/authService";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { role } = await authService.login(email, password);
      console.log("User role:", role); // For debugging

      if (role === "EXPERT") {
        navigate("/expert-profile");
      } else if (role === "USER") {
        navigate("/user-profile");
      } else {
        setError("Unknown user role");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(44,62,80,0.12)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 600,
            color: "#2c3e50",
            letterSpacing: "-0.5px",
          }}
        >
          Welcome Back
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#2c3e50",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c3e50",
                },
              },
              mb: 2,
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                "&:hover fieldset": {
                  borderColor: "#2c3e50",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2c3e50",
                },
              },
              mb: 3,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.8,
              backgroundColor: "#2c3e50",
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#1a252f",
                boxShadow: "none",
              },
              mb: 2,
            }}
          >
            Sign In
          </Button>
          <Typography
            variant="body1"
            align="center"
            sx={{
              color: "#2c3e50",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#2c3e50",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </form>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
