import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ShieldIcon from "@mui/icons-material/Shield";

const PrivacyPolicy = () => {
  const theme = useTheme();

  const sections = [
    {
      title: "Veri Güvenliği",
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      content:
        "Kişisel verileriniz, endüstri standardı güvenlik protokolleri ve şifreleme teknolojileri kullanılarak korunmaktadır. Verilerinizin güvenliği bizim için en önemli önceliktir.",
    },
    {
      title: "Gizlilik Taahhüdü",
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      content:
        "Müşterilerimizin gizliliğine saygı duyuyor ve kişisel bilgilerini üçüncü taraflarla paylaşmıyoruz. Verileriniz yalnızca hizmet kalitemizi artırmak için kullanılmaktadır.",
    },
    {
      title: "KVKK Uyumluluğu",
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      content:
        "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında tüm yasal gereklilikleri yerine getiriyor ve verilerinizi bu doğrultuda işliyoruz.",
    },
    {
      title: "Veri Kullanımı",
      icon: <DataUsageIcon sx={{ fontSize: 40 }} />,
      content:
        "Toplanan veriler, hizmet kalitemizi artırmak, yasal yükümlülüklerimizi yerine getirmek ve size daha iyi bir deneyim sunmak için kullanılmaktadır.",
    },
  ];

  const policies = [
    {
      title: "1. Toplanan Bilgiler",
      content: [
        "Ad, soyad ve iletişim bilgileri",
        "Proje detayları ve tercihler",
        "Ödeme bilgileri",
        "Hizmet kullanım verileri",
      ],
    },
    {
      title: "2. Bilgilerin Kullanımı",
      content: [
        "Hizmet sunumu ve iyileştirme",
        "İletişim ve bilgilendirme",
        "Yasal yükümlülükler",
        "Hizmet kalitesi analizi",
      ],
    },
    {
      title: "3. Bilgi Güvenliği",
      content: [
        "SSL şifreleme teknolojisi",
        "Güvenli veri depolama",
        "Düzenli güvenlik denetimleri",
        "Erişim kontrolü ve yetkilendirme",
      ],
    },
    {
      title: "4. Haklarınız",
      content: [
        "Bilgi edinme hakkı",
        "Düzeltme ve silme talebi",
        "İşleme itiraz hakkı",
        "Veri taşıma hakkı",
      ],
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  background: theme.palette.background.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Gizlilik Politikası
              </Typography>

              <Typography variant="h6" paragraph sx={{ mb: 3 }}>
                Renovatipoint olarak gizliliğinizi korumayı taahhüt ediyoruz.
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <ShieldIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 2,
                    fontSize: 40,
                  }}
                />
                <Typography variant="body1">
                  Bu gizlilik politikası, hizmetlerimizi kullanırken kişisel
                  verilerinizin nasıl toplandığını, kullanıldığını ve
                  korunduğunu açıklar.
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                alt="Veri güvenliği"
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  boxShadow: theme.shadows[10],
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        <Card
          sx={{
            mb: 8,
            borderRadius: 4,
            boxShadow: theme.shadows[5],
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {sections.map((section, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        textAlign: "center",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          transition: "transform 0.3s ease-in-out",
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: `${theme.palette.primary.main}20`,
                            color: theme.palette.primary.main,
                            margin: "0 auto 16px",
                          }}
                        >
                          {section.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {section.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Box>
              {policies.map((policy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {policy.title}
                      </Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        {policy.content.map((item, itemIndex) => (
                          <Typography
                            key={itemIndex}
                            component="li"
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>

            <Box
              sx={{
                mt: 8,
                p: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Son Güncelleme: {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bu gizlilik politikası, yasal gereklilikler ve hizmet
                şartlarımızdaki değişiklikler doğrultusunda güncellenebilir.
                Önemli değişiklikler olması durumunda size bildirim
                yapılacaktır.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
