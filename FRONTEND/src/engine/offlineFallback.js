/**
 * NagrikPath Digital India 2.0 Reference Architecture
 * Offline Keyword Fallback Engine
 * PURE JAVASCRIPT - Zero React/DOM dependencies
 */

export const OFFLINE_KEYWORD_MAP = Object.freeze({
  "education loan": "/shiksha-setu",
  "scholarship": "/shiksha-setu",
  "crop": "/kisan-setu",
  "mandi": "/kisan-setu",
  "farmer": "/kisan-setu",
  "employment": "/rozgar-setu",
  "job": "/rozgar-setu",
  "pm awas": "/yojna-setu",
  "pension": "/yojna-setu",
  "scheme": "/yojna-setu",
  "welfare": "/yojna-setu",
  "property tax": "/nagar-setu",
  "water connection": "/nagar-setu",
  "certificate": "/nagar-setu",
  "income certificate": "/profile",
  "aadhaar": "/profile"
});

/**
 * Resolves route paths purely offline from local keyword dictionary.
 *
 * @param {string} text - Input query string
 * @returns {string | null} Target route or null if no match found
 */
export function fallbackRoute(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const normalized = text.trim().toLowerCase();

  // Sort keywords by descending length to prioritize multi-word phrases
  const sortedKeywords = Object.keys(OFFLINE_KEYWORD_MAP).sort((a, b) => b.length - a.length);

  for (const keyword of sortedKeywords) {
    if (normalized.includes(keyword)) {
      return OFFLINE_KEYWORD_MAP[keyword];
    }
  }

  return null;
}

export default fallbackRoute;
