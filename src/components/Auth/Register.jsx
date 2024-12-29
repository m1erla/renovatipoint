import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Grid,
  Box,
} from "@mui/material";
import { Alert } from "@mui/material";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitleName, setJobTitleName] = useState("");
  const [postCode, setPostCode] = useState("");
  const [isExpert, setIsExpert] = useState(false);
  const [error, setError] = useState("");
  const { register, expertRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = {
        name,
        surname,
        email,
        password,
        phoneNumber,
        jobTitleName,
        postCode,
      };
      if (isExpert) {
        await expertRegister(userData);
      } else {
        await register(userData);
      }
      navigate("/login");
    } catch (error) {
      setError(error.message);
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
          Create Account
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
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
                }}
              />
            </Grid>
          </Grid>

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
              mb: 2,
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                label="Post Code"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
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
                }}
              />
            </Grid>
          </Grid>

          <TextField
            margin="normal"
            required
            fullWidth
            label="Job Title"
            value={jobTitleName}
            onChange={(e) => setJobTitleName(e.target.value)}
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

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: "#2c3e50",
            }}
          >
            Are you an expert?{" "}
            <Link
              to="/expert-register"
              style={{
                color: "#2c3e50",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign up as an expert
            </Link>
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: "#2c3e50",
              "&:hover": {
                backgroundColor: "#1a252f",
              },
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            Create Account
          </Button>
        </form>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            color: "#d32f2f",
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
