import React from "react";
import { Activity, TrendingUp, TrendingDown, Percent, GitCommit } from "lucide-react";

/**
 * VarianceAnalysisCard:
 * Strict Ground Rule 5 Compliance:
 * Renders PURE MATHEMATICAL TELEMETRY comparing Central vs State delivery performance.
 * Zero fabricated policy updates or artificial national averages.
 */
export default function VarianceAnalysisCard({ centralData, stateData, sectorTitle }) {
  if (!centralData || !stateData) return null;

  // 1. Financial Calculations
  const centralFinRate = (centralData.disbursedCr / centralData.sanctionedCr) * 100;
  const stateFinRate = (stateData.disbursedCr / stateData.sanctionedCr) * 100;
  const finVarianceDelta = stateFinRate - centralFinRate;

  // 2. Physical Calculations
  const centralPhysRate = (centralData.deliveredUnits / centralData.targetUnits) * 100;
  const statePhysRate = (stateData.deliveredUnits / stateData.targetUnits) * 100;
  const physVarianceDelta = statePhysRate - centralPhysRate;

  // 3. State Share Ratios
  const stateFinancialShare = ((stateData.sanctionedCr / centralData.sanctionedCr) * 100).toFixed(2);
  const statePhysicalShare = ((stateData.targetUnits / centralData.targetUnits) * 100).toFixed(2);

  // 4. Undisbursed Reserves (₹ Cr)
  const centralUndisbursedCr = centralData.sanctionedCr - centralData.disbursedCr;
  const stateUndisbursedCr = stateData.sanctionedCr - stateData.disbursedCr;

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
            <Activity size={15} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] uppercase tracking-wider font-mono">
              Variance Analysis & Delivery Performance
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-[#8A8F98]">
              Comparison between Central Allocation and Telangana State Ground Delivery
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Quantitative Telemetry Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Panel 1: Financial Utilization Variance */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] uppercase tracking-wider">
              Financial Variance
            </span>
            {finVarianceDelta >= 0 ? (
              <TrendingUp size={13} className="text-emerald-500" />
            ) : (
              <TrendingDown size={13} className="text-rose-500" />
            )}
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-[#EDEDED]">
            {finVarianceDelta >= 0 ? `+${finVarianceDelta.toFixed(2)}%` : `${finVarianceDelta.toFixed(2)}%`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-[#8A8F98] leading-tight">
            State {stateFinRate.toFixed(1)}% vs Central {centralFinRate.toFixed(1)}% disbursement
          </div>
        </div>

        {/* Panel 2: Physical Ground Delivery Variance */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] uppercase tracking-wider">
              Physical Variance
            </span>
            {physVarianceDelta >= 0 ? (
              <TrendingUp size={13} className="text-emerald-500" />
            ) : (
              <TrendingDown size={13} className="text-rose-500" />
            )}
          </div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {physVarianceDelta >= 0 ? `+${physVarianceDelta.toFixed(2)}%` : `${physVarianceDelta.toFixed(2)}%`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-[#8A8F98] leading-tight">
            State {statePhysRate.toFixed(1)}% vs Central {centralPhysRate.toFixed(1)}% verified
          </div>
        </div>

        {/* Panel 3: State Share of Central Sanctions */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] uppercase tracking-wider">
              State Fiscal Share
            </span>
            <Percent size={13} className="text-indigo-400" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-[#EDEDED]">
            {stateFinancialShare}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-[#8A8F98] leading-tight">
            ₹{stateData.sanctionedCr.toLocaleString("en-IN")} Cr of ₹{centralData.sanctionedCr.toLocaleString("en-IN")} Cr total
          </div>
        </div>

        {/* Panel 4: Physical Target Allocation Share */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] uppercase tracking-wider">
              Physical Scope Share
            </span>
            <GitCommit size={13} className="text-emerald-400" />
          </div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {statePhysicalShare}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-[#8A8F98] leading-tight">
            State target units share of central mission total
          </div>
        </div>
      </div>

      {/* Undisbursed Liquidity Telemetry Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/70 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-600 dark:text-[#8A8F98]">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Undisbursed Treasury Balance:</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="text-slate-700 dark:text-[#EDEDED]">
            Central Balance: <strong className="text-amber-600 dark:text-amber-400">₹ {centralUndisbursedCr.toLocaleString("en-IN")} Cr</strong>
          </span>
          <span className="text-slate-700 dark:text-[#EDEDED]">
            State Balance: <strong className="text-emerald-600 dark:text-emerald-400">₹ {stateUndisbursedCr.toLocaleString("en-IN")} Cr</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
