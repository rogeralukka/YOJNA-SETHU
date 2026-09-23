import { useState, useRef, useEffect, useCallback } from "react";
import agentTracesData from "../../../data/seed/agentTraces.json";
import { fallbackRoute } from "../../../engine/offlineFallback";

const UNRECOGNIZED_PROMPT_MESSAGE =
  "To test autonomous execution in this prototype, select one of the seeded action traces above.";

/**
 * Hook for executing deterministic agent traces under 2.5s with zero network calls.
 * Dynamically resolves keywords via engine/offlineFallback.js at runtime.
 */
export function useAgentTrace() {
  const [activeTrace, setActiveTrace] = useState(null);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const timerRef = useRef([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const resetTrace = useCallback(() => {
    clearTimers();
    setActiveTrace(null);
    setVisibleSteps([]);
    setIsExecuting(false);
    setIsComplete(false);
    setOutcome(null);
    setErrorNotice(null);
  }, []);

  const executeTrace = useCallback((trace) => {
    if (!trace || !Array.isArray(trace.steps)) return;

    clearTimers();
    setActiveTrace(trace);
    setVisibleSteps([]);
    setIsExecuting(true);
    setIsComplete(false);
    setOutcome(null);
    setErrorNotice(null);

    const steps = trace.steps;
    // Step interval: 400ms. Total execution time for 3 steps + outcome = 1.6s (< 2.5s)
    const STEP_INTERVAL_MS = 400;

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step]);
      }, (index + 1) * STEP_INTERVAL_MS);
      timerRef.current.push(timer);
    });

    const completionTimer = setTimeout(() => {
      setIsExecuting(false);
      setIsComplete(true);
      setOutcome(trace.outcome);
    }, (steps.length + 1) * STEP_INTERVAL_MS);

    timerRef.current.push(completionTimer);
  }, []);

  const runTraceById = useCallback((traceId, currentRoute = "/home") => {
    setErrorNotice(null);
    const routeTraces = agentTracesData.hubTraces[currentRoute] || [];
    const found = routeTraces.find((t) => t.id === traceId || t.chipLabel === traceId);
    if (found) {
      executeTrace(found);
      return true;
    }
    return false;
  }, [executeTrace]);

  const runTraceByQuery = useCallback((query) => {
    if (!query || typeof query !== "string" || !query.trim()) {
      return;
    }
    const trimmed = query.trim().toLowerCase();
    setErrorNotice(null);

    // 1. Check exact chip label match across all hub routes
    for (const routeKey of Object.keys(agentTracesData.hubTraces)) {
      const list = agentTracesData.hubTraces[routeKey] || [];
      const match = list.find(
        (t) => t.chipLabel.toLowerCase() === trimmed || t.id.toLowerCase() === trimmed
      );
      if (match) {
        executeTrace(match);
        return;
      }
    }

    // 2. Read from engine/offlineFallback.js at runtime
    const resolvedPath = fallbackRoute(trimmed);
    if (resolvedPath && agentTracesData.moduleDispatchTraces[resolvedPath]) {
      const dispatchTrace = agentTracesData.moduleDispatchTraces[resolvedPath];
      executeTrace({
        id: `dispatch_${resolvedPath.replace("/", "")}`,
        chipLabel: `Dispatch to ${dispatchTrace.title}`,
        route: resolvedPath,
        steps: dispatchTrace.steps,
        outcome: dispatchTrace.outcome
      });
      return;
    }

    // 3. Unrecognized input returns exact required string
    resetTrace();
    setErrorNotice(UNRECOGNIZED_PROMPT_MESSAGE);
  }, [executeTrace, resetTrace]);

  return {
    activeTrace,
    visibleSteps,
    isExecuting,
    isComplete,
    outcome,
    errorNotice,
    runTraceById,
    runTraceByQuery,
    executeTrace,
    resetTrace
  };
}

export default useAgentTrace;
