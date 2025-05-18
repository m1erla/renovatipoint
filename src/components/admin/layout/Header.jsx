import React from "react";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Select,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../../../context/AuthContext";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const ThemeToggleButton = styled(IconButton)(({ theme, isDarkMode }) => ({
  backgroundColor: isDarkMode
    ? "rgba(255, 255, 255, 0.15)"
    : "rgba(0, 0, 0, 0.05)",
  borderRadius: "50%",
  padding: 8,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: isDarkMode
      ? "rgba(255, 255, 255, 0.25)"
      : "rgba(0, 0, 0, 0.1)",
    transform: "scale(1.05)",
  },
}));

const Header = () => {
  const { mode, toggleTheme } = useCustomTheme();
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  const { user } = useAuth();
  const isDarkMode = mode === "dark";
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{
        bgcolor: isDarkMode ? "background.paper" : "#fff",
        borderBottom: isDarkMode
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <StyledToolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold" }}
        >
          {t("admin.panel")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              variant="outlined"
              sx={{ height: 40 }}
            >
              {availableLanguages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip
            title={isDarkMode ? t("common.lightMode") : t("common.darkMode")}
          >
            <ThemeToggleButton
              onClick={toggleTheme}
              color="inherit"
              isDarkMode={isDarkMode}
              aria-label={
                isDarkMode ? t("common.lightMode") : t("common.darkMode")
              }
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ThemeToggleButton>
          </Tooltip>

          <Tooltip title={t("common.notifications")}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Box>
            <Tooltip title={t("common.profile")}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user?.profileImage ? (
                  <Avatar src={user.profileImage} alt={user.name} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>{t("common.profile")}</MenuItem>
              <MenuItem onClick={handleClose}>{t("admin.settings")}</MenuItem>
            </Menu>
          </Box>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
