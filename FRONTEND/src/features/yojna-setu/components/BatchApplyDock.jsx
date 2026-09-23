import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * BatchApplyDock:
 * Floating bottom pill dock rendered when one or more schemes are selected via checkbox.
 * Displays total selection count, quick "Clear" action, and "Apply to Selected (N) →" batch CTA.
 */
export function BatchApplyDock({ selectedCount, onClear, onBatchApply }) {
  if (!selectedCount || selectedCount <= 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)] animate-in slide-in-from-bottom duration-200">
      <div className="rounded-full px-5 sm:px-6 py-3 bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-md border border-neutral-200 dark:border-white/[0.12] shadow-2xl flex items-center gap-3 sm:gap-4">
        {/* Selection Count Badge */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
            {selectedCount}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-[#EDEDED] whitespace-nowrap">
            {selectedCount === 1 ? '1 Scheme Selected' : `${selectedCount} Schemes Selected`}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-neutral-200 dark:bg-white/[0.1] hidden sm:block" />

        {/* Clear Action */}
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-[#8A8F98] dark:hover:text-[#EDEDED] px-2.5 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-[#16191F] transition-colors cursor-pointer"
        >
          Clear
        </button>

        {/* Primary Batch Action CTA */}
        <button
          type="button"
          onClick={onBatchApply}
          className="py-2 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Apply to Selected ({selectedCount})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default BatchApplyDock;
