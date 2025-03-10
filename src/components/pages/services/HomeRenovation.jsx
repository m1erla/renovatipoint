import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const HomeRenovation = () => {
  const theme = useTheme();

  const services = [
    {
      title: "İç Mekan Renovasyonu",
      description:
        "Evinizin iç mekanlarını modern ve fonksiyonel bir şekilde yeniliyoruz.",
      image:
        "https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Mutfak yenileme",
        "Banyo renovasyonu",
        "Zemin döşeme",
        "Duvar kaplama",
      ],
    },
    {
      title: "Dış Cephe Yenileme",
      description: "Binanızın dış görünümünü yenileyerek değerini artırıyoruz.",
      image:
        "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80",
      features: ["Cephe kaplama", "Yalıtım", "Boya işleri", "Çatı onarımı"],
    },
    {
      title: "Yapısal İyileştirmeler",
      description:
        "Binanızın yapısal sorunlarını çözüyor, güvenliğini artırıyoruz.",
      image:
        "https://images.unsplash.com/photo-1541855492-581f618f69a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Deprem güçlendirme",
        "Temel sağlamlaştırma",
        "Çatlak onarımı",
        "Nem yalıtımı",
      ],
    },
  ];

  const processSteps = [
    {
      title: "Keşif ve Planlama",
      description:
        "Uzman ekibimiz mekanınızı ziyaret ederek detaylı bir keşif yapar ve ihtiyaçlarınızı belirler.",
    },
    {
      title: "Tasarım ve Teklif",
      description:
        "İhtiyaçlarınıza özel tasarım ve bütçe planı hazırlanır, size detaylı bir teklif sunulur.",
    },
    {
      title: "Uygulama",
      description:
        "Profesyonel ekibimiz, belirlenen plan doğrultusunda renovasyon işlemlerini gerçekleştirir.",
    },
    {
      title: "Kalite Kontrol",
      description:
        "Tüm işlemler tamamlandıktan sonra detaylı bir kalite kontrol yapılır ve size teslim edilir.",
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              height: "400px",
              width: "100%",
              position: "relative",
              mb: 8,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: theme.shadows[10],
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1523413363574-c30aa70d4a30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Ev renovasyonu"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                p: 4,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1), transparent)",
                color: "white",
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                Ev Renovasyonu
              </Typography>
              <Typography variant="h6">
                Yaşam alanlarınızı yeniliyor, hayalinizdeki eve dönüştürüyoruz
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
          >
            Profesyonel ekibimiz ve kaliteli malzemelerimizle evinize değer
            katıyoruz. İç mekan renovasyonundan dış cephe çalışmalarına, yapısal
            iyileştirmelerden dekoratif dokunuşlara kadar eviniz için tüm
            ihtiyaçlarınızı karşılıyoruz.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease-in-out",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={service.image}
                      alt={service.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {service.description}
                      </Typography>
                      <Box>
                        {service.features.map((feature, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ mr: 1, color: "primary.main" }}
                            />
                            <Typography variant="body2">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ mb: 6, fontWeight: 700 }}
            >
              Çalışma Sürecimiz
            </Typography>
            <Grid container spacing={4}>
              {processSteps.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        backgroundColor: theme.palette.background.paper,
                        "&:hover": {
                          transform: "translateY(-5px)",
                          transition: "transform 0.3s ease-in-out",
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h1"
                          sx={{
                            mb: 2,
                            color: theme.palette.primary.main,
                            opacity: 0.2,
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {step.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              p: 6,
              backgroundImage:
                "url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 2,
              position: "relative",
              mt: 8,
              mb: 4,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.7)",
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1, color: "white" }}>
              <Typography variant="h4" gutterBottom>
                Ücretsiz Keşif İçin Bize Ulaşın
              </Typography>
              <Typography variant="body1" paragraph>
                Uzman ekibimiz projenizi değerlendirip size özel çözümler sunmak
                için hazır.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/contact"
                sx={{ mt: 2 }}
              >
                İletişime Geç
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomeRenovation;
