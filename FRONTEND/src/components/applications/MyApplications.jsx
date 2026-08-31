import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { ApplicationDetailModal } from './ApplicationDetailModal';

export const MyApplications = () => {
  const { applications } = useData();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'personal' | 'business'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Tab filter
      if (activeTab === 'personal' && app.entityType !== 'personal') return false;
      if (activeTab === 'business' && app.entityType !== 'business') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = app.applicationId.toLowerCase().includes(q);
        const matchScheme = app.schemeName.toLowerCase().includes(q);
        const matchEntity = app.entityName.toLowerCase().includes(q);
        const matchStatus = app.status.toLowerCase().includes(q);
        if (!matchId && !matchScheme && !matchEntity && !matchStatus) return false;
      }

      return true;
    });
  }, [applications, activeTab, searchQuery]);

  const statusBadges = {
    Approved: 'bg-[#E6F4EA] dark:bg-emerald-950/60 text-[#137333] dark:text-emerald-400 border border-emerald-200/50',
    Pending: 'bg-[#FEF7E0] dark:bg-amber-950/60 text-[#B06000] dark:text-amber-400 border border-amber-200/50',
    'In Review': 'bg-secondary-container dark:bg-blue-950/60 text-on-secondary-container dark:text-blue-300 border border-blue-200/50',
    Rejected: 'bg-[#FCE8E6] dark:bg-red-950/60 text-[#C5221F] dark:text-red-400 border border-red-200/50',
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-margin-desktop py-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface dark:text-white font-bold mb-1">
            {t('myApplications')}
          </h1>
          <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-slate-300">
            {t('myAppsSubtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-surface-container-low dark:bg-slate-800 rounded-full text-xs sm:text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/60 outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 dark:border-slate-700"
            placeholder={t('searchApplications')}
            type="text"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-300 hover:bg-surface-container-high'
          }`}
        >
          {t('allApplicationsTab', { count: applications.length })}
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`px-5 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all ${
            activeTab === 'personal'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-300 hover:bg-surface-container-high'
          }`}
        >
          {t('personalTab', { count: applications.filter((a) => a.entityType === 'personal').length })}
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`px-5 py-2 rounded-full font-label-bold text-xs whitespace-nowrap transition-all ${
            activeTab === 'business'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-300 hover:bg-surface-container-high'
          }`}
        >
          {t('businessTab', { count: applications.filter((a) => a.entityType === 'business').length })}
        </button>
      </div>

      {/* Grid of Applications */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-container-low dark:bg-slate-800/40 rounded-2xl text-center px-4">
          <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center text-outline dark:text-slate-400 mb-4">
            <span className="material-symbols-outlined text-[32px]">assignment_late</span>
          </div>
          <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-1">
            {t('noApplicationsFound')}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-400 max-w-sm">
            {searchQuery ? t('noAppsMatchQuery') : t('noAppsInCat')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.applicationId}
              className="group relative bg-surface-container dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1"
            >
              <div>
                {/* Badges Row */}
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary-container dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 font-status-badge text-[11px] font-bold">
                    {app.entityType === 'business' ? `${t('business')} (${app.entityName})` : t('personal')}
                  </span>

                  <span className={`px-3 py-1 rounded-full font-status-badge text-[11px] font-bold flex items-center gap-1 ${statusBadges[app.status] || statusBadges.Pending}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {app.status === 'Approved' ? 'check_circle' : app.status === 'Rejected' ? 'cancel' : 'pending_actions'}
                    </span>
                    <span>{t('status_' + app.status.toLowerCase().replace(/ /g, '_'), {}, app.status)}</span>
                  </span>
                </div>

                {/* Scheme Name */}
                <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {t('scheme_' + (app.schemeIds?.[0] || ''), {}, app.schemeName)}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400 mb-4 line-clamp-2">
                  {t('appRegisteredUnder', { category: t('category_' + app.schemeCategory.replace(/ /g, '_'), {}, app.schemeCategory) })}
                </p>

                {/* Rejection comment banner if rejected */}
                {app.status === 'Rejected' && app.adminComment && (
                  <div className="p-3 bg-error-container/30 dark:bg-error/20 border border-error/20 rounded-xl mb-4 flex gap-2 text-xs">
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">info</span>
                    <p className="font-body-sm text-[11px] text-on-surface dark:text-slate-200 line-clamp-2">
                      {t('rejection_' + (app.schemeIds?.[0] || 'general'), {}, app.adminComment)}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div>
                <div className="flex items-center gap-4 text-on-surface-variant dark:text-slate-400 font-body-sm text-xs mb-4">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                    <span>{app.appliedAt}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-[15px]">fingerprint</span>
                    <span>{app.applicationId}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="w-full py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-700/80 hover:bg-primary hover:text-white text-primary dark:text-primary-fixed font-label-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('viewDetails')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};
