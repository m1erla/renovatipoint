import api from "../utils/api";

const handleInvoiceError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("accessToken");
    throw new Error("Session expired. Please login again.");
  }

  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }

  throw new Error("An error occurred while processing the invoice");
};

const invoiceService = {
  // Get all invoices for a user
  getUserInvoices: async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/api/v1/invoices/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user invoices:", error);
      throw handleInvoiceError(error);
    }
  },

  // Get all invoices for an expert
  getExpertInvoices: async (expertId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/api/v1/invoices/expert/${expertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching expert invoices:", error);
      throw handleInvoiceError(error);
    }
  },

  // Download invoice PDF
  downloadInvoice: async (invoiceId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/api/v1/invoices/download/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceId}.pdf`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
      return true;
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw handleInvoiceError(error);
    }
  },

  // Get invoice receipt URL
  getInvoiceReceiptUrl: async (invoiceId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/api/v1/invoices/receipt/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice receipt URL:", error);
      throw handleInvoiceError(error);
    }
  },

  // Check invoice status
  checkInvoiceStatus: async (invoiceId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/api/v1/invoices/status/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking invoice status:", error);
      throw handleInvoiceError(error);
    }
  },

  // Generate invoice for user
  generateUserInvoice: async (userId, amount, paymentIntentId, paymentType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/api/v1/invoices/generate/user`,
        {
          userId,
          amount,
          paymentIntentId,
          paymentType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating user invoice:", error);
      throw handleInvoiceError(error);
    }
  },

  // Generate invoice for expert
  generateExpertInvoice: async (
    expertId,
    amount,
    paymentIntentId,
    paymentType
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/api/v1/invoices/generate/expert`,
        {
          expertId,
          amount,
          paymentIntentId,
          paymentType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating expert invoice:", error);
      throw handleInvoiceError(error);
    }
  },
};

export default invoiceService;
