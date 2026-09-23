import React, { useState } from "react";
import { useHousehold } from "../../context/HouseholdContext";
import { Sliders, RotateCcw, CheckCircle, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";

/**
 * ScenarioSwitcher:
 * Mounted strictly in /dev/harness.
 * Allows instant determinism testing across 3 presets:
 * - Preset 1: Initial Blocked State (Ramesh Income Expired 2024-03-31, Priya Active)
 * - Preset 2: Post-DPI Resolution (Ramesh Income Valid Future 2026-01-15 to 2027-01-15, Priya Active)
 * - Preset 3: Full Household Verified (100% Valid Credentials Across All Members)
 * - Reset Factory Seed
 */
export default function ScenarioSwitcher({ onScenarioApplied }) {
  const { applyScenario, resetToFactorySeed, household, activeMember } = useHousehold();
  const [activePreset, setActivePreset] = useState(1);

  const handleSelectPreset = (presetId) => {
    setActivePreset(presetId);
    applyScenario(presetId);
    if (onScenarioApplied) {
      onScenarioApplied(presetId);
    }
  };

  const handleReset = () => {
    setActivePreset(1);
    resetToFactorySeed();
    if (onScenarioApplied) {
      onScenarioApplied(1);
    }
  };

  // Inspect current Ramesh Income Cert state
  const ramesh = household?.members?.find((m) => m.name.includes("Ramesh"));
  const rameshIncomeDoc = ramesh?.documents?.find((d) => d.docTag === "DOC_INCOME_CERT");
  const isIncomeExpired = rameshIncomeDoc?.isExpired || rameshIncomeDoc?.status === "EXPIRED";

  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.08] pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60">
            <Sliders size={16} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] font-mono uppercase tracking-wider">
              Deterministic Scenario Switcher
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-[#8A8F98] font-mono">
              Simulate DPI state transitions for test harness and judge verification
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-700 dark:text-[#EDEDED] bg-slate-100 dark:bg-[#16191F] border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={12} />
          <span>Reset Factory Seed</span>
        </button>
      </div>

      {/* 3 Scenario Preset Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Preset 1 */}
        <button
          type="button"
          onClick={() => handleSelectPreset(1)}
          className={`p-3.5 rounded-xl border text-left font-mono transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
            activePreset === 1
              ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 text-slate-900 dark:text-[#EDEDED] shadow-xs"
              : "bg-slate-50 dark:bg-[#16191F] border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#8A8F98] hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Preset 1
            </span>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-[#EDEDED]">
              Initial Blocked State
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1 leading-snug">
              Ramesh Income Cert is EXPIRED (2024-03-31). Delta Resolver evaluates to BLOCKED.
            </div>
          </div>
        </button>

        {/* Preset 2 */}
        <button
          type="button"
          onClick={() => handleSelectPreset(2)}
          className={`p-3.5 rounded-xl border text-left font-mono transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
            activePreset === 2
              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 text-slate-900 dark:text-[#EDEDED] shadow-xs"
              : "bg-slate-50 dark:bg-[#16191F] border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#8A8F98] hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Preset 2
            </span>
            <Sparkles size={14} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-[#EDEDED]">
              Post-DPI Resolution
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1 leading-snug">
              Ramesh Income Cert updated with valid future dates (2026-01-15 to 2027-01-15). Status: READY.
            </div>
          </div>
        </button>

        {/* Preset 3 */}
        <button
          type="button"
          onClick={() => handleSelectPreset(3)}
          className={`p-3.5 rounded-xl border text-left font-mono transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
            activePreset === 3
              ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 text-slate-900 dark:text-[#EDEDED] shadow-xs"
              : "bg-slate-50 dark:bg-[#16191F] border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#8A8F98] hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Preset 3
            </span>
            <ShieldCheck size={14} className="text-blue-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-[#EDEDED]">
              Full Household 100% Verified
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1 leading-snug">
              All 4 members have 100% valid credentials and future expiry dates. Zero blockers.
            </div>
          </div>
        </button>
      </div>

      {/* Telemetry Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-600 dark:text-[#8A8F98]">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#8A8F98]">Active Member:</span>
          <span className="font-bold text-slate-900 dark:text-[#EDEDED]">{activeMember?.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#8A8F98]">Ramesh Income Cert:</span>
          {isIncomeExpired ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
              EXPIRED (2024-03-31)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              VERIFIED (Expires: {rameshIncomeDoc?.expiresOn?.slice(0, 10)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
