import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera, Delete as DeleteIcon } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import storageService from "../../services/storageService";
import { toast } from "react-toastify";

const ProfileImageUpload = ({ currentImage, onImageUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Eğer user veya currentImage yoksa işlem yapma
    const loadImage = async () => {
      if (!currentImage || !user?.id) return;

      try {
        const imageUrl = await storageService.getProfileImage(user.id);
        setPreviewUrl(imageUrl);
      } catch (error) {
        console.error("Profil resmi yüklenirken hata:", error);
      }
    };

    loadImage();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [currentImage, user?.id]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.id) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır!");
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen sadece resim dosyası yükleyin!");
      return;
    }

    // Önizleme URL'sini oluştur
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setLoading(true);
    try {
      const response = await storageService.uploadProfileImage(file, user.id);

      if (response) {
        onImageUpdate(response);
        toast.success("Profil resmi başarıyla güncellendi!");
      } else {
        throw new Error("Resim yükleme başarısız");
      }
    } catch (error) {
      console.error("Profil resmi yükleme hatası:", error);

      let errorMessage = "Profil resmi yüklenirken bir hata oluştu.";
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      }

      toast.error(errorMessage);
      setPreviewUrl(currentImage); // Hata durumunda eski resme geri dön
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    setLoading(true);
    try {
      await storageService.deleteProfileImage(currentImage);
      setPreviewUrl(null);
      onImageUpdate(null);
      toast.success("Profil resmi başarıyla silindi!");
    } catch (error) {
      console.error("Profil resmi silme hatası:", error);
      let errorMessage = "Profil resmi silinirken bir hata oluştu.";
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Avatar
          src={previewUrl}
          alt="Profil resmi"
          sx={{
            width: "100%",
            height: "100%",
            border: "3px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {!previewUrl && user?.name?.[0]}
        </Avatar>

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="profile-image-upload"
          type="file"
          onChange={handleFileChange}
          disabled={loading}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <label
            htmlFor="profile-image-upload"
            style={{
              position: "absolute",
              bottom: "35px",
              right: "35px",
              pointerEvents: "auto",
            }}
          >
            <IconButton
              component="span"
              sx={{
                backgroundColor: "rgba(44, 62, 80, 0.9)",
                color: "white",
                width: "32px",
                height: "32px",
                "&:hover": {
                  backgroundColor: "rgba(52, 73, 94, 1)",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                <PhotoCamera fontSize="small" />
              )}
            </IconButton>
          </label>

          {previewUrl && (
            <IconButton
              onClick={handleDelete}
              sx={{
                position: "absolute",
                top: "35px",
                right: "35px",
                backgroundColor: "rgba(211, 47, 47, 0.8)",
                color: "white",
                width: "32px",
                height: "32px",
                pointerEvents: "auto",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 1)",
                },
              }}
              disabled={loading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileImageUpload;
