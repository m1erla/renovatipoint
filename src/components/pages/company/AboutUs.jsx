import React from "react";
import { motion } from "framer-motion";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HandymanIcon from "@mui/icons-material/Handyman";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Ahmet Yılmaz",
      role: "Kurucu & CEO",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Ayşe Demir",
      role: "Baş Mimar",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Mehmet Kaya",
      role: "Proje Müdürü",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
  ];

  const features = [
    {
      icon: <EngineeringIcon className="w-8 h-8" />,
      title: "Uzman Ekip",
      description:
        "Deneyimli ve profesyonel ekibimizle en kaliteli hizmeti sunuyoruz.",
    },
    {
      icon: <HandymanIcon className="w-8 h-8" />,
      title: "Kaliteli İşçilik",
      description: "Her projede en yüksek kalite standartlarını uyguluyoruz.",
    },
    {
      icon: <EmojiObjectsIcon className="w-8 h-8" />,
      title: "Yenilikçi Çözümler",
      description:
        "Modern teknoloji ve yenilikçi yaklaşımlarla projelerinizi hayata geçiriyoruz.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Hakkımızda
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Built Better olarak, ev ve bahçe projelerinizi hayata geçirirken
              size en iyi hizmeti sunmayı hedefliyoruz. Uzman ekibimiz ve
              kaliteli hizmet anlayışımızla hayallerinizi gerçeğe
              dönüştürüyoruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Ekibimiz
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-semibold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-300 mb-4">{member.role}</p>
                    <div className="flex space-x-4">
                      <a
                        href={member.social.linkedin}
                        className="text-white hover:text-primary transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a
                        href={member.social.twitter}
                        className="text-white hover:text-primary transition-colors"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Tamamlanan Proje</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Uzman Ekip</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-white/80">Yıllık Deneyim</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80">Mutlu Müşteri</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Projenizi Birlikte Gerçekleştirelim
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Hayalinizdeki projeyi gerçeğe dönüştürmek için bizimle iletişime
              geçin.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              İletişime Geç
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
