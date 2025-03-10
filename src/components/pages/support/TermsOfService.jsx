import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import GavelIcon from "@mui/icons-material/Gavel";
import PaymentIcon from "@mui/icons-material/Payment";
import SecurityIcon from "@mui/icons-material/Security";
import HandshakeIcon from "@mui/icons-material/Handshake";
import DoneIcon from "@mui/icons-material/Done";

const TermsOfService = () => {
  const theme = useTheme();

  const sections = [
    {
      title: "Yasal Çerçeve",
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
      content:
        "Bu hizmet şartları, Built Better ile kullanıcılar arasındaki yasal ilişkiyi düzenler ve tarafların hak ve yükümlülüklerini belirler.",
    },
    {
      title: "Ödeme Koşulları",
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      content:
        "Hizmet bedelleri, ödeme planları ve iade politikalarımız şeffaf bir şekilde belirlenir ve uygulanır.",
    },
    {
      title: "Gizlilik ve Güvenlik",
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      content:
        "Kişisel verilerinizin korunması ve hizmet sürecindeki güvenlik önlemleri yasal mevzuata uygun şekilde sağlanır.",
    },
    {
      title: "Hizmet Taahhüdü",
      icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
      content:
        "Sunduğumuz hizmetlerin kalitesi ve standartları konusunda net taahhütlerde bulunuyor ve bunları yerine getiriyoruz.",
    },
  ];

  const terms = [
    {
      title: "1. Genel Hükümler",
      content: [
        "1.1. Bu şartlar, Built Better platformunun kullanımını düzenler.",
        "1.2. Platform üzerinden sunulan tüm hizmetler bu şartlara tabidir.",
        "1.3. Kullanıcılar, hizmeti kullanarak bu şartları kabul etmiş sayılır.",
        "1.4. Built Better, bu şartları önceden bildirmek kaydıyla değiştirme hakkını saklı tutar.",
      ],
    },
    {
      title: "2. Hizmet Şartları",
      content: [
        "2.1. Hizmetlerimiz profesyonel standartlarda sunulur.",
        "2.2. Proje süreleri ve maliyetler önceden belirlenir.",
        "2.3. Değişiklik talepleri ek maliyet gerektirebilir.",
        "2.4. Kalite standartlarımız garanti kapsamındadır.",
      ],
    },
    {
      title: "3. Ödeme ve İade Politikası",
      content: [
        "3.1. Ödeme planı proje başlangıcında belirlenir.",
        "3.2. Taksitli ödemelerde vade farkı uygulanabilir.",
        "3.3. İptal ve iade koşulları sözleşmede belirtilir.",
        "3.4. Geç ödemelerde yasal faiz uygulanır.",
      ],
    },
    {
      title: "4. Sorumluluklar",
      content: [
        "4.1. Proje sürecinde her iki tarafın sorumlulukları belirlenir.",
        "4.2. Mücbir sebeplerde süre uzatımı yapılabilir.",
        "4.3. Malzeme ve işçilik garantisi verilir.",
        "4.4. İş güvenliği önlemleri tarafımızca sağlanır.",
      ],
    },
    {
      title: "5. Fikri Mülkiyet",
      content: [
        "5.1. Tasarım ve projeler şirketimize aittir.",
        "5.2. Müşteri onaylı projeler üzerinde değişiklik yapılamaz.",
        "5.3. Referans kullanım hakları saklıdır.",
        "5.4. Proje görselleri izinsiz kullanılamaz.",
      ],
    },
    {
      title: "6. Anlaşmazlık Çözümü",
      content: [
        "6.1. Anlaşmazlıklar öncelikle görüşme yoluyla çözülür.",
        "6.2. Arabuluculuk süreci uygulanabilir.",
        "6.3. Yasal yollar son çare olarak kullanılır.",
        "6.4. Yetkili mahkemeler sözleşmede belirtilir.",
      ],
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={7}>
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
                Kullanım Şartları
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Renovatipoint hizmetlerini kullanmadan önce, lütfen bu kullanım
                şartlarını dikkatlice okuyun. Platformumuzu kullanarak, bu
                şartları kabul etmiş olursunuz.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <DoneIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText primary="Tüm içerikler telif hakkı ile korunmaktadır." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DoneIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText primary="Hesap güvenliğinden kullanıcı sorumludur." />
                </ListItem>
              </List>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                alt="Yasal anlaşma"
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  boxShadow: theme.shadows[10],
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
                {terms.map((term, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card sx={{ mb: 4 }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          {term.title}
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {term.content.map((item, itemIndex) => (
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
                  Bu hizmet şartları, yasal gereklilikler ve hizmet
                  koşullarımızdaki değişiklikler doğrultusunda güncellenebilir.
                  Önemli değişiklikler olması durumunda size bildirim
                  yapılacaktır.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TermsOfService;
