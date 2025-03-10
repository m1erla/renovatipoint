import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  // Settings to prevent Bitdefender related issues
  maxContentLength: 100000000, // 100MB
  maxBodyLength: 100000000,
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", {
      message: error.message,
      stack: error.stack,
    });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API Response Success:", {
      url: response.config.url,
      status: response.status,
      hasData: !!response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      stack: error.stack,
    });

    // Timeout error check
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    // Authentication error check
    if (error.response?.status === 401) {
      console.log("401 Error Detected:", {
        path: window.location.pathname,
        isLoginRequest: error.config.url.includes("/auth/authenticate"),
      });

      if (
        !window.location.pathname.includes("/login") &&
        !error.config.url.includes("/auth/authenticate")
      ) {
        console.log("Terminating session and redirecting to login");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(new Error("Session expired"));
      }
    }

    // Catch Bitdefender related errors
    if (
      error.message.includes("aborted by the software in your host machine")
    ) {
      console.error("Antivirus blocked the connection:", error);
      return Promise.reject(
        new Error(
          "Antivirus software blocked the connection. Please check your security settings."
        )
      );
    }

    // General error message check
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    return Promise.reject(error);
  }
);

export default api;
