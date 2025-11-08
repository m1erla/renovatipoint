import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  // validateStatus fonksiyonunu kaldırarak varsayılan davranışa dönüyoruz (sadece 2xx başarılı sayılır)
  // validateStatus: function (status) {
  //   return status >= 200 && status < 500;
  // },
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

// Response interceptor (hata yönetimi iyileştirildi)
api.interceptors.response.use(
  (response) => {
    // Başarılı yanıtlar için loglama (status 2xx)
    console.log("API Response Success:", {
      url: response.config.url,
      status: response.status,
      hasData: !!response.data,
    });
    return response;
  },
  (error) => {
    // Hata loglaması (tüm hatalar buraya düşecek)
    console.error("API Response Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      stack: error.stack, // Geliştirme sırasında stack trace faydalı olabilir
    });

    // Timeout error check
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
      // Kullanıcıya gösterilecek daha anlaşılır bir mesaj döndürebiliriz
      return Promise.reject(
        new Error(
          error.response?.data?.message ||
            "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."
        )
      );
    }

    // Authentication error check (401)
    if (error.response?.status === 401) {
      console.log("401 Error Detected:", {
        path: window.location.pathname,
        isLoginRequest: error.config?.url?.includes("/auth/authenticate"),
      });

      // Login sayfasında değilsek ve istek login isteği değilse yönlendir
      if (
        !window.location.pathname.includes("/login") &&
        !error.config?.url?.includes("/auth/authenticate")
      ) {
        console.log(
          "Oturum sonlandırılıyor ve login sayfasına yönlendiriliyor"
        );
        localStorage.clear();
        // window.location.href = "/login"; // Doğrudan yönlendirme yerine state yönetimi ile yapmak daha iyi olabilir
        // Uygulamanızın yönlendirme (routing) mekanizmasına göre burayı güncelleyin.
        // Örneğin: history.push('/login'); veya navigate('/login');
        // Şimdilik hatayı fırlatarak component'in yakalamasını sağlıyoruz.
        return Promise.reject(
          new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.")
        );
      }
      // Eğer login sayfasındaysa veya login isteğiyse, hatayı olduğu gibi bırak
      // ki login formu hatayı işleyebilsin (örn. "geçersiz şifre")
    }

    // Catch Bitdefender related errors (Bu kontrol yerinde kalabilir)
    if (
      error.message?.includes("aborted by the software in your host machine")
    ) {
      console.error("Antivirus bağlantıyı engelledi:", error);
      return Promise.reject(
        new Error(
          error.response?.data?.message ||
            "Antivirüs yazılımı bağlantıyı engelledi. Lütfen güvenlik ayarlarınızı kontrol edin."
        )
      );
    }

    // Backend'den gelen genel hata mesajını kullan
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    // Diğer tüm hatalar için genel bir mesaj veya Axios hatasını döndür
    return Promise.reject(error); // Veya new Error("Bir hata oluştu.")
  }
);

export default api;
