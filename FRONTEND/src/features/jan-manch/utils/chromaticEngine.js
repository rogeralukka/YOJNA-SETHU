/**
 * Dynamic Chromatic Shading Engine:
 * Strict mathematical color scale mapping deltas and trajectory to exact hex codes.
 * 
 * ▲ UPWARD / GROWTH (Green Spectrum)
 *   • Low/Steady (+1% to +25%)     → Deep Forest Green    (#047857)  [Highways, Forex]
 *   • Strong (+25% to +80%)        → Vibrant Emerald      (#10b981)  [DigiLocker, JJM]
 *   • Hyper/Surge (> +80%)         → Neon Electric Mint   (#00f59b)  [UPI, GST, Renewables, DBT, Ayushman]
 * 
 * ▼ DOWNWARD / DECLINE (Red Spectrum)
 *   • Mild (-0.1% to -5%)          → Dark Burgundy        (#991b1b)  
 *   • Moderate (-5% to -15%)       → Crimson              (#e11d48)  
 *   • Severe (> -15%)              → Electric Neon Rose   (#ff1744)  [INR Purchasing Power]
 * 
 * ■ FLAT / STAGNANT / PLATEAU (Purple Spectrum)
 *   • Low Variance (within ±1.5%)  → Muted Violet / Electric Purple (#a855f7) [Power Deficit]
 */
export function getMetricColorTheme(deltaValue, isDownwardSlope = false, isStagnant = false) {
  // 1. STAGNANT / FLAT (Purple Spectrum)
  if (isStagnant || (Math.abs(deltaValue) <= 1.5 && deltaValue !== 0 && !isDownwardSlope) || (isDownwardSlope && Math.abs(deltaValue) <= 0.5)) {
    return {
      stroke: "#a855f7",               // Electric Purple
      gradient: "from-purple-500/20 to-transparent",
      badgeBg: "bg-purple-500/15",
      badgeText: "text-purple-400 font-semibold",
      badgeBorder: "border-purple-500/30"
    };
  }

  // 2. DOWNWARD / DEPRECIATION / DECLINE (Red Spectrum)
  // If the metric is explicitly downward (like INR) or has a negative delta:
  if (isDownwardSlope || deltaValue < 0) {
    const abs = Math.abs(deltaValue);
    if (abs > 15) {
      // Severe Drop (> 15%) -> Electric Crimson / Neon Rose
      return {
        stroke: "#ff1744",
        gradient: "from-rose-500/25 to-transparent",
        badgeBg: "bg-rose-500/20",
        badgeText: "text-rose-400 font-bold",
        badgeBorder: "border-rose-500/50 shadow-[0_0_10px_rgba(255,23,68,0.35)]"
      };
    } else if (abs > 5) {
      // Moderate Drop (5% to 15%) -> Crimson
      return {
        stroke: "#e11d48",
        gradient: "from-rose-600/20 to-transparent",
        badgeBg: "bg-rose-950/40",
        badgeText: "text-rose-300 font-medium",
        badgeBorder: "border-rose-700/40"
      };
    } else {
      // Mild Drop (0% to 5%) -> Dark Burgundy
      return {
        stroke: "#991b1b",
        gradient: "from-red-950/25 to-transparent",
        badgeBg: "bg-red-950/40",
        badgeText: "text-red-400 font-medium",
        badgeBorder: "border-red-900/40"
      };
    }
  }

  // 3. UPWARD / GROWTH (Tiered Green Spectrum based on magnitude)
  const val = deltaValue;
  if (val > 80) {
    // Hyper / Surge Growth (> 80%) -> Neon Electric Mint
    return {
      stroke: "#00f59b",
      gradient: "from-[#00f59b]/25 to-transparent",
      badgeBg: "bg-[#00f59b]/15",
      badgeText: "text-[#00f59b] font-bold",
      badgeBorder: "border-[#00f59b]/40 shadow-[0_0_12px_rgba(0,245,155,0.3)]"
    };
  } else if (val > 25) {
    // Strong Growth (25% to 80%) -> Vibrant Emerald
    return {
      stroke: "#10b981",
      gradient: "from-emerald-500/20 to-transparent",
      badgeBg: "bg-emerald-500/15",
      badgeText: "text-emerald-400 font-semibold",
      badgeBorder: "border-emerald-500/30"
    };
  } else {
    // Moderate / Low Growth (1% to 25%) -> Deep Forest Green
    return {
      stroke: "#047857",
      gradient: "from-emerald-800/20 to-transparent",
      badgeBg: "bg-emerald-950/40",
      badgeText: "text-emerald-300 font-medium",
      badgeBorder: "border-emerald-700/40"
    };
  }
}

/**
 * Backward compatibility alias
 */
export function getAdaptiveChromaticTheme(delta, isStagnant = false, direction = "higher-is-better") {
  const isDownward = direction === "lower-is-better" || delta < 0;
  const theme = getMetricColorTheme(delta, isDownward, isStagnant);
  return {
    ...theme,
    text: theme.badgeText,
    bg: theme.badgeBg,
    border: theme.badgeBorder,
    fillGradient: theme.gradient
  };
}
