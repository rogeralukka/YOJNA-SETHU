/**
 * NagrikPath Digital India 2.0 Reference Architecture
 * Intent Router Engine
 * PURE JAVASCRIPT - Zero React/DOM dependencies
 */

const INTENT_RULES = [
  {
    keywords: ["scholarship", "education loan"],
    route: "/shiksha-setu",
    confidence: 0.9
  },
  {
    keywords: ["crop", "mandi", "farmer"],
    route: "/kisan-setu",
    confidence: 0.9
  },
  {
    keywords: ["job", "employment"],
    route: "/rozgar-setu",
    confidence: 0.85
  },
  {
    keywords: ["scheme", "welfare", "pension"],
    route: "/yojna-setu",
    confidence: 0.85
  },
  {
    keywords: ["certificate", "property tax", "water connection"],
    route: "/nagar-setu",
    confidence: 0.8
  }
];

/**
 * Routes natural language intent to corresponding NagrikPath service module.
 *
 * @param {string} text - User query or intent description
 * @returns {{ route: string, confidence: number, matchedKeyword: string | null }}
 */
export function routeIntent(text) {
  if (!text || typeof text !== "string") {
    return {
      route: "/home",
      confidence: 0.3,
      matchedKeyword: null
    };
  }

  const normalized = text.trim().toLowerCase();

  for (const rule of INTENT_RULES) {
    for (const kw of rule.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        return {
          route: rule.route,
          confidence: rule.confidence,
          matchedKeyword: kw
        };
      }
    }
  }

  return {
    route: "/home",
    confidence: 0.3,
    matchedKeyword: null
  };
}

export default routeIntent;
