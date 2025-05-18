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
import { useTranslation } from "react-i18next";

const TermsOfService = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const sectionKeys = [
    "legalFramework",
    "paymentTerms",
    "privacySecurity",
    "serviceCommitment",
  ];
  const termKeys = [
    "generalProvisions",
    "serviceTerms",
    "paymentPolicy",
    "responsibilities",
    "intellectualProperty",
    "disputeResolution",
  ];

  const sectionIcons = {
    legalFramework: <GavelIcon sx={{ fontSize: 40 }} />,
    paymentTerms: <PaymentIcon sx={{ fontSize: 40 }} />,
    privacySecurity: <SecurityIcon sx={{ fontSize: 40 }} />,
    serviceCommitment: <HandshakeIcon sx={{ fontSize: 40 }} />,
  };

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
                {t("pages.termsOfService.title", "Kullanım Şartları")}
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {t(
                  "pages.termsOfService.description",
                  "Renovatipoint hizmetlerini kullanmadan önce, lütfen bu kullanım şartlarını dikkatlice okuyun. Platformumuzu kullanarak, bu şartları kabul etmiş olursunuz."
                )}
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <DoneIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(
                      "pages.termsOfService.listItem1",
                      "Tüm içerikler telif hakkı ile korunmaktadır."
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DoneIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(
                      "pages.termsOfService.listItem2",
                      "Hesap güvenliğinden kullanıcı sorumludur."
                    )}
                  />
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
                alt={t(
                  "pages.termsOfService.hero.alt",
                  "Legal Agreement Image"
                )}
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
                {sectionKeys.map((key, index) => (
                  <Grid item xs={12} sm={6} md={3} key={key}>
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
                            {sectionIcons[key]}
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {t(`pages.termsOfService.sections.${key}.title`)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t(`pages.termsOfService.sections.${key}.content`)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              <Box>
                {termKeys.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card sx={{ mb: 4 }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          {t(`pages.termsOfService.terms.${key}.title`)}
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {[1, 2, 3, 4].map((itemIndex) => (
                            <Typography
                              key={itemIndex}
                              component="li"
                              variant="body1"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {t(
                                `pages.termsOfService.terms.${key}.items.${itemIndex}`
                              )}
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
                  {t("pages.termsOfService.lastUpdated", "Son Güncelleme")}:{" "}
                  {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(
                    "pages.termsOfService.updateNotice",
                    "Bu hizmet şartları, yasal gereklilikler ve hizmet koşullarımızdaki değişiklikler doğrultusunda güncellenebilir. Önemli değişiklikler olması durumunda size bildirim yapılacaktır."
                  )}
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
