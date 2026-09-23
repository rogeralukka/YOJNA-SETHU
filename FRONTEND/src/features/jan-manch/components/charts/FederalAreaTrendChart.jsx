import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

/**
 * Custom Obsidian Dark Tooltip for FederalAreaTrendChart
 */
function CustomAreaTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;

  const target = payload.find((p) => p.dataKey === "targetSanctioned")?.value;
  const delivered = payload.find((p) => p.dataKey === "deliveredVerified")?.value;
  const rate = target > 0 ? (delivered / target) * 100 : 0;

  return (
    <div className="bg-[#0F1115] border border-white/10 p-3 rounded-xl shadow-xl font-mono text-xs text-[#EDEDED] space-y-2 min-w-[190px]">
      <div className="font-bold border-b border-white/10 pb-1 text-slate-300">
        {label} Ground Verification
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-blue-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Target Units:
          </span>
          <span className="font-bold">
            {target?.toLocaleString("en-IN")} {unit}
          </span>
        </div>
        <div className="flex items-center justify-between text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Delivered / Verified:
          </span>
          <span className="font-bold">
            {delivered?.toLocaleString("en-IN")} {unit}
          </span>
        </div>
        <div className="flex items-center justify-between text-amber-400 pt-1 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Fulfillment Rate:
          </span>
          <span className="font-bold">{rate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * FederalAreaTrendChart:
 * Multi-Year Smooth AreaChart visualizer for Physical Ground Delivery.
 * - Target Sanctioned: Monotone Blue area with translucent gradient fill
 * - Delivered / Verified: Monotone Emerald area with vibrant highlight
 */
export default function FederalAreaTrendChart({
  timeline = [],
  metricLabel = "Physical Ground Delivery",
  unit = "Units"
}) {
  const chartData = timeline.map((item) => {
    const target = item.targetSanctioned || item.targetUnits || 0;
    const delivered = item.deliveredVerified || item.deliveredUnits || 0;
    return {
      fiscalYear: item.fiscalYear || `FY${item.year ? String(item.year).slice(-2) : ""}`,
      targetSanctioned: target,
      deliveredVerified: delivered
    };
  });

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 dark:border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] uppercase tracking-wider font-mono">
            {metricLabel}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#8A8F98]">
            Target Units vs Ground-Verified Delivery Volume ({unit})
          </p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 inline-block"></span>
            <span>Target</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Verified</span>
          </span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 min-h-[288px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaTargetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="areaDeliveredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-200 dark:text-white/[0.05]"
              vertical={false}
            />
            <XAxis
              dataKey="fiscalYear"
              stroke="#8A8F98"
              tick={{ fontSize: 11, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
            />
            <YAxis
              stroke="#8A8F98"
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              content={<CustomAreaTooltip unit={unit} />}
              cursor={{ stroke: "#8A8F98", strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="targetSanctioned"
              name="Target Units"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#3b82f6", stroke: "#ffffff" }}
              fillOpacity={1}
              fill="url(#areaTargetGrad)"
            />
            <Area
              type="monotone"
              dataKey="deliveredVerified"
              name="Delivered / Verified"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#10b981", stroke: "#ffffff" }}
              fillOpacity={1}
              fill="url(#areaDeliveredGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
