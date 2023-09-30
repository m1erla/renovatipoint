import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// const resources = {
//    tr: {
//        translation: {
//         welcome: 'Hoşgeldin'
//        }
//    }, 
//    en:{
//        welcome: 'Welcome!'
//    }
// }

i18n
.use(initReactI18next)
.use(Backend)
.use(LanguageDetector)
.init({
    fallbackLng: 'en',
    // resources
})

export default i18n