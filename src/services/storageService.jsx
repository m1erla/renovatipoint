import api from "../utils/api";
import { toast } from "react-toastify";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }
  return { Authorization: `Bearer ${token}` };
};

const storageService = {
  // Profil resmi yükleme
  uploadProfileImage: async (file, userId) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        `/api/v1/users/${userId}/uploadProfileImage`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Profil resmini getirme
  getProfileImage: async (userId) => {
    try {
      const response = await api.get(`/api/v1/users/${userId}/profile-image`, {
        headers: getAuthHeader(),
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.warn("Failed to load profile image:", error);
      return null;
    }
  },

  // İlan resimleri yükleme
  uploadAdImages: async (files, adId) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await api.post(
        `/api/v1/ads/${adId}/uploadAdImage`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // İlan resimlerini güncelleme
  updateAdImages: async (files, adId) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await api.post(
        `/api/v1/ads/ads/${adId}/updateAdImages`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // İlan resimlerini getirme
  getAdImages: async (adId) => {
    try {
      const response = await api.get(`/api/v1/ads/${adId}/image`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.warn("Failed to load ad images:", error);
      return [];
    }
  },

  // Kullanıcının tüm ilan resimlerini getirme
  getUserAdImages: async () => {
    try {
      const response = await api.get("/api/v1/ads/user-images", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Profil resmini silme
  deleteProfileImage: async (fileName) => {
    try {
      await api.delete(`/api/v1/users/${fileName}/profile-image`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // İlan resmini silme
  deleteAdImage: async (adId, imageId) => {
    try {
      await api.delete(`/api/v1/ads/${adId}/ad-image/${imageId}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Genel resim getirme (StorageController'dan)
  getImage: async (fileName) => {
    try {
      const response = await api.get(`/api/v1/storage/${fileName}`, {
        headers: getAuthHeader(),
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.warn("Failed to load image:", error);
      return null;
    }
  },

  // Tüm resimleri getirme (StorageController'dan)
  getAllImages: async () => {
    try {
      const response = await api.get("/api/v1/storage/all", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

const handleApiError = (error) => {
  console.error("Storage API Error:", error);

  if (error.response) {
    if (error.response.status === 401) {
      // Resim yükleme hatalarını sessizce geç
      if (error.config?.url?.includes("/image")) {
        return;
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      window.location.href = "/login";
    } else if (error.response.status === 403) {
      toast.error("Bu işlem için yetkiniz bulunmamaktadır.");
    } else {
      toast.error(
        "Bir hata oluştu: " + (error.response.data?.message || error.message)
      );
    }
  } else {
    toast.error(
      "Sunucu ile bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edin."
    );
  }
};

export default storageService;
