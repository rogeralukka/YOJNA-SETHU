import React from "react";

/**
 * SchemeCardSkeleton:
 * Sleek, CSS-only pulsing skeleton placeholder mimicking SchemeCard.jsx geometry.
 */
export function SchemeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.08] shadow-xs flex flex-col justify-between space-y-4 min-h-[300px]">
      {/* Header Tags Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* Checkbox Placeholder */}
          <div className="w-5 h-5 rounded-md bg-neutral-200 dark:bg-white/[0.06] animate-pulse shrink-0" />
          {/* Level Badge Placeholder */}
          <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-white/[0.06] animate-pulse" />
          {/* Sector Badge Placeholder */}
          <div className="h-5 w-20 rounded-full bg-neutral-100 dark:bg-white/[0.04] animate-pulse" />
        </div>
        {/* Bookmark Star Placeholder */}
        <div className="w-5 h-5 rounded-md bg-neutral-200 dark:bg-white/[0.06] animate-pulse shrink-0" />
      </div>

      {/* Scheme Title & Ministry Wireframe */}
      <div className="space-y-2">
        <div className="h-4.5 w-4/5 bg-neutral-300 dark:bg-white/[0.1] rounded-md animate-pulse" />
        <div className="h-3 w-3/5 bg-neutral-200 dark:bg-white/[0.06] rounded-md animate-pulse" />
      </div>

      {/* Benefit Well Placeholder */}
      <div className="bg-neutral-50 dark:bg-[#16191F] p-3.5 rounded-xl border border-neutral-100 dark:border-white/[0.04] space-y-2">
        <div className="h-2.5 w-24 bg-neutral-200 dark:bg-white/[0.06] rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-300 dark:bg-white/[0.1] rounded animate-pulse" />
      </div>

      {/* Card Footer Wireframe */}
      <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
        <div className="h-3 w-28 bg-neutral-200 dark:bg-white/[0.06] rounded animate-pulse" />
        <div className="h-8 w-36 rounded-xl bg-neutral-200 dark:bg-white/[0.08] animate-pulse" />
      </div>
    </div>
  );
}

export default SchemeCardSkeleton;
