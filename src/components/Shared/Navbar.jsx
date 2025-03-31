import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomTheme } from "../../context/ThemeContext";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  UserPlusIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { mode, toggleTheme } = useCustomTheme();
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const isDarkMode = mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Simplified navigation items - removed Chat, Requests, Create Ad
  const navItems = !isAuthenticated
    ? [
        {
          label: t("navbar.home"),
          path: "/",
          icon: <HomeIcon className="w-5 h-5" />,
        },
        {
          label: t("common.login"),
          path: "/login",
          icon: <ArrowRightOnRectangleIcon className="w-5 h-5" />,
        },
        {
          label: t("common.register"),
          path: "/register",
          icon: <UserPlusIcon className="w-5 h-5" />,
        },
        {
          label: t("auth.expertRegister"),
          path: "/expert-register",
          icon: <UserPlusIcon className="w-5 h-5" />,
        },
      ]
    : user?.role === "EXPERT"
    ? [
        {
          label: t("navbar.home"),
          path: "/",
          icon: <HomeIcon className="w-5 h-5" />,
        },
        {
          label: t("profile.personalInfo"),
          path: "/expert-profile",
          icon: <UserIcon className="w-5 h-5" />,
        },
        {
          label: t("navbar.ads"),
          path: "/ads",
          icon: <BuildingStorefrontIcon className="w-5 h-5" />,
        },
      ]
    : [
        {
          label: t("navbar.home"),
          path: "/",
          icon: <HomeIcon className="w-5 h-5" />,
        },
        {
          label: t("profile.personalInfo"),
          path: "/user-profile",
          icon: <UserIcon className="w-5 h-5" />,
        },
        {
          label: t("navbar.ads"),
          path: "/ads",
          icon: <BuildingStorefrontIcon className="w-5 h-5" />,
        },
      ];

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleLangDropdown = () => {
    setLangDropdownOpen(!langDropdownOpen);
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground dark:text-white"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-primary/80 text-white font-bold p-2 rounded-lg"
            >
              BB
            </motion.div>
            <span
              className={`font-bold text-xl tracking-tight hidden sm:block ${
                scrolled ? "text-foreground dark:text-dark" : "text-dark"
              }`}
            >
              Built Better
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                    isActive(item.path)
                      ? "text-primary dark:text-primary-foreground "
                      : "text-foreground dark:text-white hover:text-primary dark:hover:text-primary-foreground text-dark"
                  } transition-colors duration-300 ease-in-out`}
                >
                  {item.icon}
                  {item.label}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary-foreground/10 rounded-xl z-[-1]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-opacity-10 bg-primary/10 dark:bg-primary/5 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/15 transition-all duration-300 border border-primary/20 dark:border-primary/10 shadow-sm"
              aria-label="Tema değiştir"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-600" />
              )}
            </motion.button>

            {/* Logout Button */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-opacity-10 bg-primary/10 dark:bg-primary/5 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/15 transition-all duration-300 border border-primary/20 dark:border-primary/10 shadow-sm"
              aria-label="Tema değiştir"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-600" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-full bg-background dark:bg-gray-800 text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 top-0 h-full w-3/4 max-w-sm bg-background dark:bg-gray-900 shadow-xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-5 border-b border-border dark:border-gray-700">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-foreground dark:text-white"
                >
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white font-bold p-2 rounded-lg">
                    BB
                  </div>
                  <span className="font-bold text-lg">Built Better</span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-background dark:bg-gray-800 text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto pt-5 pb-6">
                <div className="px-4 space-y-3">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      variants={menuItemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block p-3 rounded-xl font-medium flex items-center gap-3 ${
                          isActive(item.path)
                            ? "bg-primary/10 dark:bg-primary-foreground/10 text-primary dark:text-primary-foreground"
                            : "text-foreground dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        } transition-colors duration-200`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {isAuthenticated && (
                <div className="p-4 border-t border-border dark:border-gray-700">
                  <motion.button
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full p-3 rounded-xl font-medium text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
