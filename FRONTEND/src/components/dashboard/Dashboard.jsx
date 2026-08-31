import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { SchemeCard } from './SchemeCard';
import { MultiSelectBar } from './MultiSelectBar';

export const Dashboard = () => {
  const {
    schemes,
    businesses,
    activeContext,
    setActiveContext,
    profileCompletion,
    navigateTo,
  } = useData();
  const { user } = useAuth();
  const { t } = useLang();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedSchemeIds, setSelectedSchemeIds] = useState([]);
  const [contextDropdownOpen, setContextDropdownOpen] = useState(false);

  // Active Context Label
  const activeBusiness = businesses.find((b) => b.id === activeContext);
  const contextLabel = activeContext === 'personal' ? t('personalContextTitle', { name: user.name.split(' ')[0] }) : activeBusiness?.businessName || t('business');

  // Filter schemes based on active context, search query, category, and sorting
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      // 1. Context Filter
      if (activeContext === 'personal') {
        if (scheme.isBusinessScheme) return false;
      } else {
        if (!scheme.isBusinessScheme) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchDept = scheme.department.toLowerCase().includes(q);
        const matchCat = scheme.category.toLowerCase().includes(q);
        const matchDesc = scheme.description.toLowerCase().includes(q);
        if (!matchName && !matchDept && !matchCat && !matchDesc) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'all') {
        if (scheme.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      // default: latest (isNew first, then active)
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [schemes, activeContext, searchQuery, selectedCategory, sortBy]);

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
            placeholder={t('searchPlaceholder')}
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

        {/* Category & Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Category Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-white font-label-bold text-xs py-2.5 pl-4 pr-9 rounded-full outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 transition-colors"
            >
              <option value="all">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t('category_' + cat.replace(/ /g, '_')) || cat}
                </option>
              ))}
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
        {/* Background glow elements */}
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
          </div>

          {/* Profile Completion Action Banner */}
          {activeContext === 'personal' && profileCompletion < 100 && (
            <div className="w-full lg:w-auto min-w-[300px] sm:min-w-[340px] p-[2px] rounded-2xl bg-gradient-to-br from-primary to-tertiary-fixed shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
              <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-[14px] h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center mb-3 text-on-primary-container">
                    <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
                  </div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-1">
                    {t('profileCompletionBannerTitle')}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400 mb-4">
                    {t('profileCompletionBannerDesc', { percent: profileCompletion })}
                  </p>
                </div>

                <div>
                  <div className="relative w-full h-2 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>

                  <button
                    onClick={() => navigateTo('profile')}
                    className="w-full py-2.5 bg-on-surface text-surface-container-lowest dark:bg-white dark:text-slate-900 font-label-bold text-xs rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t('updateProfile')}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface dark:text-white">
            {t('recommendedSchemes')}
          </h2>
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>
              {t('showingMatches', { shown: filteredSchemes.length, total: filteredSchemes.length })}
            </span>
          </div>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-surface-container-low dark:bg-slate-800/40 rounded-2xl text-center px-4">
            <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center text-outline dark:text-slate-400 mb-4">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <h3 className="font-headline-md text-lg text-on-surface dark:text-white font-bold mb-1">
              {t('noMatchingSchemesFound')}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mb-4">
              {t('noSchemesFoundDesc')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-primary text-on-primary font-label-bold text-xs rounded-lg hover:bg-primary-container transition-colors"
            >
              {t('resetFilters')}
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Sticky Bottom Action Bar for Multi-Select */}
      <MultiSelectBar
        selectedCount={selectedSchemeIds.length}
        onApplySelected={handleApplySelected}
        onClearSelection={() => setSelectedSchemeIds([])}
      />
    </div>
  );
};
