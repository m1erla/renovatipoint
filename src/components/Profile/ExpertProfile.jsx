import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import expertService from "../../services/expertService";
import adService from "../../services/adService";
import requestService from "../../services/requestService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import ProfileImageUpload from "../common/ProfileImageUpload";
import { toast } from "react-toastify";
import { paymentService } from "../../services/paymentService";
import invoiceService from "../../services/invoiceService";
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
  WalletIcon,
  StarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  ReceiptRefundIcon,
  BuildingLibraryIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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

function ExpertProfile() {
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [chatRooms, setChatRooms] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [ads, setAds] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    imageUrl: "",
    completionDate: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(5);
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useContext(AuthContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    // Debug log
    console.log("Current user:", user);
    console.log("Access token:", localStorage.getItem("accessToken"));
    console.log("User role:", localStorage.getItem("role"));
    console.log("User ID:", localStorage.getItem("userId"));

    // Auth yüklenene kadar bekle
    if (authLoading) {
      return;
    }

    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    // Kullanıcı expert değilse ana sayfaya yönlendir
    const userRole = localStorage.getItem("role");
    console.log("Checking user role:", userRole);

    if (userRole !== "EXPERT") {
      console.log("User is not an expert, redirecting to home");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setPaymentLoading(true);
        const userId = localStorage.getItem("userId");
        console.log("Fetching expert profile for userId:", userId);

        // Get expert profile
        const expertData = await expertService.getExpertProfile();
        console.log("Expert data received:", expertData);

        if (!expertData) {
          throw new Error("Expert data not found");
        }

        setExpert(expertData);
        setEditData(expertData);

        // Get payment info
        await fetchPaymentInfo(userId);

        // Get invoices
        try {
          const invoicesData = await invoiceService.getExpertInvoices(userId);
          console.log("Invoices data received:", invoicesData);
          const processedInvoices = (invoicesData || []).map((invoice) => ({
            ...invoice,
            id: invoice.id || `temp-${Math.random()}`,
            amount: invoice.amount || 0,
            dateIssued: invoice.dateIssued || new Date().toISOString(),
            paid: Boolean(invoice.paid),
            paymentType: invoice.paymentType || "-",
          }));
          setInvoices(processedInvoices);
        } catch (error) {
          console.error("Error fetching invoices:", error);
          setError("Failed to load invoices");
        }

        // Get other data...
        const roomsResponse = await api.get("/api/v1/chat/rooms");
        setChatRooms(roomsResponse.data);

        const adsData = await adService.getAdsByUserId(userId);
        setAds(adsData.filter((ad) => ad != null));

        const requestsData = await requestService.getExpertRequests(userId);
        setRequests(requestsData);

        setError(null);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          stack: error.stack,
        });

        if (error.response?.status === 401) {
          localStorage.clear();
          setError("Session expired. Please login again.");
          navigate("/login");
        } else {
          setError(
            "Failed to load profile information. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user, authLoading]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const invoicesData = await invoiceService.getExpertInvoices(userId);
        // Null veya undefined değerleri filtrele ve gerekli alanları dönüştür
        const processedInvoices = (invoicesData || []).map((invoice) => ({
          ...invoice,
          id: invoice.id || `temp-${Math.random()}`,
          amount: invoice.amount || 0,
          dateIssued: invoice.dateIssued || new Date().toISOString(),
          paid: Boolean(invoice.paid),
          paymentType: invoice.paymentType || "-",
        }));
        setInvoices(processedInvoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to load invoices");
      }
    };

    // İlk yükleme
    fetchInvoices();

    // Her 5 dakikada bir yenileme
    const interval = setInterval(fetchInvoices, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
      formData.append("companyName", editData.companyName || "");
      formData.append(
        "chamberOfCommerceNumber",
        editData.chamberOfCommerceNumber || ""
      );
      formData.append("jobTitleName", editData.jobTitleName || "");

      const response = await api.put(`/api/v1/experts/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setExpert(response.data);
        setEditMode(false);
        toast.success("Profil başarıyla güncellendi!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Kullanıcı bulunamadı.");
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

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await requestService.acceptRequest(requestId);

      if (response) {
        setRequests((prev) =>
          prev.map((request) =>
            request.id === requestId
              ? { ...request, status: "ACCEPTED" }
              : request
          )
        );

        navigate(`/chat/${response.chatRoomId}`);
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleProfileImageUpdate = (newImageFileName) => {
    setExpert((prev) => ({
      ...prev,
      profileImage: newImageFileName,
    }));
  };

  const handleCreateProject = async () => {
    try {
      // API çağrısı burada yapılacak
      const response = await api.post("/api/v1/experts/portfolio", newProject, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setPortfolio([...portfolio, response.data]);
      setShowProjectDialog(false);
      setNewProject({
        title: "",
        description: "",
        imageUrl: "",
        completionDate: "",
      });
      toast.success("Proje başarıyla eklendi!");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Proje eklenirken bir hata oluştu.");
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      await invoiceService.downloadInvoice(invoiceId);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  const handleSetupPayment = async (type) => {
    try {
      if (type === "SEPA") {
        navigate("/setup-sepa-payment");
      }
    } catch (error) {
      console.error("Payment setup error:", error);
      toast.error(error.message || "Failed to setup payment method");
    }
  };

  const fetchPaymentInfo = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const paymentInfoResponse = await api.get(
        `/api/v1/experts/${userId}/payment-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Payment info received:", paymentInfoResponse.data);

      // Detaylı kontrol ekleyelim
      const paymentInfo = paymentInfoResponse.data;
      const hasValidPaymentSetup =
        paymentInfo &&
        paymentInfo.stripeCustomerId &&
        paymentInfo.paymentMethodId &&
        paymentInfo.iban &&
        paymentInfo.bic &&
        paymentInfo.bankName &&
        paymentInfo.isActive !== false; // isActive false değilse veya undefined ise true kabul et

      if (hasValidPaymentSetup) {
        setPaymentMethods([
          {
            id: `bank-${paymentInfo.stripeCustomerId}`,
            type: "BANK",
            last4: paymentInfo.iban?.slice(-4),
            bankName: paymentInfo.bankName || "SEPA Account",
            createdAt: paymentInfo.createdAt || new Date().toISOString(),
          },
        ]);
      } else {
        console.log("Payment setup is incomplete or inactive:", {
          hasPaymentInfo: !!paymentInfo,
          stripeCustomerId: paymentInfo?.stripeCustomerId,
          paymentMethodId: paymentInfo?.paymentMethodId,
          iban: paymentInfo?.iban,
          bic: paymentInfo?.bic,
          bankName: paymentInfo?.bankName,
          isActive: paymentInfo?.isActive,
        });
        setPaymentMethods([]);
      }
      setPaymentError(null);
    } catch (paymentError) {
      console.error("Error fetching payment info:", paymentError);
      if (paymentError.message === "No access token found") {
        navigate("/login");
        return;
      }
      setPaymentError("Failed to load payment information");
      setPaymentMethods([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (methodId) => {
    try {
      setPaymentLoading(true);
      const type = methodId.split("-")[0].toUpperCase();
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      // Kullanıcıya silme işlemini onaylatma
      const confirmed = window.confirm(
        "Ödeme yöntemini silmek istediğinizden emin misiniz?"
      );
      if (!confirmed) {
        setPaymentLoading(false);
        return;
      }

      const response = await api.delete(
        `/api/v1/experts/${userId}/payment-method`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { type },
        }
      );

      if (response.data.isActive === false) {
        setPaymentMethods([]);
        toast.success("Ödeme yöntemi başarıyla silindi");

        // Ödeme bilgilerini yeniden yükle
        await fetchPaymentInfo(userId);
      } else {
        toast.error("Ödeme yöntemi silinemedi");
      }
    } catch (error) {
      console.error("Ödeme yöntemi silinirken hata oluştu:", error);
      toast.error(
        error.response?.data?.error ||
          "Ödeme yöntemi silinirken bir hata oluştu"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Format date with time function
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Pagination for invoices
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  if (!expert) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-6 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-lg"
        >
          <p>Uzman bilgileri bulunamadı</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-8 sm:pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative p-8 md:p-10 mb-8 rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
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
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                  <ProfileImageUpload
                    currentImage={expert.profileImage}
                    onImageUpdate={handleProfileImageUpdate}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary shadow-lg">
                  <PencilIcon className="w-5 h-5" />
                </div>
              </motion.div>
            </div>
            <div className="md:col-span-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">
                {expert.name} {expert.surname}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm shadow-sm">
                  <BriefcaseIcon className="w-4 h-4 mr-2" />
                  {expert.jobTitleName || "Expert"}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm shadow-sm">
                  <StarIcon className="w-4 h-4 mr-2" />
                  4.8/5.0
                </span>
              </div>
              <div className="space-y-4 text-gray-300">
                {expert.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <span>
                      {expert.address}
                      {expert.postCode && ` - ${expert.postCode}`}
                    </span>
                  </div>
                )}
                {expert.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <span>{expert.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <span>{expert.email}</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <WalletIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Mevcut Bakiye</p>
                    <p className="text-2xl font-bold">
                      €{expert.balance || "0.00"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <nav className="flex overflow-x-auto py-2 scrollbar-hide">
            <div className="flex space-x-2 mx-auto bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-xl shadow-md">
              {[
                {
                  icon: <BriefcaseIcon className="w-5 h-5" />,
                  label: "İlanlar & İstekler",
                },
                {
                  icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
                  label: "Sohbetler",
                },
                { icon: <StarIcon className="w-5 h-5" />, label: "Portfolyo" },
                {
                  icon: <DocumentTextIcon className="w-5 h-5" />,
                  label: "Faturalar",
                },
                {
                  icon: <CreditCardIcon className="w-5 h-5" />,
                  label: "Ödeme Yöntemleri",
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
        {/* Ads & Requests Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ads Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
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
                  variants={itemVariants}
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
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {ads.map((ad, index) => (
                    <motion.div
                      key={ad.id}
                      variants={itemVariants}
                      className="group bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50"
                    >
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
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full px-4 py-3 bg-background dark:bg-gray-700 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary rounded-xl font-medium transition-all flex justify-center items-center gap-2"
                        >
                          <PencilIcon className="w-5 h-5" />
                          Düzenle
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Requests Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground dark:text-white">
                  Bekleyen İstekler
                </h2>
              </div>

              {requests.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
                >
                  <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <BriefcaseIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                    İstek Bulunamadı
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                    Şu anda bekleyen herhangi bir istek bulunmuyor. İlanlarınız
                    için gelen istekler burada listelenecektir.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      variants={itemVariants}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-foreground dark:text-white">
                          İstek: {request.adTitle}
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
                        Kimden: {request.userName}
                      </p>
                      <div className="flex gap-3 mt-6">
                        {request.status === "PENDING" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAcceptRequest(request.id)}
                            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                            Kabul Et
                          </motion.button>
                        )}
                        {request.status === "ACCEPTED" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate(`/chat/${request.chatRoomId}`)
                            }
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
            </motion.div>
          </div>
        </TabPanel>

        {/* Chat Rooms Tab */}
        <TabPanel value={tabValue} index={1}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
              Sohbetler
            </h2>

            {chatRooms.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
              >
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <ChatBubbleLeftRightIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                  Sohbet Bulunamadı
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                  Henüz hiç sohbetiniz bulunmuyor. İsteklerinizi kabul
                  ettiğinizde veya sohbet başlatıldığında burada
                  görüntülenecektir.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chatRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    variants={itemVariants}
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
                      Müşteri: {room.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Son aktivite: {formatDateTime(room.lastActivity)}
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
          </motion.div>
        </TabPanel>

        {/* Portfolio Tab */}
        <TabPanel value={tabValue} index={2}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground dark:text-white">
                Portfolyo
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectDialog(true)}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Proje Ekle
              </motion.button>
            </div>

            {portfolio.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
              >
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <StarIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                  Henüz Proje Yok
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                  Portfolyonuzda henüz hiç proje bulunmuyor. İlk projenizi
                  eklemek için "Proje Ekle" butonuna tıklayın.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((project, index) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground dark:text-gray-400 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          Tamamlandı: {formatDate(project.completionDate)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </TabPanel>

        {/* Invoices Tab */}
        <TabPanel value={tabValue} index={3}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-white">
                  Faturalar
                </h2>
                <p className="text-muted-foreground dark:text-gray-400 mt-1">
                  Faturalarınızı görüntüleyin ve indirin
                </p>
              </div>
            </div>

            {invoices.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40"
              >
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <DocumentTextIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                  Fatura Bulunamadı
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                  Henüz hiç faturanız bulunmuyor. İşlemler tamamlandığında
                  faturalarınız burada görüntülenecektir.
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="overflow-hidden rounded-2xl border border-border dark:border-gray-700 bg-card dark:bg-gray-800 shadow-md"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 dark:bg-gray-700/50">
                        <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">
                          Fatura No
                        </th>
                        <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">
                          Tarih
                        </th>
                        <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">
                          Tutar
                        </th>
                        <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">
                          Ödeme Tipi
                        </th>
                        <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">
                          Durum
                        </th>
                        <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-muted-foreground dark:text-gray-300">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-gray-700">
                      {currentInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="hover:bg-muted/50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground dark:text-white">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground dark:text-white">
                            {formatDateTime(invoice.dateIssued)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground dark:text-white">
                            €{invoice.amount.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground dark:text-white">
                            {invoice.paymentType === "CONTACT_INFO"
                              ? "İletişim Bilgisi"
                              : invoice.paymentType === "JOB_COMPLETION"
                              ? "İş Tamamlama"
                              : invoice.paymentType}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                invoice.paid
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }`}
                            >
                              {invoice.paid ? "Ödendi" : "Bekliyor"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleDownloadInvoice(invoice.id)
                                }
                                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary-foreground/10 dark:text-primary-foreground dark:hover:bg-primary-foreground/20 transition-colors"
                                title="PDF İndir"
                              >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                              </motion.button>
                              {invoice.stripeReceiptUrl && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    window.open(
                                      invoice.stripeReceiptUrl,
                                      "_blank"
                                    )
                                  }
                                  className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                                  title="Makbuzu Görüntüle"
                                >
                                  <ReceiptRefundIcon className="w-4 h-4" />
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center p-4 border-t border-border dark:border-gray-700">
                    <nav className="flex space-x-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                          currentPage === 1
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-10 h-10 rounded-lg ${
                              currentPage === number
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-700"
                            }`}
                          >
                            {number}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                          currentPage === totalPages
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-700"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </TabPanel>

        {/* Payment Methods Tab */}
        <TabPanel value={tabValue} index={4}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground dark:text-white">
              Ödeme Yöntemleri
            </h2>

            {paymentLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-t-primary/50 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
                </div>
              </div>
            ) : paymentError ? (
              <motion.div
                variants={itemVariants}
                className="p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <XCircleIcon className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Hata</h3>
                </div>
                <p>{paymentError}</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing Payment Methods */}
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400">
                          <BuildingLibraryIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground dark:text-white">
                            SEPA Banka Hesabı
                          </h3>
                          <p className="text-muted-foreground dark:text-gray-400">
                            {method.bankName} - **** {method.last4}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-full transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 dark:border-gray-700/50">
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Eklenme: {formatDate(method.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Add New Payment Method Card */}
                {paymentMethods.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => handleSetupPayment("SEPA")}
                    className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50 p-6 cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-4">
                        <BuildingLibraryIcon className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                        Banka Hesabı Ekle
                      </h3>
                      <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                        Güvenli ödemeler için SEPA banka hesabı ekleyin
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-md font-medium flex items-center gap-2"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Hesap Ekle
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
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
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={editData.companyName || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                        Ticaret Odası Numarası
                      </label>
                      <input
                        type="text"
                        value={editData.chamberOfCommerceNumber || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            chamberOfCommerceNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                        İş Ünvanı
                      </label>
                      <input
                        type="text"
                        value={editData.jobTitleName || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            jobTitleName: e.target.value,
                          })
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

        {/* Add Project Dialog */}
        <AnimatePresence>
          {showProjectDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowProjectDialog(false)}
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
                  <h2 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-2">
                    <PlusIcon className="w-6 h-6 text-primary dark:text-primary-foreground" />
                    Yeni Proje Ekle
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowProjectDialog(false)}
                    className="p-2 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors rounded-full bg-background/80 dark:bg-gray-700/80"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Proje Başlığı
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Görsel URL
                    </label>
                    <input
                      type="text"
                      value={newProject.imageUrl}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          imageUrl: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-gray-200 mb-2">
                      Tamamlanma Tarihi
                    </label>
                    <input
                      type="date"
                      value={newProject.completionDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          completionDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProjectDialog(false)}
                    className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white transition-all border border-border dark:border-gray-600"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateProject}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md"
                  >
                    Proje Oluştur
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

export default ExpertProfile;
