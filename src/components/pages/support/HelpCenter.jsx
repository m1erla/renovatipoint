import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HelpIcon from "@mui/icons-material/Help";
import BuildIcon from "@mui/icons-material/Build";
import PaymentIcon from "@mui/icons-material/Payment";
import SecurityIcon from "@mui/icons-material/Security";

const HelpCenter = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Genel Sorular",
      icon: <HelpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: "Hizmetlerimiz",
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: "Ödeme ve Fiyatlandırma",
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
    {
      title: "Güvenlik ve Gizlilik",
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
    },
  ];

  const faqs = [
    {
      category: "Genel Sorular",
      questions: [
        {
          question: "Built Better nedir?",
          answer:
            "Built Better, ev ve bahçe renovasyon projeleriniz için profesyonel çözümler sunan bir platformdur. Uzman ekibimiz ve kaliteli hizmet anlayışımızla projelerinizi hayata geçiriyoruz.",
        },
        {
          question: "Nasıl hizmet alabilirim?",
          answer:
            "İletişim sayfamızdan bize ulaşabilir veya direkt olarak proje teklifi alabilirsiniz. Uzman ekibimiz sizinle iletişime geçerek ihtiyaçlarınızı değerlendirecektir.",
        },
      ],
    },
    {
      category: "Hizmetlerimiz",
      questions: [
        {
          question: "Hangi hizmetleri sunuyorsunuz?",
          answer:
            "Ev renovasyonu, bahçe tasarımı, özel projeler gibi çeşitli alanlarda hizmet veriyoruz. Detaylı bilgi için hizmetler sayfamızı ziyaret edebilirsiniz.",
        },
        {
          question: "Proje süreci nasıl işliyor?",
          answer:
            "Keşif, planlama, tasarım ve uygulama aşamalarından oluşan profesyonel bir süreç yönetimi uyguluyoruz. Her aşamada sizinle iletişim halinde oluyoruz.",
        },
      ],
    },
    {
      category: "Ödeme ve Fiyatlandırma",
      questions: [
        {
          question: "Fiyatlandırma nasıl belirleniyor?",
          answer:
            "Projenin kapsamı, kullanılacak malzemeler ve işçilik gereksinimleri doğrultusunda özel fiyatlandırma yapıyoruz. Ücretsiz keşif sonrası detaylı teklif sunuyoruz.",
        },
        {
          question: "Ödeme seçenekleri nelerdir?",
          answer:
            "Nakit, kredi kartı ve taksit seçeneklerimiz mevcuttur. Ayrıca kurumsal müşterilerimiz için özel ödeme planları sunuyoruz.",
        },
      ],
    },
    {
      category: "Güvenlik ve Gizlilik",
      questions: [
        {
          question: "Kişisel verilerim nasıl korunuyor?",
          answer:
            "KVKK kapsamında tüm kişisel verileriniz güvenle saklanmaktadır. Detaylı bilgi için gizlilik politikamızı inceleyebilirsiniz.",
        },
        {
          question: "Hizmet garantiniz var mı?",
          answer:
            "Tüm hizmetlerimiz garanti kapsamındadır. İşçilik ve malzeme kalitesi için belirli sürelerle garanti veriyoruz.",
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: theme.palette.background.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Yardım Merkezi
              </Typography>

              <Typography
                variant="h5"
                color="textSecondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Sorularınızı yanıtlıyor, projeleriniz için size yardımcı
                oluyoruz.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  position: "relative",
                  maxWidth: "500px",
                  mb: 4,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Sorunuzu yazın..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px",
                      pr: 0,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "0 50px 50px 0",
                    minWidth: "auto",
                    px: 3,
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                  }}
                >
                  <SearchIcon />
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                alt="Destek ekibimiz"
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
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 6,
              background: theme.palette.background.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Yardım Merkezi
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
          >
            Sıkça sorulan sorular ve yardımcı kaynaklar ile size destek olmaktan
            mutluluk duyuyoruz.
          </Typography>

          <Box sx={{ mb: 8 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Sorularınızı arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ maxWidth: "600px", mx: "auto", display: "block" }}
            />
          </Box>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {categories.map((category, index) => (
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
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          margin: "0 auto 16px",
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {category.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box>
            {filteredFaqs.map(
              (category, index) =>
                category.questions.length > 0 && (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                      {category.category}
                    </Typography>
                    {category.questions.map((faq, faqIndex) => (
                      <Accordion key={faqIndex} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">
                            {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" color="text.secondary">
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )
            )}
          </Box>

          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              p: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Sorunuzu Bulamadınız mı?
            </Typography>
            <Typography variant="body1" paragraph>
              Müşteri hizmetleri ekibimiz size yardımcı olmak için hazır.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/contact"
              sx={{ mt: 2 }}
            >
              Bize Ulaşın
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HelpCenter;
