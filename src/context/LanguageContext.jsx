import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Dil dosyalarını içe aktar
import translationTR from "../locales/tr.json";
import translationEN from "../locales/en.json";
import translationDE from "../locales/de.json";
import translationNL from "../locales/nl.json";

// Çevirileri tanımla
const resources = {
  tr: {
    translation: translationTR,
  },
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
  nl: {
    translation: translationNL,
  },
};

// i18n ayarlarını yapılandır
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Dil bağlamı oluştur
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // localStorage'dan dili al veya tarayıcı diline göre ayarla veya varsayılan olarak 'tr' kullan
    return (
      localStorage.getItem("i18nextLng") ||
      navigator.language.substring(0, 2) ||
      "tr"
    );
  });

  // Dil değiştirme işlevi
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  // Dil değiştiğinde state'i güncelle
  useEffect(() => {
    const handleLanguageChanged = () => {
      setLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  // Kullanılabilir dillerin listesi
  const availableLanguages = [
    { code: "tr", name: "Türkçe" },
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "nl", name: "Nederlands" },
  ];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        availableLanguages,
        t: i18n.t.bind(i18n),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Bağlamı kullanmak için hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
