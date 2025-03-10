import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adService from "../../services/adService";
import requestService from "../../services/requestService";
import AdRequestButton from "./AdRequestButton";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

function AdList() {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

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
      setError("Failed to load job listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
          >
            İlanları Keşfedin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl"
          >
            Size uygun hizmet ve uzmanları bulun, projelerinizi hayata geçirin
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ads.map((ad) => (
              <motion.div key={ad.id} variants={itemVariants} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        ad.images && ad.images.length > 0
                          ? ad.images[0].url
                          : adService.DEFAULT_AD_IMAGE
                      }
                      alt={ad.title}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = adService.DEFAULT_AD_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="flex-1 p-5 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                      {ad.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {ad.descriptions}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm rounded-full">
                        {ad.categoryName}
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm rounded-full">
                        {ad.serviceName}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <AdRequestButton
                        adId={ad.id}
                        expertId={ad.userId}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-300 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {ads.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
              Henüz ilan bulunmamaktadır
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Daha sonra tekrar kontrol edin veya filtreleri değiştirin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdList;
