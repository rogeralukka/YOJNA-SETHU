import React from "react";

/**
 * JanManchSkeleton:
 * Sleek, CSS-only pulsing skeleton placeholder for Jan Manch Dashboard.
 * Maintains exact container heights (h-72 min-h-[288px] for charts) to ensure zero CLS.
 */
export function JanManchSkeleton({ showHeader = false }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Optional Header Wireframe */}
      {showHeader && (
        <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.08] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-48 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-6 w-24 bg-neutral-200 dark:bg-white/[0.06] rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-3/4 bg-neutral-100 dark:bg-white/[0.04] rounded-md animate-pulse" />
        </div>
      )}

      {/* 4 Sector Tabs Wireframe */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-neutral-100 dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-2xl">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 rounded-xl bg-neutral-200/80 dark:bg-white/[0.06] animate-pulse flex items-center justify-center"
          >
            <div className="h-3.5 w-16 bg-neutral-300 dark:bg-white/[0.1] rounded-md" />
          </div>
        ))}
      </div>

      {/* 2-Column Responsive Dual-Axis Chart Wireframes (EXACT h-72 min-h-[288px] for ZERO CLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1 Skeleton */}
        <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between h-72 min-h-[288px]">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-neutral-100 dark:bg-white/[0.04] rounded-full animate-pulse" />
          </div>
          {/* Simulated chart bars */}
          <div className="h-36 w-full flex items-end justify-around gap-4 px-4 py-2 bg-neutral-50/50 dark:bg-white/[0.02] rounded-xl border border-neutral-100 dark:border-white/[0.03]">
            <div className="w-12 h-20 bg-neutral-200 dark:bg-white/[0.06] rounded-t-md animate-pulse" />
            <div className="w-12 h-28 bg-neutral-300 dark:bg-white/[0.1] rounded-t-md animate-pulse" />
            <div className="w-12 h-16 bg-neutral-200 dark:bg-white/[0.06] rounded-t-md animate-pulse" />
            <div className="w-12 h-24 bg-neutral-300 dark:bg-white/[0.1] rounded-t-md animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="h-3 w-28 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-3 w-28 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
          </div>
        </div>

        {/* Chart 2 Skeleton */}
        <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between h-72 min-h-[288px]">
          <div className="flex items-center justify-between">
            <div className="h-4 w-44 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-neutral-100 dark:bg-white/[0.04] rounded-full animate-pulse" />
          </div>
          {/* Simulated chart bars */}
          <div className="h-36 w-full flex items-end justify-around gap-4 px-4 py-2 bg-neutral-50/50 dark:bg-white/[0.02] rounded-xl border border-neutral-100 dark:border-white/[0.03]">
            <div className="w-12 h-24 bg-neutral-200 dark:bg-white/[0.06] rounded-t-md animate-pulse" />
            <div className="w-12 h-32 bg-neutral-300 dark:bg-white/[0.1] rounded-t-md animate-pulse" />
            <div className="w-12 h-18 bg-neutral-200 dark:bg-white/[0.06] rounded-t-md animate-pulse" />
            <div className="w-12 h-26 bg-neutral-300 dark:bg-white/[0.1] rounded-t-md animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="h-3 w-28 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
            <div className="h-3 w-28 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Variance Analysis Telemetry Card Wireframe */}
      <div className="bg-white dark:bg-[#0F1115] p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-white/[0.08] shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-white/[0.06] animate-pulse" />
          <div className="h-4 w-60 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04] space-y-2"
            >
              <div className="h-3 w-20 bg-neutral-200 dark:bg-white/[0.06] rounded animate-pulse" />
              <div className="h-6 w-16 bg-neutral-300 dark:bg-white/[0.1] rounded animate-pulse" />
              <div className="h-2.5 w-28 bg-neutral-200 dark:bg-white/[0.04] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JanManchSkeleton;
