import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import enTranslations from '../translations/en.json';
import hiTranslations from '../translations/hi.json';

export const LANGUAGES = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr' },
  { code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi', dir: 'ltr' },
  { code: 'as', nativeName: 'অসমীয়া', englishName: 'Assamese', dir: 'ltr' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', dir: 'ltr' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', dir: 'ltr' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', dir: 'ltr' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', dir: 'ltr' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', dir: 'ltr' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', dir: 'ltr' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', dir: 'ltr' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', dir: 'ltr' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', dir: 'ltr' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', dir: 'rtl' },
];

const languageLoaders = {
  as: () => import('../translations/as.json'),
  bn: () => import('../translations/bn.json'),
  gu: () => import('../translations/gu.json'),
  kn: () => import('../translations/kn.json'),
  ml: () => import('../translations/ml.json'),
  mr: () => import('../translations/mr.json'),
  or: () => import('../translations/or.json'),
  pa: () => import('../translations/pa.json'),
  ta: () => import('../translations/ta.json'),
  te: () => import('../translations/te.json'),
  ur: () => import('../translations/ur.json'),
};

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  // English and Hindi are pre-bundled in initial memory
  const [translationsCache, setTranslationsCache] = useState({
    en: enTranslations,
    hi: hiTranslations,
  });

  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_lang');
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    return 'en';
  });

  const [isLoadingLang, setIsLoadingLang] = useState(false);

  // Apply HTML lang attribute and scoped RTL text direction (preserve LTR product shell)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('yojanasetu_lang', lang);
  }, [lang]);

  // Load language dictionary if not already cached
  const selectLanguage = async (targetLang) => {
    if (!LANGUAGES.some(l => l.code === targetLang)) return;

    if (translationsCache[targetLang]) {
      setLangState(targetLang);
      return;
    }

    if (languageLoaders[targetLang]) {
      try {
        setIsLoadingLang(true);
        const module = await languageLoaders[targetLang]();
        const dict = module.default || module;
        setTranslationsCache(prev => ({
          ...prev,
          [targetLang]: dict,
        }));
        setLangState(targetLang);
      } catch (err) {
        console.error(`Failed to load translation bundle for ${targetLang}:`, err);
        setLangState('en');
      } finally {
        setIsLoadingLang(false);
      }
    } else {
      setLangState(targetLang);
    }
  };

  // If initial saved language is an external lazy-loaded language, load it on mount
  useEffect(() => {
    const saved = localStorage.getItem('yojanasetu_lang');
    if (saved && saved !== 'en' && saved !== 'hi' && !translationsCache[saved]) {
      selectLanguage(saved);
    }
  }, []);

  const toggleLang = () => {
    selectLanguage(lang === 'en' ? 'hi' : 'en');
  };

  const currentLanguageMeta = useMemo(() => {
    return LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  }, [lang]);

  const t = (key, replacements = {}, fallback = null) => {
    if (!key) return fallback || '';
    const activeDict = translationsCache[lang] || translationsCache.en;
    let str = activeDict?.[key];
    if (str === undefined) {
      str = translationsCache.en?.[key];
    }
    if (str === undefined) {
      if (fallback !== null && fallback !== undefined && fallback !== '') {
        str = fallback;
      } else if (
        key.startsWith('notifTitle_') ||
        key.startsWith('notifMsg_') ||
        key.startsWith('dept_') ||
        key.startsWith('benefit_') ||
        key.startsWith('benefitDetail_') ||
        key.startsWith('deadline_') ||
        key.startsWith('desc_') ||
        key.startsWith('overview_') ||
        key.startsWith('elig_') ||
        key.startsWith('doc_') ||
        key.startsWith('rejection_') ||
        key.startsWith('timeline_') ||
        key.startsWith('timelineDesc_')
      ) {
        // Return empty string or fallback rather than exposing internal key
        str = fallback || '';
      } else {
        str = key;
      }
    }
    if (typeof str === 'string' && replacements && Object.keys(replacements).length > 0) {
      Object.entries(replacements).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return str;
  };

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang: selectLanguage,
        toggleLang,
        t,
        languages: LANGUAGES,
        currentLanguageMeta,
        isLoadingLang,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
