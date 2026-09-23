import React from "react";
import { Cpu } from "lucide-react";

/**
 * OfflineDPIBadge:
 * Telemetry capsule mounted in TopNav on HubLayout routes (/home, /jan-manch, /notifications).
 * Exact Label: "LOCAL DPI MODE · 0 NETWORK CALLS"
 */
export default function OfflineDPIBadge() {
  return (
    <div
      className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#16191F] border border-slate-200 dark:border-white/10 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 shadow-xs select-none"
      title="Zero external network requests. All eligibility, encryption, and state machines execute locally in-browser."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>LOCAL DPI MODE · 0 NETWORK CALLS</span>
    </div>
  );
}
