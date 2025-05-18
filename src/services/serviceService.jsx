import api from "../utils/api";

class ServiceService {
  // Tüm servisleri getir
  async getAllServices() {
    try {
      const response = await api.get("/api/v1/services");
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  // ID'ye göre servis getir
  async getServiceById(id) {
    try {
      const response = await api.get(`/api/v1/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  }

  // Kategoriye göre servisleri getir
  async getServicesByCategory(categoryId, options = {}) {
    try {
      const { exclude = "", limit = 10 } = options;
      let url = `/api/v1/services?categoryId=${categoryId}`;

      if (exclude) {
        url += `&exclude=${exclude}`;
      }

      if (limit) {
        url += `&limit=${limit}`;
      }

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching services for category ${categoryId}:`,
        error
      );
      throw error;
    }
  }

  // Benzer servisleri getir
  async getSimilarServices(serviceId, categoryId, limit = 4) {
    try {
      const response = await api.get(
        `/api/v1/services?categoryId=${categoryId}&exclude=${serviceId}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching similar services for service ${serviceId}:`,
        error
      );
      throw error;
    }
  }

  // Öne çıkan servisleri getir
  async getFeaturedServices(limit = 3) {
    try {
      const response = await api.get(`/api/v1/services?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured services:", error);
      throw error;
    }
  }
}

export const serviceService = new ServiceService();
