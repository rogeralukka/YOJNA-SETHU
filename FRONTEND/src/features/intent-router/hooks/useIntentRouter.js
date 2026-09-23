import { useState, useMemo } from "react";
import { routeIntent } from "../../../engine/intentRouter";
import { fallbackRoute } from "../../../engine/offlineFallback";

export const FIXED_CATEGORY_CHIPS = Object.freeze([
  { name: "Yojna Setu", route: "/yojna-setu", desc: "Government Schemes & Welfare" },
  { name: "Shiksha Setu", route: "/shiksha-setu", desc: "Education & Scholarships" },
  { name: "Rozgar Setu", route: "/rozgar-setu", desc: "Employment & Jobs" },
  { name: "Kisan Setu", route: "/kisan-setu", desc: "Agriculture & Mandi" },
  { name: "Nagar Setu", route: "/nagar-setu", desc: "Municipal & Certificates" }
]);

export const MODULE_NAMES = Object.freeze({
  "/yojna-setu": "Yojna Setu (Welfare Schemes)",
  "/shiksha-setu": "Shiksha Setu (Education & Scholarships)",
  "/rozgar-setu": "Rozgar Setu (Employment & Jobs)",
  "/kisan-setu": "Kisan Setu (Agriculture & Mandi)",
  "/nagar-setu": "Nagar Setu (Municipal & Certificates)",
  "/profile": "Unified Family Profile (Documents & Identity)"
});

/**
 * React hook wrapper over engine/intentRouter.js and engine/offlineFallback.js.
 * Strictly maintains engine as single source of truth with zero logic duplication.
 */
export function useIntentRouter() {
  const [query, setQuery] = useState("");

  const routingState = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        status: "idle",
        route: null,
        confidence: 0,
        matchedKeyword: null,
        moduleName: null,
        categories: FIXED_CATEGORY_CHIPS
      };
    }

    // 1. Primary Engine: intentRouter.js
    const engineResult = routeIntent(trimmed);
    if (engineResult && engineResult.confidence >= 0.8 && engineResult.route !== "/home") {
      return {
        status: "routed",
        route: engineResult.route,
        confidence: engineResult.confidence,
        matchedKeyword: engineResult.matchedKeyword || trimmed,
        moduleName: MODULE_NAMES[engineResult.route] || engineResult.route,
        categories: FIXED_CATEGORY_CHIPS
      };
    }

    // 2. Secondary Engine: offlineFallback.js
    const fallbackPath = fallbackRoute(trimmed);
    if (fallbackPath) {
      return {
        status: "routed",
        route: fallbackPath,
        confidence: 0.85,
        matchedKeyword: trimmed,
        moduleName: MODULE_NAMES[fallbackPath] || fallbackPath,
        categories: FIXED_CATEGORY_CHIPS
      };
    }

    // 3. Zero-Match Ambiguous State
    return {
      status: "candidates",
      route: null,
      confidence: engineResult?.confidence || 0.3,
      matchedKeyword: null,
      moduleName: null,
      categories: FIXED_CATEGORY_CHIPS
    };
  }, [query]);

  const clearQuery = () => setQuery("");

  return {
    query,
    setQuery,
    clearQuery,
    status: routingState.status,
    route: routingState.route,
    confidence: routingState.confidence,
    matchedKeyword: routingState.matchedKeyword,
    moduleName: routingState.moduleName,
    categories: routingState.categories
  };
}

export default useIntentRouter;
