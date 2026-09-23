import React, { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Info, CheckCircle2 } from "lucide-react";
import { ALL_PROCESSED_STATES } from "../utils/allStatesRankingsEngine";

const REGIONS = ["All", "South", "North", "North-East", "East", "West", "Central"];

/**
 * All-India 28-State Leaderboard Table:
 * Interactive multi-column table with search, regional filters, dynamic sorting,
 * micro progress bars, and institutional citations.
 */
export default function AllStatesRankingsTable({ selectedStateId, onSelectState }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");

  // Region counts
  const regionCounts = useMemo(() => {
    const counts = { All: ALL_PROCESSED_STATES.length };
    ALL_PROCESSED_STATES.forEach((s) => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });
    return counts;
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // Default to descending for values, ascending for rank & name
      setSortDirection(field === "rank" || field === "name" ? "asc" : "desc");
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedStates = useMemo(() => {
    let list = ALL_PROCESSED_STATES.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesRegion = selectedRegion === "All" || s.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [searchQuery, selectedRegion, sortField, sortDirection]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="opacity-40 ml-1 inline-block" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={12} className="text-emerald-600 dark:text-emerald-400 ml-1 inline-block" />
    ) : (
      <ArrowDown size={12} className="text-emerald-600 dark:text-emerald-400 ml-1 inline-block" />
    );
  };

  return (
    <div className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-sm p-5 space-y-4 font-mono transition-all">
      {/* Table Header & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.04]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              NATIONAL BENCHMARK
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] uppercase tracking-wide">
              ALL-INDIA 28-STATE GOVERNANCE LEADERBOARD
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-1 font-sans">
            Comparative performance across NITI Aayog SDG Index, RBI Per Capita NSDP, and Social Baselines.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by state name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.08] rounded-lg text-slate-900 dark:text-[#EDEDED] placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-sans"
          />
        </div>
      </div>

      {/* Regional Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {REGIONS.map((region) => {
          const count = regionCounts[region] || 0;
          const isActive = selectedRegion === region;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-neutral-900 font-bold border-transparent shadow-xs"
                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-[#8A8F98] border-slate-200/60 dark:border-white/[0.06] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {region} <span className="opacity-60 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Responsive Table */}
      <div className="overflow-x-auto custom-scrollbar border border-slate-100 dark:border-white/[0.06] rounded-xl">
        <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-white/[0.06]">
          <thead className="bg-slate-50 dark:bg-[#16191F] text-slate-500 dark:text-[#8A8F98] select-none text-[11px] uppercase tracking-wider font-semibold">
            <tr>
              <th
                scope="col"
                className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("rank")}
              >
                <div className="flex items-center">
                  <span>Rank</span>
                  {renderSortIcon("rank")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  <span>State / UT</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("sdgScore")}
              >
                <div className="flex items-center">
                  <span>NITI SDG Index</span>
                  {renderSortIcon("sdgScore")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("latestNsdp")}
              >
                <div className="flex items-center">
                  <span>Per Capita NSDP</span>
                  {renderSortIcon("latestNsdp")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("incomeGrowth")}
              >
                <div className="flex items-center">
                  <span>5Y Growth</span>
                  {renderSortIcon("incomeGrowth")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("censusLiteracy")}
              >
                <div className="flex items-center">
                  <span>Literacy</span>
                  {renderSortIcon("censusLiteracy")}
                </div>
              </th>
              <th
                scope="col"
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={() => handleSort("crimeRate")}
              >
                <div className="flex items-center">
                  <span>Crime Rate</span>
                  <span
                    title="NCRB measures registered FIRs per 1L population. Higher rates in states like Kerala reflect reporting propensity rather than higher underlying violence."
                    className="cursor-help"
                  >
                    <Info size={11} className="ml-1 text-slate-400" />
                  </span>
                  {renderSortIcon("crimeRate")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] bg-white dark:bg-[#0F1115]">
            {filteredAndSortedStates.map((state) => {
              const isSelected = selectedStateId === state.id;
              const isTop3 = state.rank <= 3;

              return (
                <tr
                  key={state.id}
                  onClick={() => onSelectState && onSelectState(state)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50/70 dark:bg-blue-950/25 border-l-4 border-l-blue-600 dark:border-l-blue-500"
                      : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-md text-[11px] border ${
                        isTop3
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                          : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-400 border-slate-200/60 dark:border-white/[0.06]"
                      }`}
                    >
                      #{state.rank}
                    </span>
                  </td>

                  {/* State Name & Region */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="font-bold text-slate-900 dark:text-[#EDEDED] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {state.name}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] bg-slate-100 dark:bg-white/[0.04] px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-white/[0.06]">
                        {state.region}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400 ml-1 shrink-0" />
                      )}
                    </div>
                  </td>

                  {/* NITI SDG Index + Micro Progress Bar */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 font-extrabold text-slate-900 dark:text-[#EDEDED] text-sm tabular-nums">
                        {state.sdgScore}
                      </div>
                      <div className="w-16 bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${state.sdgScore}%`,
                            backgroundColor: state.tierColor
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Per Capita NSDP */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-extrabold text-slate-900 dark:text-[#EDEDED] tabular-nums">
                      ₹{state.latestNsdp.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]">
                      {state.latestNsdpYear} Current Prices
                    </div>
                  </td>

                  {/* 5Y Growth */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono">
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                      ↑ +{state.incomeGrowth}%
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]">
                      {state.growthYears}
                    </div>
                  </td>

                  {/* Literacy Rate */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-[#EDEDED] tabular-nums">
                      {state.censusLiteracy}%
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]">
                      Census 2011
                    </div>
                  </td>

                  {/* Crime Rate */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-[#EDEDED] tabular-nums">
                      {state.crimeRate}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]">
                      per 1L (NCRB 2022)
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Institutional Citation Footnote */}
      <div className="pt-2 text-[11px] text-slate-400 dark:text-[#8A8F98]/80 leading-relaxed border-t border-slate-100 dark:border-white/[0.04]">
        <span className="font-semibold text-slate-500 dark:text-[#8A8F98]">Institutional Citation: </span>
        Indicators compiled from official Union Government publications: NITI Aayog SDG India Index (2023–24), RBI Handbook of Statistics Table 9 / MoSPI Per Capita NSDP at Current Prices (FY20–FY24), NCRB Crime in India (2022), and Office of the Registrar General Census of India (2011 baseline; Telangana backward-aggregated by State Planning Board).
      </div>
    </div>
  );
}
