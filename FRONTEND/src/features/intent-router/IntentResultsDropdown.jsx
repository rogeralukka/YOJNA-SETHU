import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Compass, AlertCircle } from "lucide-react";
import { useUI } from "../../context/UIContext";

export default function IntentResultsDropdown({
  isOpen,
  status,
  route,
  matchedKeyword,
  moduleName,
  categories,
  onClose,
  onSelect
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { registerModalOpen, registerModalClose } = useUI();

  // Esc Key Ownership & UIContext Modal registration (Addendum 1)
  useEffect(() => {
    if (isOpen) {
      registerModalOpen();
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown, true);
      return () => {
        window.removeEventListener("keydown", handleKeyDown, true);
        registerModalClose();
      };
    }
  }, [isOpen, onClose, registerModalOpen, registerModalClose]);

  if (!isOpen || status === "idle") {
    return null;
  }

  const handleNavigate = (targetRoute) => {
    if (!targetRoute) return;
    if (onSelect) onSelect(targetRoute);
    onClose();
    navigate(targetRoute);
  };

  return (
    <div
      ref={dropdownRef}
      data-modal-open="true"
      className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#0F1115] rounded-2xl shadow-xl border border-slate-200 dark:border-white/[0.08] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* 1. HIGH-CONFIDENCE MATCH */}
      {status === "routed" && route && (
        <div className="p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8A8F98] px-3 pt-1 pb-2">
            Recommended Service Gateway
          </div>
          <button
            type="button"
            onClick={() => handleNavigate(route)}
            className="w-full text-left p-3.5 rounded-xl bg-blue-50/80 dark:bg-[#16191F] hover:bg-blue-100 dark:hover:bg-[#1D212A] border border-blue-200/80 dark:border-white/[0.08] flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-[#EDEDED] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {moduleName || route}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8A8F98] truncate">
                  Matched keyword: <span className="font-semibold text-blue-600 dark:text-blue-400">"{matchedKeyword}"</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
              <span className="hidden sm:inline">Press Enter to Jump</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* 2. ZERO-MATCH / AMBIGUOUS INTENT CANDIDATES */}
      {status === "candidates" && (
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-[#EDEDED]">
            <AlertCircle size={15} className="text-amber-500 shrink-0" />
            {/* Exact String from Specification (Item 2) */}
            <span>No direct intent match. Showing closest categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.route}
                type="button"
                onClick={() => handleNavigate(cat.route)}
                className="text-left p-3 rounded-xl bg-slate-50 dark:bg-[#16191F] hover:bg-blue-50 dark:hover:bg-[#1D212A] hover:border-blue-300 dark:hover:border-blue-700 border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#EDEDED] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </span>
                  <Compass size={13} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1 line-clamp-1">
                  {cat.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
