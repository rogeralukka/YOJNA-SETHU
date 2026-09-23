import React from "react";
import { Network, Crown, User } from "lucide-react";
import { useHousehold } from "../../context/HouseholdContext";

export default function FamilyTree() {
  const { household } = useHousehold();

  const members = household?.members || [];
  const head = members.find((m) => m.relation === "Head") || members[0];
  const dependents = members.filter((m) => m.memberId !== head?.memberId);

  return (
    <div className="bg-white dark:bg-[#0F1115] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.08] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#EDEDED]">
              Family Tree & Relationship Graph
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A8F98]">
              Hierarchical entitlement dependency and guardian linkage
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-600 dark:text-[#8A8F98] bg-slate-100 dark:bg-[#16191F] px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.08] self-start sm:self-auto">
          Household ID: <span className="font-mono font-bold text-slate-900 dark:text-[#EDEDED]">{household?.householdId}</span>
        </span>
      </div>

      {/* Dual Layout Tree */}
      <div className="space-y-6 py-2">
        {/* Head of Household Card */}
        <div className="flex justify-center">
          {head && (
            <div className="w-full max-w-md p-5 rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#16191F] shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                {head.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] truncate">
                    {head.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded shrink-0">
                    HEAD OF HOUSEHOLD
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
                  Age {head.age} • {head.gender || "Male"}
                </div>
                <div className="text-[11px] font-mono text-slate-400 dark:text-[#8A8F98]/70 mt-0.5">
                  Aadhaar: {head.maskedAadhaar}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dependents Grid */}
        {dependents.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8A8F98] flex items-center space-x-2">
              <span>Dependents & Household Members</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#16191F] text-slate-600 dark:text-[#8A8F98] border border-slate-200 dark:border-white/[0.08]">
                {dependents.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dependents.map((dep) => (
                <div
                  key={dep.memberId}
                  className="h-full p-4 rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#16191F] shadow-xs flex flex-col justify-between space-y-2 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {dep.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-[#EDEDED] truncate">
                        {dep.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8A8F98]">
                        {dep.relation} • Age {dep.age}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 dark:text-[#8A8F98]/70 font-mono">
                    <span>Aadhaar:</span>
                    <span>{dep.maskedAadhaar}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-[#8A8F98]/70 italic pt-2">
        Guardian linking for adopted or dependent family members supported under Digital Public Infrastructure (DPI) federated schema.
      </p>
    </div>
  );
}
