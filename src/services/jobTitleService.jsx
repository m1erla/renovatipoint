import api from "../utils/api";

export const getJobTitles = async () => {
  try {
    const response = await api.get("/api/v1/job_titles");
    return response.data;
  } catch (error) {
    console.error("Error fetching job titles:", error);
    throw error;
  }
};

export const getJobTitleById = async (id) => {
  try {
    const response = await api.get(`/api/v1/job_titles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job title:", error);
    throw error;
  }
};
