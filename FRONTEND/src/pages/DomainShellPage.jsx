import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { Search, ArrowRight, Check } from "lucide-react";
import domainShellsData from "../data/seed/domainShells.json";

/**
 * DomainShellPage: Unified page renderer for Phase 2 pipeline modules
 * (/shiksha-setu, /rozgar-setu, /kisan-setu, /nagar-setu).
 * Features:
 *   • Title & Tagline from domainShells.json
 *   • "Phase 2 Pipeline" status badge
 *   • Upcoming Schemes Grid (clicking card triggers Read-Only Schema Target Drawer)
 *   • "What this module will do" section
 *   • Minimalist Lucide SVG icons (ZERO raw emojis)
 *   • NO "Notify Me" buttons anywhere per strict rule
 */
export default function DomainShellPage() {
  const location = useLocation();
  const { onOpenDrawer } = useOutletContext() || {};

  // Extract slug from pathname, e.g. "/shiksha-setu" -> "shiksha-setu"
  const slug = location.pathname.replace(/^\//, "").split("/")[0];
  const shellData = domainShellsData[slug] || domainShellsData["shiksha-setu"];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Module Pipeline Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm border border-slate-700/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase text-blue-200">
            <span>{shellData.sector}</span>
          </div>

          {/* Pipeline Badge */}
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {shellData.status}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {shellData.title}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {shellData.tagline}
          </p>
        </div>
      </div>

      {/* Upcoming Schemes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 dark:text-[#EDEDED]">
              Upcoming Schemes & Services
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
              Click any card to inspect the Read-Only Schema Target Drawer and gateway requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shellData.upcomingSchemes.map((scheme) => (
            <div
              key={scheme.id}
              onClick={() => onOpenDrawer && onOpenDrawer(scheme, shellData.drawerContent)}
              className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1115] hover:border-blue-400 dark:hover:border-white/20 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    Target Scheme
                  </span>
                  <span className="text-xs text-slate-400 dark:text-[#8A8F98] group-hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                    <Search size={12} />
                    <span>Inspect</span>
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#EDEDED] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {scheme.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-[#8A8F98] leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                <span>View Schema Prerequisites</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What This Module Will Do Section */}
      <div className="bg-white dark:bg-[#0F1115] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-[#EDEDED]">
          What This Module Will Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {shellData.whatThisModuleWillDo.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-100 dark:border-white/[0.08] text-xs text-slate-700 dark:text-[#EDEDED]"
            >
              <Check size={14} className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
