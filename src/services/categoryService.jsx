import api from "../utils/api";

class CategoryService {
  // Tüm kategorileri getir
  async getAllCategories() {
    try {
      const response = await api.get("/api/v1/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // ID'ye göre kategori getir
  async getCategoryById(id) {
    try {
      const response = await api.get(`/api/v1/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  // Kategoriye ait iş unvanlarını getir
  async getCategoryJobTitles(categoryId) {
    try {
      const response = await api.get(
        `/api/v1/categories/${categoryId}/jobTitles`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching job titles for category ${categoryId}:`,
        error
      );
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
