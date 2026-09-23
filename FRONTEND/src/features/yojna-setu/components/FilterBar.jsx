import React from 'react';
import { Search } from 'lucide-react';
import { ProfileContextDropdown } from './ProfileContextDropdown';

export const SCHEME_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All Schemes' },
  { value: 'CENTRAL', label: 'Central Schemes' },
  { value: 'STATE', label: 'State Schemes' }
];

export const LIFE_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Life Statuses' },
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'senior_citizen', label: 'Senior Citizen' },
  { value: 'self_employed', label: 'Self Employed' }
];

export const SECTOR_OPTIONS = [
  { value: 'ALL', label: 'All Sectors' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Education', label: 'Education' },
  { value: 'Health', label: 'Health' },
  { value: 'Manufacturing & MSME', label: 'Manufacturing & MSME' },
  { value: 'Social Welfare', label: 'Social Welfare' }
];

export const MATCH_OPTIONS = [
  { value: 'ALL', label: 'All Match Levels' },
  { value: 'HIGH_MATCH', label: 'High Match' },
  { value: 'CRITERIA_CHECK', label: 'Criteria Check' }
];

export const SORT_OPTIONS = [
  { value: 'RECOMMENDED', label: 'Sort: Recommended' },
  { value: 'DEADLINE', label: 'Sort: Deadline (Earliest)' },
  { value: 'BENEFIT', label: 'Sort: Benefit Value' }
];

/**
 * FilterBar:
 * Comprehensive filter matrix supporting dual profile context selection,
 * search input with Lucide iconography, and fine-grained taxonomy filters.
 */
export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedSchemeType = 'ALL',
  onSelectSchemeType = () => {},
  selectedLifeStatus = 'ALL',
  onSelectLifeStatus = () => {},
  selectedSector = 'ALL',
  onSelectSector = () => {},
  selectedMatch = 'ALL',
  onSelectMatch = () => {},
  selectedSort = 'RECOMMENDED',
  onSelectSort = () => {}
}) {
  return (
    <div className="flex flex-col gap-3 mb-6 p-3 sm:p-4 rounded-2xl bg-neutral-100/90 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
      {/* Top Row: Profile Switcher + Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Profile Context Switcher */}
        <ProfileContextDropdown />

        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search schemes by name, keyword..."
            className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-[#EDEDED] placeholder-neutral-500 dark:placeholder-[#8A8F98] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-xs"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8A8F98] pointer-events-none" />
        </div>
      </div>

      {/* Bottom Row: Multi-Dropdown Filter Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1 border-t border-neutral-200/60 dark:border-white/[0.06]">
        {/* Scheme Type */}
        <select
          value={selectedSchemeType}
          onChange={(e) => onSelectSchemeType(e.target.value)}
          className="h-9 px-2.5 text-xs rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate shadow-xs"
        >
          {SCHEME_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Life Status / Category */}
        <select
          value={selectedLifeStatus}
          onChange={(e) => onSelectLifeStatus(e.target.value)}
          className="h-9 px-2.5 text-xs rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate shadow-xs"
        >
          {LIFE_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sectors */}
        <select
          value={selectedSector}
          onChange={(e) => onSelectSector(e.target.value)}
          className="h-9 px-2.5 text-xs rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate shadow-xs"
        >
          {SECTOR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Match Levels */}
        <select
          value={selectedMatch}
          onChange={(e) => onSelectMatch(e.target.value)}
          className="h-9 px-2.5 text-xs rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate shadow-xs"
        >
          {MATCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="col-span-2 sm:col-span-1 h-9 px-2.5 text-xs rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate shadow-xs"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0F1115] text-neutral-900 dark:text-[#EDEDED]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
