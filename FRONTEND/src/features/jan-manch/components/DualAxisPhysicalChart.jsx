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
import { CheckCircle2 } from "lucide-react";

const formatUnitValue = (val) => {
  if (val >= 10000000) {
    return `${(val / 10000000).toFixed(1)} Cr`;
  }
  if (val >= 100000) {
    return `${(val / 100000).toFixed(1)} L`;
  }
  if (val >= 1000) {
    return `${(val / 1000).toFixed(1)}k`;
  }
  return val.toLocaleString("en-IN");
};

const CustomTooltip = ({ active, payload, label, unitLabel }) => {
  if (active && payload && payload.length) {
    const target = payload.find((p) => p.dataKey === "targetUnits")?.value || 0;
    const delivered = payload.find((p) => p.dataKey === "deliveredUnits")?.value || 0;
    const rate = target > 0 ? ((delivered / target) * 100).toFixed(1) : "0.0";

    return (
      <div className="bg-[#0F1115] border border-white/10 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 z-50">
        <p className="font-bold text-[#EDEDED] border-b border-white/10 pb-1">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-[#8A8F98]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3B82F6]"></span> Target Units:
            </span>
            <span className="font-bold text-[#EDEDED]">{formatUnitValue(target)}</span>
          </div>
          <div className="flex justify-between gap-4 text-[#8A8F98]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]"></span> Delivered & Verified:
            </span>
            <span className="font-bold text-emerald-400">{formatUnitValue(delivered)}</span>
          </div>
          <div className="pt-1 border-t border-white/10 flex justify-between gap-4 text-[11px]">
            <span className="text-slate-400">Completion Rate:</span>
            <span className="font-bold text-blue-400">{rate}%</span>
          </div>
          {unitLabel && (
            <p className="text-[10px] text-slate-400 opacity-80 pt-0.5">
              Metric: {unitLabel}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * DualAxisPhysicalChart:
 * Visualizes Target Sanctioned vs Physically Delivered & Verified Ground Units.
 * Follows invariant: ResponsiveContainer inside immediate parent "h-72 min-h-[288px] w-full min-w-0", isAnimationActive={false}, series #3B82F6 & #10B981.
 */
export default function DualAxisPhysicalChart({ centralData, stateData }) {
  if (!centralData || !stateData) return null;

  const chartData = [
    {
      entity: "Central Target",
      targetUnits: centralData.targetUnits,
      deliveredUnits: centralData.deliveredUnits,
      unitLabel: centralData.unitLabel,
      completion: ((centralData.deliveredUnits / centralData.targetUnits) * 100).toFixed(1)
    },
    {
      entity: "State Ground Scope",
      targetUnits: stateData.targetUnits,
      deliveredUnits: stateData.deliveredUnits,
      unitLabel: stateData.unitLabel,
      completion: ((stateData.deliveredUnits / stateData.targetUnits) * 100).toFixed(1)
    }
  ];

  const centralRate = ((centralData.deliveredUnits / centralData.targetUnits) * 100).toFixed(1);
  const stateRate = ((stateData.deliveredUnits / stateData.targetUnits) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
              <CheckCircle2 size={15} />
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] uppercase tracking-wider font-mono">
              Physical Ground Delivery
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 px-2.5 py-0.5 rounded-full">
            State Rate: {stateRate}%
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1 font-mono truncate">
          {stateData.unitLabel || "Ground-Verified Beneficiary Units"}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] block uppercase">Target Sanctioned</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-[#EDEDED]">
            {formatUnitValue(stateData.targetUnits)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#8A8F98] block mt-0.5">
            Central: {formatUnitValue(centralData.targetUnits)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] block uppercase">Verified Delivered</span>
          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
            {formatUnitValue(stateData.deliveredUnits)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {stateRate}% Delivered
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
              tickFormatter={(v) => formatUnitValue(v)}
            />
            <Tooltip content={<CustomTooltip unitLabel={stateData.unitLabel} />} />
            <Bar
              dataKey="targetUnits"
              name="Target Units"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="deliveredUnits"
              name="Delivered Units"
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
          <span className="w-3 h-3 rounded-xs bg-[#3B82F6]"></span>
          <span>Target Sanctioned Units</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-xs bg-[#10B981]"></span>
          <span>Physically Delivered & Verified</span>
        </div>
      </div>
    </div>
  );
}
