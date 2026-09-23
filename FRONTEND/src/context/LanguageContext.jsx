import React, { createContext, useContext, useState, useEffect } from "react";

const LANG_KEY = "nagrikpath_lang";

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", supported: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", supported: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", supported: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", supported: false },
  { code: "mr", name: "Marathi", nativeName: "मराठी", supported: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", supported: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", supported: false },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", supported: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", supported: false },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", supported: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", supported: false },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", supported: false },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", supported: false }
];

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
      document.documentElement.setAttribute("data-lang", lang);
    } catch (e) {
      console.warn("Language storage error", e);
    }
  }, [lang]);

  const setLang = (code) => {
    if (LANGUAGES.some((l) => l.code === code)) {
      setLangState(code);
    }
  };

  const isRollout = !LANGUAGES.find((l) => l.code === lang)?.supported;

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRollout, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
