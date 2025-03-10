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

const SpecialProjects = () => {
  const theme = useTheme();

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
              alt="Özel projeler"
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
                Özel Projeler
              </Typography>
              <Typography variant="h6">
                Hayalinizdeki özel mekânları profesyonel ekibimizle hayata
                geçiriyoruz
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
            Lüks konutlar, özel tasarım havuzlar, akıllı ev sistemleri ve
            benzersiz renovasyon projeleri için özel çözümler sunuyoruz.
            Hayalinizdeki yaşam alanını birlikte inşa edelim.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
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
                      image={service.image}
                      alt={service.title}
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
                          {service.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {service.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {service.features.map((feature, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            • {feature}
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
              Uzmanlık Alanlarımız
            </Typography>
            <Grid container spacing={4}>
              {expertise.map((item, index) => (
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
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.description}
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
              Projenizi Bizimle Paylaşın
            </Typography>
            <Typography variant="body1" paragraph>
              Özel projeleriniz için profesyonel çözümler sunalım. Uzman
              ekibimiz sizinle görüşmek için hazır.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/contact"
              sx={{ mt: 2 }}
            >
              Proje Teklifi Al
            </Button>
          </Box>

          <Box sx={{ mt: 10, mb: 8 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ mb: 6, fontWeight: 700 }}
            >
              Tamamlanmış Projeler
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="350"
                      image="https://images.unsplash.com/photo-1600607687644-c7e47361a37d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Bodrum Villa"
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Bodrum Villa Renovasyonu
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bodrum'da bulunan 450m² villaya özel havuz, peyzaj ve iç
                        mekan tasarımı
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="350"
                      image="https://images.unsplash.com/photo-1600210491369-e753d80a41f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                      alt="İstanbul Penthouse"
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        İstanbul Penthouse
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nişantaşı'nda bulunan 300m² penthouse dairesine özel
                        tasarım ve akıllı ev sistemleri
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
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
                Ücretsiz Keşif İçin Bize Ulaşın
              </Typography>
              <Typography variant="body1" paragraph>
                Özel projeniz için uzman ekibimiz yanınızda.
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

export default SpecialProjects;
