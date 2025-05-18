import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { CloudIcon } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

function CreateAd() {
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

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
    fetchCategories();
    fetchServices();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Başlık gereklidir";
    if (!descriptions.trim()) newErrors.descriptions = "Açıklama gereklidir";
    if (!categoryId) newErrors.categoryId = "Lütfen bir kategori seçin";
    if (!serviceId) newErrors.serviceId = "Lütfen bir servis seçin";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("descriptions", descriptions);
    formData.append("isActive", isActive);
    formData.append("categoryId", categoryId);
    formData.append("serviceId", serviceId);
    formData.append("userId", localStorage.getItem("userId"));

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        formData.append("storages", images[i], images[i].name);
      }
    }

    try {
      const response = await api.post("/api/v1/ads/ad", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Ad creation response:", response.data);
      navigate("/my-ads");
    } catch (error) {
      console.error(
        "Failed to create ad:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response?.data || "İlan oluşturulurken bir hata oluştu."
      );
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);

      // Create previews
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setImagesPreviews(previewsArray);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setImages(filesArray);

      // Create previews
      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setImagesPreviews(previewsArray);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagesPreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setImagesPreviews(newPreviews);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-8 sm:pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-background dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-foreground dark:text-white" />
              </motion.button>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
                Yeni İlan Oluştur
              </h1>
            </div>
            <p className="text-muted-foreground dark:text-gray-400 text-lg">
              İlan detaylarını doldurarak hemen yayınlamaya başlayın
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card dark:bg-gray-800 rounded-3xl shadow-xl border border-border/40 dark:border-gray-700/40 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-foreground dark:text-white">
                    Başlık <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.title
                        ? "border-red-500 dark:border-red-500 ring-2 ring-red-500/50"
                        : "border-border dark:border-gray-600 focus:border-primary dark:focus:border-primary-foreground"
                    } bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-foreground/50 transition-all`}
                    placeholder="İlanınız için çekici bir başlık yazın"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircleIcon className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </motion.div>

                {/* Description Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-sm font-medium text-foreground dark:text-white">
                    Açıklama <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descriptions}
                    onChange={(e) => setDescriptions(e.target.value)}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.descriptions
                        ? "border-red-500 dark:border-red-500 ring-2 ring-red-500/50"
                        : "border-border dark:border-gray-600 focus:border-primary dark:focus:border-primary-foreground"
                    } bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-foreground/50 transition-all resize-none`}
                    placeholder="İlanınız hakkında detaylı bilgi verin"
                  />
                  {errors.descriptions && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircleIcon className="w-4 h-4" />
                      {errors.descriptions}
                    </p>
                  )}
                </motion.div>

                {/* Category & Service Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Category Select */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-foreground dark:text-white">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.categoryId
                          ? "border-red-500 dark:border-red-500 ring-2 ring-red-500/50"
                          : "border-border dark:border-gray-600 focus:border-primary dark:focus:border-primary-foreground"
                      } bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-foreground/50 transition-all appearance-none`}
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <XCircleIcon className="w-4 h-4" />
                        {errors.categoryId}
                      </p>
                    )}
                  </motion.div>

                  {/* Service Select */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-foreground dark:text-white">
                      Servis <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.serviceId
                          ? "border-red-500 dark:border-red-500 ring-2 ring-red-500/50"
                          : "border-border dark:border-gray-600 focus:border-primary dark:focus:border-primary-foreground"
                      } bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-foreground/50 transition-all appearance-none`}
                    >
                      <option value="">Servis seçin</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <XCircleIcon className="w-4 h-4" />
                        {errors.serviceId}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Is Active Toggle */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary-foreground/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary-foreground"></div>
                    <span className="ml-3 text-sm font-medium text-foreground dark:text-white">
                      İlan Aktif
                    </span>
                  </label>
                </motion.div>

                {/* Image Upload */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                    İlan Görselleri
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 text-center ${
                      dragActive
                        ? "border-primary dark:border-primary-foreground bg-primary/5 dark:bg-primary-foreground/5"
                        : "border-border dark:border-gray-600"
                    } transition-all duration-200`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />

                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 bg-primary/10 dark:bg-primary-foreground/10 rounded-full flex items-center justify-center mb-4"
                      >
                        <CloudIcon className="w-8 h-8 text-primary dark:text-primary-foreground" />
                      </motion.div>
                      <p className="text-lg font-medium text-foreground dark:text-white mb-2">
                        Görselleri Sürükle & Bırak veya Tıkla
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        PNG, JPG veya JPEG (max 5MB)
                      </p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagesPreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground dark:text-white mb-3">
                        Yüklenen Görseller ({imagesPreviews.length})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagesPreviews.map((preview, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group rounded-lg overflow-hidden bg-background dark:bg-gray-700 aspect-square shadow-md"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <XCircleIcon className="w-5 h-5 text-white" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                      loading ? "opacity-80 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-6 h-6" />
                        <span>İlanı Oluştur</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateAd;
