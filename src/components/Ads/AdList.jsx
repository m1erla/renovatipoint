import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adService from "../../services/adService";
import requestService from "../../services/requestService";
import AdRequestButton from "./AdRequestButton";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  UserIcon,
  TagIcon,
  CheckBadgeIcon,
  ArrowUpRightIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { getTranslationKeyFromTurkishName } from "../../utils/translationHelper";

function AdList() {
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Kullanıcı bilgilerini localStorage'dan al
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  const userRole = localStorage.getItem("role");
  const isExpert = userRole === "EXPERT";

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
    fetchAds();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/ads");

      // İlanları ve resimlerini yükle
      const adsWithImages = await Promise.all(
        response.data.map(async (ad) => {
          try {
            const images = await adService.getAdImages(ad.id);
            return {
              ...ad,
              images: images || [{ url: adService.DEFAULT_AD_IMAGE }],
            };
          } catch (error) {
            console.warn(`Failed to load images for ad ${ad.id}:`, error);
            return {
              ...ad,
              images: [{ url: adService.DEFAULT_AD_IMAGE }],
            };
          }
        })
      );

      setAds(adsWithImages.filter((ad) => ad !== null));
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      setError(t("ads.list.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  // İlan detayına yönlendirme fonksiyonu
  const handleViewDetails = (adId) => {
    navigate(`/ads/${adId}`);
  };

  // Filter ads based on search term and category
  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      !searchTerm ||
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.descriptions.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || ad.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-8 sm:pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 md:mb-16 text-center"
        >
          <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div
              className="relative left-[calc(50%-20rem)] aspect-[1155/678] w-[40rem] -translate-x-1/2 -rotate-[30deg] bg-gradient-to-tr from-primary/20 to-primary-foreground/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[80rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-6 tracking-tight"
          >
            {t("ads.list.header.title")}{" "}
            <span className="text-primary dark:text-primary-foreground">
              {t("ads.list.header.discoverHighlight")}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            {t("ads.list.header.subtitle")}
          </motion.p>

          {/* Search & Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("ads.list.searchPlaceholder")}
                className="pl-10 w-full px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="">{t("ads.list.allCategories")}</option>
              {categories.map((category) => {
                const categoryKey = getTranslationKeyFromTurkishName(
                  category.name,
                  "category"
                );
                return (
                  <option key={category.id} value={category.name}>
                    {t(categoryKey)}
                  </option>
                );
              })}
            </select>
          </motion.div>
        </motion.div>

        {/* Ads Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-primary/50 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <XCircleIcon className="w-6 h-6" />
              <h3 className="text-lg font-semibold">
                {t("ads.list.errorTitle")}
              </h3>
            </div>
            <p>{error}</p>
          </motion.div>
        ) : (
          <>
            {filteredAds.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-12 bg-card/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/40 dark:border-gray-700/40 max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <BuildingOfficeIcon className="w-10 h-10 text-primary dark:text-primary-foreground/90" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                  {t("ads.list.noAds.title")}
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 text-center mb-6 max-w-md">
                  {t("ads.list.noAds.message")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredAds.map((ad) => {
                  const categoryKey = getTranslationKeyFromTurkishName(
                    ad.categoryName,
                    "category"
                  );
                  const serviceKey = getTranslationKeyFromTurkishName(
                    ad.serviceName,
                    "service"
                  );

                  return (
                    <motion.div
                      key={ad.id}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="group bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 dark:border-gray-700/50 h-full flex flex-col"
                    >
                      <div
                        onClick={() => handleViewDetails(ad.id)}
                        className="relative h-56 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={
                            ad.images && ad.images.length > 0
                              ? ad.images[0].url
                              : adService.DEFAULT_AD_IMAGE
                          }
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = adService.DEFAULT_AD_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute bottom-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 text-primary dark:text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                        >
                          <ArrowUpRightIcon className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="flex-1 p-6 flex flex-col">
                        <h3
                          onClick={() => handleViewDetails(ad.id)}
                          className="text-xl font-semibold mb-3 text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          {ad.title}
                        </h3>

                        <p className="text-muted-foreground dark:text-gray-300 mb-4 line-clamp-3">
                          {ad.descriptions}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                            <TagIcon className="w-4 h-4 mr-1" />
                            {t(categoryKey)}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                            <CheckBadgeIcon className="w-4 h-4 mr-1" />
                            {t(serviceKey)}
                          </span>
                        </div>

                        <div className="mt-auto">
                          {isAuthenticated ? (
                            isExpert ? (
                              <AdRequestButton
                                adId={ad.id}
                                expertId={ad.userId}
                                className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                              />
                            ) : (
                              <div className="text-center">
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleViewDetails(ad.id)}
                                  className="w-full py-3 bg-background dark:bg-gray-700 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary rounded-xl font-medium transition-all flex justify-center items-center gap-2"
                                >
                                  <ArrowRightIcon className="w-5 h-5" />
                                  {t("ads.list.viewDetailsButton")}
                                </motion.button>
                                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                                  <UserIcon className="w-3 h-3" />
                                  {t("ads.list.expertOnlyNote")}
                                </p>
                              </div>
                            )
                          ) : (
                            <div className="text-center">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/login")}
                                className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                              >
                                <LockClosedIcon className="w-5 h-5" />
                                {t("ads.list.loginButton")}
                              </motion.button>
                              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
                                <LockClosedIcon className="w-3 h-3" />
                                {t("ads.list.loginNote")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdList;
