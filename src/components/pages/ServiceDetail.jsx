import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import api from "../../utils/api"; // API utility import edildi
import { toast } from "react-toastify"; // Hata mesajları için
import {
  HomeIcon,
  HomeModernIcon,
  WrenchIcon,
  ChevronRightIcon,
  CheckIcon,
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
  ClockIcon,
} from "@heroicons/react/24/outline";
import { serviceService } from "../../services/serviceService";
import { categoryService } from "../../services/categoryService";
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

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [category, setCategory] = useState(null);
  const [similarServices, setSimilarServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Hata state'i eklendi
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      setError(null);
      setService(null);
      setCategory(null);
      setSimilarServices([]);

      const serviceId = parseInt(id);

      if (isNaN(serviceId)) {
        setError(t("errors.invalidServiceId"));
        setLoading(false);
        return;
      }

      try {
        // 1. Servis detayını çek
        const serviceData = await serviceService.getServiceById(serviceId);

        if (!serviceData) {
          throw new Error("Service not found in API response");
        }

        // Serviste slug yoksa oluştur
        if (!serviceData.slug) {
          setService({
            ...serviceData,
            slug: slugify(serviceData.name),
          });
        } else {
          setService(serviceData);
        }

        // 2. Kategori ve Benzer Servisleri Çek
        if (serviceData.categoryId) {
          try {
            // Paralel olarak kategori ve benzer servisleri çek
            const [categoryData, similarServicesData] = await Promise.all([
              categoryService.getCategoryById(serviceData.categoryId),
              serviceService.getSimilarServices(
                serviceId,
                serviceData.categoryId,
                4
              ),
            ]);

            // Kategori verisini işle (eğer çekildiyse)
            if (categoryData) {
              if (!categoryData.slug) {
                setCategory({
                  ...categoryData,
                  slug: slugify(categoryData.name),
                });
              } else {
                setCategory(categoryData);
              }
            } else if (serviceData.category) {
              // Servis verisi içinde kategori bilgisi varsa onu kullan
              const category = serviceData.category;
              if (!category.slug) {
                setCategory({
                  ...category,
                  slug: slugify(category.name),
                });
              } else {
                setCategory(category);
              }
            }

            // Benzer servis verisini işle
            if (similarServicesData && Array.isArray(similarServicesData)) {
              setSimilarServices(addSlugsToItems(similarServicesData));
            } else {
              console.warn(
                "Similar services data not in expected format:",
                similarServicesData
              );
              setSimilarServices([]);
            }
          } catch (relatedDataError) {
            console.error(
              "Error fetching related category/services:",
              relatedDataError
            );
            // İkincil veriler alınamazsa bile ana servis gösterilebilir.
            // İsteğe bağlı olarak burada da toast mesajı gösterilebilir.
          }
        }
      } catch (err) {
        console.error("Error fetching service data:", err);
        if (err.response && err.response.status === 404) {
          setError(t("pages.serviceDetail.notFound.title"));
          toast.error(t("pages.serviceDetail.notFound.title"));
        } else {
          setError(t("errors.fetchDataError"));
          toast.error(t("errors.fetchDataError"));
        }
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, t]);

  const handleSimilarServiceClick = (serviceId) => {
    navigate(`/servis/${serviceId}`);
    // Sayfa yeniden yüklenecek ve useEffect tetiklenecek
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {error
            ? t("errors.errorTitle")
            : t("pages.serviceDetail.notFound.title")}
        </h1>
        <p className="mb-8">
          {error || t("pages.serviceDetail.notFound.description")}
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

  // Detaylı veri state'i kaldırıldığı için displayService yerine doğrudan service kullanılır
  const displayService = service;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80">
          <img
            src={
              displayService.backgroundImage ||
              "/images/backgrounds/default-bg.jpg"
            }
            alt={t(`services.${slugToTranslationKey(displayService.slug)}`)}
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            {category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <Link
                  to={`/kategori/${category.id}`}
                  className="inline-flex items-center text-gray-300 hover:text-white text-sm font-medium"
                >
                  {t(`categories.${slugToTranslationKey(category.slug)}`)}
                  <ChevronRightIcon className="w-4 h-4 mx-1" />{" "}
                  {t(`services.${slugToTranslationKey(displayService.slug)}`)}
                </Link>
              </motion.div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {t(`services.${slugToTranslationKey(displayService.slug)}`)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
            >
              {t("pages.serviceDetail.description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center items-center gap-4"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white">
                {t("pages.serviceDetail.price", {
                  price: displayService.price,
                })}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white">
                {t("pages.serviceDetail.duration", {
                  duration: displayService.duration,
                })}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={() => navigate("/request-service")}
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                {t("pages.serviceDetail.requestService")}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Açıklama ve Hizmet Detayları */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sol Sütun - Ana İçerik */}
            <div className="flex-1">
              {/* Tab Navigasyonu */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-1 border-b-2 font-medium text-md ${
                      activeTab === "overview"
                        ? "border-primary text-primary dark:border-primary-foreground dark:text-primary-foreground"
                        : "border-transparent text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                    }`}
                  >
                    {t("pages.serviceDetail.tabs.overview")}
                  </button>
                  {displayService.packages && (
                    <button
                      onClick={() => setActiveTab("packages")}
                      className={`py-4 px-1 border-b-2 font-medium text-md ${
                        activeTab === "packages"
                          ? "border-primary text-primary dark:border-primary-foreground dark:text-primary-foreground"
                          : "border-transparent text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                      }`}
                    >
                      {t("pages.serviceDetail.tabs.packages")}
                    </button>
                  )}
                  {displayService.process && (
                    <button
                      onClick={() => setActiveTab("process")}
                      className={`py-4 px-1 border-b-2 font-medium text-md ${
                        activeTab === "process"
                          ? "border-primary text-primary dark:border-primary-foreground dark:text-primary-foreground"
                          : "border-transparent text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                      }`}
                    >
                      {t("pages.serviceDetail.tabs.process")}
                    </button>
                  )}
                  {displayService.faqs && (
                    <button
                      onClick={() => setActiveTab("faqs")}
                      className={`py-4 px-1 border-b-2 font-medium text-md ${
                        activeTab === "faqs"
                          ? "border-primary text-primary dark:border-primary-foreground dark:text-primary-foreground"
                          : "border-transparent text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
                      }`}
                    >
                      {t("pages.serviceDetail.tabs.faqs")}
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab İçerikleri */}
              <div className="py-6">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-white">
                      {t("pages.serviceDetail.overview.title")}
                    </h2>
                    <div className="space-y-4 text-foreground dark:text-gray-300">
                      <h3 className="text-xl font-semibold text-foreground dark:text-white mb-4">
                        {t("pages.serviceDetail.included.title")}
                      </h3>
                      <ul className="list-none space-y-3">
                        {displayService.includedItems?.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {displayService.features && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
                          {t("pages.serviceDetail.overview.features")}
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {displayService.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-3 text-muted-foreground dark:text-gray-300"
                            >
                              <CheckIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "overview" && displayService.longDescription && (
                  <div className="prose prose-lg dark:prose-invert max-w-none text-foreground dark:text-gray-300">
                    <h3 className="text-xl font-semibold text-foreground dark:text-white mb-4">
                      {t("pages.serviceDetail.descriptionTitle")}
                    </h3>
                    <p>{displayService.longDescription}</p>
                  </div>
                )}

                {activeTab === "packages" && displayService.packages && (
                  <div className="space-y-6">
                    {displayService.packages.map((pkg, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border dark:border-gray-700"
                      >
                        <h4 className="text-lg font-semibold mb-2 text-foreground dark:text-white">
                          {pkg.name}
                        </h4>
                        <p className="text-muted-foreground dark:text-gray-400 mb-4">
                          {pkg.description}
                        </p>
                        <p className="text-2xl font-bold text-primary mb-4">
                          {t("pages.serviceDetail.price", { price: pkg.price })}
                        </p>
                        <ul className="list-none space-y-2 text-foreground dark:text-gray-300 mb-4">
                          {pkg.features?.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-center">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                          {t("pages.serviceDetail.selectPackage")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "process" && displayService.process && (
                  <div>
                    <h2 className="text-2xl font-bold mb-8 text-foreground dark:text-white">
                      {t("pages.serviceDetail.process.title")}
                    </h2>
                    <div className="space-y-8">
                      {displayService.process.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground dark:text-gray-300">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "faqs" && displayService.faqs && (
                  <div>
                    <h2 className="text-2xl font-bold mb-8 text-foreground dark:text-white">
                      {t("pages.serviceDetail.faqs.title")}
                    </h2>
                    <div className="space-y-6">
                      {displayService.faqs.map((faq, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">
                            {faq.question}
                          </h3>
                          <p className="text-muted-foreground dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Sütun - Servis Bilgileri ve Benzer Hizmetler */}
            <div className="lg:w-1/3 space-y-8">
              {/* Servis Özeti Kartı */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border dark:border-gray-700">
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-4">
                  {t("pages.serviceDetail.summary.title")}
                </h3>
                <div className="space-y-3 text-muted-foreground dark:text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {t("pages.serviceDetail.summary.price")}
                    </span>
                    <span className="text-foreground dark:text-white font-semibold">
                      {t("pages.serviceDetail.price", {
                        price: displayService.price,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {t("pages.serviceDetail.summary.duration")}
                    </span>
                    <span className="inline-flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {t("pages.serviceDetail.duration", {
                        duration: displayService.duration,
                      })}
                    </span>
                  </div>
                  {category && (
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {t("pages.serviceDetail.summary.category")}
                      </span>
                      <Link
                        to={`/kategori/${category.id}`}
                        className="text-primary hover:underline"
                      >
                        {t(
                          getTranslationKeyFromTurkishName(
                            category.name,
                            "category"
                          )
                        )}
                      </Link>
                    </div>
                  )}
                </div>
                <button className="mt-6 w-full px-4 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
                  {t("pages.serviceDetail.requestService")}
                </button>
              </div>

              {/* Benzer Hizmetler Kartı */}
              {similarServices.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-4">
                    {t("pages.serviceDetail.similarServices.title")}
                  </h3>
                  <div className="space-y-4">
                    {similarServices.map((similarService) => (
                      <div
                        key={similarService.id}
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() =>
                          handleSimilarServiceClick(similarService.id)
                        }
                      >
                        {similarService.icon && (
                          <div className="flex-shrink-0 w-12 h-12 bg-muted/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center text-primary">
                            {getIcon(similarService.icon)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-foreground dark:text-white group-hover:text-primary transition-colors">
                            {t(
                              `services.${slugToTranslationKey(
                                similarService.slug
                              )}`
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            {t("pages.serviceDetail.price", {
                              price: similarService.price,
                            })}
                          </p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-muted-foreground dark:text-gray-500 ml-auto group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları Bölümü */}
      {displayService.testimonials && (
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
            {/* Müşteri yorumları için gerekli kod buraya eklenecek */}
          </div>
        </section>
      )}

      {/* Sıkça Sorulan Sorular */}
      {displayService.faqs && (
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
            {/* Sıkça sorulan sorular için gerekli kod buraya eklenecek */}
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetail;
