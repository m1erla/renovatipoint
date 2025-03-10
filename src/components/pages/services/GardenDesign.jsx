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

const GardenDesign = () => {
  const theme = useTheme();

  const services = [
    {
      title: "Peyzaj Tasarımı",
      description:
        "Bahçenizi profesyonel peyzaj tasarımı ile yeniden düzenliyoruz.",
      image:
        "https://images.unsplash.com/photo-1551410224-699683e15636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
      icon: <LocalFloristIcon />,
      features: [
        "Bahçe düzenleme",
        "Bitki seçimi ve yerleşimi",
        "Peyzaj aydınlatması",
        "Dekoratif taş döşeme",
      ],
    },
    {
      title: "Sulama Sistemleri",
      description:
        "Otomatik sulama sistemleri ile bahçenizi her zaman yeşil tutuyoruz.",
      image:
        "https://images.unsplash.com/photo-1623510593430-2fb4c2da5881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      icon: <WaterDropIcon />,
      features: [
        "Otomatik sulama sistemleri",
        "Damlama sulama",
        "Yağmurlama sistemleri",
        "Su tasarrufu çözümleri",
      ],
    },
    {
      title: "Bahçe Mobilyaları",
      description: "Bahçenizi fonksiyonel ve estetik mobilyalarla donatıyoruz.",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      icon: <CheckCircleIcon />,
      features: [
        "Dış mekan mobilyaları",
        "Veranda ve teras düzenleme",
        "Çardak ve pergola yapımı",
        "Bahçe oturma grupları",
      ],
    },
  ];

  const benefits = [
    {
      title: "Sürdürülebilir Tasarım",
      description:
        "Çevre dostu malzemeler ve su tasarrufu sağlayan sistemlerle sürdürülebilir bahçeler tasarlıyoruz.",
    },
    {
      title: "Dört Mevsim Kullanım",
      description:
        "Her mevsim güzel görünen ve kullanılabilen bahçeler için özel bitki seçimleri yapıyoruz.",
    },
    {
      title: "Kolay Bakım",
      description:
        "Akıllı sistemler ve doğru bitki seçimleriyle bakımı kolay bahçeler oluşturuyoruz.",
    },
    {
      title: "Değer Artışı",
      description:
        "Profesyonel peyzaj tasarımı ile mülkünüzün değerini artırıyoruz.",
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
              src="https://images.unsplash.com/photo-1558293842-c0fd3db86157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Bahçe tasarımı"
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
                Bahçe Tasarımı
              </Typography>
              <Typography variant="h6">
                Doğanın güzelliğini evinize taşıyacak profesyonel peyzaj
                çözümleri
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
            Bahçenizi dört mevsim yaşanabilir bir yaşam alanına dönüştürmek için
            uzman peyzaj mimarlarımız ve deneyimli bahçıvanlarımızla özel
            çözümler sunuyoruz.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} key={index}>
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
                          {service.icon}
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
              Neden Bizi Seçmelisiniz?
            </Typography>
            <Grid container spacing={4}>
              {benefits.map((benefit, index) => (
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
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {benefit.description}
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
                Bahçeniz İçin Ücretsiz Keşif
              </Typography>
              <Typography variant="body1" paragraph>
                Bahçenizin potansiyelini keşfetmek için uzmanlarımız yanınızda.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/contact"
                sx={{ mt: 2 }}
              >
                Randevu Al
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default GardenDesign;
