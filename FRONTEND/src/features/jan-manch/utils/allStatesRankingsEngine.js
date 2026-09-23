import rawStatesData from "../../../data/seed/janmanch/all_states_matrix.json";

/**
 * All-India 28-State Rankings & Computations Engine:
 * Computes runtime metrics, dynamic sorting, rank assignments, and NITI SDG tiers.
 */

export function getNitiTier(sdgScore) {
  if (sdgScore >= 75) {
    return {
      tier: "Front Runner",
      badgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      colorHex: "#10b981"
    };
  }
  if (sdgScore >= 65) {
    return {
      tier: "Performer",
      badgeClass:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      colorHex: "#3b82f6"
    };
  }
  return {
    tier: "Aspirant",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    colorHex: "#f59e0b"
  };
}

export function processAllStates(states = rawStatesData) {
  // 1. Compute runtime metric fields for each state
  const computed = states.map((s) => {
    const validPoints = (s.nsdpHistory || []).filter((p) => p.val !== null && p.val !== undefined);
    const latestPoint = validPoints[validPoints.length - 1] || { val: 0, fy: "FY24" };
    const basePoint = validPoints[0] || latestPoint;

    const latestNsdp = latestPoint.val;
    const latestNsdpYear = latestPoint.fy;
    const incomeGrowth =
      basePoint.val > 0
        ? Number((((latestPoint.val - basePoint.val) / basePoint.val) * 100).toFixed(1))
        : 0;
    const growthYears = `${basePoint.fy}–${latestPoint.fy}`;
    const tierInfo = getNitiTier(s.sdgScore);

    return {
      ...s,
      validNsdpHistory: validPoints,
      latestNsdp,
      latestNsdpYear,
      incomeGrowth,
      growthYears,
      tier: tierInfo.tier,
      tierBadge: tierInfo.badgeClass,
      tierColor: tierInfo.colorHex
    };
  });

  // 2. Sort by sdgScore descending, tie-breaker: latestNsdp descending
  computed.sort((a, b) => {
    if (b.sdgScore !== a.sdgScore) {
      return b.sdgScore - a.sdgScore;
    }
    return b.latestNsdp - a.latestNsdp;
  });

  // 3. Assign dynamic ranks 1 to 28
  return computed.map((state, idx) => ({
    ...state,
    rank: idx + 1
  }));
}

/**
 * Get all processed states with rankings
 */
export const ALL_PROCESSED_STATES = processAllStates(rawStatesData);

/**
 * Helper to get a specific state by ID
 */
export function getStateById(id = "telangana") {
  return (
    ALL_PROCESSED_STATES.find((s) => s.id === id) ||
    ALL_PROCESSED_STATES.find((s) => s.id === "telangana") ||
    ALL_PROCESSED_STATES[0]
  );
}
