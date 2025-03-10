import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { motion } from "framer-motion";

const ContactUs = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: "Adres",
      details: ["Maslak, Büyükdere Cad. No:123", "34485 Sarıyer/İstanbul"],
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: "Telefon",
      details: ["+90 (212) 123 45 67", "+90 (532) 123 45 67"],
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: "E-posta",
      details: ["info@builtbetter.com", "destek@builtbetter.com"],
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log(formData);
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
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
            İletişim
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
            sx={{ mb: 8, maxWidth: "800px", mx: "auto" }}
          >
            Sorularınız veya projeleriniz için bizimle iletişime geçin. Size
            yardımcı olmaktan mutluluk duyarız.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                      alignItems: "center",
                      textAlign: "center",
                      p: 3,
                      backgroundColor: theme.palette.background.paper,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease-in-out",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        mb: 2,
                      }}
                    >
                      {info.icon}
                    </Box>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {info.title}
                      </Typography>
                      {info.details.map((detail, idx) => (
                        <Typography
                          key={idx}
                          variant="body1"
                          color="textSecondary"
                          paragraph
                        >
                          {detail}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={8} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="h4" gutterBottom align="center">
                  Bize Mesaj Gönderin
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Adınız"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="E-posta"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Konu"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Mesajınız"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                      >
                        Gönder
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: theme.shadows[10],
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                  alt="Ofis lokasyonu haritası"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ContactUs;
