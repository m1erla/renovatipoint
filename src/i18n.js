import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Dil dosyalarını doğrudan import ediyoruz
import translationEN from "./locales/en.json";
import translationTR from "./locales/tr.json";
import translationDE from "./locales/de.json";
import translationNL from "./locales/nl.json";

const resources = {
  en: {
    translation: translationEN,
  },
  tr: {
    translation: translationTR,
  },
  de: {
    translation: translationDE,
  },
  nl: {
    translation: translationNL,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
