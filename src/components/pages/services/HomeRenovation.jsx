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
import { useTranslation } from "react-i18next";

const HomeRenovation = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const serviceKeys = ["interior", "exterior", "structural"];
  const processStepKeys = [
    "discovery",
    "design",
    "implementation",
    "qualityControl",
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
              alt={t(
                "pages.homeRenovation.hero.alt",
                "Home Renovation Hero Image"
              )}
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
                {t("pages.homeRenovation.title", "Ev Renovasyonu")}
              </Typography>
              <Typography variant="h6">
                {t(
                  "pages.homeRenovation.subtitle",
                  "Yaşam alanlarınızı yeniliyor, hayalinizdeki eve dönüştürüyoruz"
                )}
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
            {t(
              "pages.homeRenovation.description",
              "Profesyonel ekibimiz ve kaliteli malzemelerimizle evinize değer katıyoruz. İç mekan renovasyonundan dış cephe çalışmalarına, yapısal iyileştirmelerden dekoratif dokunuşlara kadar eviniz için tüm ihtiyaçlarınızı karşılıyoruz."
            )}
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {serviceKeys.map((key, index) => (
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
                      image={t(
                        `pages.homeRenovation.services.${key}.image`,
                        "/images/services/default.jpg"
                      )}
                      alt={t(`pages.homeRenovation.services.${key}.title`)}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {t(`pages.homeRenovation.services.${key}.title`)}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {t(`pages.homeRenovation.services.${key}.description`)}
                      </Typography>
                      <Box>
                        {[1, 2, 3, 4].map((featureIndex) => (
                          <Box
                            key={featureIndex}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ mr: 1, color: "primary.main" }}
                            />
                            <Typography variant="body2">
                              {t(
                                `pages.homeRenovation.services.${key}.features.${featureIndex}`
                              )}
                            </Typography>
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
              {t("pages.homeRenovation.process.title", "Çalışma Sürecimiz")}
            </Typography>
            <Grid container spacing={4}>
              {processStepKeys.map((key, index) => (
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
                          {t(`pages.homeRenovation.process.${key}.title`)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {t(`pages.homeRenovation.process.${key}.description`)}
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
                "url(https://images.unsplash.com/photo-1586023492-581f618f69a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
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
                {t(
                  "pages.homeRenovation.cta.title",
                  "Ücretsiz Keşif İçin Bize Ulaşın"
                )}
              </Typography>
              <Typography variant="body1" paragraph>
                {t(
                  "pages.homeRenovation.cta.description",
                  "Uzman ekibimiz projenizi değerlendirip size özel çözümler sunmak için hazır."
                )}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/contact"
                sx={{ mt: 2 }}
              >
                {t("pages.homeRenovation.cta.button", "İletişime Geç")}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomeRenovation;
