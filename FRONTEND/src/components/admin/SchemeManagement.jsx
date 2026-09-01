import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { AddEditSchemeModal } from './AddEditSchemeModal';

export const SchemeManagement = () => {
  const { schemes, deleteScheme } = useData();
  const { t } = useLang();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [govLevelFilter, setGovLevelFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
      if (govLevelFilter === 'Central' && s.governmentLevel !== 'central') return false;
      if (govLevelFilter === 'State' && s.governmentLevel !== 'state') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchDept = s.department.toLowerCase().includes(q);
        const matchState = s.applicableStates ? s.applicableStates.some(st => st.toLowerCase().includes(q)) : false;
        if (!matchName && !matchDept && !matchState) return false;
      }
      return true;
    });
  }, [schemes, categoryFilter, govLevelFilter, searchQuery]);

  const handleOpenAdd = () => {
    setEditingScheme(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (scheme) => {
    setEditingScheme(scheme);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-margin-desktop gap-6 pb-24 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface dark:text-white">
            {t('schemeManagement')}
          </h1>
          <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">
            {t('schemeManagementSubtitle', {}, 'Create, update, and manage published government welfare schemes and eligibility parameters')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>{t('addNewScheme')}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-outline-variant/20 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 pl-11 pr-4 rounded-xl text-xs sm:text-sm text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700"
            placeholder={t('searchSchemesPlaceholder')}
            type="text"
          />
        </div>

        {/* Government Level Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={govLevelFilter}
            onChange={(e) => setGovLevelFilter(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 pl-4 pr-10 rounded-xl text-xs sm:text-sm text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700 appearance-none cursor-pointer"
          >
            <option value="All">{t('allLevels', {}, 'All Levels')}</option>
            <option value="Central">{t('centralGov', {}, 'Central Government')}</option>
            <option value="State">{t('stateGov', {}, 'State Government')}</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 pointer-events-none text-[18px]">
            expand_more
          </span>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 pl-4 pr-10 rounded-xl text-xs sm:text-sm text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700 appearance-none cursor-pointer"
          >
            <option value="All">{t('allCategories')}</option>
            <option value="Agriculture">{t('category_Agriculture')}</option>
            <option value="Finance">{t('category_Finance')}</option>
            <option value="Healthcare">{t('category_Healthcare')}</option>
            <option value="Housing">{t('category_Housing')}</option>
            <option value="Education">{t('category_Education')}</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 pointer-events-none text-[18px]">
            expand_more
          </span>
        </div>
      </div>

      {/* Grid of Scheme Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-surface-container dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Badges & Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-emerald-950/60 text-[#1B5E20] dark:text-emerald-400 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {t('active')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-variant dark:bg-slate-700 text-on-surface-variant dark:text-slate-300 text-[10px] font-bold uppercase">
                    {t('category_' + scheme.category.replace(/ /g, '_')) || scheme.category}
                  </span>
                  {scheme.governmentLevel === 'state' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-secondary-container/60 dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 border border-outline-variant/30">
                      {scheme.applicableStates && scheme.applicableStates.length === 1
                        ? `STATE · ${scheme.applicableStates[0].toUpperCase()}`
                        : `STATE · ${scheme.applicableStates?.length || 1} STATES`}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-fixed/40 dark:bg-primary/20 text-on-primary-fixed-variant dark:text-primary-fixed border border-primary/20">
                      {t('centralGovBadge', {}, 'CENTRAL')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(scheme)}
                    className="p-1.5 rounded-full hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors"
                    title={t('edit')}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(scheme.id)}
                    className="p-1.5 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant dark:text-slate-400 transition-colors"
                    title={t('delete')}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Title & Ministry */}
              <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {t('scheme_' + scheme.id, {}, scheme.name)}
              </h3>
              <p className="font-body-sm text-xs text-primary dark:text-primary-fixed font-medium mb-3">
                {t('dept_' + scheme.id, {}, scheme.department)}
              </p>

              <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400 line-clamp-2 mb-4">
                {t('desc_' + scheme.id, {}, scheme.description)}
              </p>
            </div>

            {/* Footer Information */}
            <div className="pt-4 border-t border-outline-variant/20 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="text-on-surface-variant dark:text-slate-400">
                {scheme.isBusinessScheme ? t('enterpriseScheme') : t('citizenScheme')}
              </span>
              <span className="font-mono font-semibold text-on-surface dark:text-white">
                {t('deadline_' + scheme.id, {}, scheme.deadlineText || t('alwaysOpen'))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full border border-outline-variant/30 shadow-2xl animate-fade-in-up my-auto">
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-2">
              {t('confirmDeleteScheme')}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-400 mb-6">
              {t('deleteSchemeConfirmDesc')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  deleteScheme(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-error text-white text-xs font-semibold hover:opacity-90"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add/Edit Modal */}
      <AddEditSchemeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingScheme={editingScheme}
      />
    </div>
  );
};
