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
import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessIcon from "@mui/icons-material/Business";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SchoolIcon from "@mui/icons-material/School";
import { useTranslation } from "react-i18next";

const SpecialProjects = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const serviceKeys = ["pool", "smartHome", "attic"];
  const expertiseKeys = [
    "projectManagement",
    "customDesign",
    "qualityControl",
    "sustainability",
  ];
  const completedProjectKeys = ["bodrumVilla", "istanbulPenthouse"];

  const services = [
    {
      title: "Özel Havuz Yapımı",
      description:
        "Lüks ve özelleştirilmiş havuz tasarımları ile yaşam alanınıza değer katıyoruz.",
      image:
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Özel boyutlu havuzlar",
        "Şelale ve su oyunları",
        "Şezlong alanları",
        "Özel aydınlatma sistemleri",
      ],
    },
    {
      title: "Akıllı Ev Sistemleri",
      description:
        "Evinizdeki tüm cihazları kontrol edebileceğiniz entegre akıllı ev sistemleri.",
      image:
        "https://images.unsplash.com/photo-1558002038-1055953ce55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Ses ve ışık kontrolü",
        "Güvenlik sistemleri",
        "İklimlendirme kontrolü",
        "Mobil uygulama ile kontrol",
      ],
    },
    {
      title: "Özel Çatı Katı Tasarımı",
      description:
        "Kullanılmayan çatı katlarını fonksiyonel yaşam alanlarına dönüştürüyoruz.",
      image:
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Çatı katı dönüşümü",
        "Özel tasarım mobilyalar",
        "Çatı pencereleri",
        "Çatı terası düzenlemesi",
      ],
    },
  ];

  const projects = [
    {
      title: "Otel Renovasyonu",
      description:
        "Otel ve konaklama tesislerinin modern ve lüks bir görünüme kavuşturulması.",
      image: "https://source.unsplash.com/random/800x600/?hotel-interior",
      icon: <ApartmentIcon />,
      features: [
        "Lobi ve resepsiyon tasarımı",
        "Oda renovasyonları",
        "Restoran ve bar alanları",
        "SPA ve wellness merkezleri",
      ],
    },
    {
      title: "Ofis Dönüşümü",
      description:
        "Modern çalışma alanları için yenilikçi ve ergonomik ofis tasarımları.",
      image: "https://source.unsplash.com/random/800x600/?modern-office",
      icon: <BusinessIcon />,
      features: [
        "Açık ofis tasarımı",
        "Toplantı odaları",
        "Dinlenme alanları",
        "Akustik çözümler",
      ],
    },
    {
      title: "Mağaza Konsepti",
      description: "Markanızı en iyi şekilde yansıtan özel mağaza tasarımları.",
      image: "https://source.unsplash.com/random/800x600/?retail-store",
      icon: <StorefrontIcon />,
      features: [
        "Vitrin tasarımı",
        "Ürün sergileme üniteleri",
        "Aydınlatma çözümleri",
        "Kasa ve deneme kabinleri",
      ],
    },
    {
      title: "Eğitim Kurumları",
      description:
        "Modern eğitim ortamları için fonksiyonel ve estetik tasarımlar.",
      image: "https://source.unsplash.com/random/800x600/?modern-school",
      icon: <SchoolIcon />,
      features: [
        "Sınıf tasarımları",
        "Laboratuvar ve atölyeler",
        "Spor salonları",
        "Ortak kullanım alanları",
      ],
    },
  ];

  const expertise = [
    {
      title: "Proje Yönetimi",
      description:
        "Deneyimli proje yöneticilerimizle süreçleri profesyonelce yönetiyoruz.",
    },
    {
      title: "Özel Tasarım",
      description:
        "Her projeye özel, benzersiz ve fonksiyonel tasarımlar geliştiriyoruz.",
    },
    {
      title: "Kalite Kontrol",
      description:
        "Uluslararası standartlarda kalite kontrol süreçleri uyguluyoruz.",
    },
    {
      title: "Sürdürülebilirlik",
      description:
        "Çevre dostu malzemeler ve enerji verimli çözümler sunuyoruz.",
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
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt={t(
                "pages.specialProjects.hero.alt",
                "Special Projects Hero Image"
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
                {t("pages.specialProjects.title", "Özel Projeler")}
              </Typography>
              <Typography variant="h6">
                {t(
                  "pages.specialProjects.subtitle",
                  "Hayalinizdeki özel mekânları profesyonel ekibimizle hayata geçiriyoruz"
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
              "pages.specialProjects.description",
              "Lüks konutlar, özel tasarım havuzlar, akıllı ev sistemleri ve benzersiz renovasyon projeleri için özel çözümler sunuyoruz. Hayalinizdeki yaşam alanını birlikte inşa edelim."
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
                      height="300"
                      image={t(
                        `pages.specialProjects.services.${key}.image`,
                        "/images/projects/default.jpg"
                      )}
                      alt={t(`pages.specialProjects.services.${key}.title`)}
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
                          }}
                        >
                          <CheckCircleIcon />
                        </Box>
                        <Typography variant="h5" component="h2">
                          {t(`pages.specialProjects.services.${key}.title`)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {t(`pages.specialProjects.services.${key}.description`)}
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
                              `pages.specialProjects.services.${key}.features.${featureIndex}`
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
                "pages.specialProjects.expertise.title",
                "Uzmanlık Alanlarımız"
              )}
            </Typography>
            <Grid container spacing={4}>
              {expertiseKeys.map((key, index) => (
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
                          {t(`pages.specialProjects.expertise.${key}.title`)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {t(
                            `pages.specialProjects.expertise.${key}.description`
                          )}
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
              p: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(
                "pages.specialProjects.cta1.title",
                "Projenizi Bizimle Paylaşın"
              )}
            </Typography>
            <Typography variant="body1" paragraph>
              {t(
                "pages.specialProjects.cta1.description",
                "Özel projeleriniz için profesyonel çözümler sunalım. Uzman ekibimiz sizinle görüşmek için hazır."
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/contact"
              sx={{ mt: 2 }}
            >
              {t("pages.specialProjects.cta1.button", "Proje Teklifi Al")}
            </Button>
          </Box>

          <Box sx={{ mt: 10, mb: 8 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ mb: 6, fontWeight: 700 }}
            >
              {t(
                "pages.specialProjects.completed.title",
                "Tamamlanmış Projeler"
              )}
            </Typography>
            <Grid container spacing={3}>
              {completedProjectKeys.map((key) => (
                <Grid item xs={12} md={6} key={key}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="350"
                        image={t(
                          `pages.specialProjects.completed.${key}.image`
                        )}
                        alt={t(`pages.specialProjects.completed.${key}.title`)}
                      />
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          {t(`pages.specialProjects.completed.${key}.title`)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t(
                            `pages.specialProjects.completed.${key}.description`
                          )}
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
                "url(https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
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
                  "pages.specialProjects.cta2.title",
                  "Ücretsiz Keşif İçin Bize Ulaşın"
                )}
              </Typography>
              <Typography variant="body1" paragraph>
                {t(
                  "pages.specialProjects.cta2.description",
                  "Özel projeniz için uzman ekibimiz yanınızda."
                )}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/contact"
                sx={{ mt: 2 }}
              >
                {t("pages.specialProjects.cta2.button", "İletişime Geç")}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SpecialProjects;
