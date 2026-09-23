import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  X,
  Play,
  CheckCircle2,
  Cpu,
  ArrowRight,
  AlertCircle,
  Send
} from "lucide-react";
import { useUI } from "../../context/UIContext";
import agentTracesData from "../../data/seed/agentTraces.json";
import { fallbackRoute } from "../../engine/offlineFallback";

const UNRECOGNIZED_PROMPT_MESSAGE =
  "To test autonomous execution in this prototype, select one of the seeded action traces above.";

export default function AgenticDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isExecutingGlobal, setIsExecutingGlobal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { registerModalOpen, registerModalClose } = useUI();

  const currentPath = location.pathname;
  const timersRef = useRef([]);
  const messagesEndRef = useRef(null);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Esc Key Ownership (Rule 13 & Acceptance Criteria 5)
  useEffect(() => {
    if (isOpen) {
      registerModalOpen();
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown, true);
      return () => {
        window.removeEventListener("keydown", handleKeyDown, true);
        registerModalClose();
      };
    }
  }, [isOpen, registerModalOpen, registerModalClose]);

  // Auto-scroll to bottom of chat when new messages or step updates arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Context-aware action chips based on active route
  const currentRouteTraces =
    agentTracesData.hubTraces[currentPath] ||
    agentTracesData.hubTraces["/home"] ||
    [];

  const executeTraceAction = (trace, userQueryLabel) => {
    if (!trace || !Array.isArray(trace.steps)) return;
    clearTimers();
    setIsExecutingGlobal(true);

    const userMsgId = `u_${Date.now()}`;
    const agentMsgId = `a_${Date.now() + 1}`;

    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: userQueryLabel || trace.chipLabel
    };

    const agentMsg = {
      id: agentMsgId,
      sender: "agent",
      trace,
      visibleSteps: [],
      isExecuting: true,
      isComplete: false,
      outcome: null
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);

    const STEP_INTERVAL_MS = 400;
    trace.steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMsgId
              ? { ...msg, visibleSteps: [...msg.visibleSteps, step] }
              : msg
          )
        );
      }, (idx + 1) * STEP_INTERVAL_MS);
      timersRef.current.push(t);
    });

    const completionTimer = setTimeout(() => {
      setIsExecutingGlobal(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? { ...msg, isExecuting: false, isComplete: true, outcome: trace.outcome }
            : msg
        )
      );
    }, (trace.steps.length + 1) * STEP_INTERVAL_MS);
    timersRef.current.push(completionTimer);
  };

  const handleChipClick = (trace) => {
    setQueryInput("");
    executeTraceAction(trace, trace.chipLabel);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim() || isExecutingGlobal) return;
    const input = queryInput.trim();
    const trimmed = input.toLowerCase();
    setQueryInput("");

    // 1. Exact chip match across all hub routes
    for (const routeKey of Object.keys(agentTracesData.hubTraces)) {
      const list = agentTracesData.hubTraces[routeKey] || [];
      const match = list.find(
        (t) => t.chipLabel.toLowerCase() === trimmed || t.id.toLowerCase() === trimmed
      );
      if (match) {
        executeTraceAction(match, input);
        return;
      }
    }

    // 2. Offline fallback match
    const resolvedPath = fallbackRoute(trimmed);
    if (resolvedPath && agentTracesData.moduleDispatchTraces[resolvedPath]) {
      const dispatchTrace = agentTracesData.moduleDispatchTraces[resolvedPath];
      executeTraceAction(
        {
          id: `dispatch_${resolvedPath.replace("/", "")}`,
          chipLabel: `Dispatch to ${dispatchTrace.title}`,
          route: resolvedPath,
          steps: dispatchTrace.steps,
          outcome: dispatchTrace.outcome
        },
        input
      );
      return;
    }

    // 3. Unrecognized input
    const userMsg = { id: `u_${Date.now()}`, sender: "user", text: input };
    const agentMsg = {
      id: `a_${Date.now() + 1}`,
      sender: "agent",
      isError: true,
      errorNotice: UNRECOGNIZED_PROMPT_MESSAGE
    };
    setMessages((prev) => [...prev, userMsg, agentMsg]);
  };

  const handleChatReset = () => {
    clearTimers();
    setIsExecutingGlobal(false);
    setMessages([]);
  };

  const handleOutcomeAction = (targetRoute) => {
    setIsOpen(false);
    navigate(targetRoute);
  };

  return (
    <>
      {/* 1. FLOATING CAPSULE TRIGGER */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full px-4 h-10 bg-neutral-900 dark:bg-[#0F1115] border border-neutral-700/50 dark:border-white/10 text-neutral-200 shadow-xl flex items-center gap-2 hover:border-white/25 transition-all cursor-pointer group"
          title="Open Deterministic Action Agent"
        >
          <Sparkles size={14} className="text-neutral-400 dark:text-neutral-300 group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-xs font-bold tracking-wider">NAGRIK AGENT</span>
        </button>
      </div>

      {/* 2. FLOATING TELEMETRY CARD (AEGIS Continuous Chat Style) */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-3rem)] max-h-[85vh] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          data-modal-open="true"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-[#0F1115]">
            <div className="flex items-center space-x-2">
              <Sparkles size={14} className="text-neutral-400 dark:text-neutral-300 shrink-0" />
              <h2 className="font-mono text-xs font-semibold tracking-wider text-slate-900 dark:text-[#EDEDED]">
                NAGRIK ACTION AGENT
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleChatReset}
                className="text-[11px] font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer transition px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                title="Reset conversation"
              >
                CHAT RESET
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                title="Close agent telemetry card (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Middle Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Context-Aware Recommended Action Chips */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-[#8A8F98] uppercase font-bold">
                RECOMMENDED ACTION TRACES
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRouteTraces.map((trace) => (
                  <button
                    key={trace.id}
                    type="button"
                    disabled={isExecutingGlobal}
                    onClick={() => handleChipClick(trace)}
                    className="text-left px-3 py-1.5 rounded-lg text-xs font-mono border bg-slate-50 dark:bg-[#16191F] text-slate-700 dark:text-[#EDEDED] border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#1D212A] transition-all duration-150 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Play size={10} className="text-emerald-500" />
                    <span>{trace.chipLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-[#8A8F98]/70 font-mono text-[11px] space-y-1">
                <p>Select a recommended action trace above</p>
                <p className="text-[10px] opacity-75">or type a keyword below for deterministic execution.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  if (msg.sender === "user") {
                    return (
                      <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-1">
                        <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-tr-xs bg-blue-600 text-white font-mono text-xs shadow-xs">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  if (msg.isError) {
                    return (
                      <div
                        key={msg.id}
                        className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-start space-x-2 animate-in fade-in"
                      >
                        <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{msg.errorNotice}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-1">
                      {/* Monospace Steps */}
                      <div className="space-y-2">
                        {msg.visibleSteps?.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl border bg-slate-50 dark:bg-[#16191F] border-slate-200 dark:border-white/[0.08] space-y-1 font-mono animate-in slide-in-from-left-1 duration-150"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                    step.type === "tool"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300"
                                      : step.type === "rule"
                                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                                  }`}
                                >
                                  [00:0{step.stepNumber}.0] {step.type.toUpperCase()}
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-[#EDEDED]">
                                  {step.name}
                                </span>
                              </div>
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-[#8A8F98] pl-1 leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        ))}

                        {/* Pending Spinner */}
                        {msg.isExecuting && (
                          <div className="p-2.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-950/20 font-mono text-xs text-emerald-400 flex items-center space-x-2 animate-pulse">
                            <Cpu size={13} className="animate-spin text-emerald-400" />
                            <span>Evaluating deterministic decision tree (&lt; 2.5s)...</span>
                          </div>
                        )}
                      </div>

                      {/* Final Outcome Card */}
                      {msg.isComplete && msg.outcome && (
                        <div className="p-3.5 rounded-xl border border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-2.5 font-mono animate-in zoom-in-95 duration-150">
                          <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            <span>{msg.outcome.title || "Deterministic Action Plan"}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-[#EDEDED] leading-relaxed">
                            {msg.outcome.verdict}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOutcomeAction(msg.outcome.actionRoute)}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition cursor-pointer"
                          >
                            <span>{msg.outcome.actionLabel}</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Docked Input Bar at Bottom */}
          <div className="p-3 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#0F1115]">
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Type keyword (e.g. mandi, scholarship, audit)..."
                className="w-full pl-3 pr-9 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#16191F] text-slate-900 dark:text-[#EDEDED] placeholder-slate-400 dark:placeholder-[#8A8F98] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!queryInput.trim() || isExecutingGlobal}
                className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition cursor-pointer"
                title="Submit trace keyword"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
