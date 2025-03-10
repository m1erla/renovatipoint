import React, { useState, useEffect } from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import storageService from "../../services/storageService";
import { toast } from "react-toastify";

const ImageDisplay = ({
  fileName,
  onDelete,
  width = "100%",
  height = "auto",
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!fileName) {
        setError("Resim bulunamadı");
        setLoading(false);
        return;
      }

      try {
        const url = await storageService.getImage(fileName);
        setImageUrl(url);
        setError(null);
      } catch (err) {
        console.error("Resim yükleme hatası:", err);
        setError("Resim yüklenirken bir hata oluştu");
        toast.error("Resim yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [fileName]);

  const handleDelete = async () => {
    try {
      await storageService.deleteImage(fileName);
      if (onDelete) {
        onDelete(fileName);
      }
      toast.success("Resim başarıyla silindi");
    } catch (err) {
      console.error("Resim silme hatası:", err);
      toast.error("Resim silinirken bir hata oluştu");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width={width}
        height={height}
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !imageUrl) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width={width}
        height={height}
        minHeight={200}
        bgcolor="grey.100"
      >
        {error || "Resim bulunamadı"}
      </Box>
    );
  }

  return (
    <Box position="relative" width={width} height={height}>
      <img
        src={imageUrl}
        alt="Yüklenen resim"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      {onDelete && (
        <IconButton
          onClick={handleDelete}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ImageDisplay;
