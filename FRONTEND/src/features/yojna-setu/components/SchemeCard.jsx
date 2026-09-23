import React from 'react';
import {
  CreditCard,
  ArrowRight,
  Clock,
  Star,
  Check
} from 'lucide-react';

function getSchemeDepartment(scheme) {
  if (scheme.department) return scheme.department;
  if (scheme.id === 'post-matric-obc') return 'Ministry of Social Justice & Empowerment';
  if (scheme.id === 'pm-kisan') return 'Ministry of Agriculture & Farmers Welfare';
  if (scheme.id === 'pm-jay') return 'National Health Authority';
  return `${scheme.level || 'Central'} Government`;
}

function getSchemeBenefit(scheme) {
  if (scheme.benefitSummary) return scheme.benefitSummary;
  if (scheme.benefit) return scheme.benefit;
  if (scheme.id === 'post-matric-obc') return 'Post-matric educational financial assistance';
  if (scheme.id === 'pm-kisan') return '₹6,000 / year Direct Benefit Transfer';
  if (scheme.id === 'pm-jay') return '₹5 Lakh / family / yr Cashless Health Cover';
  return 'Direct Beneficiary Entitlement';
}

/**
 * SchemeCard:
 * Dynamic scheme card reflecting engine evaluation (ELIGIBLE-READY, ELIGIBLE-BLOCKED, INELIGIBLE).
 * Supports multi-scheme checkbox selection and interactive bookmark starring.
 */
export function SchemeCard({
  scheme,
  isSelected = false,
  onToggleSelect,
  isBookmarked = false,
  onToggleBookmark,
  onInspectDelta,
  onSynthesizeDocket
}) {
  const department = getSchemeDepartment(scheme);
  const benefit = getSchemeBenefit(scheme);

  // Determine badge text and styling based on evaluated state
  let badgePill = null;
  let actionButton = null;

  if (scheme.state === 'ELIGIBLE-READY') {
    badgePill = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap leading-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
        Ready to Apply
      </span>
    );

    actionButton = (
      <button
        onClick={() => onSynthesizeDocket(scheme)}
        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Synthesize Application Docket</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  } else if (scheme.state === 'ELIGIBLE-BLOCKED') {
    const expiredCount = scheme.delta?.expiredDocs?.length || 0;
    const badgeText = expiredCount > 0 ? (expiredCount === 1 ? '1 Prerequisite Expired' : `${expiredCount} Prerequisites Expired`) : 'Missing Credential';

    badgePill = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap leading-none bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
        {badgeText}
      </span>
    );

    actionButton = (
      <button
        onClick={() => onInspectDelta(scheme)}
        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 dark:text-[#EDEDED] bg-neutral-100 hover:bg-neutral-200 dark:bg-[#16191F] dark:hover:bg-[#1D212A] border border-neutral-300 dark:border-white/[0.08] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Inspect Eligibility Delta</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  } else {
    // INELIGIBLE
    badgePill = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap leading-none bg-neutral-500/10 text-neutral-500 dark:text-[#8A8F98] border border-neutral-500/20 shrink-0">
        Criteria Not Met
      </span>
    );

    actionButton = null;
  }

  const isEligible = scheme.state !== 'INELIGIBLE';

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0F1115] border transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/25 shadow-md bg-blue-50/20 dark:bg-blue-950/10'
          : 'border-neutral-200 dark:border-white/[0.08] shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges, Checkbox & Bookmark Star */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {isEligible && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect && onToggleSelect(scheme.id);
                }}
                className={`w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white dark:bg-[#16191F] border-neutral-300 dark:border-white/[0.15] text-transparent hover:border-blue-500'
                }`}
                title={isSelected ? 'Deselect scheme' : 'Select scheme for batch application'}
                aria-label={isSelected ? `Deselect ${scheme.name}` : `Select ${scheme.name}`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-[#16191F] text-neutral-600 dark:text-[#8A8F98] border border-neutral-200 dark:border-white/[0.08] shrink-0 leading-none inline-flex items-center">
              {scheme.level || 'CENTRAL'}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 shrink-0 leading-none inline-flex items-center">
              {scheme.sector}
            </span>
            {badgePill}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark && onToggleBookmark(scheme.id);
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-[#16191F] transition-all cursor-pointer shrink-0 mt-0.5"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Scheme'}
            aria-label={isBookmarked ? `Remove Bookmark for ${scheme.name}` : `Bookmark ${scheme.name}`}
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                isBookmarked
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-neutral-400 dark:text-[#8A8F98]'
              }`}
            />
          </button>
        </div>

        {/* Scheme Title & Department */}
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] leading-snug">
          {scheme.name}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-[#8A8F98] mt-1">
          {department}
        </p>

        {/* Benefit Summary Well */}
        <div className="mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-200/70 dark:border-white/[0.06]">
          <div className="flex items-start gap-2.5">
            <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98] block">
                Entitlement / Benefit
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-[#EDEDED]">
                {benefit}
              </span>
            </div>
          </div>
        </div>

        {/* Ineligible Reason if applicable */}
        {scheme.state === 'INELIGIBLE' && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/[0.06] border border-rose-500/20 text-xs text-rose-700 dark:text-rose-400">
            <span className="font-semibold block mb-0.5">Reason:</span>
            {scheme.ineligibleReason}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-[#8A8F98]">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {scheme.deadline || 'Always Open'}
          </span>
          <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase">
            {scheme.id}
          </span>
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
}

export default SchemeCard;
