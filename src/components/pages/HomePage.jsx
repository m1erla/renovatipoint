import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HomeIcon,
  HomeModernIcon,
  WrenchIcon,
  ChevronLeftIcon,
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
  CheckCircleIcon,
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
  return iconComponents[iconName] || <HomeIcon className="w-10 h-10" />;
};

// Yaygın kullanılan servislerden öne çıkan 3 tanesini seçelim
const featuredServices = [
  servicesData.find((service) => service.id === 6), // Mutfak Yenileme
  servicesData.find((service) => service.id === 8), // Peyzaj Tasarımı
  servicesData.find((service) => service.id === 22), // Klima Montajı
];

// Öne çıkan hizmetler için Unsplash görselleri
const getServiceImage = (serviceId) => {
  const images = {
    6: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Mutfak Yenileme
    8: "https://images.unsplash.com/photo-1558293842-c0fd3db86157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80", // Peyzaj Tasarımı
    22: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Klima Montajı
  };

  return (
    images[serviceId] ||
    "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80"
  );
};

function HomePage() {
  const [categories, setCategories] = useState(categoriesData);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 640;
  const itemsPerPage = isMobile ? 1 : 3;

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/kategori/${categoryId}`);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/servis/${serviceId}`);
  };

  // Kategoriler için Unsplash görselleri
  const getCategoryImage = (categoryId) => {
    const images = {
      1: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Ev Temizliği
      2: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Boya & Badana
      3: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Tadilat & Yenileme
      4: "https://images.unsplash.com/photo-1558293842-c0fd3db86157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80", // Bahçe Düzenleme
      5: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80", // Elektrik Tesisatı
      6: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Su Tesisatı
      7: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80", // Beyaz Eşya Tamiri
      8: "https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Güvenlik Sistemleri
      9: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Mobilya Montaj/Tamir
      10: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", // Nakliyat
      11: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80", // Isıtma & Soğutma
      12: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80", // Elektronik Cihaz Tamiri
    };

    return (
      images[categoryId] ||
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70">
          <img
            src="/images/renovation-hero.jpg"
            alt="Hero"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10 text-white"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Hayalinizdeki Mekanı Birlikte İnşa Edelim
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-200">
            Renovatipoint, uzman ekibiyle ev ve bahçe projelerinizi hayata
            geçiriyor.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-primary/50"
            >
              Hemen Başla
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-foreground dark:text-white"
          >
            Kategoriler
          </motion.h2>

          <div className="relative">
            {categories.length > itemsPerPage && (
              <>
                <button
                  onClick={handlePrevPage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background dark:bg-gray-700 shadow-lg hover:bg-muted dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-foreground dark:text-gray-200" />
                </button>
                <button
                  onClick={handleNextPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background dark:bg-gray-700 shadow-lg hover:bg-muted dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <ChevronRightIcon className="w-6 h-6 text-foreground dark:text-gray-200" />
                </button>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
              {visibleCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border dark:border-gray-700"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getCategoryImage(category.id)}
                      alt={category.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-primary/80 text-white">
                        {getIcon(category.icon)}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground dark:text-gray-300 mb-4">
                      {category.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                        {category.expertCount} Uzman
                      </span>
                      <span className="text-sm text-muted-foreground dark:text-gray-400">
                        Detaylar için tıklayın
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-foreground dark:text-white"
          >
            Öne Çıkan Hizmetlerimiz
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border dark:border-gray-700 cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getServiceImage(service.id)}
                    alt={service.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-primary/80 text-white">
                      {getIcon(service.icon)}
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {service.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground dark:text-gray-300">
                    {service.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                      </svg>
                      {service.expertCount} Uzman
                    </span>
                    <Link
                      to={`/servis/${service.id}`}
                      className="inline-flex items-center text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Detaylı Bilgi
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-foreground dark:text-white">
                Neden Renovatipoint?
              </h2>
              <p className="text-lg mb-6 text-muted-foreground dark:text-gray-300">
                Deneyimli uzmanlarımız, kaliteli malzemelerimiz ve müşteri
                memnuniyeti odaklı yaklaşımımızla, projelerinizi en iyi şekilde
                hayata geçiriyoruz.
              </p>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-primary mr-2" />
                    <span className="font-semibold">Uzman Ekip</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Deneyimli ve sertifikalı profesyoneller
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-primary mr-2" />
                    <span className="font-semibold">Kaliteli Malzeme</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    A-kalite ürünler ve garantili işçilik
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-primary mr-2" />
                    <span className="font-semibold">Müşteri Memnuniyeti</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    %100 müşteri memnuniyeti garantisi
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-primary mr-2" />
                    <span className="font-semibold">Uygun Fiyat</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Rekabetçi fiyatlar ve şeffaf teklifler
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/expert-register"
                  className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary dark:border-primary-foreground dark:text-primary-foreground rounded-lg font-semibold hover:bg-primary hover:text-white dark:hover:bg-primary-foreground dark:hover:text-primary transition-all duration-300"
                >
                  Uzman Olarak Katıl
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Profesyonel ekip çalışması"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    Başarı İstatistiklerimiz
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg">
                      <div className="text-4xl font-bold text-primary dark:text-primary-foreground mb-1">
                        500+
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Tamamlanan Proje
                      </p>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg">
                      <div className="text-4xl font-bold text-primary dark:text-primary-foreground mb-1">
                        100+
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Uzman Profesyonel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
