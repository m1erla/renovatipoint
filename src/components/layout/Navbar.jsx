import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  LanguageIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useCustomTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const isDarkMode = mode === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsUserMenuOpen(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Get current language
  const currentLanguage = i18n.language;

  // Language options
  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  ];

  // Close menus on page change
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
    setIsLanguageMenuOpen(false);
  }, [location]);

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0 },
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

  const isActive = (path) => location.pathname === path;

  // Determine the correct profile path based on user role
  const profilePath = user
    ? user.role === "EXPERT"
      ? "/expert-profile"
      : "/user-profile"
    : "/login"; // Default to login if user is not logged in

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md"
          : "py-4 bg-white dark:bg-gray-900 shadow-sm"
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <div className="hidden md:flex items-center space-x-4">
            {[
              { to: "/", label: t("nav.home") },
              { to: "/services", label: t("nav.services") },
              { to: "/experts", label: t("nav.experts") },
              { to: "/ads", label: t("nav.ads") },
              { to: "/about", label: t("nav.about") },
              { to: "/contact", label: t("nav.contact") },
            ].map((item) => (
              <motion.div
                key={item.to}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.to}
                  className={`relative px-3 py-2 rounded-lg font-medium flex items-center ${
                    isActive(item.to)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  } transition-colors duration-300`}
                >
                  {item.label}
                  {isActive(item.to) && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg z-[-1]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-opacity-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-all duration-300 border border-blue-200/50 dark:border-blue-700/30 shadow-sm"
              aria-label={t("common.changeTheme")}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-600" />
              )}
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800"
              >
                <LanguageIcon className="w-5 h-5" />
                <span className="text-base">
                  {
                    languages.find((lang) => lang.code === currentLanguage)
                      ?.flag
                  }
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    {languages.map((language) => (
                      <motion.button
                        key={language.code}
                        whileHover={{
                          x: 5,
                          backgroundColor: isDarkMode
                            ? "rgba(55, 65, 81, 0.5)"
                            : "rgba(243, 244, 246, 0.5)",
                        }}
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${
                          currentLanguage === language.code
                            ? "text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-md"
              >
                <UserCircleIcon className="w-5 h-5" />
                <ChevronDownIcon className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                  >
                    {user ? (
                      <>
                        <motion.div
                          whileHover={{
                            x: 5,
                            backgroundColor: isDarkMode
                              ? "rgba(55, 65, 81, 0.5)"
                              : "rgba(243, 244, 246, 0.5)",
                          }}
                        >
                          <Link
                            to={profilePath}
                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            {t("nav.profile")}
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{
                            x: 5,
                            backgroundColor: isDarkMode
                              ? "rgba(55, 65, 81, 0.5)"
                              : "rgba(243, 244, 246, 0.5)",
                          }}
                        >
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            {t("common.logout")}
                          </button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          whileHover={{
                            x: 5,
                            backgroundColor: isDarkMode
                              ? "rgba(55, 65, 81, 0.5)"
                              : "rgba(243, 244, 246, 0.5)",
                          }}
                        >
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            {t("nav.login")}
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{
                            x: 5,
                            backgroundColor: isDarkMode
                              ? "rgba(55, 65, 81, 0.5)"
                              : "rgba(243, 244, 246, 0.5)",
                          }}
                        >
                          <Link
                            to="/register"
                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            {t("nav.register")}
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{
                            x: 5,
                            backgroundColor: isDarkMode
                              ? "rgba(55, 65, 81, 0.5)"
                              : "rgba(243, 244, 246, 0.5)",
                          }}
                        >
                          <Link
                            to="/expert-register"
                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 transition-colors"
                          >
                            {t("nav.expertRegister")}
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle for Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-opacity-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-all duration-300 border border-blue-200/50 dark:border-blue-700/30 shadow-sm"
              aria-label={t("common.changeTheme")}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-600" />
              )}
            </motion.button>

            {/* Language Selector for Mobile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800"
              >
                <LanguageIcon className="w-5 h-5" />
                <span className="text-base">
                  {
                    languages.find((lang) => lang.code === currentLanguage)
                      ?.flag
                  }
                </span>
              </motion.button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    {languages.map((language) => (
                      <motion.button
                        key={language.code}
                        whileHover={{
                          x: 5,
                          backgroundColor: isDarkMode
                            ? "rgba(55, 65, 81, 0.5)"
                            : "rgba(243, 244, 246, 0.5)",
                        }}
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${
                          currentLanguage === language.code
                            ? "text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 5 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { to: "/", label: t("nav.home") },
                  { to: "/services", label: t("nav.services") },
                  { to: "/experts", label: t("nav.experts") },
                  { to: "/ads", label: t("nav.ads") },
                  { to: "/about", label: t("nav.about") },
                  { to: "/contact", label: t("nav.contact") },
                ].map((item) => (
                  <motion.div
                    key={item.to}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.to}
                      className={`block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                        isActive(item.to)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                {user ? (
                  <>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={profilePath}
                        className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {t("nav.profile")}
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {t("common.logout")}
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {t("nav.login")}
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/register"
                        className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {t("nav.register")}
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/expert-register"
                        className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {t("nav.expertRegister")}
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
