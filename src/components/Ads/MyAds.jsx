import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Container,
} from "@mui/material";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import adService from "../../services/adService";

function MyAds() {
  const [ads, setAds] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = adService.DEFAULT_AD_IMAGE;
  };

  const fetchAds = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Kullanıcı bilgisi bulunamadı.");
        navigate("/login");
        return;
      }
      const response = await adService.getAdsByUserId(userId);

      const adsWithImages = await Promise.all(
        response.map(async (ad) => {
          try {
            const images = await adService.getAdImages(ad.id);
            return {
              ...ad,
              images:
                images && images.length > 0
                  ? images
                  : [{ url: adService.DEFAULT_AD_IMAGE }],
            };
          } catch (error) {
            console.warn(`Failed to load images for ad ${ad.id}:`, error);
            return {
              ...ad,
              images: [{ url: adService.DEFAULT_AD_IMAGE }],
            };
          }
        })
      );

      setAds(adsWithImages);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories", {
        headers: adService.getAuthHeader(),
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/v1/services", {
        headers: adService.getAuthHeader(),
      });
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchAds();
  }, []);

  const handleEditAd = (ad) => {
    try {
      const editData = {
        ...ad,
        categoryId: ad.category?.id || ad.categoryId,
        serviceId: ad.service?.id || ad.serviceId,
        images: ad.images || [],
      };

      setEditingAd(editData);
      setOpen(true);
    } catch (error) {
      console.error("Error in handleEditAd:", error);
      toast.error("İlan düzenleme sırasında bir hata oluştu.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAd(null);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      if (!editingAd || !editingAd.id) {
        toast.error("İlan bilgileri eksik.");
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("id", editingAd.id);
      formData.append("title", editingAd.title || "");
      formData.append("descriptions", editingAd.descriptions || "");
      formData.append("isActive", editingAd.isActive || true);
      formData.append("categoryId", editingAd.categoryId || "");
      formData.append("serviceId", editingAd.serviceId || "");

      if (editingAd.images && editingAd.images.length > 0) {
        editingAd.images.forEach((image, index) => {
          formData.append(`existingImages[${index}]`, image.id);
        });
      }

      await adService.updateAd(editingAd.id, formData);
      await fetchAds();
      handleClose();
    } catch (error) {
      console.error("Failed to update ad:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(
          "İlan güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        backgroundColor: "#f5f5f7",
        pt: { xs: 8, sm: 9 },
        pb: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            }}
          >
            My Ads
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage and edit your advertisements
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    ad.images && ad.images.length > 0
                      ? ad.images[0].url
                      : adService.DEFAULT_AD_IMAGE
                  }
                  alt={ad.title}
                  onError={handleImageError}
                  sx={{
                    objectFit: "cover",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 500,
                      color: "#2c3e50",
                      mb: 2,
                    }}
                  >
                    {ad.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {ad.descriptions}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "#fff",
                        color: "#666",
                        py: 0.5,
                        px: 1.5,
                        borderRadius: 1,
                        fontWeight: 500,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      Category: {ad.categoryName || "N/A"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "#fff",
                        color: "#666",
                        py: 0.5,
                        px: 1.5,
                        borderRadius: 1,
                        fontWeight: 500,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      Service: {ad.serviceName || "N/A"}
                    </Typography>
                  </Box>
                  {ad.images && ad.images.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Images:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {ad.images.map((image, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={image.url || adService.DEFAULT_AD_IMAGE}
                            alt={`Image ${index + 1}`}
                            onError={handleImageError}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 1,
                              objectFit: "cover",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEditAd(ad)}
                    sx={{
                      mt: "auto",
                      color: "#2c3e50",
                      borderColor: "#2c3e50",
                      "&:hover": {
                        borderColor: "#1a252f",
                        backgroundColor: "rgba(44, 62, 80, 0.04)",
                      },
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 1.5,
                      py: 1,
                      width: "100%",
                    }}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            color: "#2c3e50",
            fontWeight: 600,
          }}
        >
          Edit Ad
        </DialogTitle>
        <DialogContent>
          {editingAd && (
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}
            >
              {editingAd.images && editingAd.images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Current Images:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {editingAd.images.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 80,
                          height: 80,
                        }}
                      >
                        <img
                          src={image.url || adService.DEFAULT_AD_IMAGE}
                          alt={`Ad image ${index + 1}`}
                          onError={handleImageError}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <TextField
                autoFocus
                label="Title"
                type="text"
                fullWidth
                value={editingAd.title || ""}
                onChange={(e) =>
                  setEditingAd({ ...editingAd, title: e.target.value })
                }
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
              <TextField
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={editingAd.descriptions || ""}
                onChange={(e) =>
                  setEditingAd({ ...editingAd, descriptions: e.target.value })
                }
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
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingAd.categoryId || ""}
                  onChange={(e) => {
                    setEditingAd({
                      ...editingAd,
                      categoryId: e.target.value,
                    });
                  }}
                  label="Category"
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      "&:hover": {
                        borderColor: "#2c3e50",
                      },
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2c3e50",
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select
                  value={editingAd.serviceId || ""}
                  onChange={(e) => {
                    setEditingAd({
                      ...editingAd,
                      serviceId: e.target.value,
                    });
                  }}
                  label="Service"
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      "&:hover": {
                        borderColor: "#2c3e50",
                      },
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2c3e50",
                    },
                  }}
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "#666",
              "&:hover": {
                backgroundColor: "rgba(102, 102, 102, 0.04)",
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#2c3e50",
              "&:hover": {
                backgroundColor: "#1a252f",
              },
              textTransform: "none",
              fontWeight: 500,
              px: 3,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyAds;
