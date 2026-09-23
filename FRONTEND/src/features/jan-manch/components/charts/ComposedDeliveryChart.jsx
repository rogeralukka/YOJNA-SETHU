import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

/**
 * Custom Obsidian Dark Tooltip for ComposedDeliveryChart
 */
function CustomComposedTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;

  const sanctioned = payload.find((p) => p.dataKey === "centralSanctioned")?.value;
  const disbursed = payload.find((p) => p.dataKey === "stateDisbursed")?.value;
  const rate = payload.find((p) => p.dataKey === "disbursementRate")?.value;

  return (
    <div className="bg-[#0F1115] border border-white/10 p-3 rounded-xl shadow-xl font-mono text-xs text-[#EDEDED] space-y-2 min-w-[190px]">
      <div className="font-bold border-b border-white/10 pb-1 text-slate-300">
        {label} Financial Telemetry
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-blue-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
            Central Sanctioned:
          </span>
          <span className="font-bold">₹{sanctioned?.toLocaleString("en-IN")} Cr</span>
        </div>
        <div className="flex items-center justify-between text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500"></span>
            State Disbursed:
          </span>
          <span className="font-bold">₹{disbursed?.toLocaleString("en-IN")} Cr</span>
        </div>
        <div className="flex items-center justify-between text-amber-400 pt-1 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Disbursement Rate:
          </span>
          <span className="font-bold">{rate?.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * ComposedDeliveryChart:
 * Multi-Year Interactive Recharts visualizer.
 * - Bars: Central Sanctioned (#3b82f6) & State Disbursed (#10b981) on Left Y-Axis (₹ Cr)
 * - Line: Disbursement Rate % (#f59e0b) on Right Y-Axis with dynamic domain to avoid flat render.
 */
export default function ComposedDeliveryChart({
  timeline = [],
  metricLabel = "Financial Allocation & Disbursement",
  unit = "₹ Cr"
}) {
  const chartData = timeline.map((item) => {
    const sanctioned = item.centralSanctioned || item.sanctionedCr || 0;
    const disbursed = item.stateDisbursed || item.disbursedCr || 0;
    const rate = sanctioned > 0 ? (disbursed / sanctioned) * 100 : 0;
    return {
      fiscalYear: item.fiscalYear || `FY${item.year ? String(item.year).slice(-2) : ""}`,
      centralSanctioned: sanctioned,
      stateDisbursed: disbursed,
      disbursementRate: Number(rate.toFixed(1))
    };
  });

  const minRate = chartData.reduce(
    (min, d) => (d.disbursementRate < min ? d.disbursementRate : min),
    100
  );
  const rightDomainMin = Math.max(0, Math.floor(minRate - 4));

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 dark:border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] uppercase tracking-wider font-mono">
            {metricLabel}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#8A8F98]">
            Central vs State Outlay (Bars) &amp; Execution Rate (Line)
          </p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block"></span>
            <span>Sanctioned</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block"></span>
            <span>Disbursed</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-500 dark:text-amber-400">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
            <span>Rate %</span>
          </span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-72 min-h-[288px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
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
            {/* Left Y-Axis: ₹ Cr */}
            <YAxis
              yAxisId="left"
              stroke="#8A8F98"
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
            />
            {/* Right Y-Axis: % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b"
              domain={[rightDomainMin, 100]}
              tick={{ fontSize: 10, fontFamily: "monospace", fill: "#f59e0b" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              content={<CustomComposedTooltip unit={unit} />}
              cursor={{ fill: "currentColor", className: "text-slate-100/60 dark:text-white/[0.03]" }}
            />
            <Bar
              yAxisId="left"
              dataKey="centralSanctioned"
              name="Central Sanctioned"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              yAxisId="left"
              dataKey="stateDisbursed"
              name="State Disbursed"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="disbursementRate"
              name="Disbursement Rate"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#f59e0b", stroke: "#ffffff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
