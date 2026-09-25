// TODO: Remove during Phase 6 — migrate consumers to useTranslation(). Only LanguageSwitcher.jsx survives.
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../components/common/LanguageSwitcher";

export const LANGUAGES = SUPPORTED_LANGUAGES;
export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState(() => (i18n.language || "en").split("-")[0]);

  useEffect(() => {
    const handleLanguageChanged = (newLang) => {
      const code = (newLang || "en").split("-")[0];
      setLangState(code);
      document.documentElement.setAttribute("data-lang", code);
    };

    i18n.on("languageChanged", handleLanguageChanged);
    document.documentElement.setAttribute("data-lang", (i18n.language || "en").split("-")[0]);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const setLang = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRollout: false, languages: SUPPORTED_LANGUAGES }}>
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
