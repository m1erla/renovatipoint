import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
} from "@mui/material";
import api from "../../utils/api";
import { CloudUploadIcon } from "lucide-react";

function CreateAd() {
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/v1/services");
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("descriptions", descriptions);
    formData.append("isActive", isActive);
    formData.append("categoryId", categoryId);
    formData.append("serviceId", serviceId);
    formData.append("userId", localStorage.getItem("userId"));
    images.forEach((image, index) => {
      formData.append(`storages`, image);
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await api.post("/api/v1/ads/ad", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Ad creation response:", response.data);
      navigate("/my-ads");
    } catch (error) {
      console.error(
        "Failed to create ad:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 4,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            mb: 4,
          }}
        >
          Create New Ad
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ backgroundColor: "#f8f9fa" }}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={descriptions}
              onChange={(e) => setDescriptions(e.target.value)}
              sx={{ backgroundColor: "#f8f9fa" }}
            />
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                onChange={(e) => {
                  console.log("Selected category:", e.target.value);
                  setCategoryId(e.target.value);
                }}
                label="Category"
                sx={{ backgroundColor: "#f8f9fa" }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Service</InputLabel>
              <Select
                value={serviceId}
                onChange={(e) => {
                  console.log("Selected service:", e.target.value);
                  setServiceId(e.target.value);
                }}
                label="Service"
                sx={{ backgroundColor: "#f8f9fa" }}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Is Active"
              sx={{ ml: 0 }}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderColor: "#2c3e50",
                    color: "#2c3e50",
                    "&:hover": {
                      borderColor: "#1a252f",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  Upload Images
                </Button>
              </label>
              <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
                {images.length} images selected
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: "#2c3e50",
                "&:hover": {
                  backgroundColor: "#1a252f",
                },
              }}
            >
              Create Ad
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default CreateAd;
