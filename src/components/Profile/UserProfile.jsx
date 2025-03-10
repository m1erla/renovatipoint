import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilIcon,
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  PlusIcon,
  XMarkIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/AuthContext";
import ProfileImageUpload from "../common/ProfileImageUpload";
import AdImagesUpload from "../common/AdImagesUpload";
import { toast } from "react-toastify";
import RequestService from "../../services/requestService";
import adService from "../../services/adService";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} className="py-6">
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [chatRooms, setChatRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingAd, setEditingAd] = useState({
    id: "",
    title: "",
    descriptions: "",
    categoryId: "",
    categoryName: "",
    serviceId: "",
    serviceName: "",
    isActive: true,
    images: [],
  });
  const [showAdEditDialog, setShowAdEditDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useContext(AuthContext);

  const checkTokenAndRedirect = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      localStorage.clear();
      toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const initializeProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        if (!token) {
          localStorage.clear();
          toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
          navigate("/login");
          return;
        }

        // Token'ı kontrol et
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Kullanıcı bilgilerini yükle
        const userResponse = await api.get("/api/v1/users/response");

        if (userResponse.data) {
          setUser(userResponse.data);
          setEditData(userResponse.data);

          // Kullanıcının verilerini sırayla yükle
          await Promise.all([
            fetchUserAds(userResponse.data.id),
            fetchUserChatRooms(userResponse.data.id),
            fetchUserRequests(userResponse.data.id),
          ]);
        }

        setError(null);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
          navigate("/login");
        } else {
          setError("Profil bilgileri yüklenirken bir hata oluştu.");
          toast.error(
            error.response?.data?.message ||
              "Bir hata oluştu. Lütfen tekrar deneyin."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
    fetchCategories();
    fetchServices();
  }, [navigate, isAuthenticated]);

  const fetchUserAds = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      const response = await api.get(`/api/v1/ads/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        // İlanları ve resimlerini yükle
        const adsWithImages = await Promise.all(
          response.data
            .filter((ad) => ad != null)
            .map(async (ad) => {
              try {
                const images = await adService.getAdImages(ad.id);
                return {
                  ...ad,
                  images: images || [{ url: adService.DEFAULT_AD_IMAGE }],
                  storages: images || [],
                };
              } catch (error) {
                console.warn(`Failed to load images for ad ${ad.id}:`, error);
                return {
                  ...ad,
                  images: [{ url: adService.DEFAULT_AD_IMAGE }],
                  storages: [],
                };
              }
            })
        );
        setAds(adsWithImages);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        toast.error("İlanlar yüklenirken bir hata oluştu.");
      }
    }
  };

  const fetchUserChatRooms = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      const response = await api.get("/api/v1/chat/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setChatRooms(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        toast.error("Sohbet odaları yüklenirken bir hata oluştu.");
      }
    }
  };

  const fetchUserRequests = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const userRole = localStorage.getItem("role");

      if (!token) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      let fetchedRequests;
      if (userRole === "USER") {
        fetchedRequests = await RequestService.getRequestsByAdOwner(userId);
      } else if (userRole === "EXPERT") {
        fetchedRequests = await RequestService.getExpertRequests(userId);
      }

      if (fetchedRequests) {
        setRequests(fetchedRequests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        toast.error("İstekler yüklenirken bir hata oluştu.");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get("/api/v1/services");
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("id", userId);
      formData.append("name", editData.name || "");
      formData.append("surname", editData.surname || "");
      formData.append("email", editData.email || "");
      formData.append("phoneNumber", editData.phoneNumber || "");
      formData.append("address", editData.address || "");
      formData.append("postCode", editData.postCode || "");
      formData.append("role", editData.role || "USER");

      const response = await api.put("/api/v1/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Güncel kullanıcı bilgilerini al ve state'i güncelle
        const updatedUserResponse = await api.get("/api/v1/users/response", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (updatedUserResponse.data) {
          setUser(updatedUserResponse.data);
          setEditData(updatedUserResponse.data);
        }

        setEditMode(false);
        toast.success("Profil başarıyla güncellendi!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      } else if (error.response?.status === 404) {
        toast.error("Kullanıcı bulunamadı.");
      } else if (error.response?.status === 405) {
        toast.error("Bu işlem için yetkiniz yok.");
      } else {
        toast.error(
          error.response?.data?.error ||
            "Profil güncellenirken bir hata oluştu."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpdate = async (newImageFileName) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }

      setUser((prev) => ({
        ...prev,
        profileImage: newImageFileName,
      }));

      // Profil resmini güncelle
      const formData = new FormData();
      formData.append("file", newImageFileName);

      await api.post("/api/v1/users/update-profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil resmi başarıyla güncellendi!");
    } catch (error) {
      console.error("Failed to update profile image:", error);
      toast.error("Profil resmi güncellenirken bir hata oluştu.");
    }
  };

  const handleEditAd = async (ad) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      navigate("/login");
      return;
    }
    if (!ad || !ad.id) {
      toast.error("Geçersiz ilan bilgisi");
      return;
    }
    try {
      // İlan resimlerini yükle
      const images = await adService.getAdImages(ad.id);
      setEditingAd({
        ...ad,
        images: Array.isArray(images)
          ? images
          : [{ url: adService.DEFAULT_AD_IMAGE }],
        storages: Array.isArray(images) ? images : [],
      });
      setShowAdEditDialog(true);
    } catch (error) {
      console.error("Failed to load ad images:", error);
      toast.error("İlan resimleri yüklenirken bir hata oluştu.");
    }
  };

  const handleAdEditClose = () => {
    setShowAdEditDialog(false);
    setEditingAd({
      id: "",
      title: "",
      descriptions: "",
      categoryId: "",
      categoryName: "",
      serviceId: "",
      serviceName: "",
      isActive: true,
      images: [],
    });
    setValidationErrors({});
  };

  const validateAdEdit = () => {
    const errors = {};
    if (!editingAd.categoryId) {
      errors.categoryId = "Lütfen bir kategori seçin";
    }
    if (!editingAd.serviceId) {
      errors.serviceId = "Lütfen bir servis seçin";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdSave = async () => {
    try {
      if (!validateAdEdit()) {
        return;
      }
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("id", editingAd.id);
      formData.append("title", editingAd.title);
      formData.append("descriptions", editingAd.descriptions);
      formData.append("isActive", editingAd.isActive);
      formData.append("categoryName", editingAd.categoryName);
      formData.append("categoryId", editingAd.categoryId);
      formData.append("serviceId", editingAd.serviceId);
      formData.append("serviceName", editingAd.serviceName);

      // Resim dosyalarını ekle
      if (editingAd.images && Array.isArray(editingAd.images)) {
        editingAd.images.forEach((image, index) => {
          if (image && image.file) {
            formData.append(`images`, image.file);
          }
        });
      }

      await api.put(`/api/v1/ads/update/${editingAd.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUserAds(user.id);
      handleAdEditClose();
      toast.success("İlan başarıyla güncellendi!");
    } catch (error) {
      console.error("İlan güncellenirken hata oluştu:", error);
      if (error.response?.status === 401) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      } else if (error.response?.status === 400) {
        toast.error("Geçersiz veri. Lütfen tüm alanları kontrol edin.");
      } else {
        toast.error(
          "İlan güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setLoading(true);
      const response = await RequestService.acceptRequest(requestId);

      if (response) {
        toast.success("İstek başarıyla kabul edildi");
        await fetchUserRequests(user.id);

        // Check both possible chatRoom ID locations
        const chatRoomId = response.chatRoom?.id || response.chatRoomId;
        if (chatRoomId) {
          navigate(`/chat/${chatRoomId}`);
        }
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        toast.error("İstek kabul edilirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const userId = localStorage.getItem("userId");
      await RequestService.rejectRequest(requestId, userId);
      toast.success("İstek reddedildi");
      await fetchUserRequests(user.id);
    } catch (error) {
      console.error("Failed to reject request:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else {
        toast.error("İstek reddedilirken bir hata oluştu.");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-primary/50 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <XCircleIcon className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Hata</h3>
          </div>
          <p>{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-6 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-lg"
        >
          <p>Kullanıcı bilgileri bulunamadı</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-16 sm:pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative p-8 md:p-10 mb-8 mt-4 rounded-3xl bg-gradient-to-br from-gray-800/95 via-gray-800 to-gray-900 text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
          </div>

          <div className="absolute top-0 right-0 p-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditMode(true)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors shadow-lg"
            >
              <PencilIcon className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="relative w-37 h-37 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                  <ProfileImageUpload
                    currentImage={user.profileImage}
                    onImageUpdate={handleProfileImageUpdate}
                  />
                </div>
              </motion.div>
            </div>
            <div className="md:col-span-9">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">
                {user.name} {user.surname}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm shadow-sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.role}
                </span>
              </div>
              <div className="space-y-4 text-gray-300">
                {user.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <span>
                      {user.address}
                      {user.postCode && ` - ${user.postCode}`}
                    </span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <nav className="flex overflow-x-auto py-2 scrollbar-hide">
            <div className="flex space-x-2 mx-auto bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-xl shadow-md">
              {[
                {
                  icon: <DocumentTextIcon className="w-5 h-5" />,
                  label: "İlanlarım",
                },
                {
                  icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
                  label: "Sohbetler",
                },
                {
                  icon: <BriefcaseIcon className="w-5 h-5" />,
                  label: "İstekler",
                },
              ].map((tab, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 font-medium text-sm inline-flex items-center gap-2 rounded-lg transition-all ${
                    tabValue === index
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white hover:bg-background/80 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </nav>
        </div>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white">
              İlanlarım
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-ad")}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Yeni İlan Oluştur
            </motion.button>
          </div>

          {ads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
            >
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                Henüz İlan Yok
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                Henüz hiç ilan oluşturmadınız. İlk ilanınızı oluşturmak için
                "Yeni İlan Oluştur" butonuna tıklayın.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create-ad")}
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors shadow-md"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                İlk İlanımı Oluştur
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        ad.imageUrl
                          ? `${process.env.REACT_APP_API_URL}/api/v1/ads/${ad.id}/image/${ad.imageUrl}`
                          : `${process.env.REACT_APP_API_URL}/api/v1/ads/default-image`
                      }
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditAd(ad)}
                      className="absolute bottom-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 text-primary dark:text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400 mb-4 line-clamp-2">
                      {ad.descriptions}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                        {ad.categoryName}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                        {ad.serviceName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEditAd(ad)}
                      className="w-full px-4 py-3 bg-background dark:bg-gray-700 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary rounded-xl font-medium transition-all group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-primary-foreground dark:group-hover:text-primary flex justify-center items-center gap-2"
                    >
                      <PencilIcon className="w-5 h-5" />
                      Düzenle
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabPanel>

        {/* Sohbetler Tab */}
        <TabPanel value={tabValue} index={1}>
          {chatRooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
            >
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                Sohbet Bulunamadı
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                Henüz hiç sohbetiniz bulunmuyor. İsteklerinizi kabul ettiğinizde
                veya sohbet başlatıldığında burada görüntülenecektir.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chatRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(`/chat/${room.id}`)}
                  className="group bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50 cursor-pointer p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
                      {room.ad.title}
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="p-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground"
                    >
                      <ArrowUpRightIcon className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <p className="text-muted-foreground dark:text-gray-400 mb-3 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Uzman: {room.expert.name}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Son aktivite: {formatDate(room.lastActivity)}
                  </p>
                  {room.recentMessages?.length > 0 && (
                    <div className="mt-4 p-4 bg-background/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl group-hover:bg-primary/5 dark:group-hover:bg-primary/10 transition-colors">
                      <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2">
                        <span className="font-medium text-foreground dark:text-white">
                          Son mesaj:
                        </span>{" "}
                        {room.recentMessages[0].content}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-border/50 dark:border-gray-700/50">
                    <button className="w-full py-2.5 rounded-xl bg-background dark:bg-gray-700 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:bg-primary-foreground dark:group-hover:text-primary transition-colors font-medium flex items-center justify-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Sohbete Git
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabPanel>

        {/* İstekler Tab */}
        <TabPanel value={tabValue} index={2}>
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
            >
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <BriefcaseIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                İstek Bulunamadı
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                Şu anda bekleyen herhangi bir istek bulunmuyor. İlanlarınız için
                gelen istekler burada listelenecektir.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
                      {request.adTitle}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          : request.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground dark:text-gray-400 mb-4 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Uzman: {request.expertName}
                  </p>
                  <div className="flex gap-3 mt-6">
                    {request.status === "PENDING" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          Kabul Et
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <XCircleIcon className="w-5 h-5" />
                          Reddet
                        </motion.button>
                      </>
                    )}
                    {request.status === "ACCEPTED" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/chat/${request.chatRoomId}`)}
                        className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        Sohbete Git
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabPanel>

        {/* Edit Profile Dialog */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setEditMode(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground dark:text-white">
                    Profili Düzenle
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditMode(false)}
                    className="p-2 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors rounded-full bg-background/80 dark:bg-gray-700/80"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                        Soyad
                      </label>
                      <input
                        type="text"
                        value={editData.surname || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, surname: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={editData.phoneNumber || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Adres
                    </label>
                    <textarea
                      value={editData.address || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      value={editData.postCode || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, postCode: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditMode(false)}
                    className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white transition-all border border-border dark:border-gray-600"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditSave}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md"
                  >
                    Kaydet
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ad Edit Dialog */}
        <AnimatePresence>
          {showAdEditDialog && editingAd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={handleAdEditClose}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-2">
                    <DocumentTextIcon className="w-6 h-6 text-primary dark:text-primary-foreground" />
                    İlanı Düzenle
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAdEditClose}
                    className="p-2 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors rounded-full bg-background/80 dark:bg-gray-700/80"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={editingAd.title}
                      onChange={(e) =>
                        setEditingAd({ ...editingAd, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={editingAd.descriptions}
                      onChange={(e) =>
                        setEditingAd({
                          ...editingAd,
                          descriptions: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                        Kategori
                      </label>
                      <select
                        value={editingAd.categoryId || ""}
                        onChange={(e) =>
                          setEditingAd({
                            ...editingAd,
                            categoryId: e.target.value,
                            categoryName: categories.find(
                              (c) => c.id === e.target.value
                            )?.name,
                          })
                        }
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          validationErrors.categoryId
                            ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/50"
                            : "border-border dark:border-gray-600"
                        } bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      >
                        <option value="">Kategori seçin</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {validationErrors.categoryId && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                          <XCircleIcon className="w-4 h-4 inline" />
                          {validationErrors.categoryId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                        Servis
                      </label>
                      <select
                        value={editingAd.serviceId || ""}
                        onChange={(e) =>
                          setEditingAd({
                            ...editingAd,
                            serviceId: e.target.value,
                            serviceName: services.find(
                              (s) => s.id === e.target.value
                            )?.name,
                          })
                        }
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          validationErrors.serviceId
                            ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/50"
                            : "border-border dark:border-gray-600"
                        } bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      >
                        <option value="">Servis seçin</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                      {validationErrors.serviceId && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                          <XCircleIcon className="w-4 h-4 inline" />
                          {validationErrors.serviceId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4 flex items-center gap-2">
                      <PlusIcon className="w-5 h-5 text-primary dark:text-primary-foreground" />
                      İlan Görselleri
                    </h3>
                    <AdImagesUpload
                      adId={editingAd.id}
                      initialImages={
                        editingAd?.images && Array.isArray(editingAd.images)
                          ? editingAd.images.map((img) => ({
                              name: img?.name || "",
                              url: img?.url || adService.DEFAULT_AD_IMAGE,
                            }))
                          : []
                      }
                      onImagesUpdate={(images) =>
                        setEditingAd({
                          ...editingAd,
                          images: images && Array.isArray(images) ? images : [],
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdEditClose}
                    className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white transition-all border border-border dark:border-gray-600"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdSave}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md"
                  >
                    Kaydet
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
