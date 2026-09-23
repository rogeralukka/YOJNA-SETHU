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
import {
  TrendingUp,
  Award,
  BookOpen,
  ShieldAlert,
  ChevronDown
} from "lucide-react";
import { ALL_PROCESSED_STATES } from "../utils/allStatesRankingsEngine";

/**
 * Custom Minimalist Tooltip for 5Y NSDP Trajectory
 */
const NSDPTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const dataItem = payload[0];
  const val = dataItem?.value;
  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md pointer-events-none font-mono">
      <div className="text-[11px] text-slate-500 dark:text-neutral-400 mb-0.5">
        Fiscal Year {label}
      </div>
      <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
        ₹{typeof val === "number" ? val.toLocaleString("en-IN") : val}
      </div>
      <div className="text-[10px] text-slate-400 dark:text-[#8A8F98] mt-0.5">
        Per Capita Net State Domestic Product
      </div>
    </div>
  );
};

/**
 * StateHeroSummary:
 * Selected State Executive Governance Card:
 * - 4 High-impact Vital KPI Tiles (SDG Score, Per Capita Income, Literacy, Crime Rate)
 * - Real 5-Year Income Trajectory AreaChart (RBI Handbook Table 9, handling null values cleanly)
 * - State Quick-Switcher dropdown
 */
export default function StateHeroSummary({ state, onSelectStateId }) {
  if (!state) return null;

  // Filter out any null entries so the curve stops cleanly at the latest verified year
  const chartData = (state.nsdpHistory || []).filter(
    (pt) => pt.val !== null && pt.val !== undefined
  );

  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 shadow-sm space-y-5 font-mono transition-all">
      {/* State Header & Dropdown Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.04]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              STATE GOVERNANCE PROFILE
            </span>
            <span className="text-xs text-slate-400 dark:text-[#8A8F98]">
              {state.region} Region
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-[#EDEDED] tracking-tight mt-1">
            {state.name}
          </h2>
        </div>

        {/* State Quick-Switcher Dropdown */}
        <div className="relative">
          <select
            value={state.id}
            onChange={(e) => onSelectStateId && onSelectStateId(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-[#EDEDED] text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer shadow-xs font-sans"
          >
            {ALL_PROCESSED_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.rank} {s.name} (SDG {s.sdgScore})
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
          />
        </div>
      </div>

      {/* 4 State KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. NITI SDG Index */}
        <div className="bg-slate-50/70 dark:bg-[#16191F]/50 p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A8F98] uppercase tracking-wider">
              NITI SDG Index
            </span>
            <span className="p-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs">
              <Award size={13} />
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
              {state.sdgScore}{" "}
              <span className="text-xs font-normal text-slate-400 dark:text-[#8A8F98]">/ 100</span>
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                Rank #{state.rank} of 28
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]/70 pt-1 border-t border-slate-200/50 dark:border-white/[0.04]">
            NITI Aayog 2023–24
          </div>
        </div>

        {/* 2. Per Capita NSDP */}
        <div className="bg-slate-50/70 dark:bg-[#16191F]/50 p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A8F98] uppercase tracking-wider">
              Per Capita NSDP
            </span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs">
              <TrendingUp size={13} />
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
              ₹{state.latestNsdp.toLocaleString("en-IN")}
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                ↑ +{state.incomeGrowth}% ({state.growthYears})
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]/70 pt-1 border-t border-slate-200/50 dark:border-white/[0.04]">
            RBI Table 9 ({state.latestNsdpYear})
          </div>
        </div>

        {/* 3. Literacy Rate */}
        <div className="bg-slate-50/70 dark:bg-[#16191F]/50 p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A8F98] uppercase tracking-wider">
              Literacy Rate
            </span>
            <span className="p-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 text-xs">
              <BookOpen size={13} />
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
              {state.censusLiteracy}%
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#8A8F98] mt-1 font-sans">
              Census 2011 Baseline
            </div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]/70 pt-1 border-t border-slate-200/50 dark:border-white/[0.04]">
            Office of Registrar General
          </div>
        </div>

        {/* 4. Cognizable Crime Rate */}
        <div className="bg-slate-50/70 dark:bg-[#16191F]/50 p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8A8F98] uppercase tracking-wider">
              Crime Rate
            </span>
            <span className="p-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-xs">
              <ShieldAlert size={13} />
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-[#EDEDED] tracking-tight">
              {state.crimeRate}{" "}
              <span className="text-xs font-normal text-slate-400 dark:text-[#8A8F98]">/ 1L</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#8A8F98] mt-1 font-sans">
              NCRB 2022 Registration Rate
            </div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]/70 pt-1 border-t border-slate-200/50 dark:border-white/[0.04]">
            Crime in India 2022 Report
          </div>
        </div>
      </div>

      {/* Real 5-Year Income Trajectory AreaChart */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED]">
              5-Year Per Capita NSDP Trajectory (Current Prices)
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-[#8A8F98]">
              Source: RBI Handbook of Statistics Table 9 • FY20 to {state.latestNsdpYear}
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            +{state.incomeGrowth}% Overall Growth
          </div>
        </div>

        <div className="h-52 min-h-[208px] w-full min-w-0 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`nsdpGrad-${state.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                domain={["dataMin - 15000", "dataMax + 15000"]}
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<NSDPTooltip />} />
              <Area
                type="monotone"
                dataKey="val"
                name="Per Capita NSDP"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                fillOpacity={1}
                fill={`url(#nsdpGrad-${state.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
