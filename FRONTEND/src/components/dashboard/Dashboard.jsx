import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { SchemeCard } from './SchemeCard';
import { MultiSelectBar } from './MultiSelectBar';
import { isSchemeGeographicallyEligible } from '../../data/states';
import { LIFE_STATUSES, SECTORS, getLifeStatusLabel, getOccupationLabel, getSectorLabel } from '../../data/taxonomy';

export const Dashboard = () => {
  const {
    schemes,
    businesses,
    activeContext,
    setActiveContext,
    profileCompletion,
    navigateTo,
    userProfile,
    evaluateScheme
  } = useData();
  const { user } = useAuth();
  const { t } = useLang();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [govLevelFilter, setGovLevelFilter] = useState('all'); // 'all', 'central', 'state'
  const [lifeStatusFilter, setLifeStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [matchFilter, setMatchFilter] = useState('all'); // 'all', 'high_match', 'eligible'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'latest', 'deadline'
  const [selectedSchemeIds, setSelectedSchemeIds] = useState([]);
  const [contextDropdownOpen, setContextDropdownOpen] = useState(false);

  // Active User State
  const userState = userProfile?.state || user?.state || 'Uttar Pradesh';

  // Active Context Label
  const activeBusiness = businesses.find((b) => b.id === activeContext);
  const contextLabel = activeContext === 'personal' ? t('personalContextTitle', { name: user.name.split(' ')[0] }) : activeBusiness?.businessName || t('business');

  // Evaluated Schemes with server-authoritative engine
  const evaluatedSchemes = useMemo(() => {
    return schemes.map((s) => ({
      ...s,
      evaluation: evaluateScheme(s)
    }));
  }, [schemes, userProfile]);

  // Filter schemes based on active context, geographic eligibility, filters, and intelligence
  const filteredSchemes = useMemo(() => {
    return evaluatedSchemes.filter((scheme) => {
      // 1. Context Filter
      if (activeContext === 'personal') {
        if (scheme.isBusinessScheme) return false;
      } else {
        if (!scheme.isBusinessScheme) return false;
      }

      // 2. Geographic State Eligibility (Central + user's state only)
      if (!isSchemeGeographicallyEligible(scheme, userState)) {
        return false;
      }

      // 3. Government Level Filter (Browsing filter)
      if (govLevelFilter === 'central') {
        if (scheme.governmentLevel !== 'central') return false;
      } else if (govLevelFilter === 'state') {
        if (scheme.governmentLevel !== 'state') return false;
      }

      // 4. Life Status Filter
      if (lifeStatusFilter !== 'all') {
        const eligibleStatuses = scheme.eligibleLifeStatuses || ['ALL'];
        if (!eligibleStatuses.includes('ALL') && !eligibleStatuses.includes(lifeStatusFilter)) {
          return false;
        }
      }

      // 5. Sector Filter
      if (sectorFilter !== 'all') {
        const eligibleSectors = scheme.eligibleSectors || ['ALL'];
        if (!eligibleSectors.includes('ALL') && !eligibleSectors.includes(sectorFilter)) {
          return false;
        }
      }

      // 6. Match Status Filter
      if (matchFilter === 'high_match') {
        if (scheme.evaluation.status !== 'HIGH_MATCH') return false;
      } else if (matchFilter === 'eligible') {
        if (!['HIGH_MATCH', 'POTENTIAL_MATCH'].includes(scheme.evaluation.status)) return false;
      }

      // 7. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchDept = scheme.department.toLowerCase().includes(q);
        const matchCat = scheme.category.toLowerCase().includes(q);
        const matchDesc = scheme.description.toLowerCase().includes(q);
        const matchGov = scheme.governmentLevel ? (scheme.governmentLevel.toLowerCase().includes(q) || (scheme.governmentLevel === 'central' ? 'central' : 'state').includes(q)) : false;
        const matchStates = scheme.applicableStates ? scheme.applicableStates.some(s => s.toLowerCase().includes(q)) : false;
        const matchOcc = scheme.eligibleOccupations ? scheme.eligibleOccupations.some(o => getOccupationLabel(o).toLowerCase().includes(q)) : false;
        const matchSec = scheme.eligibleSectors ? scheme.eligibleSectors.some(s => getSectorLabel(s).toLowerCase().includes(q)) : false;

        if (!matchName && !matchDept && !matchCat && !matchDesc && !matchGov && !matchStates && !matchOcc && !matchSec) {
          return false;
        }
      }

      // 8. Category Filter
      if (selectedCategory !== 'all') {
        if (scheme.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'relevance') {
        const statusWeight = {
          HIGH_MATCH: 400,
          POTENTIAL_MATCH: 300,
          NEEDS_INFO: 200,
          NOT_ELIGIBLE: 0
        };
        const weightA = (statusWeight[a.evaluation.status] || 0) + a.evaluation.matchScore;
        const weightB = (statusWeight[b.evaluation.status] || 0) + b.evaluation.matchScore;
        return weightB - weightA;
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      // latest (isNew first, then active)
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [evaluatedSchemes, activeContext, userState, govLevelFilter, lifeStatusFilter, sectorFilter, matchFilter, searchQuery, selectedCategory, sortBy]);

  // Categories list derived from current context
  const categories = useMemo(() => {
    const list = new Set();
    schemes.forEach((s) => {
      if (activeContext === 'personal' && !s.isBusinessScheme) {
        list.add(s.category);
      } else if (activeContext !== 'personal' && s.isBusinessScheme) {
        list.add(s.category);
      }
    });
    return Array.from(list);
  }, [schemes, activeContext]);

  // Count high matches for banner
  const highMatchCount = useMemo(() => {
    return filteredSchemes.filter(s => s.evaluation.status === 'HIGH_MATCH').length;
  }, [filteredSchemes]);

  // Multi-select toggle
  const handleToggleSelect = (id) => {
    setSelectedSchemeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplySelected = () => {
    const selectedList = schemes.filter((s) => selectedSchemeIds.includes(s.id));
    if (selectedList.length > 0) {
      navigateTo('application-form', selectedList);
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-24">
      {/* Top Action Bar: Context Selector, Search & Filters */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 z-30 border-b border-outline-variant/20 dark:border-slate-800">
        {/* Context Selector */}
        <div className="relative">
          <div
            onClick={() => setContextDropdownOpen(!contextDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer text-on-surface dark:text-white border border-outline-variant/30 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-[20px] text-primary dark:text-primary-fixed">
              {activeContext === 'personal' ? 'account_circle' : 'storefront'}
            </span>
            <span className="font-label-bold text-xs sm:text-sm font-semibold">
              {contextLabel}
            </span>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant dark:text-slate-400">
              arrow_drop_down
            </span>
          </div>

          {/* Context Dropdown */}
          {contextDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-slate-700 py-2 z-40 animate-fade-in-up">
              <div className="px-4 py-1.5 text-[11px] font-label-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                {t('switchProfileContext')}
              </div>

              {/* Personal Context */}
              <button
                onClick={() => {
                  setActiveContext('personal');
                  setSelectedSchemeIds([]);
                  setContextDropdownOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors ${
                  activeContext === 'personal'
                    ? 'text-primary dark:text-primary-fixed bg-primary/5 dark:bg-primary/10'
                    : 'text-on-surface dark:text-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>{t('youContext', { name: user.name })}</span>
              </button>

              {/* Registered Businesses */}
              {businesses.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => {
                    setActiveContext(biz.id);
                    setSelectedSchemeIds([]);
                    setContextDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors ${
                    activeContext === biz.id
                      ? 'text-primary dark:text-primary-fixed bg-primary/5 dark:bg-primary/10'
                      : 'text-on-surface dark:text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span className="truncate">{biz.businessName}</span>
                </button>
              ))}

              <div className="border-t border-outline-variant/20 dark:border-slate-700 my-1"></div>

              {/* Add Business Action */}
              <button
                onClick={() => {
                  setContextDropdownOpen(false);
                  navigateTo('my-business');
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-3 text-xs font-bold text-primary dark:text-primary-fixed hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add_business</span>
                <span>{t('addBusiness')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-time Search Input */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline dark:text-slate-400 text-[20px]">
              search
            </span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low dark:bg-slate-800 text-on-surface dark:text-white font-body-md text-sm py-2.5 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/60 dark:placeholder:text-slate-400"
            placeholder="Search schemes by name, ministry, occupation, sector, or state..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">clear</span>
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Government Level Selector */}
          <div className="relative">
            <select
              value={govLevelFilter}
              onChange={(e) => setGovLevelFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-white font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 transition-colors"
              aria-label="Government Level"
            >
              <option value="all">{t('allSchemes', {}, 'All Schemes')}</option>
              <option value="central">{t('centralGov', {}, 'Central Government')}</option>
              <option value="state">{t('myStateGov', { state: userState }, `${userState} Government`)}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Life Status Filter */}
          <div className="relative">
            <select
              value={lifeStatusFilter}
              onChange={(e) => setLifeStatusFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-white font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 transition-colors"
            >
              <option value="all">All Life Statuses</option>
              {LIFE_STATUSES.map((ls) => (
                <option key={ls.id} value={ls.id}>
                  {ls.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-white font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 transition-colors"
            >
              <option value="all">All Sectors</option>
              {SECTORS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Match Filter */}
          <div className="relative">
            <select
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-white font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 transition-colors"
            >
              <option value="all">All Match Levels</option>
              <option value="high_match">High Match Only</option>
              <option value="eligible">Eligible Only</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-white font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 transition-colors"
            >
              <option value="relevance">Sort: Recommended</option>
              <option value="latest">{t('latest')}</option>
              <option value="deadline">{t('deadline')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant dark:text-slate-400 pointer-events-none">
              sort
            </span>
          </div>
        </div>
      </div>

      {/* Hero / Greeting Section */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop pt-8 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-container/20 via-tertiary-container/10 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full mb-4 shadow-sm text-xs font-bold">
              <span className="material-symbols-outlined text-[16px] text-tertiary">celebration</span>
              <span className="tracking-wider uppercase">{t('eligibleSchemesDiscovered')}</span>
            </div>

            <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-on-surface dark:text-white mb-3 font-bold">
              {t('helloUser')}, {activeContext === 'personal' ? user.name.split(' ')[0] : activeBusiness?.businessName}!
              <br />
              <span className="text-primary dark:text-primary-fixed opacity-95">
                {t('eligibleSchemesCount', { count: filteredSchemes.length })}
              </span>
            </h1>

            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant dark:text-slate-300 max-w-2xl">
              {activeContext === 'personal'
                ? t('personalDashboardDesc')
                : t('businessDashboardDesc', { businessName: activeBusiness?.businessName || t('yourEnterprise') })}
            </p>

            {/* Personalized Intelligence Profile Banner */}
            {activeContext === 'personal' && (
              <div className="mt-4 inline-flex flex-wrap items-center gap-2 p-3 bg-surface-container-lowest/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-outline-variant/30 text-xs text-on-surface dark:text-slate-200">
                <span className="font-bold flex items-center gap-1 text-primary dark:text-primary-fixed">
                  <span className="material-symbols-outlined text-[16px]">tune</span> Your Profile Context:
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-slate-700 font-semibold">
                  {getLifeStatusLabel(userProfile.life_status)}
                </span>
                {userProfile.occupation && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-slate-700 font-semibold">
                    {getOccupationLabel(userProfile.occupation)}
                  </span>
                )}
                {userProfile.sector && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-slate-700 font-semibold">
                    {getSectorLabel(userProfile.sector)}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-slate-700 font-semibold">
                  {userProfile.state}
                </span>
                <button
                  onClick={() => navigateTo('profile')}
                  className="text-primary dark:text-primary-fixed font-bold hover:underline ml-1"
                >
                  Update Profile →
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Widget */}
          <div className="w-full lg:w-80 bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-2xl border border-outline-variant/30 dark:border-slate-700 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                Recommendation Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Server Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block">
                  {highMatchCount}
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-slate-400 font-medium">
                  High Matches
                </span>
              </div>
              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-2xl font-bold text-primary dark:text-primary-fixed block">
                  {filteredSchemes.length}
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-slate-400 font-medium">
                  Available in {userState}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop">
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isSelected={selectedSchemeIds.includes(scheme.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest dark:bg-slate-800 rounded-3xl border border-outline-variant/30 dark:border-slate-700 p-8 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-[48px] text-outline-variant dark:text-slate-600 mb-3 block">
              filter_alt_off
            </span>
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-1">
              No matching schemes found
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
              Try adjusting your search criteria or resetting some of the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setGovLevelFilter('all');
                setLifeStatusFilter('all');
                setSectorFilter('all');
                setMatchFilter('all');
              }}
              className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-container transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Multi-Select Action Bar */}
      <MultiSelectBar
        selectedCount={selectedSchemeIds.length}
        onApply={handleApplySelected}
        onClear={() => setSelectedSchemeIds([])}
      />
    </div>
  );
};
