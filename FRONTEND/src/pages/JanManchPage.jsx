import React, { useState } from "react";
import { Activity, Building2 } from "lucide-react";
import JanManchHeader from "../features/jan-manch/components/JanManchHeader";
import NationalPulseView from "../features/jan-manch/components/NationalPulseView";
import StateDeliveryAuditView from "../features/jan-manch/components/StateDeliveryAuditView";
import ErrorBoundary from "../components/shared/ErrorBoundary";

/**
 * JanManchPage (/jan-manch): Empirical Governance Accountability Tracker
 * Definitive Dual-Mode Architecture:
 * 1. JanManchHeader with clean monospace Telangana // Central Allocation scope.
 * 2. Segmented Pill Switcher: [ National Pulse ] [ State Delivery Audit (28 States) ].
 * 3. Mode "National Pulse": 12 verified macroeconomic and DPI indicators (FY21–FY26).
 * 4. Mode "State Delivery Audit": 28-State All-India Matrix (RBI NSDP 5Y series, NITI Aayog SDG, NCRB, Census Literacy) + Telangana 8-Sector Scheme Pilot.
 */
export default function JanManchPage() {
  const [activeMode, setActiveMode] = useState("national");

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Header with Scope */}
      <JanManchHeader />

      {/* 2. Dual-Mode Segmented Switcher */}
      <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.08] w-fit">
        <button
          type="button"
          onClick={() => setActiveMode("national")}
          className={`px-4 py-2 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
            activeMode === "national"
              ? "bg-white dark:bg-white text-slate-900 dark:text-neutral-900 shadow-xs border border-slate-200/60 dark:border-transparent"
              : "text-slate-500 dark:text-[#8A8F98] hover:text-slate-900 dark:hover:text-[#EDEDED] hover:bg-slate-200/50 dark:hover:bg-white/5"
          }`}
        >
          <Activity size={13} className={activeMode === "national" ? "text-blue-600 dark:text-blue-600" : ""} />
          <span>National Pulse</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("state")}
          className={`px-4 py-2 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
            activeMode === "state"
              ? "bg-white dark:bg-white text-slate-900 dark:text-neutral-900 shadow-xs border border-slate-200/60 dark:border-transparent"
              : "text-slate-500 dark:text-[#8A8F98] hover:text-slate-900 dark:hover:text-[#EDEDED] hover:bg-slate-200/50 dark:hover:bg-white/5"
          }`}
        >
          <Building2 size={13} className={activeMode === "state" ? "text-blue-600 dark:text-blue-600" : ""} />
          <span>State Delivery Audit (28 States)</span>
        </button>
      </div>

      {/* 3. Render View based on Active Mode */}
      {activeMode === "national" ? (
        <ErrorBoundary moduleName="National Pulse Visualizer">
          <NationalPulseView />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary moduleName="State Governance & Delivery Audit">
          <StateDeliveryAuditView />
        </ErrorBoundary>
      )}
    </div>
  );
}
