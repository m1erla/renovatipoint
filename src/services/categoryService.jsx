import api from "../utils/api";
import axios from "axios";

// Public endpoints için ayrı bir axios instance
const publicApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

class CategoryService {
  getAllCategories() {
    // Backend ile uyumlu endpoint
    return publicApi.get("/api/v1/categories");
  }

  getCategoryById(id) {
    return publicApi.get(`/api/v1/categories/${id}`);
  }

  getCategoryExperts(categoryId) {
    return publicApi.get(`/api/v1/categories/${categoryId}/jobTitles`);
  }
}

export const categoryService = new CategoryService();
