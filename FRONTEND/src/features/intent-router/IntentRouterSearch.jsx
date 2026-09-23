import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import useIntentRouter from "./hooks/useIntentRouter";
import IntentResultsDropdown from "./IntentResultsDropdown";

export default function IntentRouterSearch() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    query,
    setQuery,
    clearQuery,
    status,
    route,
    matchedKeyword,
    moduleName,
    categories
  } = useIntentRouter();

  const isDropdownOpen = isFocused && query.trim().length > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // High-confidence match navigates on explicit Enter
      if (status === "routed" && route) {
        navigate(route);
        clearQuery();
        setIsFocused(false);
      }
      // Zero-match (candidates) does NOT navigate on Enter per specification & Addendum 6a
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      clearQuery();
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    clearQuery();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full z-30"
      onBlur={(e) => {
        // If focus leaves the entire container (including dropdown), close dropdown
        if (!containerRef.current?.contains(e.relatedTarget)) {
          // Allow small delay for click events inside dropdown to register
          setTimeout(() => setIsFocused(false), 150);
        }
      }}
    >
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400 dark:text-slate-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type what you need — I'll take you there"
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#0F1115] text-slate-900 dark:text-[#EDEDED] placeholder-slate-400 dark:placeholder-[#8A8F98] text-sm font-medium border border-slate-200 dark:border-white/[0.08] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown Overlay */}
      <IntentResultsDropdown
        isOpen={isDropdownOpen}
        status={status}
        route={route}
        matchedKeyword={matchedKeyword}
        moduleName={moduleName}
        categories={categories}
        onClose={() => setIsFocused(false)}
        onSelect={() => {
          clearQuery();
          setIsFocused(false);
        }}
      />
    </div>
  );
}
