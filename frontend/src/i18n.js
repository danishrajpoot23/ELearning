// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
import translationEN from './locales/en/translation.json';
import translationUR from './locales/ur/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ur: {
    translation: translationUR,
  },
  es: {
    translation: translationES,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // agar koi language na milay to yeh use ho
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;