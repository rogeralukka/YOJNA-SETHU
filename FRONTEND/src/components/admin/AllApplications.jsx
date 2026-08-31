import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const AllApplications = () => {
  const { applications, navigateTo } = useData();
  const { t } = useLang();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Status Filter
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;

      // Date Range Filter
      if (fromDate && app.appliedAt < fromDate) return false;
      if (toDate && app.appliedAt > toDate) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = app.applicationId.toLowerCase().includes(q);
        const matchUser = app.userName.toLowerCase().includes(q);
        const matchEmail = app.userEmail.toLowerCase().includes(q);
        const matchScheme = app.schemeName.toLowerCase().includes(q);
        const matchEntity = app.entityName.toLowerCase().includes(q);
        if (!matchId && !matchUser && !matchEmail && !matchScheme && !matchEntity) return false;
      }

      return true;
    });
  }, [applications, statusFilter, fromDate, toDate, searchQuery]);

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setFromDate('');
    setToDate('');
  };

  const statusStyles = {
    Approved: 'bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#137333] dark:text-emerald-400 border border-emerald-200/50',
    Pending: 'bg-secondary-container dark:bg-blue-950/60 text-on-secondary-container dark:text-blue-300 border border-blue-200/50',
    'In Review': 'bg-tertiary-fixed-dim/40 dark:bg-amber-950/60 text-on-tertiary-fixed-variant dark:text-amber-300 border border-amber-200/50',
    Rejected: 'bg-[#FCE8E6] dark:bg-red-950/60 text-[#C5221F] dark:text-red-400 border border-red-200/50',
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-margin-desktop gap-6 pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface dark:text-white">
          {t('allApplications')}
        </h1>
        <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 max-w-3xl">
          {t('allApplicationsSubtitle', {}, 'Review and manage incoming program applications across all departments')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/20 dark:border-slate-700 flex flex-col xl:flex-row gap-4 xl:items-end">
        {/* Search Input */}
        <div className="flex flex-col gap-1 flex-1">
          <label className="font-label-bold text-[11px] uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            {t('search')}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-[20px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 pl-11 pr-4 rounded-xl text-xs sm:text-sm text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700"
              placeholder={t('searchAdminPlaceholder')}
              type="text"
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1 w-full xl:w-48">
          <label className="font-label-bold text-[11px] uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            {t('status')}
          </label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 pl-4 pr-10 rounded-xl text-xs sm:text-sm text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 dark:border-slate-700 appearance-none"
            >
              <option value="All">{t('allStatuses')}</option>
              <option value="Pending">{t('status_pending')}</option>
              <option value="In Review">{t('status_in_review')}</option>
              <option value="Approved">{t('status_approved')}</option>
              <option value="Rejected">{t('status_rejected')}</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-1 w-full xl:w-40">
          <label className="font-label-bold text-[11px] uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            {t('fromDate')}
          </label>
          <input
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 px-3 rounded-xl text-xs text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700"
            type="date"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-1 w-full xl:w-40">
          <label className="font-label-bold text-[11px] uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
            {t('toDate')}
          </label>
          <input
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-surface-container-lowest dark:bg-slate-900 py-2.5 px-3 rounded-xl text-xs text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700"
            type="date"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="bg-surface-variant dark:bg-slate-700 hover:bg-outline-variant dark:hover:bg-slate-600 text-on-surface dark:text-white py-2.5 px-5 rounded-xl font-label-bold text-xs h-[42px] flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>{t('reset')}</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container-low dark:bg-slate-900/60 border-b border-outline-variant/20 dark:border-slate-700 text-on-surface-variant dark:text-slate-400 font-label-bold uppercase tracking-wider text-[11px]">
                <th className="px-6 py-4">{t('appId')}</th>
                <th className="px-6 py-4">{t('applicant')}</th>
                <th className="px-6 py-4">{t('scheme')}</th>
                <th className="px-6 py-4">{t('entity')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 dark:divide-slate-700/50">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant dark:text-slate-400">
                    {t('noAppsMatchFilters')}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.applicationId}
                    onClick={() => navigateTo('admin-review-application', app.applicationId)}
                    className="hover:bg-surface-container-low/50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                  >
                    {/* App ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-on-surface dark:text-white">
                        #{app.applicationId}
                      </span>
                      {app.reviewLater && (
                        <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                          {t('reviewLater')}
                        </span>
                      )}
                    </td>

                    {/* Applicant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                          {app.userName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-on-surface dark:text-white truncate">
                            {app.userName}
                          </span>
                          <span className="text-[11px] text-on-surface-variant dark:text-slate-400 truncate">
                            {app.userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Scheme */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-on-surface dark:text-slate-200 line-clamp-1 max-w-xs">
                        {app.schemeName}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-variant dark:bg-slate-700 text-on-surface-variant dark:text-slate-300 text-xs font-medium">
                        <span className="material-symbols-outlined text-[15px]">
                          {app.entityType === 'business' ? 'storefront' : 'person'}
                        </span>
                        <span>{app.entityType === 'business' ? app.entityName : t('individual')}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusStyles[app.status] || statusStyles.Pending}`}>
                        {t('status_' + app.status.toLowerCase().replace(/ /g, '_')) || app.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('admin-review-application', app.applicationId);
                        }}
                        className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-300 hover:text-primary transition-colors"
                        title={t('reviewApplication')}
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
