// src/components/Shared/Footer.js

import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useCustomTheme } from "../../context/ThemeContext";

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "#111827" : theme.palette.background.paper,
  borderTop: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : theme.palette.divider
  }`,
  padding: (isAuthPage) => (isAuthPage ? "16px 0" : "48px 0 24px 0"),
  width: "100%",
  marginTop: "auto",
  position: "relative",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : theme.palette.text.primary,
  fontWeight: 700,
  marginBottom: "24px",
  fontSize: "1.1rem",
}));

const FooterLink = styled(MuiLink)(({ theme }) => ({
  color:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.7)"
      : theme.palette.text.secondary,
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  display: "block",
  marginBottom: "12px",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "translateX(5px)",
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.7)"
      : theme.palette.text.secondary,
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "translateY(-3px)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
  },
}));

const Logo = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.mode === "dark" ? "#fff" : theme.palette.text.primary,
  fontSize: "1.5rem",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "16px",
}));

function Footer() {
  const { theme } = useCustomTheme();
  const location = useLocation();

  const isAuthPage = ["/login", "/register", "/expert-register"].includes(
    location.pathname
  );

  return (
    <StyledFooter
      isAuthPage={isAuthPage}
      sx={{
        backgroundColor: isAuthPage
          ? "transparent"
          : theme.palette.background.paper,
        borderTop: isAuthPage ? "none" : `1px solid ${theme.palette.divider}`,
      }}
    >
      {!isAuthPage ? (
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Logo to="/">
                <Box
                  component="span"
                  sx={{
                    background: theme.palette.background.gradient,
                    borderRadius: "8px",
                    padding: "4px 8px",
                    color: "white",
                    marginRight: "4px",
                  }}
                >
                  BB
                </Box>
                Built Better
              </Logo>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  maxWidth: "300px",
                }}
              >
                We bring your home and garden projects to life with our expert
                team and quality service.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <SocialButton>
                  <FacebookIcon />
                </SocialButton>
                <SocialButton>
                  <TwitterIcon />
                </SocialButton>
                <SocialButton>
                  <InstagramIcon />
                </SocialButton>
                <SocialButton>
                  <LinkedInIcon />
                </SocialButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FooterTitle variant="h6">Company</FooterTitle>
              <FooterLink component={Link} to="/about">
                About Us
              </FooterLink>
              <FooterLink component={Link} to="/careers">
                Careers
              </FooterLink>
              <FooterLink component={Link} to="/contact">
                Contact Us
              </FooterLink>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FooterTitle variant="h6">Services</FooterTitle>
              <FooterLink component={Link} to="/services/home-renovation">
                Home Renovation
              </FooterLink>
              <FooterLink component={Link} to="/services/garden-design">
                Garden Design
              </FooterLink>
              <FooterLink component={Link} to="/services/special-projects">
                Special Projects
              </FooterLink>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FooterTitle variant="h6">Support</FooterTitle>
              <FooterLink component={Link} to="/help">
                Help Center
              </FooterLink>
              <FooterLink component={Link} to="/privacy">
                Privacy Policy
              </FooterLink>
              <FooterLink component={Link} to="/terms">
                Terms of Service
              </FooterLink>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              mt: 4,
              pt: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.tertiary }}
            >
              © {new Date().getFullYear()} Built Better. All rights reserved.
            </Typography>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              © {new Date().getFullYear()} Built Better. All rights reserved.
            </Typography>
          </Box>
        </Container>
      )}
    </StyledFooter>
  );
}

export default Footer;
