import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import adService from "../../services/adService";
import api from "../../utils/api";
import AdRequestButton from "./AdRequestButton";
import {
  UserIcon,
  TagIcon,
  CheckBadgeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [expert, setExpert] = useState(null);
  const [relatedAds, setRelatedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  // Kullanıcı bilgilerini localStorage'dan al
  const isAuthenticated = localStorage.getItem("accessToken") ? true : false;
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
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

  // --- Helper function for image error handling ---
  const handleImageError = (e, placeholder = adService.DEFAULT_AD_IMAGE) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = placeholder;
  };

  useEffect(() => {
    const fetchAdDetail = async () => {
      try {
        setLoading(true);
        // Fetch ad details
        const adData = await adService.getAdById(id);

        // Fetch images
        const images = await adService.getAdImages(id);

        // Set ad data with images
        setAd({
          ...adData,
          images:
            images && images.length > 0
              ? images
              : [{ url: adService.DEFAULT_AD_IMAGE }],
        });

        // Fetch expert information
        if (adData.userId) {
          try {
            const expertResponse = await api.get(
              `/api/v1/users/${adData.userId}`
            );
            setExpert(expertResponse.data);
          } catch (error) {
            console.error("Failed to fetch expert details:", error);
          }
        }

        // Fetch related ads (mock - in a real app this would fetch based on category)
        try {
          const relatedResponse = await api.get("/api/v1/ads");
          const relatedAdsData = relatedResponse.data
            .filter(
              (relatedAd) =>
                relatedAd.categoryId === adData.categoryId &&
                relatedAd.id !== adData.id
            )
            .slice(0, 3);

          // Fetch images for related ads
          const relatedWithImages = await Promise.all(
            relatedAdsData.map(async (relAd) => {
              try {
                const images = await adService.getAdImages(relAd.id);
                return {
                  ...relAd,
                  images:
                    images && images.length > 0
                      ? images
                      : [{ url: adService.DEFAULT_AD_IMAGE }],
                };
              } catch (error) {
                return {
                  ...relAd,
                  images: [{ url: adService.DEFAULT_AD_IMAGE }],
                };
              }
            })
          );

          setRelatedAds(relatedWithImages);
        } catch (error) {
          console.error("Failed to fetch related ads:", error);
        }

        // Mock reviews data - in a real app this would be fetched from an API
        const mockReviews = [
          {
            id: 1,
            userId: "user1",
            userName: "Ahmet Yılmaz",
            rating: 5,
            comment:
              "Mükemmel bir hizmet! Çok profesyonel bir yaklaşım ve zamanında teslimat.",
            date: "2023-06-15T10:30:00",
            userImage: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            id: 2,
            userId: "user2",
            userName: "Ayşe Kaya",
            rating: 4,
            comment:
              "Kaliteli iş, ancak biraz daha detaylı açıklama yapabilirdi. Yine de memnun kaldım.",
            date: "2023-05-28T14:15:00",
            userImage: "https://randomuser.me/api/portraits/women/44.jpg",
          },
          {
            id: 3,
            userId: "user3",
            userName: "Test User",
            rating: 3,
            comment: "Okay.",
            date: "2023-07-01T09:00:00",
            userImage: "invalid-url",
          }, // Test case
        ];
        setReviews(
          mockReviews.map((r) => ({
            ...r,
            userImage: r.userImage || "/images/placeholder-user.png",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch ad details:", error);
        setError(
          "İlan detayları yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetail();
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? ad.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === ad.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  if (loading) {
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
            <h3 className="text-lg font-semibold">Hata</h3>
          </div>
          <p>{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Geri Dön
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-6 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <XCircleIcon className="w-6 h-6" />
            <h3 className="text-lg font-semibold">İlan Bulunamadı</h3>
          </div>
          <p>Aradığınız ilan bulunamadı veya kaldırılmış olabilir.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Geri Dön
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-16 sm:pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-10"
        >
          {/* Back button and breadcrumb */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 dark:bg-gray-800/80 shadow-sm hover:bg-background dark:hover:bg-gray-700 text-primary dark:text-primary-foreground hover:text-primary/80 dark:hover:text-primary-foreground/80 transition-all"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="font-medium">İlanlara Geri Dön</span>
            </motion.button>
          </motion.div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Ad details */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-8"
            >
              {/* Ad image gallery */}
              <div className="relative bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-border/50 dark:border-gray-700/50">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={
                        ad.images[currentImageIndex]?.url ||
                        adService.DEFAULT_AD_IMAGE
                      }
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onError={handleImageError}
                    />
                  </AnimatePresence>

                  {ad.images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-foreground dark:text-white shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all"
                      >
                        <ChevronLeftIcon className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-foreground dark:text-white shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all"
                      >
                        <ChevronRightIcon className="w-6 h-6" />
                      </motion.button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {ad.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                              currentImageIndex === index
                                ? "bg-primary dark:bg-primary-foreground"
                                : "bg-white/50 dark:bg-gray-800/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {ad.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {ad.images.map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? "border-primary dark:border-primary-foreground"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image?.url || adService.DEFAULT_AD_IMAGE}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                        {currentImageIndex === index && (
                          <div className="absolute inset-0 bg-primary/10 dark:bg-primary-foreground/10" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ad title and details */}
              <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-border/50 dark:border-gray-700/50">
                <h1 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
                  {ad.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                    <TagIcon className="w-4 h-4 mr-1" />
                    {ad.categoryName}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                    <CheckBadgeIcon className="w-4 h-4 mr-1" />
                    {ad.serviceName}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100/80 dark:bg-gray-700/80 text-muted-foreground dark:text-gray-300">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(ad.createdAt || ad.createdDate)}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <h2 className="text-xl font-semibold text-foreground dark:text-white">
                    Açıklama
                  </h2>
                  <p className="text-muted-foreground dark:text-gray-300 whitespace-pre-line">
                    {ad.descriptions}
                  </p>
                </div>

                {/* Additional Information */}
                {(ad.price || ad.duration || ad.location) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-background/50 dark:bg-gray-700/30 rounded-xl">
                    {ad.price && (
                      <div className="flex items-center">
                        <BanknotesIcon className="w-5 h-5 mr-2 text-primary dark:text-primary-foreground" />
                        <span className="text-foreground dark:text-white">
                          <strong>Ücret:</strong> {ad.price} TL
                        </span>
                      </div>
                    )}
                    {ad.duration && (
                      <div className="flex items-center">
                        <ClockIcon className="w-5 h-5 mr-2 text-primary dark:text-primary-foreground" />
                        <span className="text-foreground dark:text-white">
                          <strong>Süre:</strong> {ad.duration}
                        </span>
                      </div>
                    )}
                    {ad.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-2 text-primary dark:text-primary-foreground" />
                        <span className="text-foreground dark:text-white">
                          <strong>Konum:</strong> {ad.location}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action button */}
                {isAuthenticated ? (
                  isExpert ? (
                    <AdRequestButton
                      adId={ad.id}
                      expertId={userId}
                      className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    />
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm flex items-center justify-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Not: Sadece uzman hesapları ilanlara başvuru yapabilir.
                      </p>
                    </div>
                  )
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/login")}
                    className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <LockClosedIcon className="w-5 h-5" />
                    Başvurmak İçin Giriş Yap
                  </motion.button>
                )}
              </div>

              {/* Reviews section */}
              <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-border/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-semibold mb-6 text-foreground dark:text-white flex items-center gap-2">
                  <StarIcon className="w-6 h-6 text-primary dark:text-primary-foreground" />
                  Değerlendirmeler ({reviews.length})
                </h2>

                {/* Review list */}
                {reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-muted/30 dark:bg-gray-700/30 rounded-xl">
                    <StarIcon className="w-12 h-12 text-primary/40 dark:text-primary-foreground/40 mb-3" />
                    <p className="text-muted-foreground dark:text-gray-400 text-center">
                      Henüz değerlendirme yapılmamış.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border/50 dark:border-gray-700/50 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              review.userImage || "/images/placeholder-user.png"
                            }
                            alt={review.userName}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) =>
                              handleImageError(
                                e,
                                "/images/placeholder-user.png"
                              )
                            }
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-foreground dark:text-white">
                                  {review.userName}
                                </h4>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>{formatDate(review.date)}</span>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-foreground dark:text-gray-300">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Login to review prompt */}
                {!isAuthenticated && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-blue-700 dark:text-blue-300 mb-3">
                      Değerlendirme yapmak için giriş yapmalısınız
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/login")}
                      className="px-6 py-2 bg-primary text-white rounded-lg shadow-md flex items-center justify-center gap-2 mx-auto"
                    >
                      <LockClosedIcon className="w-4 h-4" />
                      Giriş Yap
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right side - Expert info and related ads */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Expert info card */}
              <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-border/50 dark:border-gray-700/50">
                <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
                  İlan Sahibi
                </h2>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={expert?.profileImage || "/images/placeholder-user.png"}
                    alt={expert?.name || ad.expertName || "İlan Sahibi"}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) =>
                      handleImageError(e, "/images/placeholder-user.png")
                    }
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-foreground dark:text-white">
                      {expert?.name || ad.expertName || "İsim Bilgisi Yok"}{" "}
                      {expert?.surname || ""}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400">
                      {expert?.jobTitleName || ad.company || "Expert"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {(expert?.phoneNumber || ad.phone) && (
                    <div className="flex items-center gap-3 text-foreground dark:text-gray-300">
                      <div className="w-10 h-10 rounded-full bg-background/80 dark:bg-gray-700/80 flex items-center justify-center">
                        <PhoneIcon className="w-5 h-5 text-primary dark:text-primary-foreground" />
                      </div>
                      <span>{expert?.phoneNumber || ad.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-foreground dark:text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-background/80 dark:bg-gray-700/80 flex items-center justify-center">
                      <EnvelopeIcon className="w-5 h-5 text-primary dark:text-primary-foreground" />
                    </div>
                    <span>
                      {expert?.email || ad.email || "E-posta bilgisi yok"}
                    </span>
                  </div>

                  {(expert?.address || ad.location) && (
                    <div className="flex items-center gap-3 text-foreground dark:text-gray-300">
                      <div className="w-10 h-10 rounded-full bg-background/80 dark:bg-gray-700/80 flex items-center justify-center">
                        <MapPinIcon className="w-5 h-5 text-primary dark:text-primary-foreground" />
                      </div>
                      <span>{expert?.address || ad.location}</span>
                    </div>
                  )}
                </div>

                {isAuthenticated && isExpert && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {}} // This would open a chat with the expert
                    className="w-full py-3 bg-background dark:bg-gray-700 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary rounded-xl font-medium transition-all border border-border dark:border-gray-600 flex justify-center items-center gap-2"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    İletişime Geç
                  </motion.button>
                )}
              </div>

              {/* Related ads */}
              {relatedAds.length > 0 && (
                <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-border/50 dark:border-gray-700/50">
                  <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">
                    Benzer İlanlar
                  </h2>

                  <div className="space-y-4">
                    {relatedAds.map((relatedAd) => (
                      <motion.div
                        key={relatedAd.id}
                        whileHover={{ y: -4 }}
                        onClick={() => navigate(`/ads/${relatedAd.id}`)}
                        className="flex gap-3 cursor-pointer p-3 rounded-xl hover:bg-background/50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <img
                          src={
                            relatedAd.images && relatedAd.images.length > 0
                              ? relatedAd.images[0]?.url
                              : adService.DEFAULT_AD_IMAGE
                          }
                          alt={relatedAd.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          onError={handleImageError}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground dark:text-white line-clamp-2">
                            {relatedAd.title}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2 mt-1">
                            {relatedAd.descriptions}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdDetail;
