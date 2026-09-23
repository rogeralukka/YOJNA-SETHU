import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Fingerprint,
  AlertTriangle,
  ArrowRight,
  FileText,
  FileQuestion
} from 'lucide-react';

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{status || 'In Review'}</span>
          </span>
        );
    }
  };

  const personalCount = applications.filter((a) => a.entityType === 'personal').length;
  const businessCount = applications.filter((a) => a.entityType === 'business').length;

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-12 py-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900 dark:text-[#EDEDED] font-bold mb-1">
            {t('myApplications') || 'My Submitted Applications'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8A8F98]">
            {t('myAppsSubtitle') || 'Track live status, issuance receipts, and verifier remarks across all citizen & enterprise dockets.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#8A8F98]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#16191F] rounded-xl text-xs sm:text-sm text-neutral-900 dark:text-[#EDEDED] placeholder:text-neutral-400 dark:placeholder:text-[#8A8F98]/60 outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-200 dark:border-white/[0.08] shadow-xs"
            placeholder={t('searchApplications') || 'Search by scheme or application ID...'}
            type="text"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#1D212A]'
          }`}
        >
          All Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#1D212A]'
          }`}
        >
          Personal ({personalCount})
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'business'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#1D212A]'
          }`}
        >
          Business ({businessCount})
        </button>
      </div>

      {/* Grid of Applications */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-2xl text-center px-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#16191F] flex items-center justify-center text-neutral-400 dark:text-[#8A8F98] mb-4">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-[#EDEDED] mb-1">
            {t('noApplicationsFound') || 'No Applications Found'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-[#8A8F98] max-w-sm">
            {searchQuery ? 'No submitted applications match your search query.' : 'You have not submitted applications under this category yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app.applicationId}
              className="group relative bg-white dark:bg-[#0F1115] rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-white/[0.08] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1"
            >
              <div>
                {/* Badges Row */}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-neutral-100 dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] text-[11px] font-bold uppercase tracking-wider border border-neutral-200 dark:border-white/[0.08]">
                    {app.entityType === 'business' ? `Business (${app.entityName})` : 'Personal Citizen'}
                  </span>

                  {getStatusBadge(app.status)}
                </div>

                {/* Scheme Name */}
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {app.schemeName}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#8A8F98] mb-4 line-clamp-2">
                  Registered under {app.schemeCategory || 'Social Welfare & Direct Entitlement'}
                </p>

                {/* Rejection comment banner if rejected */}
                {app.status === 'Rejected' && app.adminComment && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-4 flex gap-2 text-xs text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      {app.adminComment}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-neutral-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between text-neutral-500 dark:text-[#8A8F98] text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{app.appliedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>{app.applicationId}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-[#16191F] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-neutral-800 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
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

export default MyApplications;
