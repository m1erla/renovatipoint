import React, { useState, useEffect } from "react";
import expertService from "../../services/expertService";
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { getJobTitles } from "../../services/jobTitleService";
import { useNavigate } from "react-router-dom";

function ExpertRegister() {
  const [jobTitles, setJobTitles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    jobTitleId: "", // Initialize job title ID
    jobTitleName: "", // Keep track of selected title name
    postCode: "",
    phoneNumber: "",
    address: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch job titles when component mounts
  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const titles = await getJobTitles();
        setJobTitles(titles);
      } catch (error) {
        console.error("Failed to fetch job titles:", error);
        setError("Failed to load job titles. Please try again later.");
      }
    };
    fetchJobTitles();
  }, []);

  const handleJobTitleChange = (event) => {
    const selectedTitle = jobTitles.find(
      (title) => title.id === event.target.value
    );
    setFormData((prev) => ({
      ...prev,
      jobTitleId: selectedTitle.id,
      jobTitleName: selectedTitle.name,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate job title selection
      if (!formData.jobTitleId) {
        throw new Error("Please select a job title");
      }

      const response = await expertService.registerExpert(formData);
      console.log("Registration successful:", response);

      // Store the access token
      if (response.token) {
        localStorage.setItem("accessToken", response.token);
      }

      // Show success message and redirect to expert profile
      setSuccess("Registration successful! Redirecting to your profile...");
      setTimeout(() => {
        navigate("/expert-profile");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 600,
            background: "linear-gradient(45deg, #2c3e50 30%, #2c3e50 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            letterSpacing: "-0.5px",
            color: "#2c3e50",
          }}
        >
          Join as Expert
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required margin="normal">
                <InputLabel>Job Title</InputLabel>
                <Select
                  value={formData.jobTitleId}
                  onChange={handleJobTitleChange}
                  error={!formData.jobTitleId}
                >
                  {jobTitles.map((title) => (
                    <MenuItem key={title.id} value={title.id}>
                      {title.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Please select your job title</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Post Code"
                name="postCode"
                value={formData.postCode}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#f8fafc",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={1}
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
                  background:
                    "linear-gradient(45deg, #2c3e50 30%, #2c3e50 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #2c3e50 30%, #00BCD4 90%)",
                  },
                }}
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default ExpertRegister;
