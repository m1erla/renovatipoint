import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { serviceService } from "../../../services/serviceService";
import { convertToTranslationKeys } from "../../../utils/translationHelper"; // Import the helper

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await serviceService.getAllServices();
        if (Array.isArray(data)) {
          // Process services to add translationKey
          const processedServices = convertToTranslationKeys(data, {
            type: "service",
            nameField: "name",
          });
          setServices(processedServices);
        } else {
          console.warn("Fetched services data is not an array:", data);
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(t("errors.fetchFailed", "Failed to fetch services.")); // Added default fallback
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [t]);

  const handleServiceClick = (id) => {
    navigate(`/servis/${id}`);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/images/placeholder-ad.png";
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-foreground dark:text-white">
          {t("services.title", "Tüm Servisler")}
        </h1>
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">{t("errors.errorTitle")}</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border dark:border-gray-700 cursor-pointer"
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.imageUrl || "/images/placeholder-ad.png"}
                  alt={t(service.translationKey || service.name)} // Use t() with translationKey
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-2">
                    {t(service.translationKey || service.name)} {/* Use t() with translationKey */}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground dark:text-gray-300 mb-4">
                  {/* Assuming service.description is either already translated or doesn't need to be. 
                                      If it needs translation and comes from CSV as a key, it should also be processed.
                                      For now, let's assume it's fine as is or will be handled separately. */}
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {t("services.expertCount", { count: service.expertCount || 0 })}
                  </span>
                  {service.id && (
                    <span
                      className="inline-flex items-center text-primary hover:underline text-sm"
                      onClick={e => { e.stopPropagation(); handleServiceClick(service.id); }}
                    >
                      {t("services.viewDetails", "Detaylar")}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {!loading && services.length === 0 && (
          <div className="text-center text-lg text-muted-foreground mt-16">
            {t("services.empty", "Hiç servis bulunamadı.")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;