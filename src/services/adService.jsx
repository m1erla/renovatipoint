import api from "../utils/api";

const getAllAds = async () => {
  const response = await api.get("/api/v1/ads");
  return response.data;
};

const getAdsByUserId = async (userId) => {
  const response = await api.get(`/api/v1/ads/user/${userId}`);
  return response.data;
};

export default {
  getAllAds,
  getAdsByUserId,
};
