import React, { useState, useTransition } from "react";
import StateHeroSummary from "./StateHeroSummary";
import AllStatesRankingsTable from "./AllStatesRankingsTable";
import SectorSelector from "./SectorSelector";
import TimeRangeFilter from "./TimeRangeFilter";
import MetricCard from "./MetricCard";
import ComposedDeliveryChart from "./charts/ComposedDeliveryChart";
import FederalAreaTrendChart from "./charts/FederalAreaTrendChart";
import VarianceAnalysisCard from "./VarianceAnalysisCard";
import ErrorBoundary from "../../../components/shared/ErrorBoundary";
import { JanManchSkeleton } from "../../../components/shared/skeletons";
import { getStateById } from "../utils/allStatesRankingsEngine";

import telanganaSectorsData from "../../../data/seed/janmanch/telangana_sectors.json";
import agricultureData from "../../../data/seed/janmanch/agriculture.json";
import jaljeevanData from "../../../data/seed/janmanch/jaljeevan.json";
import healthData from "../../../data/seed/janmanch/health.json";
import infrastructureData from "../../../data/seed/janmanch/infrastructure.json";
import { Sparkles, Building2 } from "lucide-react";

const SECTOR_DATA_MAP = {
  ...telanganaSectorsData,
  agriculture: telanganaSectorsData?.agriculture || agricultureData,
  jaljeevan: telanganaSectorsData?.jaljeevan || jaljeevanData,
  health: telanganaSectorsData?.health || healthData,
  infrastructure: telanganaSectorsData?.infrastructure || infrastructureData
};

function filterTimeline(timeline = [], range = "ALL") {
  if (!timeline || timeline.length === 0) return [];
  if (range === "3Y") return timeline.slice(-3);
  if (range === "5Y") return timeline.slice(-5);
  return timeline;
}

/**
 * StateDeliveryAuditView:
 * Comprehensive All-India Governance Matrix:
 * 1. Selected State Executive Hero with 5Y RBI NSDP Trajectory
 * 2. 28-State All-India Leaderboard with Live Filter & Sort
 * 3. Granular Scheme Audit (Active for Telangana Pilot with 8 sectors)
 */
export default function StateDeliveryAuditView() {
  const [selectedStateId, setSelectedStateId] = useState("telangana");
  const [activeSectorKey, setActiveSectorKey] = useState("agriculture");
  const [timeRange, setTimeRange] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [isSwitching, setIsSwitching] = useState(false);

  const selectedState = getStateById(selectedStateId);

  const handleSelectState = (state) => {
    if (state?.id) {
      setSelectedStateId(state.id);
    }
  };

  const handleSelectSector = (sectorKey) => {
    if (sectorKey === activeSectorKey) return;
    setIsSwitching(true);
    startTransition(() => {
      setActiveSectorKey(sectorKey);
      setTimeout(() => {
        setIsSwitching(false);
      }, 150);
    });
  };

  const isTelangana = selectedStateId === "telangana";
  const currentSectorData = SECTOR_DATA_MAP[activeSectorKey] || SECTOR_DATA_MAP.agriculture;

  // Timelines & Slicing for Telangana Scheme View
  const rawFinTimeline = currentSectorData.financialMetric?.timeline || [];
  const rawPhysTimeline = currentSectorData.physicalMetric?.timeline || [];

  const filteredFinTimeline = filterTimeline(rawFinTimeline, timeRange);
  const filteredPhysTimeline = filterTimeline(rawPhysTimeline, timeRange);

  // Financial Telemetry for MetricCard
  const latestFin = rawFinTimeline[rawFinTimeline.length - 1] || {};
  const prevFin = rawFinTimeline[rawFinTimeline.length - 2] || latestFin;
  const finDisbursed = latestFin.stateDisbursed || 0;
  const finSanctioned = latestFin.centralSanctioned || 1;
  const finUtilizationRate = (finDisbursed / finSanctioned) * 100;
  const finYoY = prevFin.stateDisbursed
    ? ((finDisbursed - prevFin.stateDisbursed) / prevFin.stateDisbursed) * 100
    : 0;

  // Physical Telemetry for MetricCard
  const latestPhys = rawPhysTimeline[rawPhysTimeline.length - 1] || {};
  const prevPhys = rawPhysTimeline[rawPhysTimeline.length - 2] || latestPhys;
  const physDelivered = latestPhys.deliveredVerified || 0;
  const physTarget = latestPhys.targetSanctioned || 1;
  const physFulfillmentRate = (physDelivered / physTarget) * 100;
  const physYoY = prevPhys.deliveredVerified
    ? ((physDelivered - prevPhys.deliveredVerified) / prevPhys.deliveredVerified) * 100
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Selected State Executive Hero & 5Y Income Trajectory Chart */}
      <ErrorBoundary moduleName="State Governance Profile">
        <StateHeroSummary
          state={selectedState}
          onSelectStateId={(id) => setSelectedStateId(id)}
        />
      </ErrorBoundary>

      {/* 2. All-India 28-State Leaderboard Table */}
      <ErrorBoundary moduleName="All-India Rankings Table">
        <AllStatesRankingsTable
          selectedStateId={selectedStateId}
          onSelectState={handleSelectState}
        />
      </ErrorBoundary>

      {/* 3. Granular Scheme Audit (Telangana Pilot or Other States Guidance) */}
      <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                SCHEME-LEVEL DELIVERY AUDIT
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] font-mono uppercase">
                {selectedState.name} // Federal Transfer &amp; Ground Fulfillment
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-1 font-sans">
              Central Allocations, State Disbursements, and Physical Infrastructure Verification.
            </p>
          </div>

          {!isTelangana && (
            <button
              type="button"
              onClick={() => setSelectedStateId("telangana")}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold cursor-pointer hover:bg-blue-100 transition-all font-mono self-start sm:self-auto"
            >
              <Sparkles size={13} />
              <span>Switch to Telangana Pilot</span>
            </button>
          )}
        </div>

        {isTelangana ? (
          <>
            {/* 8-Sector Selector */}
            <SectorSelector
              activeSector={activeSectorKey}
              onSelectSector={handleSelectSector}
            />

            {/* Time Scrubber Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs font-mono text-slate-500 dark:text-[#8A8F98]">
                Historical Horizon:{" "}
                <span className="font-bold text-slate-800 dark:text-[#EDEDED]">
                  {timeRange === "ALL"
                    ? "6 Fiscal Years (FY21-FY26)"
                    : timeRange === "5Y"
                    ? "5 Fiscal Years (FY22-FY26)"
                    : "3 Fiscal Years (FY24-FY26)"}
                </span>
              </div>
              <div className="flex justify-end">
                <TimeRangeFilter
                  selectedRange={timeRange}
                  onRangeChange={(range) => setTimeRange(range)}
                />
              </div>
            </div>

            {isSwitching ? (
              <JanManchSkeleton />
            ) : (
              <>
                {/* Multi-Year Dual-Column Visualizer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left Column: Financial Delivery */}
                  <div className="space-y-4">
                    <MetricCard
                      label={`${currentSectorData.financialMetric?.label || "Financial Outlay"} (FY26)`}
                      value={`₹${finDisbursed.toLocaleString("en-IN")}`}
                      unit="Cr Disbursed"
                      trend={finYoY}
                      rateLabel="Federal-to-State Utilization Rate"
                      rateValue={finUtilizationRate}
                      category="financial"
                    />

                    <ErrorBoundary moduleName="Financial Delivery Chart">
                      <ComposedDeliveryChart
                        timeline={filteredFinTimeline}
                        metricLabel={currentSectorData.financialMetric?.label || "Financial Allocation & Disbursement"}
                        unit={currentSectorData.financialMetric?.unit || "₹ Cr"}
                      />
                    </ErrorBoundary>
                  </div>

                  {/* Right Column: Physical Ground Delivery */}
                  <div className="space-y-4">
                    <MetricCard
                      label={`${currentSectorData.physicalMetric?.label || "Ground Delivery"} (FY26)`}
                      value={physDelivered.toLocaleString("en-IN")}
                      unit={currentSectorData.physicalMetric?.unit || "Units"}
                      trend={physYoY}
                      rateLabel="Ground Verification Fulfillment"
                      rateValue={physFulfillmentRate}
                      category="physical"
                    />

                    <ErrorBoundary moduleName="Physical Delivery Chart">
                      <FederalAreaTrendChart
                        timeline={filteredPhysTimeline}
                        metricLabel={currentSectorData.physicalMetric?.label || "Physical Ground Delivery"}
                        unit={currentSectorData.physicalMetric?.unit || "Units"}
                      />
                    </ErrorBoundary>
                  </div>
                </div>

                {/* Empirical Variance Telemetry Card */}
                <ErrorBoundary moduleName="Variance Analysis">
                  <VarianceAnalysisCard
                    centralData={currentSectorData.central}
                    stateData={currentSectorData.stateData}
                    sectorTitle={currentSectorData.title}
                  />
                </ErrorBoundary>
              </>
            )}

            {/* Governance Audit Feed & Transparency Updates */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED] font-mono">
                  Public Audit &amp; Policy Telemetry Feed
                </h2>
                <span className="text-xs font-mono text-slate-400 dark:text-[#8A8F98]">
                  {currentSectorData.title}
                </span>
              </div>

              <div className="space-y-3.5">
                {(currentSectorData.auditFeed || currentSectorData.updates)?.map((upd, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0F1115] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-white/20 font-mono"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            upd.type === "Policy Change"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : upd.type === "Budget Allocation"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {upd.type}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#EDEDED]">
                          {upd.title}
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-[#8A8F98]/70 font-mono">
                        {upd.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#8A8F98] leading-relaxed font-sans">
                      {upd.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Non-Telangana State Guidance Notice */
          <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED]">
                  State Scheme Telemetry Pilot Scope
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-1 font-sans leading-relaxed max-w-2xl">
                  Granular central scheme audit telemetry (financial allocation, disbursement variance, and ground physical verification) is active for the <strong className="text-slate-900 dark:text-white">Telangana Pilot</strong> across 8 state sectors. Select Telangana to audit central vs state disbursements, or explore the All-India Rankings table above.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStateId("telangana")}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold shadow-xs hover:bg-slate-800 transition-all cursor-pointer shrink-0 font-mono"
            >
              Audit Telangana Pilot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
