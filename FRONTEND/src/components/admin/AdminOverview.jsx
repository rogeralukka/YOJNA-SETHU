import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const AdminOverview = () => {
  const { applications, businesses, schemes, navigateTo } = useData();
  const { t } = useLang();

  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'Pending' || a.status === 'In Review').length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const rejectedApps = applications.filter((a) => a.status === 'Rejected').length;
  const totalBiz = 4820 + businesses.length;

  const statCards = [
    { title: t('totalUsers'), value: '12,450', icon: 'group', bg: 'bg-primary-container text-on-primary-container' },
    { title: t('totalBusinesses'), value: totalBiz.toLocaleString('en-IN'), icon: 'domain', bg: 'bg-surface-tint/20 text-surface-tint' },
    { title: t('totalApplications'), value: totalApps.toString(), icon: 'description', bg: 'bg-secondary-container text-on-secondary-container' },
    { title: t('pendingApplications'), value: pendingApps.toString(), icon: 'pending_actions', bg: 'bg-tertiary-container text-on-tertiary-container' },
    { title: t('approvedApplications'), value: approvedApps.toString(), icon: 'check_circle', bg: 'bg-[#E8F5E9] text-[#1B5E20]' },
    { title: t('rejectedApplications'), value: rejectedApps.toString(), icon: 'cancel', bg: 'bg-[#FFEBEE] text-[#C62828]' },
  ];

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-margin-desktop gap-8 pb-24 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-headline-lg font-bold text-on-surface dark:text-white">
          {t('platformOverview')}
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">
          {t('adminOverviewSubtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-surface-container dark:bg-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-outline-variant/20 dark:border-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
              <span className="text-[10px] font-label-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider line-clamp-1">
                {stat.title}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-headline-md font-bold text-on-surface dark:text-white mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Line Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-surface-container dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/20 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white">
                {t('applicationsTrend')}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                {t('monthlyIntakeSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-primary dark:text-primary-fixed font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> {t('allApplications')}
              </span>
              <span className="flex items-center gap-1 text-secondary dark:text-slate-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> {t('status_approved')}
              </span>
            </div>
          </div>

          {/* SVG Animated Chart */}
          <div className="w-full h-64 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" className="text-outline-variant/20 dark:text-slate-700" strokeDasharray="4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-outline-variant/20 dark:text-slate-700" strokeDasharray="4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" className="text-outline-variant/20 dark:text-slate-700" strokeDasharray="4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="currentColor" className="text-outline-variant/20 dark:text-slate-700" />

              {/* Area Gradient */}
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003fb1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#003fb1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Filled Area */}
              <path
                d="M 0,160 Q 80,120 160,80 T 320,50 T 500,30 L 500,190 L 0,190 Z"
                fill="url(#primaryGradient)"
              />

              {/* Primary Curve (Applications) */}
              <path
                d="M 0,160 Q 80,120 160,80 T 320,50 T 500,30"
                fill="none"
                stroke="#003fb1"
                strokeWidth="3.5"
                className="draw-line"
              />

              {/* Secondary Curve (Approvals) */}
              <path
                d="M 0,180 Q 80,150 160,110 T 320,85 T 500,55"
                fill="none"
                stroke="#515f74"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Data points */}
              {[[0,160], [125,100], [250,65], [375,40], [500,30]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#003fb1" stroke="#ffffff" strokeWidth="2" />
              ))}
            </svg>

            <div className="flex justify-between text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 font-medium">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </div>
        </div>

        {/* Doughnut Chart & Top Schemes */}
        <div className="bg-surface-container dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/20 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white mb-1">
              {t('applicationsByCategory')}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-6">
              {t('sectorShareBreakdown')}
            </p>

            {/* Doughnut Visualization */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Agriculture Segment 40% */}
                  <circle cx="50" cy="50" r="40" stroke="#003fb1" strokeWidth="14" fill="transparent" strokeDasharray="100 151" strokeDashoffset="0" />
                  {/* Finance Segment 30% */}
                  <circle cx="50" cy="50" r="40" stroke="#1a56db" strokeWidth="14" fill="transparent" strokeDasharray="75 176" strokeDashoffset="-100" />
                  {/* Housing / Other 30% */}
                  <circle cx="50" cy="50" r="40" stroke="#ffb95f" strokeWidth="14" fill="transparent" strokeDasharray="75 176" strokeDashoffset="-175" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-bold text-on-surface dark:text-white block font-mono">
                    {totalApps}
                  </span>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400 uppercase font-semibold">
                    {t('total')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs pt-4 border-t border-outline-variant/20 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> {t('category_Agriculture')}
              </span>
              <span className="font-bold text-on-surface dark:text-slate-200">40%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> {t('category_Finance')}
              </span>
              <span className="font-bold text-on-surface dark:text-slate-200">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim" /> {t('category_Healthcare')}
              </span>
              <span className="font-bold text-on-surface dark:text-slate-200">30%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Schemes List */}
      <div className="bg-surface-container dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/20 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white">
            {t('topAppliedSchemes')}
          </h2>
          <button
            onClick={() => navigateTo('admin-all-applications')}
            className="text-xs font-label-bold text-primary dark:text-primary-fixed hover:underline"
          >
            {t('allApplications')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schemes.slice(0, 3).map((s, i) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-surface-container-low dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-primary-fixed text-[10px] font-bold uppercase">
                    {t('category_' + s.category.replace(/ /g, '_')) || s.category}
                  </span>
                  <span className="text-xs font-bold text-on-surface dark:text-white font-mono">
                    #{i + 1}
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-on-surface dark:text-white line-clamp-1 mb-1">
                  {t('scheme_' + s.id, {}, s.name)}
                </h4>
                <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                  {t('dept_' + s.id, {}, s.department)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/20 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-on-surface-variant dark:text-slate-400">{t('estVolume')}</span>
                <span className="font-bold text-primary dark:text-primary-fixed">
                  {t('applicantsCount', { count: 3400 - i * 900 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
