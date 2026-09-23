import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { SchemeCard } from './SchemeCard';
import { MultiSelectBar } from './MultiSelectBar';
import { isSchemeGeographicallyEligible } from '../../data/states';
import { LIFE_STATUSES, SECTORS, getLifeStatusLabel, getOccupationLabel, getSectorLabel } from '../../data/taxonomy';
import Icon from '../../../features/yojna-setu/components/Icon';

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
      <div className="px-4 sm:px-8 lg:px-margin-desktop py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 z-30 border-b border-outline-variant/20 dark:border-white/[0.08]">
        {/* Context Selector */}
        <div className="relative">
          <div
            onClick={() => setContextDropdownOpen(!contextDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low dark:bg-[#16191F] hover:bg-surface-container-high dark:hover:bg-[#1D212A] rounded-full transition-colors cursor-pointer text-on-surface dark:text-[#EDEDED] border border-outline-variant/30 dark:border-white/[0.08]"
          >
            <span className="text-primary dark:text-primary-fixed flex items-center">
              <Icon name={activeContext === 'personal' ? 'account_circle' : 'storefront'} size={20} />
            </span>
            <span className="font-label-bold text-xs sm:text-sm font-semibold">
              {contextLabel}
            </span>
            <span className="text-on-surface-variant dark:text-[#8A8F98] flex items-center">
              <Icon name="arrow_drop_down" size={20} />
            </span>
          </div>

          {/* Context Dropdown */}
          {contextDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest dark:bg-[#0F1115] rounded-2xl shadow-xl border border-outline-variant/30 dark:border-white/[0.08] py-2 z-40 animate-fade-in-up">
              <div className="px-4 py-1.5 text-[11px] font-label-bold uppercase tracking-wider text-on-surface-variant dark:text-[#8A8F98]">
                {t('switchProfileContext')}
              </div>

              {/* Personal Context */}
              <button
                onClick={() => {
                  setActiveContext('personal');
                  setSelectedSchemeIds([]);
                  setContextDropdownOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold hover:bg-surface-container-low dark:hover:bg-[#16191F] transition-colors ${
                  activeContext === 'personal'
                    ? 'text-primary dark:text-primary-fixed bg-primary/5 dark:bg-primary/10'
                    : 'text-on-surface dark:text-[#EDEDED]'
                }`}
              >
                <Icon name="account_circle" size={18} />
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
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold hover:bg-surface-container-low dark:hover:bg-[#16191F] transition-colors ${
                    activeContext === biz.id
                      ? 'text-primary dark:text-primary-fixed bg-primary/5 dark:bg-primary/10'
                      : 'text-on-surface dark:text-[#EDEDED]'
                  }`}
                >
                  <Icon name="storefront" size={18} />
                  <span className="truncate">{biz.businessName}</span>
                </button>
              ))}

              <div className="border-t border-outline-variant/20 dark:border-white/[0.08] my-1"></div>

              {/* Add Business Action */}
              <button
                onClick={() => {
                  setContextDropdownOpen(false);
                  navigateTo('my-business');
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-3 text-xs font-bold text-primary dark:text-primary-fixed hover:bg-primary/5 transition-colors"
              >
                <Icon name="add_business" size={18} />
                <span>{t('addBusiness')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-time Search Input */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline dark:text-[#8A8F98]">
            <Icon name="search" size={20} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low dark:bg-[#16191F] text-on-surface dark:text-[#EDEDED] font-body-md text-sm py-2.5 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline/60 dark:placeholder:text-[#8A8F98]"
            placeholder="Search schemes by name, ministry, occupation, sector, or state..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface"
            >
              <Icon name="clear" size={18} />
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
              className="appearance-none bg-surface-container-low dark:bg-[#16191F] hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-white/[0.08] transition-colors"
              aria-label="Government Level"
            >
              <option value="all">{t('allSchemes', {}, 'All Schemes')}</option>
              <option value="central">{t('centralGov', {}, 'Central Government')}</option>
              <option value="state">{t('myStateGov', { state: userState }, `${userState} Government`)}</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none flex items-center">
              <Icon name="expand_more" size={18} />
            </span>
          </div>

          {/* Life Status Filter */}
          <div className="relative">
            <select
              value={lifeStatusFilter}
              onChange={(e) => setLifeStatusFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-[#16191F] hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-white/[0.08] transition-colors"
            >
              <option value="all">All Life Statuses</option>
              {LIFE_STATUSES.map((ls) => (
                <option key={ls.id} value={ls.id}>
                  {ls.name}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none flex items-center">
              <Icon name="expand_more" size={18} />
            </span>
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-[#16191F] hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-white/[0.08] transition-colors"
            >
              <option value="all">All Sectors</option>
              {SECTORS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none flex items-center">
              <Icon name="expand_more" size={18} />
            </span>
          </div>

          {/* Match Filter */}
          <div className="relative">
            <select
              value={matchFilter}
              onChange={(e) => setMatchFilter(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-[#16191F] hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-white/[0.08] transition-colors"
            >
              <option value="all">All Match Levels</option>
              <option value="high_match">High Match Only</option>
              <option value="eligible">Eligible Only</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none flex items-center">
              <Icon name="expand_more" size={18} />
            </span>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-[#16191F] hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-white/[0.08] transition-colors"
            >
              <option value="relevance">Sort: Recommended</option>
              <option value="latest">{t('latest')}</option>
              <option value="deadline">{t('deadline')}</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none flex items-center">
              <Icon name="sort" size={18} />
            </span>
          </div>
        </div>
      </div>

      {/* Hero / Greeting Section */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop pt-8 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-container/20 via-tertiary-container/10 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex-1 animate-fade-in-up">
            <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-on-surface dark:text-[#EDEDED] mb-3 font-bold">
              {t('helloUser')}, {activeContext === 'personal' ? user.name.split(' ')[0] : activeBusiness?.businessName}!
              <br />
              <span className="text-primary dark:text-primary-fixed opacity-95">
                {t('eligibleSchemesCount', { count: filteredSchemes.length })}
              </span>
            </h1>

            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant dark:text-[#8A8F98] max-w-2xl">
              {activeContext === 'personal'
                ? t('personalDashboardDesc')
                : t('businessDashboardDesc', { businessName: activeBusiness?.businessName || t('yourEnterprise') })}
            </p>

            {/* Personalized Intelligence Profile Banner */}
            {activeContext === 'personal' && (
              <div className="mt-4 inline-flex flex-wrap items-center gap-2 p-3 bg-surface-container-lowest/80 dark:bg-[#16191F]/80 backdrop-blur-sm rounded-2xl border border-outline-variant/30 dark:border-white/[0.08] text-xs text-on-surface dark:text-[#EDEDED]">
                <span className="font-bold flex items-center gap-1 text-primary dark:text-primary-fixed">
                  <Icon name="tune" size={16} /> Your Profile Context:
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-[#1D212A] font-semibold">
                  {getLifeStatusLabel(userProfile.life_status)}
                </span>
                {userProfile.occupation && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-[#1D212A] font-semibold">
                    {getOccupationLabel(userProfile.occupation)}
                  </span>
                )}
                {userProfile.sector && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-[#1D212A] font-semibold">
                    {getSectorLabel(userProfile.sector)}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-[#1D212A] font-semibold">
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
          <div className="w-full lg:w-80 bg-surface-container-lowest dark:bg-[#0F1115] p-6 rounded-2xl border border-outline-variant/30 dark:border-white/[0.08] shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-[#8A8F98]">
                Recommendation Engine
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-surface-container-low dark:bg-[#16191F] rounded-xl border border-transparent dark:border-white/[0.06]">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block">
                  {highMatchCount}
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#8A8F98] font-medium">
                  High Matches
                </span>
              </div>
              <div className="p-3 bg-surface-container-low dark:bg-[#16191F] rounded-xl border border-transparent dark:border-white/[0.06]">
                <span className="text-2xl font-bold text-primary dark:text-primary-fixed block">
                  {filteredSchemes.length}
                </span>
                <span className="text-[11px] text-on-surface-variant dark:text-[#8A8F98] font-medium">
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
          <div className="text-center py-16 bg-surface-container-lowest dark:bg-[#0F1115] rounded-3xl border border-outline-variant/30 dark:border-white/[0.08] p-8 max-w-lg mx-auto">
            <div className="text-outline-variant dark:text-[#8A8F98]/50 mb-3 flex justify-center">
              <Icon name="filter_alt_off" size={48} />
            </div>
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-[#EDEDED] mb-1">
              No matching schemes found
            </h3>
            <p className="text-xs text-on-surface-variant dark:text-[#8A8F98] mb-4">
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
