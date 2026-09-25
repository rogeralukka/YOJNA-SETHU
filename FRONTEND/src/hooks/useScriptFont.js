import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const SCRIPT_FONT_MAP = {
  hi: {
    id: 'devanagari',
    family: 'Noto Sans Devanagari',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap',
  },
  mr: {
    id: 'devanagari',
    family: 'Noto Sans Devanagari',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap',
  },
  bn: {
    id: 'bengali',
    family: 'Noto Sans Bengali',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap',
  },
  as: {
    id: 'bengali',
    family: 'Noto Sans Bengali',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap',
  },
  ta: {
    id: 'tamil',
    family: 'Noto Sans Tamil',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap',
  },
  te: {
    id: 'telugu',
    family: 'Noto Sans Telugu',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap',
  },
  kn: {
    id: 'kannada',
    family: 'Noto Sans Kannada',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap',
  },
  ml: {
    id: 'malayalam',
    family: 'Noto Sans Malayalam',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;600;700&display=swap',
  },
  gu: {
    id: 'gujarati',
    family: 'Noto Sans Gujarati',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap',
  },
  pa: {
    id: 'gurmukhi',
    family: 'Noto Sans Gurmukhi',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Gurmukhi:wght@400;500;600;700&display=swap',
  },
  or: {
    id: 'oriya',
    family: 'Noto Sans Oriya',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Oriya:wght@400;500;600;700&display=swap',
  },
  ur: {
    id: 'nastaliq-urdu',
    family: 'Noto Nastaliq Urdu',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap',
  },
};

// In-memory registry of dynamically injected script fonts
const injectedScripts = new Set();

/**
 * Injects a script font stylesheet link tag for the specified language.
 * Deduplicates requests to ensure zero redundant network overhead.
 */
export function loadScriptFont(lang) {
  if (!lang) return null;
  const code = lang.split('-')[0].toLowerCase();
  const fontConfig = SCRIPT_FONT_MAP[code];

  if (!fontConfig) {
    // English (or fallback) uses Inter; no extra script font needed
    return null;
  }

  const linkId = `font-script-${fontConfig.id}`;
  if (injectedScripts.has(fontConfig.id) || document.getElementById(linkId)) {
    injectedScripts.add(fontConfig.id);
    return fontConfig.family;
  }

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = fontConfig.url;
  document.head.appendChild(link);
  injectedScripts.add(fontConfig.id);

  return fontConfig.family;
}

/**
 * useScriptFont hook:
 * Listens to active language changes and injects the corresponding Noto Sans script font.
 */
export default function useScriptFont() {
  const { i18n } = useTranslation();

  useEffect(() => {
    loadScriptFont(i18n.language);

    const handleLanguageChanged = (newLang) => {
      loadScriptFont(newLang);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);
}
