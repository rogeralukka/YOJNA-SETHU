import React from "react";

/**
 * JanManchHeader:
 * Title: "JAN MANCH"
 * Subtitle: "Empirical Governance Accountability Tracker"
 * Scope Monospace Label: "Telangana // Central Allocation"
 */
export default function JanManchHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#EDEDED]">
          JAN MANCH
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8A8F98] mt-1 font-medium">
          Empirical Governance Accountability Tracker
        </p>
      </div>

      <div>
        <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
          Telangana // Central Allocation
        </span>
      </div>
    </div>
  );
}
