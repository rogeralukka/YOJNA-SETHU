import { useState, useEffect, useCallback } from "react";
import localFallbackSeed from "../../../data/seed/janmanch/national_pulse.json";

/**
 * useNationalPulse:
 * Adaptive data hook for Jan Manch National Pulse hub.
 * - Fetches from Express backend (/api/janmanch/pulse?timeRange=...)
 * - Automatic offline fallback to local sovereign baseline if backend is unavailable.
 */
export function useNationalPulse(timeRange = "ALL") {
  const [indicators, setIndicators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [provenance, setProvenance] = useState(localFallbackSeed.provenance);

  /**
   * Helper to filter fallback local seed data
   */
  const getLocalFallbackData = useCallback(() => {
    const rawIndicators = localFallbackSeed.indicators || [];
    return rawIndicators.map((ind) => {
      let timeline = ind.timeline || [];
      if (timeRange === "3Y") timeline = timeline.slice(-3);
      else if (timeRange === "5Y") timeline = timeline.slice(-5);
      return {
        ...ind,
        timeline
      };
    });
  }, [timeRange]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`/api/janmanch/pulse?timeRange=${encodeURIComponent(timeRange)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.indicators)) {
          setIndicators(json.indicators);
          setIsLiveBackend(true);
          setLastSynced(json.lastSynced ? new Date(json.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Live");
          if (json.provenance) setProvenance(json.provenance);
          setIsLoading(false);
          return;
        }
      }
      throw new Error(`API returned HTTP ${res.status}`);
    } catch (err) {
      // Graceful offline fallback
      console.info("[useNationalPulse] Backend unavailable, using local sovereign baseline:", err.message);
      setIndicators(getLocalFallbackData());
      setIsLiveBackend(false);
      setLastSynced("Sep 2026");
      setProvenance(localFallbackSeed.provenance);
      setIsLoading(false);
    }
  }, [timeRange, getLocalFallbackData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Manual sync trigger
   */
  const syncNow = async () => {
    try {
      await fetch("/api/janmanch/sync", { method: "POST" });
      await fetchData();
    } catch (err) {
      console.warn("[useNationalPulse] Manual sync failed:", err.message);
    }
  };

  return {
    indicators,
    isLoading,
    isLiveBackend,
    lastSynced,
    provenance,
    syncNow,
    refresh: fetchData
  };
}

export default useNationalPulse;
