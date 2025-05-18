import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from "../../utils/api";
import { toast } from "react-toastify";
import {
  HomeIcon,
  HomeModernIcon,
  WrenchIcon,
  ChevronRightIcon,
  PencilIcon,
  BeakerIcon,
  SwatchIcon,
  BoltIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  SquaresPlusIcon,
  TruckIcon,
  FireIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { categoryService } from "../../services/categoryService";
import { serviceService } from "../../services/serviceService";
import {
  addSlugsToItems,
  slugify,
  slugToTranslationKey,
} from "../../utils/slugify";
import { getTranslationKeyFromTurkishName } from "../../utils/translationHelper";

// Icon bileşenleri
const iconComponents = {
  HomeIcon: <HomeIcon className="w-10 h-10" />,
  HomeModernIcon: <HomeModernIcon className="w-10 h-10" />,
  WrenchIcon: <WrenchIcon className="w-10 h-10" />,
  TreesIcon: <PencilIcon className="w-10 h-10" />,
  SwatchIcon: <SwatchIcon className="w-10 h-10" />,
  BoltIcon: <BoltIcon className="w-10 h-10" />,
  DropletIcon: <BeakerIcon className="w-10 h-10" />,
  AppWindowIcon: <ComputerDesktopIcon className="w-10 h-10" />,
  ShieldCheckIcon: <ShieldCheckIcon className="w-10 h-10" />,
  SofaIcon: <SquaresPlusIcon className="w-10 h-10" />,
  TruckIcon: <TruckIcon className="w-10 h-10" />,
  ThermometerIcon: <FireIcon className="w-10 h-10" />,
  TabletSmartphoneIcon: <DevicePhoneMobileIcon className="w-10 h-10" />,
};

const getIcon = (iconName) => {
  return iconComponents[iconName] || <HomeIcon className="w-6 h-6" />;
};

const CategoryDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [categoryServices, setCategoryServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setCategory(null);
      setCategoryServices([]);
      const categoryId = parseInt(id);

      if (isNaN(categoryId)) {
        setError(t("errors.invalidCategoryId"));
        setLoading(false);
        return;
      }

      try {
        // Kategori ve kategoriye ait hizmetleri çek
        const [categoryData, servicesData] = await Promise.all([
          categoryService.getCategoryById(categoryId),
          serviceService.getServicesByCategory(categoryId),
        ]);

        // Kategori verisini işle
        if (categoryData) {
          if (!categoryData.slug) {
            setCategory({
              ...categoryData,
              slug: slugify(categoryData.name),
            });
          } else {
            setCategory(categoryData);
          }

          // Debug: Çeviri anahtarı oluşturma ve kullanımını kontrol et
          if (categoryData.name) {
            const translationKey = getTranslationKeyFromTurkishName(
              categoryData.name,
              "category"
            );
            console.log("Kategori Adı:", categoryData.name);
            console.log("Oluşturulan Çeviri Anahtarı:", translationKey);
            console.log("Çeviri Sonucu:", t(translationKey));
          }
        } else {
          throw new Error("Category not found in API response");
        }

        // Servis verilerini işle
        if (servicesData && Array.isArray(servicesData)) {
          const servicesWithSlugs = addSlugsToItems(servicesData);
          setCategoryServices(servicesWithSlugs);

          // Debug: İlk servisi örnek olarak kontrol et
          if (servicesWithSlugs.length > 0 && servicesWithSlugs[0].name) {
            const serviceName = servicesWithSlugs[0].name;
            const serviceTranslationKey = getTranslationKeyFromTurkishName(
              serviceName,
              "service"
            );
            console.log("İlk Servis Adı:", serviceName);
            console.log("Servis Çeviri Anahtarı:", serviceTranslationKey);
            console.log("Servis Çeviri Sonucu:", t(serviceTranslationKey));
          }
        } else {
          console.warn(
            "Services data is not in expected format:",
            servicesData
          );
          setCategoryServices([]);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        if (err.response && err.response.status === 404) {
          setError(t("pages.categoryDetail.notFound.title"));
          toast.error(t("pages.categoryDetail.notFound.title"));
        } else {
          setError(t("errors.fetchDataError"));
          toast.error(t("errors.fetchDataError"));
        }
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  const handleServiceClick = (serviceId) => {
    navigate(`/servis/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {error
            ? t("errors.errorTitle")
            : t("pages.categoryDetail.notFound.title")}
        </h1>
        <p className="mb-8">
          {error || t("pages.categoryDetail.notFound.description")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          {t("common.backToHome")}
        </Link>
      </div>
    );
  }

  const displayCategory = category;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80">
          <img
            src={
              displayCategory.backgroundImage ||
              "/images/backgrounds/default-bg.jpg"
            }
            alt={t(
              getTranslationKeyFromTurkishName(displayCategory.name, "category")
            )}
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {getTranslationKeyFromTurkishName(
                displayCategory.name,
                "category"
              )
                ? t(
                    getTranslationKeyFromTurkishName(
                      displayCategory.name,
                      "category"
                    )
                  )
                : displayCategory.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
            >
              {displayCategory.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center items-center mb-4"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white">
                {t("pages.categoryDetail.experts", {
                  count: displayCategory.expertCount,
                })}
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white">
                {t("pages.categoryDetail.services", {
                  count: displayCategory.serviceCount,
                })}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Açıklama Bölümü */}
      {displayCategory.longDescription && (
        <section className="py-16 bg-muted/30 dark:bg-gray-800/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg text-foreground dark:text-gray-300 leading-relaxed"
              >
                {displayCategory.longDescription}
              </motion.p>
            </div>
          </div>
        </section>
      )}

      {/* Özellikler Bölümü */}
      {displayCategory.features && (
        <section className="py-16 bg-background dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16 text-foreground dark:text-white"
            >
              {t("pages.categoryDetail.features.title")}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayCategory.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-border dark:border-gray-700"
                >
                  <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hizmetler Bölümü */}
      <section className="py-16 bg-muted/30 dark:bg-gray-800/20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16 text-foreground dark:text-white"
          >
            {t("pages.categoryDetail.services")}
          </motion.h2>

          {categoryServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleServiceClick(service.id)}
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 border border-border dark:border-gray-700"
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={t(
                        getTranslationKeyFromTurkishName(
                          service.name,
                          "service"
                        )
                      )}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-white">
                      {t(
                        getTranslationKeyFromTurkishName(
                          service.name,
                          "service"
                        )
                      )}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-300 mb-4">
                      {service.shortDescription}
                    </p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground dark:text-gray-400">
                      <span>
                        {service.startingPrice
                          ? t("pages.serviceDetail.price", {
                              price: service.startingPrice,
                            })
                          : t("pages.serviceDetail.price", {
                              price: service.price,
                            })}
                      </span>
                      <span className="inline-flex items-center">
                        {t("home.categories.viewDetails")}
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground dark:text-gray-400">
              {t("pages.categoryDetail.noServices")}
            </div>
          )}
        </div>
      </section>

      {/* Müşteri Yorumları Bölümü */}
      {displayCategory.testimonials && (
        <section className="py-16 bg-background dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16 text-foreground dark:text-white"
            >
              {t("pages.serviceDetail.testimonials.title")}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {displayCategory.testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-border dark:border-gray-700"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        testimonial.avatar ||
                        "/images/testimonials/default-avatar.jpg"
                      }
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground dark:text-gray-300 italic">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sıkça Sorulan Sorular */}
      {displayCategory.faqs && (
        <section className="py-16 bg-muted/30 dark:bg-gray-800/20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16 text-foreground dark:text-white"
            >
              {t("pages.serviceDetail.faqs.title")}
            </motion.h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {displayCategory.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-border dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Bölümü */}
      <section className="py-16 bg-primary/10 dark:bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 text-foreground dark:text-white"
          >
            {t("pages.categoryDetail.cta.title", {
              name: getTranslationKeyFromTurkishName(
                displayCategory.name,
                "category"
              )
                ? t(
                    getTranslationKeyFromTurkishName(
                      displayCategory.name,
                      "category"
                    )
                  )
                : displayCategory.name,
            })}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground dark:text-gray-300"
          >
            {t("pages.categoryDetail.cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-primary/50"
            >
              {t("pages.categoryDetail.cta.button")}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
