import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";

// MUI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import MessageIcon from "@mui/icons-material/Message";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PaymentsIcon from "@mui/icons-material/Payments";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentIcon from "@mui/icons-material/Payment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CategoryIcon from "@mui/icons-material/Category";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

// MUI Components
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Paper,
} from "@mui/material";

const Sidebar = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const isDarkMode = mode === "dark";

  // Sidebar menü öğeleri - çevirileri t fonksiyonu ile alıyoruz
  const menuItems = [
    {
      id: "dashboard",
      label: t("admin.dashboard"),
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      id: "analytics",
      label: t("admin.analytics"),
      path: "/admin/analytics",
      icon: <AnalyticsIcon />,
    },
    {
      id: "users",
      label: t("admin.users"),
      path: "/admin/users",
      icon: <PeopleIcon />,
    },
    {
      id: "messages",
      label: t("admin.message"),
      path: "/admin/messages",
      icon: <MessageIcon />,
    },
    {
      id: "payments",
      label: t("admin.payment"),
      path: "/admin/payments",
      icon: <PaymentIcon />,
    },
    {
      id: "ads",
      label: t("admin.ads"),
      path: "/admin/ads",
      icon: <MonetizationOnIcon />,
    },
    {
      id: "storage",
      label: t("admin.storage"),
      path: "/admin/storage",
      icon: <StorageIcon />,
    },
    {
      id: "categories",
      label: t("admin.category"),
      path: "/admin/categories",
      icon: <CategoryIcon />,
    },
    {
      id: "services",
      label: t("admin.service"),
      path: "/admin/services",
      icon: <MiscellaneousServicesIcon />,
    },
    {
      id: "settings",
      label: t("admin.settings"),
      path: "/admin/settings",
      icon: <SettingsIcon />,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Paper
      elevation={0}
      square
      sx={{
        width: "240px",
        flexShrink: 0,
        height: "100%",
        bgcolor: isDarkMode ? "background.paper" : "#f9fafb",
        color: isDarkMode ? "text.primary" : "text.primary",
        borderRight: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.05)"
          : "1px solid rgba(0, 0, 0, 0.05)",
        transition: "background-color 0.3s, color 0.3s",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.05)"
              : "1px solid rgba(0, 0, 0, 0.05)",
            bgcolor: isDarkMode
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(0, 0, 0, 0.01)",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {t("admin.panel")}
          </Typography>
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem
                button
                key={item.id}
                component={Link}
                to={item.path}
                sx={{
                  color: isDarkMode
                    ? active
                      ? "primary.main"
                      : "text.primary"
                    : active
                    ? "primary.main"
                    : "text.primary",
                  bgcolor: active
                    ? isDarkMode
                      ? "rgba(59, 130, 246, 0.12)"
                      : "rgba(37, 99, 235, 0.08)"
                    : "transparent",
                  backdropFilter: active ? "blur(8px)" : "none",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  my: 0.5,
                  "&:hover": {
                    bgcolor: isDarkMode
                      ? active
                        ? "rgba(59, 130, 246, 0.16)"
                        : "rgba(255, 255, 255, 0.05)"
                      : active
                      ? "rgba(37, 99, 235, 0.12)"
                      : "rgba(0, 0, 0, 0.04)",
                    transform: "translateX(4px)",
                  },
                  "&::before": active
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        height: "60%",
                        width: "4px",
                        backgroundColor: isDarkMode
                          ? "primary.main"
                          : "primary.main",
                        borderRadius: "0 4px 4px 0",
                      }
                    : {},
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isDarkMode
                      ? active
                        ? "primary.main"
                        : "text.secondary"
                      : active
                      ? "primary.main"
                      : "text.secondary",
                    minWidth: "40px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                  }}
                />
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider
          sx={{
            my: 1,
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.08)",
          }}
        />

        {isLoggedIn && (
          <List sx={{ px: 1 }}>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                color: "error.main",
                borderRadius: "8px",
                transition: "all 0.2s ease",
                my: 0.5,
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(239, 68, 68, 0.08)"
                    : "rgba(239, 68, 68, 0.08)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary={t("common.logout")}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItem>
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default Sidebar;
