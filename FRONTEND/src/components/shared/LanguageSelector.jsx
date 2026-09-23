import React, { useState, useRef, useEffect, useMemo } from "react";
import { Globe, ChevronDown, Search, Check, X, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang, isRollout, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Reset search query when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) =>
        l.nativeName.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [languages, searchQuery]);

  const activeLangObj = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Compact Pill Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1115] text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#16191F] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        title={`Language: ${activeLangObj.nativeName} (${activeLangObj.name})`}
      >
        <Globe size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="uppercase tracking-wider">{activeLangObj.code}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 dark:text-[#8A8F98] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0F1115] shadow-xl border border-slate-200 dark:border-white/[0.08] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-white/[0.08]">
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-slate-400 dark:text-[#8A8F98] pointer-events-none"
              />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-[#16191F] rounded-xl text-xs text-slate-900 dark:text-[#EDEDED] placeholder:text-slate-400 dark:placeholder:text-[#8A8F98] focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 dark:border-white/10 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] rounded cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Clean Scrollable Language List */}
          <div className="max-h-64 overflow-y-auto p-2 space-y-1 divide-y-0 [scrollbar-width:thin]">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-[#8A8F98]">
                No language found
              </div>
            ) : (
              filteredLanguages.map((item) => {
                const isSelected = item.code === lang;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLang(item.code);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60"
                        : "hover:bg-slate-100 dark:hover:bg-[#16191F] text-slate-700 dark:text-[#EDEDED] border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-[#EDEDED] leading-tight">
                        {item.nativeName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-[#8A8F98] font-normal">
                        {item.name}
                      </span>
                    </div>

                    {isSelected && (
                      <Check
                        size={16}
                        className="text-blue-600 dark:text-blue-400 shrink-0 ml-2"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Rollout Note */}
          {isRollout && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border-t border-slate-100 dark:border-white/[0.08] text-[11px] text-amber-800 dark:text-amber-300 flex items-center space-x-2">
              <AlertTriangle size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Hub language pack in rollout</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
