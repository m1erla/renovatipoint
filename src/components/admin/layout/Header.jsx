import React from "react";
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const navigate = useNavigate();
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleLangDropdown = () => {
    setLangDropdownOpen(!langDropdownOpen);
  };

  const isDarkMode = mode === "dark";

  return (
    <header
      className={`sticky top-0 z-10 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow`}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className={`lg:hidden -m-2.5 p-2.5 ${
            isDarkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-700 hover:text-gray-900"
          }`}
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={toggleLangDropdown}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors duration-200 flex items-center gap-1`}
              aria-label={t("common.language")}
            >
              <GlobeAltIcon className="w-5 h-5" />
              <span className="text-xs font-medium">
                {language.toUpperCase()}
              </span>
            </button>

            {langDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg ${
                  isDarkMode
                    ? "bg-gray-700"
                    : "bg-white ring-1 ring-black ring-opacity-5"
                } z-10`}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-600"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${language === lang.code ? "font-bold" : ""}`}
                      role="menuitem"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } transition-colors duration-200`}
            aria-label={t("common.theme")}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-amber-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-blue-600" />
            )}
          </button>

          <div className="relative">
            <span
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {t("admin.welcome")}, {user?.name || "Admin"}
            </span>
          </div>
          <button
            type="button"
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
            onClick={handleLogout}
          >
            {t("common.logout")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
