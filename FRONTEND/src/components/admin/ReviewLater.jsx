import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const ReviewLater = () => {
  const { applications, setReviewLater, navigateTo } = useData();
  const { t } = useLang();

  const reviewLaterApps = applications.filter((a) => a.reviewLater);

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-margin-desktop gap-8 pb-24 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface dark:text-white">
            {t('reviewLater')}
          </h1>
          <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 max-w-2xl">
            {t('reviewLaterSubtitle', {}, 'Applications queued for subsequent evaluation. Prioritize departmental reviews and resume where you left off.')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface-container dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-outline-variant/20 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="text-xl font-headline-md font-bold text-primary dark:text-primary-fixed">
              {reviewLaterApps.length}
            </span>
            <span className="text-[10px] font-label-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
              {t('savedItems')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Queued Applications */}
      {reviewLaterApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low dark:bg-slate-800/40 rounded-3xl border border-outline-variant/20 dark:border-slate-800 text-center p-6">
          <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center text-outline dark:text-slate-400 mb-4">
            <span className="material-symbols-outlined text-[32px]">schedule</span>
          </div>
          <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-1">
            {t('noAppsInReviewLater')}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mb-6">
            {t('noAppsInReviewLaterDesc')}
          </p>
          <button
            onClick={() => navigateTo('admin-all-applications')}
            className="px-5 py-2.5 bg-primary text-white font-label-bold text-xs rounded-xl hover:bg-primary-container transition-colors"
          >
            {t('allApplications')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {reviewLaterApps.map((app) => (
            <div
              key={app.applicationId}
              className="relative flex flex-col bg-surface-container dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Dismiss from Review Later */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setReviewLater(app.applicationId, false)}
                  className="p-1.5 rounded-full hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400"
                  title={t('remove')}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Applicant Avatar & Name */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                  {app.userName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-on-surface dark:text-white truncate">
                    {app.userName}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-primary dark:text-primary-fixed bg-primary-fixed/30 dark:bg-primary-fixed/10 px-2 py-0.5 rounded-md inline-block w-fit mt-0.5">
                    #{app.applicationId}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-col gap-3 flex-1 mb-5 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="font-label-bold text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
                    {t('targetGovInitiative')}
                  </span>
                  <span className="font-semibold text-on-surface dark:text-slate-200 truncate">
                    {app.schemeName}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-label-bold text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
                    {t('queuedOn')}
                  </span>
                  <div className="flex items-center gap-1.5 text-on-surface dark:text-slate-300">
                    <span className="material-symbols-outlined text-[15px] text-outline">calendar_today</span>
                    <span>{app.updatedAt || app.appliedAt}</span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-outline-variant/30 dark:bg-slate-700 my-1" />

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] font-label-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
                    <span>{t('auditStage')}</span>
                    <span>{t('status_pending')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-variant dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary-fixed-dim rounded-full w-[60%]" />
                  </div>
                </div>
              </div>

              {/* Review Now CTA */}
              <button
                onClick={() => navigateTo('admin-review-application', app.applicationId)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-container to-primary rounded-xl text-on-primary font-label-bold text-xs flex items-center justify-center gap-2 hover:shadow-md transition-all"
              >
                <span>{t('reviewNow')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
