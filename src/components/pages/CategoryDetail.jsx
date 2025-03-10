import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import categoriesData from "../../data/categories/categories.json";
import servicesData from "../../data/services/services.json";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [categoryServices, setCategoryServices] = useState([]);
  const [detailedCategoryData, setDetailedCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ana kategori verisini al
    const categoryId = parseInt(id);
    const foundCategory = categoriesData.find((cat) => cat.id === categoryId);

    if (foundCategory) {
      setCategory(foundCategory);

      // Bu kategorideki hizmetleri bul
      const services = servicesData.filter(
        (service) => service.categoryId === categoryId
      );
      setCategoryServices(services);

      // Daha detaylı kategori verisi için dosya yüklemeyi dene (varsa)
      try {
        // Kategori slug'ı üzerinden detaylı veri dosyasını dinamik olarak import et
        import(`../../data/categories/${foundCategory.slug}.json`)
          .then((module) => {
            setDetailedCategoryData(module.default);
          })
          .catch(() => {
            // Detaylı veri dosyası bulunamadıysa sessizce devam et
            console.log("Detailed category data not found");
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error loading detailed category data:", error);
        setLoading(false);
      }
    } else {
      console.error("Category not found");
      setLoading(false);
    }
  }, [id]);

  const handleServiceClick = (serviceId) => {
    navigate(`/servis/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Kategori Bulunamadı</h1>
        <p className="mb-8">Üzgünüz, aradığınız kategori bulunamadı.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <HomeIcon className="w-5 h-5 mr-2" /> Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Detaylı veri varsa onu kullan, yoksa normal kategori verisini kullan
  const displayCategory = detailedCategoryData || category;

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
            alt={displayCategory.name}
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
              {displayCategory.name}
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
                {displayCategory.expertCount} Uzman
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-white">
                {displayCategory.serviceCount} Hizmet
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
              Neden Bizi Tercih Etmelisiniz
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
            {displayCategory.name} Hizmetlerimiz
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleServiceClick(service.id)}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-border dark:border-gray-700"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image || `/images/services/default.jpg`}
                    alt={service.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground mr-4">
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground dark:text-gray-300 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground dark:text-gray-400">
                      {service.expertCount} Uzman
                    </span>
                    <span className="inline-flex items-center text-primary dark:text-primary-foreground text-sm font-medium">
                      Detayları Gör{" "}
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              Müşteri Yorumları
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
              Sıkça Sorulan Sorular
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
            {displayCategory.name} İhtiyacınız İçin Hemen Başlayın
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

export default CategoryDetail;
