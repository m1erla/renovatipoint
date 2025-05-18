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
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DeckIcon from "@mui/icons-material/Deck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";

const GardenDesign = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const serviceKeys = ["landscaping", "irrigation", "furniture"];
  const benefitKeys = [
    "sustainable",
    "allSeasons",
    "easyMaintenance",
    "valueIncrease",
  ];

  const serviceIcons = {
    landscaping: <LocalFloristIcon />,
    irrigation: <WaterDropIcon />,
    furniture: <CheckCircleIcon />,
  };

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
              src="https://images.unsplash.com/photo-1558293842-c0fd3db86157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt={t("pages.gardenDesign.hero.alt", "Garden Design Hero Image")}
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
                {t("pages.gardenDesign.title", "Bahçe Tasarımı")}
              </Typography>
              <Typography variant="h6">
                {t(
                  "pages.gardenDesign.subtitle",
                  "Doğanın güzelliğini evinize taşıyacak profesyonel peyzaj çözümleri"
                )}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ mb: 8, maxWidth: "900px", mx: "auto" }}
          >
            {t(
              "pages.gardenDesign.description",
              "Bahçenizi dört mevsim yaşanabilir bir yaşam alanına dönüştürmek için uzman peyzaj mimarlarımız ve deneyimli bahçıvanlarımızla özel çözümler sunuyoruz."
            )}
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {serviceKeys.map((key, index) => (
              <Grid item xs={12} md={4} key={key}>
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
                      height="240"
                      image={t(
                        `pages.gardenDesign.services.${key}.image`,
                        "/images/services/default-garden.jpg"
                      )}
                      alt={t(`pages.gardenDesign.services.${key}.title`)}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            mr: 2,
                            p: 1,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {serviceIcons[key]}
                        </Box>
                        <Typography variant="h5" component="h2">
                          {t(`pages.gardenDesign.services.${key}.title`)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {t(`pages.gardenDesign.services.${key}.description`)}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {[1, 2, 3, 4].map((featureIndex) => (
                          <Typography
                            key={featureIndex}
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            •{" "}
                            {t(
                              `pages.gardenDesign.services.${key}.features.${featureIndex}`
                            )}
                          </Typography>
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
              {t(
                "pages.gardenDesign.benefits.title",
                "Neden Bizi Seçmelisiniz?"
              )}
            </Typography>
            <Grid container spacing={4}>
              {benefitKeys.map((key, index) => (
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
                        <Typography variant="h6" gutterBottom>
                          {t(`pages.gardenDesign.benefits.${key}.title`)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {t(`pages.gardenDesign.benefits.${key}.description`)}
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
                "url(https://images.unsplash.com/photo-1620820186187-fc32e79adb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80)",
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
                  "pages.gardenDesign.cta.title",
                  "Bahçeniz İçin Ücretsiz Keşif"
                )}
              </Typography>
              <Typography variant="body1" paragraph>
                {t(
                  "pages.gardenDesign.cta.description",
                  "Bahçenizin potansiyelini keşfetmek için uzmanlarımız yanınızda."
                )}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/contact"
                sx={{ mt: 2 }}
              >
                {t("pages.gardenDesign.cta.button", "Randevu Al")}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default GardenDesign;
