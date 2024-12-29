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
} from "@mui/material";
import api from "../../utils/api";

function MyAds() {
  const [ads, setAds] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchAds = async () => {
    try {
      const response = await api.get("/api/v1/ads");
      console.log("Fetched ads:", JSON.stringify(response.data, null, 2));
      setAds(response.data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
  };

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

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchAds();
  }, []);

  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAd(null);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("id", editingAd.id);
      formData.append("title", editingAd.title);
      formData.append("descriptions", editingAd.descriptions);
      formData.append("isActive", editingAd.isActive);
      formData.append("categoryName", editingAd.categoryName);
      formData.append("categoryId", editingAd.categoryId);
      formData.append("serviceId", editingAd.serviceId);
      formData.append("serviceName", editingAd.serviceName);
      // Add other fields as necessary

      const response = await api.put(
        `/api/v1/ads/update/${editingAd.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Update response:", response.data);
      fetchAds(); // Refetch ads to get the updated data
      handleClose();
    } catch (error) {
      console.error("Failed to update ad:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Ads
      </Typography>
      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item xs={12} sm={6} md={4} key={ad.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={ad.imageUrl || "https://via.placeholder.com/140"}
                alt={ad.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {ad.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ad.descriptions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {ad.categoryName || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Service: {ad.serviceName || "N/A"}
                </Typography>
                {ad.storages && ad.storages.length > 0 && (
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      Images:
                    </Typography>
                    {ad.storages.map((storages, index) => (
                      <img
                        key={index}
                        src={storages.url}
                        alt={``}
                        style={{ width: "50px", height: "50px", margin: "5px" }}
                      />
                    ))}
                  </div>
                )}
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEditAd(ad)}
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Ad</DialogTitle>
        <DialogContent>
          {editingAd && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                type="text"
                fullWidth
                value={editingAd.title}
                onChange={(e) =>
                  setEditingAd({ ...editingAd, title: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={editingAd.descriptions}
                onChange={(e) =>
                  setEditingAd({ ...editingAd, descriptions: e.target.value })
                }
              />
              <InputLabel>Category</InputLabel>
              <Select
                value={editingAd.categoryName}
                onChange={(e) => {
                  console.log("Selected category:", e.target.value);
                  setEditingAd({ ...editingAd, categoryName: e.target.value });
                }}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <InputLabel>Service</InputLabel>
              <Select
                value={editingAd.serviceName}
                onChange={(e) => {
                  console.log("Selected service:", e.target.value);
                  setEditingAd({ ...editingAd, serviceName: e.target.value });
                }}
                label="Service"
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MyAds;
