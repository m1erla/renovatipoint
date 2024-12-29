import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import YardIcon from "@mui/icons-material/Yard";
import HandymanIcon from "@mui/icons-material/Handyman";

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: "url('/images/renovation-hero.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "80vh",
  display: "flex",
  alignItems: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
}));

const services = [
  {
    title: "Home Renovation",
    description:
      "Interior renovation, kitchen and bathroom remodeling, flooring",
    icon: <HomeRepairServiceIcon sx={{ fontSize: 40 }} />,
    image: "/images/home-renovation.jpg",
  },
  {
    title: "Garden Design",
    description: "Landscape design, planting, irrigation systems",
    icon: <YardIcon sx={{ fontSize: 40 }} />,
    image: "/images/garden-design.jpg",
  },
  {
    title: "Special Projects",
    description: "Terrace design, pool construction, garage renovation",
    icon: <HandymanIcon sx={{ fontSize: 40 }} />,
    image: "/images/special-projects.jpg",
  },
];

function HomePage() {
  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 4,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Create Your Dream Space
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              mb: 6,
              maxWidth: 600,
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            We bring your home and garden renovation projects to life with our
            expert team.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#2c3e50",
              px: 4,
              py: 2,
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "#1a252f",
              },
            }}
          >
            Get Started
          </Button>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 6, color: "#2c3e50", fontWeight: 600 }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} md={4} key={service.title}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ color: "#2c3e50", fontWeight: 600 }}
                  >
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{ color: "#2c3e50", fontWeight: 600, mb: 3 }}
              >
                Why Choose Us?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#546e7a", mb: 4, fontSize: "1.1rem" }}
              >
                With our experienced experts, quality materials, and customer
                satisfaction-focused approach, we bring your projects to life in
                the best way possible.
              </Typography>
              <Button
                component={Link}
                to="/expert-register"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#2c3e50",
                  color: "#2c3e50",
                  "&:hover": {
                    borderColor: "#1a252f",
                    backgroundColor: "#1a252f",
                    color: "white",
                  },
                }}
              >
                Join as Expert
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  bgcolor: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, color: "#2c3e50" }}>
                  Our Success Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#2c3e50", fontWeight: 700 }}
                    >
                      500+
                    </Typography>
                    <Typography color="text.secondary">
                      Completed Projects
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#2c3e50", fontWeight: 700 }}
                    >
                      100+
                    </Typography>
                    <Typography color="text.secondary">
                      Expert Professionals
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
