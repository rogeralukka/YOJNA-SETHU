import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const RTL_LANGUAGES = ['ur'];

export function isRtlLanguage(lang) {
  if (!lang) return false;
  const code = lang.split('-')[0].toLowerCase();
  return RTL_LANGUAGES.includes(code);
}

/**
 * useDirection:
 * Subscribes to i18next language changes and returns 'rtl' for Urdu ('ur'), else 'ltr'.
 * Synchronously reflects dir and lang attributes on the <html> root element.
 */
export default function useDirection() {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState(() =>
    isRtlLanguage(i18n.language) ? 'rtl' : 'ltr'
  );

  useEffect(() => {
    const updateDirection = (lng) => {
      const nextDir = isRtlLanguage(lng) ? 'rtl' : 'ltr';
      setDirection(nextDir);
      const cleanLang = (lng || 'en').split('-')[0];
      document.documentElement.dir = nextDir;
      document.documentElement.lang = cleanLang;
      document.documentElement.setAttribute('data-direction', nextDir);
    };

    // Ensure document attributes match initial language
    updateDirection(i18n.language);

    i18n.on('languageChanged', updateDirection);
    return () => {
      i18n.off('languageChanged', updateDirection);
    };
  }, [i18n]);

  return direction;
}
