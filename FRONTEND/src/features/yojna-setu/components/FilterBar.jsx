import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { ProfileContextDropdown } from './ProfileContextDropdown';

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
  const { t } = useTranslation();

  const schemeTypeOptions = useMemo(() => [
    { value: 'ALL', label: t('yojnaSetu.filters.allSchemes') },
    { value: 'CENTRAL', label: t('yojnaSetu.filters.centralSchemes') },
    { value: 'STATE', label: t('yojnaSetu.filters.stateSchemes') }
  ], [t]);

  const lifeStatusOptions = useMemo(() => [
    { value: 'ALL', label: t('yojnaSetu.filters.allLifeStatuses') },
    { value: 'student', label: t('yojnaSetu.filters.student') },
    { value: 'farmer', label: t('yojnaSetu.filters.farmer') },
    { value: 'senior_citizen', label: t('yojnaSetu.filters.seniorCitizen') },
    { value: 'self_employed', label: t('yojnaSetu.filters.selfEmployed') }
  ], [t]);

  const sectorOptions = useMemo(() => [
    { value: 'ALL', label: t('yojnaSetu.filters.allSectors') },
    { value: 'Agriculture', label: t('yojnaSetu.filters.agriculture') },
    { value: 'Education', label: t('yojnaSetu.filters.education') },
    { value: 'Health', label: t('yojnaSetu.filters.health') },
    { value: 'Manufacturing & MSME', label: t('yojnaSetu.filters.manufacturingMsme') },
    { value: 'Social Welfare', label: t('yojnaSetu.filters.socialWelfare') }
  ], [t]);

  const matchOptions = useMemo(() => [
    { value: 'ALL', label: t('yojnaSetu.filters.allMatchLevels') },
    { value: 'HIGH_MATCH', label: t('yojnaSetu.filters.highMatch') },
    { value: 'CRITERIA_CHECK', label: t('yojnaSetu.filters.criteriaCheck') }
  ], [t]);

  const sortOptions = useMemo(() => [
    { value: 'RECOMMENDED', label: t('yojnaSetu.filters.sortRecommended') },
    { value: 'DEADLINE', label: t('yojnaSetu.filters.sortDeadlineEarliest') },
    { value: 'BENEFIT', label: t('yojnaSetu.filters.sortBenefitValue') }
  ], [t]);

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
            placeholder={t('yojnaSetu.filters.searchPlaceholder')}
            className="w-full h-10 pl-9 pr-4 rtl:pl-4 rtl:pr-9 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] text-neutral-900 dark:text-[#EDEDED] placeholder-neutral-500 dark:placeholder-[#8A8F98] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-xs"
          />
          <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8A8F98] pointer-events-none" />
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
          {schemeTypeOptions.map((opt) => (
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
          {lifeStatusOptions.map((opt) => (
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
          {sectorOptions.map((opt) => (
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
          {matchOptions.map((opt) => (
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
          {sortOptions.map((opt) => (
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
