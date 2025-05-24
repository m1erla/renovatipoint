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
import { jobTitleService } from "../../services/jobTitleService";
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
  CameraIcon,
  IdentificationIcon,
  AcademicCapIcon as PortfolioIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import ProjectForm from "./ProjectForm";
import InvoiceTable from "./InvoiceTable";
import PaymentMethodSection from "./PaymentMethodSection";
import AdCard from "./AdCard";
import RequestCard from "./RequestCard";
import ChatCard from "./ChatCard";
import PortfolioCard from "./PortfolioCard";
import { slugify } from "../../utils/slugify";
import { getTranslationKeyFromTurkishName } from "../../utils/translationHelper";

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
  const { t, i18n } = useTranslation();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [chatRooms, setChatRooms] = useState([]);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [requests, setRequests] = useState([]);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    imageUrl: "",
    completionDate: "",
  });
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(5);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitlesLoading, setJobTitlesLoading] = useState(false);
  const [jobTitlesError, setJobTitlesError] = useState(null);
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useContext(AuthContext);

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

  const checkTokenAndRedirect = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      localStorage.clear();
      toast.error(t("toasts.sessionExpired"));
      navigate("/login");
      return false;
    }
    return true;
  };

  const fetchJobTitles = async () => {
    if (!checkTokenAndRedirect()) return;
    setJobTitlesLoading(true);
    setJobTitlesError(null);
    try {
      const fetchedJobTitles = await jobTitleService.getAllJobTitles();
      setJobTitles(fetchedJobTitles || []);
    } catch (error) {
      console.error("Failed to fetch job titles:", error);
      setJobTitlesError(t("expertProfile.errors.loadJobTitlesFailed"));
      setJobTitles([]);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.errors.loadJobTitlesFailed"));
      }
    } finally {
      setJobTitlesLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const initializeProfile = async () => {
      if (!checkTokenAndRedirect()) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        // const expertId = localStorage.getItem("expertId"); // No longer needed for this endpoint

        // Ensure Authorization header is set for the request
        // api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // This is likely already handled by interceptor

        // Fetch expert data using the correct endpoint that uses the token
        const expertResponse = await api.get(
          `/api/v1/experts/responseExpert` // NEW endpoint using token
        );

        if (expertResponse.data) {
          const expertData = expertResponse.data; // Assuming response.data is the expert object
          const expertId = expertData.id; // Get expertId from the response data

          if (!expertId) {
            throw new Error("Expert ID not found in profile response.");
          }

          setExpert(expertData);
          setEditData({
            ...expertData,
            jobTitleId: expertData.jobTitle?.id || "",
          });

          // Fetch related data using the retrieved expertId
          await Promise.all([
            fetchExpertRequests(expertId),
            fetchExpertChatRooms(expertId),
            fetchPortfolioProjects(expertId),
            fetchInvoices(expertId),
            fetchPaymentInfo(expertId), // Ensure this uses expertId
            fetchJobTitles(), // Fetch job titles here
          ]);
        } else {
          setError(t("expertProfile.errors.loadFailedSpecific"));
          toast.error(t("expertProfile.errors.loadFailedSpecific"));
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch expert profile:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          toast.error(t("toasts.sessionExpired"));
          navigate("/login");
        } else if (err.message === "Expert ID not found in profile response.") {
          setError(t("expertProfile.errors.loadFailedSpecific")); // Or a more specific error
          toast.error(t("expertProfile.errors.loadFailedSpecific"));
        } else if (err.message === "User ID not found in local storage.") {
          // This check might become obsolete or should refer to expertId contextually
          setError(t("expertProfile.errors.expertIdNotFound")); // Changed key to expertIdNotFound for clarity
          toast.error(t("expertProfile.errors.expertIdNotFound")); // Changed key
        } else {
          const errorMessage =
            err.response?.data?.message || t("expertProfile.errors.loadFailed");
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate, isAuthenticated, t]);

  const fetchExpertRequests = async (expertId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const fetchedRequests = await requestService.getExpertRequests(expertId);
      if (fetchedRequests) {
        setRequests(fetchedRequests);
      }
    } catch (error) {
      console.error("Failed to fetch expert requests:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.errors.loadRequestsFailed"));
      }
    }
  };

  const fetchExpertChatRooms = async (expertId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const response = await api.get(`/api/v1/chat/rooms`);
      if (response.data) {
        setChatRooms(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch expert chat rooms:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.errors.loadChatsFailed"));
      }
    }
  };

  const fetchPortfolioProjects = async (expertId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const response = await api.get(`/api/v1/experts/${expertId}/portfolio`);
      if (response.data) {
        setPortfolioProjects(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio projects:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.errors.loadPortfolioFailed"));
      }
    }
  };

  const fetchInvoices = async (expertId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const response = await api.get(`/api/v1/invoices/expert/${expertId}`);
      setInvoices(response.data || []);
    } catch (err) {
      console.error("Failed to load invoices:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.invoices.errors.loadFailed"));
      }
    }
  };

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleEditSave = async () => {
    if (!checkTokenAndRedirect()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const expertIdToUpdate = expert?.id;

      if (!expertIdToUpdate) {
        toast.error(t("expertProfile.errors.expertIdNotFound"));
        setLoading(false);
        return;
      }

      const updateData = {
        id: expertIdToUpdate,
        name: editData.name || "",
        surname: editData.surname || "",
        phoneNumber: editData.phoneNumber || "",
        address: editData.address || "",
        postCode: editData.postCode || "",
        companyName: editData.companyName || "",
        chamberOfCommerceNumber: editData.chamberOfCommerceNumber || "",
        jobTitleId: editData.jobTitleId || null,
      };

      console.log("Updating expert with data:", updateData);

      const response = await api.put(`/api/v1/experts/update`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        const expertResponse = await api.get(`/api/v1/experts/responseExpert`);
        if (expertResponse.data) {
          setExpert(expertResponse.data);
          setEditData({
            ...expertResponse.data,
            jobTitleId: expertResponse.data.jobTitle?.id || "",
          });
        }

        setEditMode(false);
        toast.success(t("expertProfile.edit.success"));
      } else {
        toast.error(t("expertProfile.errors.updateFailedUnexpected"));
      }
    } catch (err) {
      console.error("Error updating expert profile:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else if (err.request) {
        console.error("Error request:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      const errorMessage =
        err.response?.data?.message || t("expertProfile.errors.updateFailed");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      setLoading(true);
      const response = await requestService.acceptRequest(requestId);

      if (response) {
        toast.success(t("expertProfile.requests.acceptSuccess"));
        await fetchExpertRequests(expert.id);

        // Navigate to chat if chat room ID exists
        const chatRoomId = response.chatRoom?.id || response.chatRoomId;
        if (chatRoomId) {
          navigate(`/chat/${chatRoomId}`);
        }
      } else {
        toast.error(t("expertProfile.requests.errors.acceptFailedResponse"));
      }
    } catch (error) {
      console.error("Failed to accept request:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.requests.errors.acceptFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpdate = async (newImageFile) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const token = localStorage.getItem("accessToken");
      const expertId = expert?.id;
      if (!expertId) {
        toast.error(t("expertProfile.errors.expertIdNotFound"));
        return;
      }

      const formData = new FormData();
      formData.append("file", newImageFile);

      await api.put(
        `/api/v1/experts/${expertId}/uploadProfileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Re-fetch profile data after successful image update
      const expertResponse = await api.get(`/api/v1/experts/responseExpert`);
      if (expertResponse.data) {
        setExpert(expertResponse.data);
        setEditData(expertResponse.data);
      }

      toast.success(t("expertProfile.edit.imageUpdateSuccess"));
    } catch (error) {
      console.error("Failed to update profile image:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.errors.imageUpdateFailed"));
      }
    }
  };

  const handleCreateProject = async (projectData) => {
    if (!checkTokenAndRedirect()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const expertId = expert?.id;
      if (!expertId) {
        toast.error(t("expertProfile.errors.expertIdNotFound"));
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("expertId", expertId);
      formData.append("title", projectData.title);
      formData.append("description", projectData.description);
      formData.append("completionDate", projectData.completionDate);
      if (projectData.imageFile) {
        formData.append("imageFile", projectData.imageFile);
      }

      const response = await api.post(
        `/api/v1/experts/${expertId}/portfolio`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        await fetchPortfolioProjects(expertId);
        setShowProjectDialog(false);
        toast.success(t("expertProfile.addProjectDialog.toast.success"));
      } else {
        toast.error(t("expertProfile.addProjectDialog.toast.errorResponse"));
      }
    } catch (error) {
      console.error("Error adding project:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            t("expertProfile.addProjectDialog.toast.error")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/api/v1/invoices/download/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice_${invoiceId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);

      toast.success(t("expertProfile.invoices.toast.downloadSuccess"));
    } catch (err) {
      console.error("Failed to download invoice:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.invoices.errors.downloadFailed"));
      }
    }
  };

  const handleSetupPayment = async (type) => {
    if (!checkTokenAndRedirect()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const expertId = expert?.id;
      if (!expertId) {
        toast.error(t("expertProfile.errors.expertIdNotFound"));
        setLoading(false);
        return;
      }

      const response = await api.post(
        `/api/v1/payments/stripe/connect/onboarding`,
        { expertId: expertId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error(t("expertProfile.paymentMethods.errors.setupFailed"));
      }
    } catch (err) {
      console.error("Error setting up payment:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("expertProfile.paymentMethods.errors.setupFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentInfo = async (expertId) => {
    if (!checkTokenAndRedirect()) return;
    try {
      const response = await expertService.getPaymentInfo(expertId);
      setPaymentInfo(response.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to load payment info:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          toast.error(t("toasts.sessionExpired"));
          navigate("/login");
        } else {
          toast.error(t("expertProfile.paymentMethods.errors.loadFailed"));
        }
      } else {
        setPaymentInfo(null);
      }
    }
  };

  const handleRemovePaymentMethod = async (methodId) => {
    if (!checkTokenAndRedirect()) return;
    if (!window.confirm(t("expertProfile.paymentMethods.confirmDelete"))) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const expertId = expert?.id;
      if (!expertId) {
        toast.error(t("expertProfile.errors.expertIdNotFound"));
        setLoading(false);
        return;
      }

      await paymentService.handleRemovePaymentMethod(methodId, "BANK");

      toast.success(t("expertProfile.paymentMethods.toast.deleteSuccess"));
      await fetchPaymentInfo(expertId);
    } catch (err) {
      console.error("Error removing payment method:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        toast.error(t("toasts.sessionExpired"));
        navigate("/login");
      } else {
        const errorMsg =
          err.response?.data?.message ||
          t("expertProfile.paymentMethods.errors.deleteFailed");
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const currentLocale = i18n.language || "tr";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t("common.invalidDate");
      }
      return new Intl.DateTimeFormat(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return t("common.invalidDate");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const currentLocale = i18n.language || "tr";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t("common.invalidDate");
      }
      return new Intl.DateTimeFormat(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return t("common.invalidDate");
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = adService.DEFAULT_AD_IMAGE;
  };

  if (loading && !expert) {
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
            <h3 className="text-lg font-semibold">{t("common.error")}</h3>
          </div>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t("common.retry")}
          </button>
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
          <p>{t("expertProfile.errors.notFoundMessage")}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-16 sm:pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative p-8 md:p-10 mb-8 mt-4 rounded-3xl bg-gradient-to-br from-gray-800/95 via-gray-800 to-gray-900 text-white shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
          </div>

          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditData({
                  ...expert,
                  jobTitleId: expert.jobTitle?.id || "",
                });
                setEditMode(true);
              }}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors shadow-lg"
              aria-label={t("expertProfile.edit.editButtonLabel")}
            >
              <PencilIcon className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-3 flex justify-center md:justify-start">
              <motion.div
                className="relative w-48 h-48"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <ProfileImageUpload
                  currentImage={expert.profileImage}
                  onImageUpdate={handleProfileImageUpdate}
                  uploadIcon={<CameraIcon className="w-8 h-8 text-white" />}
                  ariaLabelUpload={t("expertProfile.edit.uploadPhoto")}
                />
              </motion.div>
            </div>

            <div className="md:col-span-9 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {expert.name} {expert.surname}
              </h1>
              {expert.jobTitle?.name && (
                <p className="text-xl text-blue-300 mb-4">
                 {t(expert.jobTitle.name, expert.jobTitle.name.split('.').pop())}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm shadow-sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {t("expertProfile.header.role")}
                </span>
                {expert.averageRating && expert.averageRating > 0 && (
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-400/10 text-yellow-300 backdrop-blur-sm shadow-sm">
                    <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                    {expert.averageRating.toFixed(1)} ({expert.reviewCount || 0}{" "}
                    {t("expertProfile.header.reviews", {
                      count: expert.reviewCount || 0,
                    })}
                    )
                  </span>
                )}
              </div>

              <div className="space-y-3 text-gray-300">
                {expert.companyName && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <BuildingLibraryIcon className="w-5 h-5 text-gray-400" />
                    <span>{expert.companyName}</span>
                  </div>
                )}
                {expert.chamberOfCommerceNumber && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <IdentificationIcon className="w-5 h-5 text-gray-400" />
                    <span>{expert.chamberOfCommerceNumber}</span>
                  </div>
                )}
                {expert.address && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <span>
                      {expert.address}
                      {expert.postCode && ` - ${expert.postCode}`}
                    </span>
                  </div>
                )}
                {expert.phoneNumber && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span>{expert.phoneNumber}</span>
                  </div>
                )}
                {expert.email && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <span>{expert.email}</span>
                  </div>
                )}
              </div>

              {paymentInfo?.balance && (
                <div className="mt-6 pt-4 border-t border-white/10 text-center md:text-left">
                  <span className="text-sm text-gray-400 block mb-1">
                    {t("expertProfile.header.balanceLabel")}
                  </span>
                  <span className="text-2xl font-semibold text-green-400">
                    {new Intl.NumberFormat(i18n.language, {
                      style: "currency",
                      currency:
                        paymentInfo.balance.currency?.toUpperCase() || "EUR",
                    }).format(paymentInfo.balance.amount / 100)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mb-8">
          <nav className="flex overflow-x-auto py-2 scrollbar-hide">
            <div className="flex space-x-2 mx-auto bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-xl shadow-md">
              {[
                {
                  icon: <DocumentTextIcon className="w-5 h-5" />,
                  label: t("expertProfile.tabs.adsRequests"),
                },
                {
                  icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
                  label: t("expertProfile.tabs.chats"),
                },
                {
                  icon: <PortfolioIcon className="w-5 h-5" />,
                  label: t("expertProfile.tabs.portfolio"),
                },
                {
                  icon: <BanknotesIcon className="w-5 h-5" />,
                  label: t("expertProfile.tabs.invoices"),
                },
                {
                  icon: <CreditCardIcon className="w-5 h-5" />,
                  label: t("expertProfile.tabs.paymentMethods"),
                },
              ].map((tab, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 sm:px-6 py-3 font-medium text-sm inline-flex items-center gap-2 rounded-lg transition-all ${
                    tabValue === index
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white hover:bg-background/80 dark:hover:bg-gray-700/50"
                  }`}
                  aria-current={tabValue === index ? "page" : undefined}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </nav>
        </div>

        <TabPanel value={tabValue} index={0}>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
                {t("expertProfile.requests.title")}
              </h2>
              {requests.filter((req) => req.status === "PENDING").length ===
              0 ? (
                <div className="text-center p-8 bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
                  <BriefcaseIcon className="w-12 h-12 mx-auto text-muted-foreground dark:text-gray-500 mb-3" />
                  <h3 className="text-lg font-semibold mb-1">
                    {t("expertProfile.requests.emptyState.title")}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm">
                    {t("expertProfile.requests.emptyState.message")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests
                    .filter((req) => req.status === "PENDING")
                    .map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onAccept={handleAcceptRequest}
                        onGoToChat={(chatId) => navigate(`/chat/${chatId}`)}
                        t={t}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
            {t("expertProfile.chats.title")}
          </h2>
          {chatRooms.length === 0 ? (
            <div className="text-center p-8 bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-muted-foreground dark:text-gray-500 mb-3" />
              <h3 className="text-lg font-semibold mb-1">
                {t("expertProfile.chats.emptyState.title")}
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-sm">
                {t("expertProfile.chats.emptyState.message")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chatRooms.map((room) => (
                <ChatCard
                  key={room.id}
                  room={room}
                  currentUserRole="EXPERT"
                  onGoToChat={(chatId) => navigate(`/chat/${chatId}`)}
                  formatDateTime={formatDateTime}
                  t={t}
                />
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground dark:text-white">
              {t("expertProfile.portfolio.title")}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProjectDialog(true)}
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              {t("expertProfile.portfolio.addProjectButton")}
            </motion.button>
          </div>
          {portfolioProjects.length === 0 ? (
            <div className="text-center p-8 bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
              <PortfolioIcon className="w-12 h-12 mx-auto text-muted-foreground dark:text-gray-500 mb-3" />
              <h3 className="text-lg font-semibold mb-1">
                {t("expertProfile.portfolio.emptyState.title")}
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 text-sm">
                {t("expertProfile.portfolio.emptyState.message")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioProjects.map((project) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  formatDate={formatDate}
                  t={t}
                  onImageError={handleImageError}
                />
              ))}
            </div>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
            {t("expertProfile.invoices.title")}
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 mb-6">
            {t("expertProfile.invoices.description")}
          </p>
          <InvoiceTable
            invoices={invoices}
            onDownload={handleDownloadInvoice}
            formatDateTime={formatDateTime}
            t={t}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
            {t("expertProfile.paymentMethods.title")}
          </h2>
          <PaymentMethodSection
            paymentInfo={paymentInfo}
            onSetupPayment={handleSetupPayment}
            onRemovePayment={handleRemovePaymentMethod}
            formatDateTime={formatDateTime}
            loading={loading}
            t={t}
          />
        </TabPanel>

        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setEditMode(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-expert-profile-dialog-title"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2
                    id="edit-expert-profile-dialog-title"
                    className="text-2xl font-bold text-foreground dark:text-white"
                  >
                    {t("expertProfile.editDialog.title")}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditMode(false)}
                    className="p-2 text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors rounded-full bg-background/80 dark:bg-gray-700/80"
                    aria-label={t("common.closeDialog")}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="edit-name"
                        className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                      >
                        {t("expertProfile.editDialog.firstNameLabel")}
                      </label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className={formInputStyles}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-surname"
                        className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                      >
                        {t("expertProfile.editDialog.lastNameLabel")}
                      </label>
                      <input
                        id="edit-surname"
                        type="text"
                        value={editData.surname || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, surname: e.target.value })
                        }
                        className={formInputStyles}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="edit-company-name"
                        className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                      >
                        {t("expertProfile.editDialog.companyNameLabel")}
                      </label>
                      <input
                        id="edit-company-name"
                        type="text"
                        value={editData.companyName || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            companyName: e.target.value,
                          })
                        }
                        className={formInputStyles}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-coc"
                        className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                      >
                        {t("expertProfile.editDialog.chamberOfCommerceLabel")}
                      </label>
                      <input
                        id="edit-coc"
                        type="text"
                        value={editData.chamberOfCommerceNumber || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            chamberOfCommerceNumber: e.target.value,
                          })
                        }
                        className={formInputStyles}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="edit-job-title"
                        className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                      >
                        {t("expertProfile.editDialog.jobTitleLabel")}
                      </label>
                      <select
                        id="edit-job-title"
                        value={editData.jobTitleId || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            jobTitleId: e.target.value,
                          })
                        }
                        className={formInputStyles}
                        disabled={jobTitlesLoading || !!jobTitlesError}
                        aria-invalid={!!jobTitlesError}
                        aria-describedby={
                          jobTitlesError ? "job-title-error" : undefined
                        }
                      >
                        <option value="" disabled>
                          {jobTitlesLoading
                            ? t("common.loading")
                            : jobTitlesError
                            ? t("common.error")
                            : t(
                                "expertProfile.editDialog.selectJobTitlePlaceholder"
                              )}
                        </option>
                        {!jobTitlesLoading &&
                          !jobTitlesError &&
                          jobTitles.map((jt) => {
                      
                            return (
                              <option key={jt.id} value={jt.id}>
                                {t(jt.name, jt.name.split('.').pop())}
                              </option>
                            );
                          })}
                      </select>
                      {jobTitlesError && (
                        <p
                          id="job-title-error"
                          className="text-xs text-red-500 mt-1"
                        >
                          {jobTitlesError}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="edit-phone"
                        className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                      >
                        {t("expertProfile.editDialog.phoneLabel")}
                      </label>
                      <input
                        id="edit-phone"
                        type="tel"
                        value={editData.phoneNumber || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className={formInputStyles}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="edit-address"
                      className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                    >
                      {t("expertProfile.editDialog.addressLabel")}
                    </label>
                    <textarea
                      id="edit-address"
                      value={editData.address || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                      rows={3}
                      className={formTextareaStyles}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-postcode"
                      className="block text-sm font-medium text-foreground dark:text-gray-200 mb-1"
                    >
                      {t("expertProfile.editDialog.postCodeLabel")}
                    </label>
                    <input
                      id="edit-postcode"
                      type="text"
                      value={editData.postCode || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, postCode: e.target.value })
                      }
                      className={formInputStyles}
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
                    {t("common.cancelButton")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditSave}
                    disabled={loading}
                    className={`px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? t("common.saving") : t("common.saveButton")}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showProjectDialog && (
            <ProjectForm
              isOpen={showProjectDialog}
              onClose={() => setShowProjectDialog(false)}
              onSubmit={handleCreateProject}
              loading={loading}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const formInputStyles =
  "w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const formTextareaStyles =
  "w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

export default ExpertProfile;
