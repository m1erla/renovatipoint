import api from "../utils/api";
import { toast } from "react-toastify";
import storageService from "./storageService";

// Rastgele bir sayı ile Picsum'dan resim al
const getRandomNumber = () => Math.floor(Math.random() * 1000) + 1;
const DEFAULT_AD_IMAGE = `https://picsum.photos/id/${getRandomNumber()}/300/200`;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAllAds = async () => {
  try {
    const response = await api.get("/api/v1/ads");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getAdsByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/v1/ads/user/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getAdImages = async (adId) => {
  try {
    const response = await api.get(`/api/v1/ads/${adId}/image`);

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((image) => ({
        id: image.id,
        name: image.name,
        type: image.type,
        url: image.name
          ? `${process.env.REACT_APP_API_URL}/api/v1/ads/${adId}/image/${image.name}`
          : DEFAULT_AD_IMAGE,
      }));
    }
    return [{ url: DEFAULT_AD_IMAGE }];
  } catch (error) {
    console.warn("Failed to load ad images:", error);
    return [{ url: DEFAULT_AD_IMAGE }];
  }
};

const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response?.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
    window.location.href = "/login";
  } else if (error.response?.status === 403) {
    toast.error("Bu işlem için yetkiniz bulunmamaktadır.");
  } else if (error.response?.status === 404) {
    toast.error("İlan bulunamadı.");
  } else {
    toast.error(
      `Bir hata oluştu: ${error.response?.data?.message || error.message}`
    );
  }
};

const updateAd = async (id, formData) => {
  try {
    const response = await api.put(`/api/v1/ads/update/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      toast.success("İlan başarıyla güncellendi!");
      return response.data;
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default {
  getAllAds,
  getAdsByUserId,
  updateAd,
  getAuthHeader,
  getAdImages,
  DEFAULT_AD_IMAGE,
};
