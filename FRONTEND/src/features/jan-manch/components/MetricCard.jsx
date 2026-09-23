import React from "react";
import { ArrowUpRight, ArrowDownRight, IndianRupee, Layers } from "lucide-react";

/**
 * MetricCard:
 * Fixed-height balanced metric summary card with:
 * - min-h-[96px] flex flex-col justify-between
 * - Large bold latest value + % trend chip (ArrowUpRight/ArrowDownRight)
 * - Subtext with dynamic Federal-to-State Utilization Rate / Fulfillment telemetry
 */
export default function MetricCard({
  label,
  value,
  unit,
  trend,
  trendLabel = "vs prior period",
  rateLabel = "Federal-to-State Utilization Rate",
  rateValue,
  category = "financial"
}) {
  const isPositive = trend >= 0;
  const isFinancial = category === "financial";
  const Icon = isFinancial ? IndianRupee : Layers;

  return (
    <div className="bg-white dark:bg-[#0F1115] p-4 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-sm min-h-[96px] flex flex-col justify-between font-mono">
      {/* Top Row: Label & Category Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-[#8A8F98] uppercase tracking-wider">
          {label}
        </span>
        <span
          className={`p-1 rounded-md border text-xs ${
            isFinancial
              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-900/60"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60"
          }`}
        >
          <Icon size={12} />
        </span>
      </div>

      {/* Middle Row: Large Bold Value + Trend Chip */}
      <div className="flex items-baseline justify-between my-1">
        <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
          {value}
          {unit && (
            <span className="text-xs font-normal text-slate-500 dark:text-[#8A8F98] ml-1.5 font-sans">
              {unit}
            </span>
          )}
        </div>

        {trend !== undefined && trend !== null && (
          <div
            className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} className="stroke-[2.5]" />
            ) : (
              <ArrowDownRight size={12} className="stroke-[2.5]" />
            )}
            <span>{isPositive ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`}</span>
          </div>
        )}
      </div>

      {/* Bottom Row: Dynamic Rate Telemetry */}
      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 dark:border-white/[0.04]">
        <span className="text-slate-500 dark:text-[#8A8F98] truncate pr-2">
          {rateLabel}:
        </span>
        <span className="font-bold text-slate-900 dark:text-[#EDEDED] whitespace-nowrap">
          {typeof rateValue === "number" ? `${rateValue.toFixed(1)}%` : rateValue}
        </span>
      </div>
    </div>
  );
}
