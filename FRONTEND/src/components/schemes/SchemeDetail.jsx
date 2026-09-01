import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { getOccupationLabel, getSectorLabel, getLifeStatusLabel } from '../../data/taxonomy';

export const SchemeDetail = () => {
  const { selectedSchemeId, schemes, isBookmarked, toggleBookmark, navigateTo, evaluateScheme, userProfile } = useData();
  const { t } = useLang();

  const scheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];
  const bookmarked = scheme ? isBookmarked(scheme.id) : false;
  const evaluation = evaluateScheme(scheme);

  if (!scheme) {
    return (
      <div className="p-8 text-center text-on-surface dark:text-white">
        <p>{t('schemeNotFound')}</p>
        <button onClick={() => navigateTo('dashboard')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          {t('backToDashboard')}
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (evaluation.status) {
      case 'HIGH_MATCH':
        return {
          label: 'High Match',
          color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          icon: 'verified'
        };
      case 'POTENTIAL_MATCH':
        return {
          label: 'Eligible',
          color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
          icon: 'check_circle'
        };
      case 'NEEDS_INFO':
        return {
          label: 'Needs More Information',
          color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
          icon: 'help'
        };
      case 'NOT_ELIGIBLE':
      default:
        return {
          label: 'Not Eligible for Your Profile',
          color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
          icon: 'cancel'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="flex flex-col w-full relative min-h-screen pb-24">
      {/* Back Button / Breadcrumb */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop py-4">
        <button
          onClick={() => navigateTo('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{t('backToDashboard')}</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="px-4 sm:px-8 lg:px-margin-desktop flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - 2/3 width */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body-sm text-xs font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">
                    {t('dept_' + scheme.id, {}, scheme.department)}
                  </span>
                  {scheme.governmentLevel === 'state' ? (
                    <span className="px-3 py-1 bg-secondary-container/60 dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 rounded-full font-status-badge text-xs font-semibold uppercase tracking-wider border border-outline-variant/30">
                      {scheme.applicableStates && scheme.applicableStates.length === 1
                        ? `${t('stateGov', {}, 'State Government')} — ${scheme.applicableStates[0]}`
                        : `${t('stateGov', {}, 'State Government')} — ${scheme.applicableStates?.length || 1} States`}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-primary-fixed/40 dark:bg-primary/20 text-on-primary-fixed-variant dark:text-primary-fixed rounded-full font-status-badge text-xs font-semibold uppercase tracking-wider border border-primary/20">
                      {t('centralGov', {}, 'Central Government')} · All India
                    </span>
                  )}
                </div>
                <span className="px-3 py-1 bg-secondary-container dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 rounded-full font-status-badge text-xs font-semibold uppercase tracking-wider">
                  {t('category_' + scheme.category.replace(/ /g, '_'), {}, scheme.category)}
                </span>
              </div>

              <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface dark:text-white font-bold mt-2">
                {t('scheme_' + scheme.id, {}, scheme.name)}
              </h1>
              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant dark:text-slate-300 mt-1 max-w-3xl">
                {t('desc_' + scheme.id, {}, scheme.description)}
              </p>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-outline-variant/50 to-transparent dark:from-slate-700" />

            {/* Scheme Overview */}
            <div className="flex flex-col gap-3">
              <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">
                  description
                </span>
                <span>{t('schemeOverview')}</span>
              </h2>
              <p className="font-body-md text-sm text-on-surface dark:text-slate-300 leading-relaxed">
                {t('overview_' + scheme.id, {}, scheme.overview || scheme.description)}
              </p>
            </div>
          </div>

          {/* Explainable Eligibility Analysis Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">manage_search</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white">
                    Personalized Eligibility Reasoning
                  </h2>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400">
                    Authoritative rule evaluation against your registered citizen profile
                  </p>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto ${badge.color}`}>
                <span className="material-symbols-outlined text-[16px]">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-on-surface dark:text-slate-200 font-medium">
              {evaluation.summary}
            </p>

            {/* Criteria Evaluation Items */}
            <div className="space-y-2.5">
              {evaluation.criteriaResults.map((crit, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                    crit.satisfied
                      ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 text-on-surface dark:text-slate-200'
                      : crit.isMissing
                      ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/20 text-on-surface dark:text-slate-200'
                      : 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/20 text-on-surface dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                        crit.satisfied
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : crit.isMissing
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {crit.satisfied ? 'check_circle' : crit.isMissing ? 'help' : 'cancel'}
                    </span>
                    <div>
                      <span className="font-bold block">{crit.label}</span>
                      <span className="text-[11px] text-on-surface-variant dark:text-slate-400">
                        {crit.message}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-7 sm:pl-0">
                    <span className="text-[10px] text-on-surface-variant dark:text-slate-400 block uppercase font-bold">
                      Required / Your Profile
                    </span>
                    <span className="font-semibold text-xs text-on-surface dark:text-white">
                      {crit.requiredValue} · <span className={crit.satisfied ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}>{crit.userValue}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* If missing information */}
            {evaluation.missingFields && evaluation.missingFields.length > 0 && (
              <div className="p-3.5 bg-amber-500/10 dark:bg-amber-950/40 rounded-xl border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Missing profile fields: <strong>{evaluation.missingFields.join(', ')}</strong></span>
                </div>
                <button
                  onClick={() => navigateTo('profile')}
                  className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors whitespace-nowrap"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>

          {/* Grid of 2 Cards: Scheme Eligibility & Required Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligibility Criteria */}
            <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col gap-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary-fixed/20 dark:bg-primary/10 rounded-bl-full group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">
                  verified
                </span>
                <span>{t('eligibilityCriteria')}</span>
              </h2>

              <ul className="flex flex-col gap-3 font-body-md text-xs sm:text-sm text-on-surface dark:text-slate-300 relative z-10">
                {scheme.eligibilityCriteria?.map((crit, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2.5 ${crit.eligible === false ? 'opacity-60 line-through' : ''}`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                        crit.eligible === false ? 'text-outline dark:text-slate-500' : 'text-primary dark:text-primary-fixed'
                      }`}
                    >
                      {crit.eligible === false ? 'close' : 'done'}
                    </span>
                    <span>{t('elig_' + scheme.id + '_' + idx, {}, crit.text)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col gap-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-tertiary-fixed/20 dark:bg-tertiary/10 rounded-bl-full group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-tertiary dark:text-tertiary-fixed">
                  folder_open
                </span>
                <span>{t('requiredDocuments')}</span>
              </h2>

              <ul className="flex flex-col gap-3 font-body-md text-xs sm:text-sm text-on-surface dark:text-slate-300 relative z-10">
                {scheme.documentsRequired?.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-tertiary dark:text-tertiary-fixed text-[18px] shrink-0 mt-0.5">
                      description
                    </span>
                    <span>{t('doc_' + scheme.id + '_' + idx, {}, doc)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col gap-5 sticky top-20">
            {/* Urgent Deadline Banner if applicable */}
            {scheme.isUrgent && (
              <div className="bg-error-container/30 dark:bg-error/20 border border-error/30 p-4 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-[20px] shrink-0">
                  warning
                </span>
                <div className="flex flex-col">
                  <span className="font-label-bold text-xs font-bold text-error">
                    {t('urgentDeadline')}
                  </span>
                  <span className="font-body-sm text-xs text-on-surface dark:text-slate-300 mt-0.5">
                    {t('urgentDeadlineDesc', { deadline: t('deadline_' + scheme.id, {}, scheme.deadlineText) })}
                  </span>
                </div>
              </div>
            )}

            {/* Benefit Summary */}
            <div className="p-4 bg-surface-container-low dark:bg-slate-700/60 rounded-xl">
              <span className="text-[11px] font-label-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                {t('directBenefit')}
              </span>
              <p className="font-headline-md text-xl font-bold text-primary dark:text-primary-fixed mt-0.5">
                {t('benefit_' + scheme.id, {}, scheme.benefit)}
              </p>
              <p className="text-xs text-on-surface-variant dark:text-slate-300">
                {t('benefitDetail_' + scheme.id, {}, scheme.benefitDetail)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigateTo('application-form', [scheme])}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-[#1E3A5F] text-on-primary py-3.5 px-6 rounded-xl font-label-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-md hover:shadow-xl"
              >
                <span>{t('applyNow')}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => toggleBookmark(scheme.id)}
                className="w-full bg-transparent text-secondary dark:text-slate-300 py-3 px-6 rounded-xl font-label-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-outline-variant dark:border-slate-600 hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
                <span>{bookmarked ? t('removeBookmark') : t('saveBookmark')}</span>
              </button>
            </div>

            {/* Application Stats */}
            <div className="pt-5 border-t border-outline-variant/30 dark:border-slate-700 flex flex-col gap-3">
              <h3 className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                {t('applicationStats')}
              </h3>

              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant dark:text-slate-400">
                  {t('processingTime')}
                </span>
                <span className="font-label-bold font-semibold text-on-surface dark:text-white">
                  {scheme.processingTime || "15-30 Days"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant dark:text-slate-400">
                  {t('approvalRate')}
                </span>
                <span className="font-label-bold font-semibold text-primary dark:text-primary-fixed">
                  {scheme.approvalRate || "85%"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant dark:text-slate-400">
                  Target Occupations
                </span>
                <span className="font-semibold text-on-surface dark:text-white text-right">
                  {scheme.eligibleOccupations && !scheme.eligibleOccupations.includes('ALL')
                    ? scheme.eligibleOccupations.map(getOccupationLabel).join(', ')
                    : 'Open to All Occupations'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant dark:text-slate-400">
                  Target Sectors
                </span>
                <span className="font-semibold text-on-surface dark:text-white text-right">
                  {scheme.eligibleSectors && !scheme.eligibleSectors.includes('ALL')
                    ? scheme.eligibleSectors.map(getSectorLabel).join(', ')
                    : 'Open to All Sectors'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
