import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { IndianRupee } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sanctioned = payload.find((p) => p.dataKey === "sanctionedCr")?.value || 0;
    const disbursed = payload.find((p) => p.dataKey === "disbursedCr")?.value || 0;
    const rate = sanctioned > 0 ? ((disbursed / sanctioned) * 100).toFixed(1) : "0.0";

    return (
      <div className="bg-[#0F1115] border border-white/10 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 z-50">
        <p className="font-bold text-[#EDEDED] border-b border-white/10 pb-1">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-[#8A8F98]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6366F1]"></span> Sanctioned:
            </span>
            <span className="font-bold text-[#EDEDED]">₹ {sanctioned.toLocaleString("en-IN")} Cr</span>
          </div>
          <div className="flex justify-between gap-4 text-[#8A8F98]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]"></span> Disbursed:
            </span>
            <span className="font-bold text-emerald-400">₹ {disbursed.toLocaleString("en-IN")} Cr</span>
          </div>
          <div className="pt-1 border-t border-white/10 flex justify-between gap-4 text-[11px]">
            <span className="text-slate-400">Utilization Rate:</span>
            <span className="font-bold text-blue-400">{rate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * DualAxisFinancialChart:
 * Visualizes Central vs State Financial Delivery (Sanctioned vs Disbursed ₹ Cr).
 * Follows invariant: ResponsiveContainer inside immediate parent "h-72 min-h-[288px] w-full min-w-0", isAnimationActive={false}.
 */
export default function DualAxisFinancialChart({ centralData, stateData, sectorTitle }) {
  if (!centralData || !stateData) return null;

  const chartData = [
    {
      entity: "Central Allocation",
      sanctionedCr: centralData.sanctionedCr,
      disbursedCr: centralData.disbursedCr,
      utilization: ((centralData.disbursedCr / centralData.sanctionedCr) * 100).toFixed(1)
    },
    {
      entity: "Telangana State Share",
      sanctionedCr: stateData.sanctionedCr,
      disbursedCr: stateData.disbursedCr,
      utilization: ((stateData.disbursedCr / stateData.sanctionedCr) * 100).toFixed(1)
    }
  ];

  const centralRate = ((centralData.disbursedCr / centralData.sanctionedCr) * 100).toFixed(1);
  const stateRate = ((stateData.disbursedCr / stateData.sanctionedCr) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
              <IndianRupee size={15} />
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] uppercase tracking-wider font-mono">
              Financial Delivery (₹ Cr)
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 px-2.5 py-0.5 rounded-full">
            State Rate: {stateRate}%
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1 font-mono">
          Central Sanction vs Public Treasury Disbursement
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] block uppercase">Central Sanctioned</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-[#EDEDED]">
            ₹ {centralData.sanctionedCr.toLocaleString("en-IN")} Cr
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {centralRate}% Disbursed
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] block uppercase">State Sanctioned</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-[#EDEDED]">
            ₹ {stateData.sanctionedCr.toLocaleString("en-IN")} Cr
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {stateRate}% Disbursed
          </span>
        </div>
      </div>

      {/* Immediate Parent Container Guard: h-72 min-h-[288px] w-full min-w-0 */}
      <div className="h-72 min-h-[288px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="entity"
              tick={{ fill: "#8A8F98", fontSize: 11, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8A8F98", fontSize: 10, fontFamily: "monospace" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="sanctionedCr"
              name="Sanctioned"
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="disbursedCr"
              name="Disbursed"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-[11px] font-mono text-slate-600 dark:text-[#8A8F98] pt-2 border-t border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#6366F1]"></span>
          <span>Sanctioned Budget (₹ Cr)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#10B981]"></span>
          <span>Publicly Disbursed (₹ Cr)</span>
        </div>
      </div>
    </div>
  );
}
