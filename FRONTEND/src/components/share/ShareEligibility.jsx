import { api } from '../../services/api';
import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';

export const ShareEligibility = () => {
  const { userProfile, schemes, activeContext, businesses, showToast, navigateTo } = useData();
  const { t } = useLang();

  const activeBusiness = businesses.find((b) => b.id === activeContext);

  const eligibleSchemes = schemes.filter((s) => {
    if (activeContext === 'personal') return !s.isBusinessScheme;
    return s.isBusinessScheme;
  }).slice(0, 4);

  const handleCopyLink = () => {
    const mockUrl = `${window.location.origin}/share/eligibility/${userProfile.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mockUrl).catch(() => {});
    }
    showToast(t('linkCopiedToast'));
  };

  const handleDownloadPdf = async () => {
    try {
      showToast('Generating official PDF certificate...');
      const blob = await api.downloadPdfReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `YojnaSetu_Eligibility_${(userProfile.name || 'Citizen').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Official PDF downloaded successfully!');
    } catch (e) {
      window.print();
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 sm:p-6 lg:p-10 min-h-[calc(100vh-64px)] animate-fade-in-up">
      {/* Modal / Card */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest dark:bg-slate-900 rounded-[28px] shadow-2xl border border-outline-variant/30 dark:border-slate-800 overflow-hidden">
        {/* Glows */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-surface-container-low/60 dark:bg-slate-800/60 border-b border-surface-variant dark:border-slate-800 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">ios_share</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {t('shareEligibilityTitle')}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
                {t('shareEligibilitySubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-9 h-9 rounded-full bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-8 relative z-10 flex flex-col gap-6">
          {/* Applicant / Business Profile Summary Card */}
          <div className="bg-surface-container-low dark:bg-slate-800/80 rounded-2xl p-5 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface dark:text-slate-200">
                {activeContext === 'personal' ? t('applicantProfile') : t('enterpriseProfile')}
              </span>
              <span className="font-status-badge text-[11px] bg-primary-container text-on-primary-container px-3 py-0.5 rounded-full font-bold">
                {t('verifiedResident')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-on-surface-variant dark:text-slate-400">{t('fullName')}</span>
                <span className="font-semibold text-on-surface dark:text-white truncate">
                  {activeContext === 'personal' ? userProfile.name : activeBusiness?.businessName}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-on-surface-variant dark:text-slate-400">
                  {activeContext === 'personal' ? t('age') : t('businessType')}
                </span>
                <span className="font-semibold text-on-surface dark:text-white">
                  {activeContext === 'personal' ? `${userProfile.age} Years` : activeBusiness?.businessType}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-on-surface-variant dark:text-slate-400">{t('state')}</span>
                <span className="font-semibold text-on-surface dark:text-white">
                  {userProfile.state}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-on-surface-variant dark:text-slate-400">{t('category')}</span>
                <span className="font-semibold text-on-surface dark:text-white">
                  {userProfile.category}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 sm:col-span-2">
                <span className="text-on-surface-variant dark:text-slate-400">
                  {activeContext === 'personal' ? t('annualIncome') : t('annualTurnover')}
                </span>
                <span className="font-semibold text-on-surface dark:text-white">
                  ₹ {activeContext === 'personal' ? userProfile.income.toLocaleString('en-IN') : activeBusiness?.annualTurnover}
                </span>
              </div>
            </div>
          </div>

          {/* Qualified Schemes List */}
          <div className="flex flex-col gap-3">
            <h3 className="font-label-bold text-xs uppercase tracking-wider text-on-surface dark:text-slate-200">
              {t('eligibleSchemesTitle', { count: eligibleSchemes.length })}
            </h3>

            <ul className="flex flex-col gap-2.5">
              {eligibleSchemes.map((s) => (
                <li
                  key={s.id}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 dark:border-slate-700"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-body-md text-xs sm:text-sm text-on-surface dark:text-white font-bold truncate">
                      {t('scheme_' + s.id, {}, s.name)}
                    </span>
                    <span className="font-body-sm text-xs text-primary dark:text-primary-fixed font-medium">
                      {t('benefit_' + s.id, {}, s.benefit)} • {t('dept_' + s.id, {}, s.department)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-5 sm:p-6 bg-surface-container-low/60 dark:bg-slate-800/60 border-t border-surface-variant dark:border-slate-800 relative z-10">
          <button
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 rounded-full flex items-center gap-2 font-label-bold text-xs text-secondary dark:text-slate-200 border border-outline-variant dark:border-slate-700 hover:bg-surface-container dark:hover:bg-slate-700 transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>{t('downloadPdf')}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-6 py-2.5 rounded-full flex items-center gap-2 font-label-bold text-xs text-on-primary bg-gradient-to-r from-primary to-[#1E3A5F] shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>{t('copyLink')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
