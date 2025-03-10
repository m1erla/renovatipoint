import React, { useState, useContext } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import storageService from "../../services/storageService";
import { toast } from "react-toastify";

const ImageUpload = ({ onUploadSuccess, multiple = false, adId = null }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setLoading(true);
    try {
      if (multiple) {
        const fileList = Array.from(files);
        const fileNames = await storageService.uploadImages(
          fileList,
          user.id,
          adId
        );
        onUploadSuccess(fileNames);
        toast.success("Resimler başarıyla yüklendi!");
      } else {
        const fileName = await storageService.uploadImage(files[0], user.id);
        onUploadSuccess(fileName);
        toast.success("Resim başarıyla yüklendi!");
      }
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      toast.error("Resim yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="image-upload-button"
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
        disabled={loading}
      />
      <label htmlFor="image-upload-button">
        <Button
          variant="contained"
          component="span"
          startIcon={
            loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
          disabled={loading}
          sx={{
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#34495e",
            },
          }}
        >
          {loading ? "Yükleniyor..." : multiple ? "Resimleri Seç" : "Resim Seç"}
        </Button>
      </label>
      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, color: "text.secondary" }}
      >
        {multiple
          ? "Birden fazla resim seçebilirsiniz"
          : "Tek bir resim seçebilirsiniz"}
      </Typography>
    </Box>
  );
};

export default ImageUpload;
