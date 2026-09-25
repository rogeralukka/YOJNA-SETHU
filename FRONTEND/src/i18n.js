import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import te from './locales/te/translation.json';
import ta from './locales/ta/translation.json';
import kn from './locales/kn/translation.json';
import ml from './locales/ml/translation.json';
import mr from './locales/mr/translation.json';
import gu from './locales/gu/translation.json';
import bn from './locales/bn/translation.json';
import or from './locales/or/translation.json';
import pa from './locales/pa/translation.json';
import as from './locales/as/translation.json';
import ur from './locales/ur/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  ta: { translation: ta },
  kn: { translation: kn },
  ml: { translation: ml },
  mr: { translation: mr },
  gu: { translation: gu },
  bn: { translation: bn },
  or: { translation: or },
  pa: { translation: pa },
  as: { translation: as },
  ur: { translation: ur },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as', 'ur'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nagrikpath_language',
    },
  });

export default i18n;
