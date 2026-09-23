import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { AddEditSchemeModal } from './AddEditSchemeModal';
import { getOccupationLabel, getSectorLabel, getLifeStatusLabel } from '../../data/taxonomy';
import Icon from '../../../features/yojna-setu/components/Icon';

export const SchemeManagement = () => {
  const { schemes, deleteScheme, getAdminAuditLogs } = useData();
  const { t } = useLang();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [govLevelFilter, setGovLevelFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const auditLogs = useMemo(() => {
    return getAdminAuditLogs ? getAdminAuditLogs() : [];
  }, [auditModalOpen, getAdminAuditLogs, schemes]);

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
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface dark:text-[#EDEDED]">
            {t('schemeManagement')}
          </h1>
          <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-[#8A8F98]">
            {t('schemeManagementSubtitle', {}, 'Create, update, and manage published government welfare schemes and eligibility parameters')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container dark:bg-[#16191F] text-on-surface dark:text-[#EDEDED] font-label-bold text-xs sm:text-sm border border-outline-variant/30 dark:border-white/[0.08] hover:bg-surface-container-high transition-colors"
          >
            <Icon name="history" size={18} />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
          >
            <Icon name="add" size={20} />
            <span>{t('addNewScheme')}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container dark:bg-[#0F1115] rounded-2xl p-4 shadow-sm border border-outline-variant/20 dark:border-white/[0.08] flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Icon name="search" size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-[#16191F] py-2.5 pl-11 pr-4 rounded-xl text-xs sm:text-sm text-on-surface dark:text-[#EDEDED] outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-white/[0.08]"
            placeholder={t('searchSchemesPlaceholder')}
            type="text"
          />
        </div>

        {/* Government Level Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={govLevelFilter}
            onChange={(e) => setGovLevelFilter(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-[#16191F] py-2.5 pl-4 pr-10 rounded-xl text-xs sm:text-sm text-on-surface dark:text-[#EDEDED] outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-white/[0.08] appearance-none cursor-pointer"
          >
            <option value="All">{t('allLevels', {}, 'All Levels')}</option>
            <option value="Central">{t('centralGov', {}, 'Central Government')}</option>
            <option value="State">{t('stateGov', {}, 'State Government')}</option>
          </select>
          <Icon name="expand_more" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-[#16191F] py-2.5 pl-4 pr-10 rounded-xl text-xs sm:text-sm text-on-surface dark:text-[#EDEDED] outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-white/[0.08] appearance-none cursor-pointer"
          >
            <option value="All">{t('allCategories')}</option>
            <option value="Agriculture">{t('category_Agriculture')}</option>
            <option value="Finance">{t('category_Finance')}</option>
            <option value="Healthcare">{t('category_Healthcare')}</option>
            <option value="Housing">{t('category_Housing')}</option>
            <option value="Education">{t('category_Education')}</option>
          </select>
          <Icon name="expand_more" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-[#8A8F98] pointer-events-none" />
        </div>
      </div>

      {/* Grid of Scheme Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-surface-container dark:bg-[#0F1115] rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/[0.08] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Badges & Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-emerald-950/60 text-[#1B5E20] dark:text-emerald-400 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> {t('active')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-variant dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] text-[10px] font-bold uppercase border border-transparent dark:border-white/[0.08]">
                    {t('category_' + scheme.category.replace(/ /g, '_')) || scheme.category}
                  </span>
                  {scheme.governmentLevel === 'state' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-secondary-container/60 dark:bg-[#16191F] text-on-secondary-container dark:text-[#8A8F98] border border-outline-variant/30 dark:border-white/[0.08]">
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
                    className="p-1.5 rounded-full hover:bg-surface-container-high dark:hover:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] hover:text-primary dark:hover:text-[#EDEDED] transition-colors"
                    title={t('edit')}
                  >
                    <Icon name="edit" size={18} />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(scheme.id)}
                    className="p-1.5 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant dark:text-[#8A8F98] transition-colors"
                    title={t('delete')}
                  >
                    <Icon name="delete" size={18} />
                  </button>
                </div>
              </div>

              {/* Title & Ministry */}
              <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-[#EDEDED] mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {t('scheme_' + scheme.id, {}, scheme.name)}
              </h3>
              <p className="font-body-sm text-xs text-primary dark:text-primary-fixed font-medium mb-3">
                {t('dept_' + scheme.id, {}, scheme.department)}
              </p>

              <p className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98] line-clamp-2 mb-3">
                {t('desc_' + scheme.id, {}, scheme.description)}
              </p>

              {/* Targeting Intelligence Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {scheme.eligibleLifeStatuses && !scheme.eligibleLifeStatuses.includes('ALL') && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-lowest dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] text-[10px] font-semibold border border-transparent dark:border-white/[0.08]">
                    {scheme.eligibleLifeStatuses.map(getLifeStatusLabel).join(', ')}
                  </span>
                )}
                {scheme.eligibleOccupations && !scheme.eligibleOccupations.includes('ALL') && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-lowest dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] text-[10px] font-semibold border border-transparent dark:border-white/[0.08]">
                    {scheme.eligibleOccupations.slice(0, 2).map(getOccupationLabel).join(', ')}
                  </span>
                )}
                {scheme.eligibleSectors && !scheme.eligibleSectors.includes('ALL') && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-lowest dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] text-[10px] font-semibold border border-transparent dark:border-white/[0.08]">
                    {scheme.eligibleSectors.slice(0, 2).map(getSectorLabel).join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Footer Information */}
            <div className="pt-4 border-t border-outline-variant/20 dark:border-white/[0.08] flex justify-between items-center text-xs">
              <span className="text-on-surface-variant dark:text-[#8A8F98]">
                {scheme.isBusinessScheme ? t('enterpriseScheme') : t('citizenScheme')}
              </span>
              <span className="font-mono font-semibold text-on-surface dark:text-[#EDEDED]">
                {t('deadline_' + scheme.id, {}, scheme.deadlineText || t('alwaysOpen'))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Trail Modal */}
      {auditModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-lowest dark:bg-[#0F1115] p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-outline-variant/30 dark:border-white/[0.08] shadow-2xl animate-fade-in-up my-auto max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Icon name="history" size={22} className="text-primary" />
                <h3 className="font-headline-md text-lg font-bold text-on-surface dark:text-[#EDEDED]">
                  Admin Scheme Audit Trail
                </h3>
              </div>
              <button
                onClick={() => setAuditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant dark:text-[#8A8F98] hover:bg-surface-container dark:hover:bg-[#16191F]"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-surface-container-low dark:bg-[#16191F] rounded-xl border border-outline-variant/20 dark:border-white/[0.08] text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary dark:text-primary-fixed">{log.schemeName}</span>
                      <span className="text-[10px] text-on-surface-variant dark:text-[#8A8F98]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-on-surface dark:text-[#EDEDED]">
                      Changed <span className="font-mono font-semibold bg-surface-container-high dark:bg-[#08090A] px-1 rounded">{log.fieldChanged}</span> by <span className="font-semibold">{log.adminId}</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant dark:text-[#8A8F98] truncate">
                      Old: <span className="font-mono">{log.oldValue}</span> → New: <span className="font-mono">{log.newValue}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-on-surface-variant dark:text-[#8A8F98] text-xs">
                  No modifications logged yet in this session.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-outline-variant/30 dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setAuditModalOpen(false)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-container"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-container-lowest dark:bg-[#0F1115] p-6 rounded-2xl max-w-sm w-full border border-outline-variant/30 dark:border-white/[0.08] shadow-2xl animate-fade-in-up my-auto">
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-[#EDEDED] mb-2">
              {t('confirmDeleteScheme')}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant dark:text-[#8A8F98] mb-6">
              {t('deleteSchemeConfirmDesc')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant dark:text-[#8A8F98] hover:bg-surface-container dark:hover:bg-[#16191F]"
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
