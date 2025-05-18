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
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const sectionKeys = [
    "dataSecurity",
    "privacyCommitment",
    "kvkkCompliance",
    "dataUsage",
  ];
  const policyKeys = [
    "collectedInfo",
    "infoUsage",
    "infoSecurity",
    "yourRights",
  ];

  const sectionIcons = {
    dataSecurity: <SecurityIcon sx={{ fontSize: 40 }} />,
    privacyCommitment: <LockIcon sx={{ fontSize: 40 }} />,
    kvkkCompliance: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    dataUsage: <DataUsageIcon sx={{ fontSize: 40 }} />,
  };

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
                {t("pages.privacyPolicy.title", "Gizlilik Politikası")}
              </Typography>

              <Typography variant="h6" paragraph sx={{ mb: 3 }}>
                {t(
                  "pages.privacyPolicy.commitment",
                  "Renovatipoint olarak gizliliğinizi korumayı taahhüt ediyoruz."
                )}
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
                  {t(
                    "pages.privacyPolicy.description",
                    "Bu gizlilik politikası, hizmetlerimizi kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar."
                  )}
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
                alt={t("pages.privacyPolicy.hero.alt", "Data Security Image")}
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
                          {t(`pages.privacyPolicy.sections.${key}.title`)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t(`pages.privacyPolicy.sections.${key}.content`)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Box>
              {policyKeys.map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {t(`pages.privacyPolicy.policies.${key}.title`)}
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
                              `pages.privacyPolicy.policies.${key}.items.${itemIndex}`
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
                {t("pages.privacyPolicy.lastUpdated", "Son Güncelleme")}:{" "}
                {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(
                  "pages.privacyPolicy.updateNotice",
                  "Bu gizlilik politikası, yasal gereklilikler ve hizmet şartlarımızdaki değişiklikler doğrultusunda güncellenebilir. Önemli değişiklikler olması durumunda size bildirim yapılacaktır."
                )}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
