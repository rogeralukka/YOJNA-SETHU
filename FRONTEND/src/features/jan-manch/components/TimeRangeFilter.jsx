import React from "react";

const TIME_RANGES = [
  { id: "3Y", label: "3Y", description: "Past 3 Fiscal Years" },
  { id: "5Y", label: "5Y", description: "Past 5 Fiscal Years" },
  { id: "ALL", label: "ALL", description: "All Historical Data (FY21-FY26)" }
];

/**
 * TimeRangeFilter:
 * Google-Finance-style time range scrubber ([ 3Y ] [ 5Y ] [ ALL ])
 * Compact segmented pill container with high-contrast Obsidian dark styling.
 */
export default function TimeRangeFilter({ selectedRange = "ALL", onRangeChange }) {
  return (
    <div
      role="group"
      aria-label="Time range selector"
      className="inline-flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08]"
    >
      {TIME_RANGES.map((range) => {
        const isActive = selectedRange === range.id;
        return (
          <button
            key={range.id}
            type="button"
            onClick={() => onRangeChange?.(range.id)}
            aria-pressed={isActive}
            title={range.description}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-all duration-150 cursor-pointer ${
              isActive
                ? "bg-white dark:bg-white text-neutral-900 dark:text-neutral-900 font-bold shadow-xs border border-neutral-200/60 dark:border-transparent"
                : "text-neutral-600 dark:text-[#8A8F98] hover:text-neutral-900 dark:hover:text-[#EDEDED] hover:bg-neutral-200/50 dark:hover:bg-white/5"
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
