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
import { useTranslation } from "react-i18next";

const HelpCenter = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: t("support.helpCenter.categories.general"),
      icon: <HelpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: t("support.helpCenter.categories.services"),
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: t("support.helpCenter.categories.payment"),
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
    {
      title: t("support.helpCenter.categories.security"),
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
    },
  ];

  const faqs = [
    {
      category: t("support.helpCenter.categories.general"),
      questions: [
        {
          question: t("support.helpCenter.faqs.general.items.0.question"),
          answer: t("support.helpCenter.faqs.general.items.0.answer"),
        },
        {
          question: t("support.helpCenter.faqs.general.items.1.question"),
          answer: t("support.helpCenter.faqs.general.items.1.answer"),
        },
      ],
    },
    {
      category: t("support.helpCenter.categories.services"),
      questions: [
        {
          question: t("support.helpCenter.faqs.services.items.0.question"),
          answer: t("support.helpCenter.faqs.services.items.0.answer"),
        },
        {
          question: t("support.helpCenter.faqs.services.items.1.question"),
          answer: t("support.helpCenter.faqs.services.items.1.answer"),
        },
      ],
    },
    {
      category: t("support.helpCenter.categories.payment"),
      questions: [
        {
          question: t("support.helpCenter.faqs.payment.items.0.question"),
          answer: t("support.helpCenter.faqs.payment.items.0.answer"),
        },
        {
          question: t("support.helpCenter.faqs.payment.items.1.question"),
          answer: t("support.helpCenter.faqs.payment.items.1.answer"),
        },
      ],
    },
    {
      category: t("support.helpCenter.categories.security"),
      questions: [
        {
          question: t("support.helpCenter.faqs.security.items.0.question"),
          answer: t("support.helpCenter.faqs.security.items.0.answer"),
        },
        {
          question: t("support.helpCenter.faqs.security.items.1.question"),
          answer: t("support.helpCenter.faqs.security.items.1.answer"),
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
                {t("support.helpCenter.title")}
              </Typography>

              <Typography
                variant="h5"
                color="textSecondary"
                paragraph
                sx={{ mb: 4 }}
              >
                {t("support.helpCenter.description")}
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
                  placeholder={t("support.helpCenter.searchPlaceholder")}
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
                alt={t("support.helpCenter.title")}
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
            {t("support.helpCenter.faqs.title")}
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
          >
            {t("support.helpCenter.faqs.description")}
          </Typography>

          <Box sx={{ mb: 8 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("support.helpCenter.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 4 }}
            />

            {filteredFaqs.map((category, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {category.category}
                </Typography>
                {category.questions.map((faq, faqIndex) => (
                  <Accordion key={faqIndex} sx={{ mb: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${faqIndex}-content`}
                      id={`panel${faqIndex}-header`}
                    >
                      <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HelpCenter;
