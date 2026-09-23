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
import { ArrowUpRight } from "lucide-react";

const COMPOSITE_TIMELINE = [
  { fy: "FY21", val: 100.0, yoy: 0 },
  { fy: "FY22", val: 114.2, yoy: 14.2 },
  { fy: "FY23", val: 128.6, yoy: 12.6 },
  { fy: "FY24", val: 142.1, yoy: 10.5 },
  { fy: "FY25", val: 156.8, yoy: 10.3 },
  { fy: "FY26", val: 168.4, yoy: 7.4 }
];

const CompositeTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const dataItem = payload[0];
  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md pointer-events-none">
      <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 mb-0.5">
        {label}
      </div>
      <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
        {dataItem.value} <span className="text-xs font-normal text-slate-500 dark:text-neutral-400">pts</span>
      </div>
      {dataItem.payload.yoy > 0 && (
        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
          +{dataItem.payload.yoy}% YoY
        </div>
      )}
    </div>
  );
};

export default function CompositeProgressHero() {
  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 shadow-sm min-h-[224px] flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              MACRO SYNTHESIS
            </span>
            <span className="text-xs font-bold font-mono tracking-wider text-slate-700 dark:text-[#EDEDED] uppercase">
              DESH KA INDEX // COMPOSITE SOVEREIGN PROGRESS BENCHMARK
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-2 font-mono">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
              168.4 <span className="text-sm font-normal text-slate-500 dark:text-[#8A8F98]">pts</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <ArrowUpRight size={13} className="stroke-[2.5]" />
              <span>+68.4% Net Sovereign Uplift since FY21</span>
            </span>
          </div>
        </div>
        <div className="text-left sm:text-right font-mono text-[10px] text-slate-400 dark:text-[#8A8F98]/70">
          <div>BASE: FY21 = 100.0</div>
          <div>FREQUENCY: ANNUAL COMPOSITE</div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-28 w-full min-w-0 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={COMPOSITE_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="deshKaIndexGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-slate-200 dark:text-white/[0.05]"
              vertical={false}
            />
            <XAxis
              dataKey="fy"
              stroke="#8A8F98"
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "currentColor", className: "text-slate-200 dark:text-white/[0.08]" }}
            />
            <YAxis
              stroke="#8A8F98"
              domain={[90, 180]}
              tick={{ fontSize: 9, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip content={<CompositeTooltip />} />
            <Area
              type="monotone"
              dataKey="val"
              name="Composite Index"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: "#ffffff", strokeWidth: 2, fill: "#3b82f6" }}
              fillOpacity={1}
              fill="url(#deshKaIndexGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/[0.04] text-[10px] font-mono text-slate-400 dark:text-[#8A8F98]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span>
          Multi-pillar aggregation across Economic, Digital Infrastructure, Welfare, and Capital Assets • NITI Aayog SDG Index Weighting Standard
        </span>
        <span className="text-slate-500 dark:text-neutral-500">REF: NITI-SDG-2026</span>
      </div>
    </div>
  );
}
