import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import servicesData from "../../data/services/services.json";
import categoriesData from "../../data/categories/categories.json";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [category, setCategory] = useState(null);
  const [detailedServiceData, setDetailedServiceData] = useState(null);
  const [similarServices, setSimilarServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Ana servis verisini al
    const serviceId = parseInt(id);
    const foundService = servicesData.find((serv) => serv.id === serviceId);

    if (foundService) {
      setService(foundService);

      // Bu servise ait kategoriyi bul
      const relatedCategory = categoriesData.find(
        (cat) => cat.id === foundService.categoryId
      );
      setCategory(relatedCategory);

      // Benzer servisleri bul (aynı kategorideki diğer servisler)
      const similar = servicesData
        .filter(
          (serv) =>
            serv.categoryId === foundService.categoryId && serv.id !== serviceId
        )
        .slice(0, 4); // En fazla 4 benzer servis göster
      setSimilarServices(similar);

      // Daha detaylı servis verisi için dosya yüklemeyi dene (varsa)
      try {
        // Servis slug'ı üzerinden detaylı veri dosyasını dinamik olarak import et
        import(`../../data/services/${foundService.slug}.json`)
          .then((module) => {
            setDetailedServiceData(module.default);
          })
          .catch(() => {
            // Detaylı veri dosyası bulunamadıysa sessizce devam et
            console.log("Detailed service data not found");
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error loading detailed service data:", error);
        setLoading(false);
      }
    } else {
      console.error("Service not found");
      setLoading(false);
    }
  }, [id]);

  const handleSimilarServiceClick = (serviceId) => {
    navigate(`/servis/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Hizmet Bulunamadı</h1>
        <p className="mb-8">Üzgünüz, aradığınız hizmet bulunamadı.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <HomeIcon className="w-5 h-5 mr-2" /> Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Detaylı veri varsa onu kullan, yoksa normal servis verisini kullan
  const displayService = detailedServiceData || service;

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
            alt={displayService.name}
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
                  {category.name} <ChevronRightIcon className="w-4 h-4 mx-1" />{" "}
                  {displayService.name}
                </Link>
              </motion.div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {displayService.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
            >
              {displayService.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center items-center mb-4"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white">
                {displayService.expertCount} Uzman
              </span>
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
                    Genel Bakış
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
                      Paketler
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
                      Süreç
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
                      SSS
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab İçerikleri */}
              <div className="tab-content">
                {/* Genel Bakış Tab İçeriği */}
                {activeTab === "overview" && (
                  <div>
                    {displayService.longDescription && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                      >
                        <h2 className="text-2xl font-semibold mb-4 text-foreground dark:text-white">
                          {displayService.name} Hakkında
                        </h2>
                        <p className="text-lg text-muted-foreground dark:text-gray-300 leading-relaxed">
                          {displayService.longDescription}
                        </p>
                      </motion.div>
                    )}

                    {/* Özellikler ve Faydalar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      {/* Özellikler */}
                      {displayService.features && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                        >
                          <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
                            Hizmet Özellikleri
                          </h3>
                          <ul className="space-y-3">
                            {displayService.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckIcon className="w-5 h-5 text-primary dark:text-primary-foreground mt-0.5 mr-3 flex-shrink-0" />
                                <span className="text-muted-foreground dark:text-gray-300">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Faydalar */}
                      {displayService.benefits && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                        >
                          <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
                            Hizmet Faydaları
                          </h3>
                          <ul className="space-y-3">
                            {displayService.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <CheckIcon className="w-5 h-5 text-primary dark:text-primary-foreground mt-0.5 mr-3 flex-shrink-0" />
                                <span className="text-muted-foreground dark:text-gray-300">
                                  {benefit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>

                    {/* Müşteri Yorumları */}
                    {displayService.testimonials && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                      >
                        <h2 className="text-2xl font-semibold mb-6 text-foreground dark:text-white">
                          Müşteri Yorumları
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {displayService.testimonials.map(
                            (testimonial, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                              >
                                <p className="text-muted-foreground dark:text-gray-300 italic mb-4">
                                  "{testimonial.content}"
                                </p>
                                <div className="flex items-center">
                                  <img
                                    src={
                                      testimonial.avatar ||
                                      "/images/testimonials/default-avatar.jpg"
                                    }
                                    alt={testimonial.author}
                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                  />
                                  <div>
                                    <h4 className="font-medium text-foreground dark:text-white">
                                      {testimonial.author}
                                    </h4>
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                                      {testimonial.role}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Paketler Tab İçeriği */}
                {activeTab === "packages" && displayService.packages && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-foreground dark:text-white">
                      Hizmet Paketleri
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {displayService.packages.map((pkg, index) => (
                        <div
                          key={pkg.id}
                          className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border ${
                            index === 1
                              ? "border-primary dark:border-primary-foreground ring-4 ring-primary/20"
                              : "border-border dark:border-gray-700"
                          }`}
                        >
                          <div
                            className={`p-6 ${
                              index === 1
                                ? "bg-primary/5 dark:bg-primary/10"
                                : ""
                            }`}
                          >
                            <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white">
                              {pkg.name}
                            </h3>
                            <p className="text-muted-foreground dark:text-gray-300 mb-4">
                              {pkg.description}
                            </p>
                            <div className="flex items-end mb-4">
                              <span className="text-3xl font-bold text-foreground dark:text-white">
                                {pkg.price} ₺
                              </span>
                              {pkg.duration && (
                                <span className="text-sm text-muted-foreground dark:text-gray-400 ml-2 pb-1">
                                  <ClockIcon className="w-4 h-4 inline mr-1" />
                                  {pkg.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-6 bg-gray-50 dark:bg-gray-800/80">
                            <h4 className="font-medium text-sm text-foreground dark:text-gray-300 mb-3">
                              Paket İçeriği:
                            </h4>
                            <ul className="space-y-2">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckIcon className="w-5 h-5 text-primary dark:text-primary-foreground mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground dark:text-gray-300">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <button
                              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium ${
                                index === 1
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-foreground dark:text-white"
                              } hover:bg-primary hover:text-white transition-colors`}
                            >
                              Paketi Seç
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Süreç Tab İçeriği */}
                {activeTab === "process" && displayService.process && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-foreground dark:text-white">
                      Hizmet Süreci
                    </h2>
                    <div className="relative">
                      <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-primary/20 dark:bg-primary/30"></div>
                      <div className="space-y-8">
                        {displayService.process.map((step, index) => (
                          <div key={index} className="flex">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-lg font-bold z-10">
                              {step.step}
                            </div>
                            <div className="ml-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                              <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
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
                  </motion.div>
                )}

                {/* SSS Tab İçeriği */}
                {activeTab === "faqs" && displayService.faqs && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-foreground dark:text-white">
                      Sıkça Sorulan Sorular
                    </h2>
                    <div className="space-y-4">
                      {displayService.faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                        >
                          <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-white">
                            {faq.question}
                          </h3>
                          <p className="text-muted-foreground dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sağ Sütun - Yan Panel */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24">
                {/* Hizmet Talebi Kartı */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
                >
                  <h3 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
                    Hizmet Talebi Oluştur
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300 mb-6">
                    Bu hizmet için talebinizi oluşturun, uzmanlarımız en kısa
                    sürede size ulaşsın.
                  </p>
                  <button className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Talep Oluştur
                  </button>
                </motion.div>

                {/* Benzer Hizmetler */}
                {similarServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-white">
                      Benzer Hizmetler
                    </h3>
                    <div className="space-y-4">
                      {similarServices.map((similarService) => (
                        <div
                          key={similarService.id}
                          onClick={() =>
                            handleSimilarServiceClick(similarService.id)
                          }
                          className="flex items-start cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-primary-foreground mr-3 flex-shrink-0">
                            {getIcon(similarService.icon)}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground dark:text-white mb-1">
                              {similarService.name}
                            </h4>
                            <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
                              {similarService.shortDescription}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="py-16 bg-primary/10 dark:bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 text-foreground dark:text-white"
          >
            {displayService.name} İhtiyacınız İçin Hemen Başlayın
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground dark:text-gray-300"
          >
            Profesyonel uzmanlarımız en kısa sürede size ulaşsın
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
              Hemen Başla
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
