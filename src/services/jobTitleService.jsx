import api from "../utils/api";

class JobTitleService {
  // Tüm iş unvanlarını getir
  async getAllJobTitles() {
    try {
      const response = await api.get("/api/v1/job_titles");
      return response.data;
    } catch (error) {
      console.error("Error fetching job titles:", error);
      throw error;
    }
  }

  // ID'ye göre iş unvanı getir
  async getJobTitleById(id) {
    try {
      const response = await api.get(`/api/v1/job_titles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job title ${id}:`, error);
      throw error;
    }
  }
}

export const jobTitleService = new JobTitleService();
