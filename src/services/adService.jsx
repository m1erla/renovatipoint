import api from "../utils/api";
import { toast } from "react-toastify";
// import storageService from "./storageService"; // If not used directly, can be removed
import { mockAdsData } from "./mockAdData"; // Import mock ads

export const DEFAULT_AD_IMAGE = "/images/placeholder-ad.png";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAllAds = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Assign mock images to each ad from mockAdsData
    const adsWithMockImages = mockAdsData.map(ad => ({
      ...ad,
      images: [{ url: DEFAULT_AD_IMAGE, name: "default-ad.png", id: "default-img-id-for-ad-" + ad.id }],
    }));
    return adsWithMockImages;
    // const response = await api.get("/api/v1/ads");
    // return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getAdById = async (adId) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const ad = mockAdsData.find(mockAd => mockAd.id === adId);
    if (ad) {
      // Simulate that the ad object from "getById" might not have images directly,
      // and they are fetched separately by getAdImages.
      // Or, you can assume getAdById returns images too for simplicity in mock.
      // For this example, let's return it without images, and getAdImages will provide them.
      return { ...ad }; // Return a copy
    }
    throw new Error(`Ad with ID ${adId} not found in mock data.`);
    // const response = await api.get(`/api/v1/ads/${adId}`);
    // return response.data;
  } catch (error) {
    // For mock, let's not call handleApiError directly unless it's a simulated 404
    if (error.message.includes("not found")) {
        console.error("Mock Ad Not Found:", error.message);
        const notFoundError = new Error("İlan bulunamadı.");
        // @ts-ignore
        notFoundError.response = { status: 404, data: { message: "İlan bulunamadı." } };
        handleApiError(notFoundError); // Call handleApiError for 404 specifically
    } else {
        console.error("Mock getAdById Error:", error);
    }
    throw error;
  }
};

const getAdsByUserId = async (userId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userAds = mockAdsData.filter(ad => ad.userId === userId).map(ad => ({
        ...ad,
        images: [{ url: DEFAULT_AD_IMAGE, name: "default-ad.png", id: "default-img-id-for-ad-" + ad.id }],
    }));
    return userAds;
    // const response = await api.get(`/api/v1/ads/user/${userId}`, {
    //   headers: getAuthHeader(),
    // });
    // return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const getAdImages = async (adId) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // For mock, let's return 1 to 3 placeholder images
    const numImages = Math.floor(Math.random() * 3) + 1;
    const images = Array.from({ length: numImages }, (_, i) => ({
      id: `img-${adId}-${i}`,
      name: `ad_image_${adId}_${i + 1}.jpg`,
      type: 'image/jpeg',
      url: `https://picsum.photos/seed/${adId}_${i}/800/450` // Using picsum for varied images
    }));

    if (images.length > 0) return images;
    return [{ url: DEFAULT_AD_IMAGE, name: "default.png", id: "default-img-for-" + adId }];

  } catch (error) {
    console.warn(`Mock: Failed to load ad images for ${adId}:`, error);
    return [{ url: DEFAULT_AD_IMAGE, name: "default.png", id: "default-img-for-" + adId }];
  }
};

const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response?.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
    // window.location.href = "/login"; // Consider using useNavigate hook at component level
  } else if (error.response?.status === 403) {
    toast.error("Bu işlem için yetkiniz bulunmamaktadır.");
  } else if (error.response?.status === 404) {
    toast.error(error.response?.data?.message || "Kaynak bulunamadı.");
  } else {
    toast.error(
      `Bir hata oluştu: ${error.response?.data?.message || error.message}`
    );
  }
};

const updateAd = async (id, formData) => {
  try {
    // Simulate update
    await new Promise(resolve => setTimeout(resolve, 500));
    const adIndex = mockAdsData.findIndex(ad => ad.id === id);
    if (adIndex > -1) {
        // Note: FormData handling in mock is simplified.
        // A real update would extract fields from formData.
        mockAdsData[adIndex] = {
            ...mockAdsData[adIndex],
            title: formData.get('title') || mockAdsData[adIndex].title,
            descriptions: formData.get('descriptions') || mockAdsData[adIndex].descriptions,
            isActive: formData.get('isActive') === 'true', // FormData values are strings
            // categoryId, serviceId might also need update if part of formData
            updatedAt: new Date().toISOString()
        };
        toast.success("İlan başarıyla güncellendi! (Mock)");
        return mockAdsData[adIndex];
    }
    throw new Error("Ad not found for update in mock data.");
    // const response = await api.put(`/api/v1/ads/update/${id}`, formData, {
    //   headers: {
    //     ...getAuthHeader(),
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    // if (response.status === 200) {
    //   toast.success("İlan başarıyla güncellendi!");
    //   return response.data;
    // }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const adService = { // Encapsulate in an object
  getAllAds,
  getAdsByUserId,
  getAdById,
  updateAd,
  getAuthHeader, // You might not need to export this if only used internally
  getAdImages,
  DEFAULT_AD_IMAGE, // Exporting the constant
};

export default adService;