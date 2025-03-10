import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  IconButton,
  Typography,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import storageService from "../../services/storageService";
import { toast } from "react-toastify";
import api from "../../utils/api";

const AdImagesUpload = ({ adId, initialImages = [], onImagesUpdate }) => {
  // initialImages'in her zaman bir dizi olduğundan emin olalım
  const safeInitialImages = Array.isArray(initialImages) ? initialImages : [];
  const [images, setImages] = useState(safeInitialImages);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (!adId) return;

      setLoading(true);
      try {
        const response = await storageService.getAdImages(adId);
        setImages(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Resim yükleme hatası:", error);
        toast.error("Resimler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [adId]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const response = await storageService.uploadAdImages(files, adId);
      const newImages = Array.isArray(response) ? response : [];
      setImages((prev) =>
        Array.isArray(prev) ? [...prev, ...newImages] : [...newImages]
      );

      // Üst bileşeni de güncelle
      const currentImages = Array.isArray(images) ? images : [];
      onImagesUpdate([...currentImages, ...newImages]);

      toast.success("Resimler başarıyla yüklendi!");
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resimler yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      await api.delete(`/api/v1/ads/${adId}/ad-image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Dizi kontrolü ekleyelim
      const safeImages = Array.isArray(images) ? images : [];
      setImages((prev) =>
        Array.isArray(prev) ? prev.filter((img) => img !== imageId) : []
      );
      onImagesUpdate(safeImages.filter((img) => img !== imageId));

      toast.success("Resim başarıyla silindi!");
    } catch (error) {
      console.error("Resim silme hatası:", error);
      if (error.response?.status === 401) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      } else {
        toast.error("Resim silinirken bir hata oluştu");
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="ad-images-upload"
        multiple
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label htmlFor="ad-images-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={
            uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
          disabled={uploading}
          sx={{
            mb: 2,
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#34495e",
            },
          }}
        >
          {uploading ? "Yükleniyor..." : "Resim Ekle"}
        </Button>
      </label>

      <ImageList
        sx={{ width: "100%", height: "auto" }}
        cols={3}
        rowHeight={200}
        gap={8}
      >
        {Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => (
            <ImageListItem key={index} sx={{ position: "relative" }}>
              <img
                src={`${process.env.REACT_APP_API_URL}/api/v1/ads/${adId}/image/${image}`}
                alt={`İlan resmi ${index + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(211, 47, 47, 0.8)",
                  },
                }}
                onClick={() => handleDelete(image)}
              >
                <DeleteIcon />
              </IconButton>
            </ImageListItem>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center", width: "100%" }}
          >
            Henüz resim eklenmemiş
          </Typography>
        )}
        <ImageListItem>
          <label htmlFor="ad-images-upload">
            <Box
              sx={{
                height: "200px",
                border: "2px dashed #ccc",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#2c3e50",
                  backgroundColor: "rgba(44, 62, 80, 0.05)",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: "#2c3e50" }} />
              <Typography variant="body2" color="textSecondary">
                Yeni Resim Ekle
              </Typography>
            </Box>
          </label>
        </ImageListItem>
      </ImageList>
    </Box>
  );
};

export default AdImagesUpload;
