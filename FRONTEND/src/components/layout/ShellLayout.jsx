import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { useUI } from "../../context/UIContext";

/**
 * ShellLayout: Dedicated wrapper for pipeline modules (Shiksha, Rozgar, Kisan, Nagar).
 * Locked Viewport App Shell with isolated scrolling main canvas.
 */
export default function ShellLayout() {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [drawerData, setDrawerData] = useState(null);
  const { registerModalOpen, registerModalClose } = useUI();

  const isDrawerOpen = !!selectedScheme;

  // Manage drawer Esc key and UIContext modal tracking
  useEffect(() => {
    if (isDrawerOpen) {
      registerModalOpen();
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setSelectedScheme(null);
          setDrawerData(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown, true);
      return () => {
        window.removeEventListener("keydown", handleKeyDown, true);
        registerModalClose();
      };
    }
  }, [isDrawerOpen, registerModalOpen, registerModalClose]);

  const handleOpenDrawer = (scheme, moduleDrawerContent) => {
    setSelectedScheme(scheme);
    setDrawerData(moduleDrawerContent);
  };

  const handleCloseDrawer = () => {
    setSelectedScheme(null);
    setDrawerData(null);
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col overflow-hidden bg-slate-100 dark:bg-[#08090A] text-slate-900 dark:text-[#EDEDED] transition-colors duration-300 ease-in-out">
      <TopNav isPublic={false} />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet context={{ onOpenDrawer: handleOpenDrawer }} />
        </div>
      </main>

      {/* Read-Only Schema Target Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in"
          onClick={handleCloseDrawer}
          data-modal-open="true"
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0F1115] h-full shadow-2xl border-l border-slate-200 dark:border-white/[0.08] p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Top / Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      Read-Only Sandbox
                    </span>
                    <span className="text-xs text-slate-400 dark:text-[#8A8F98]">Target Schema</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#EDEDED] mt-1">
                    {selectedScheme?.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
                    {selectedScheme?.description}
                  </p>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED]"
                >
                  ✕
                </button>
              </div>

              {/* Department & Federated Architecture */}
              {drawerData?.department && (
                <div className="bg-slate-50 dark:bg-[#16191F] p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8A8F98]">
                    Nodal Department
                  </span>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#EDEDED]">
                    {drawerData.department}
                  </div>
                </div>
              )}

              {/* Gateway Roadmap */}
              {drawerData?.roadmap && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8A8F98]">
                    Gateway Federation Roadmap
                  </span>
                  <div className="text-xs text-slate-600 dark:text-[#EDEDED] bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 leading-relaxed">
                    {drawerData.roadmap}
                  </div>
                </div>
              )}

              {/* Document Prerequisites */}
              {drawerData?.prerequisites && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#8A8F98]">
                    Required Document Prerequisites
                  </span>
                  <ul className="space-y-2">
                    {drawerData.prerequisites.map((prereq, idx) => (
                      <li
                        key={idx}
                        className="flex items-center space-x-2 text-xs text-slate-700 dark:text-[#EDEDED] bg-white dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.08] p-2.5 rounded-lg shadow-2xs"
                      >
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Notice */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] text-[11px] text-slate-500 dark:text-[#8A8F98] text-center">
              Schema Target Sandbox preview for Digital India 2.0 evaluation. Integration locked for Phase 2+.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
