import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const ReviewApplication = () => {
  const {
    applications,
    selectedApplicationId,
    approveApplication,
    rejectApplication,
    setReviewLater,
    navigateTo,
    showToast
  } = useData();
  const { t } = useLang();

  // Find active application or fallback to first pending
  const application =
    applications.find((a) => a.applicationId === selectedApplicationId) ||
    applications.find((a) => a.status === 'Pending') ||
    applications[0];

  const [rejectionNotes, setRejectionNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!application) {
    return (
      <div className="p-8 text-center">
        <p>No applications available for review.</p>
        <button
          onClick={() => navigateTo('admin-all-applications')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-xs"
        >
          Back to All Applications
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    approveApplication(application.applicationId);
    setErrorMsg('');
  };

  const handleReject = () => {
    if (!rejectionNotes.trim()) {
      setErrorMsg("A rejection reason is mandatory before submitting rejection.");
      return;
    }
    const success = rejectApplication(application.applicationId, rejectionNotes);
    if (success) {
      setErrorMsg('');
    }
  };

  const handleReviewLater = () => {
    setReviewLater(application.applicationId, true);
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-margin-desktop gap-6 pb-24 animate-fade-in-up">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-label-bold text-outline dark:text-slate-400 uppercase tracking-wider mb-2">
            <span
              onClick={() => navigateTo('admin-all-applications')}
              className="cursor-pointer hover:text-primary"
            >
              {t('allApplications')}
            </span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-primary dark:text-primary-fixed">
              Application #{application.applicationId}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface dark:text-white flex items-center gap-3 flex-wrap">
            <span>{t('reviewApplications')}</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-status-badge font-bold uppercase tracking-wider ${
                application.status === 'Approved'
                  ? 'bg-[#E8F5E9] text-[#1B5E20]'
                  : application.status === 'Rejected'
                  ? 'bg-[#FFEBEE] text-[#C62828]'
                  : 'bg-tertiary-container/20 text-tertiary dark:text-tertiary-fixed'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>{t('status_' + application.status.toLowerCase().replace(/ /g, '_'), {}, application.status)}</span>
            </span>

            {application.reviewLater && (
              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                {t('inReviewLaterQueue', {}, 'In Review Later Queue')}
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-300 shadow-sm"
            title="Print Application"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid (8 Cols Left, 4 Cols Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Applicant Info Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

            <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">person</span>
              <span>{t('applicantDetails')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs sm:text-sm">
              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('fullName')}
                </span>
                <p className="font-bold text-on-surface dark:text-white text-base">
                  {application.userName}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('email')}
                </span>
                <p className="font-medium text-on-surface dark:text-white">
                  {application.userEmail}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('mobile')}
                </span>
                <p className="font-medium text-on-surface dark:text-white">
                  {application.userPhone}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('citizenId')}
                </span>
                <p className="font-mono font-bold text-primary dark:text-primary-fixed bg-surface-container-low dark:bg-slate-900 px-2.5 py-1 rounded-md inline-block">
                  {application.userId}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('stateCategory')}
                </span>
                <p className="font-medium text-on-surface dark:text-white">
                  {application.userState} ({application.userCategory})
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('annualIncome')}
                </span>
                <p className="font-medium text-on-surface dark:text-white">
                  {application.userIncome}
                </p>
              </div>
            </div>
          </div>

          {/* Business Info Card (if business application) */}
          {application.entityType === 'business' && (
            <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none" />

              <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">domain</span>
                <span>{t('businessDetails')}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs sm:text-sm">
                <div>
                  <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                    {t('legalName')}
                  </span>
                  <p className="font-bold text-on-surface dark:text-white text-base">
                    {application.businessDetails?.businessName || application.entityName}
                  </p>
                </div>

                <div>
                  <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                    {t('gstNumber')}
                  </span>
                  <p className="font-mono font-medium text-on-surface dark:text-white">
                    {application.businessDetails?.gst || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                    {t('panNumber')}
                  </span>
                  <p className="font-mono font-medium text-on-surface dark:text-white">
                    {application.businessDetails?.pan || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                    {t('turnoverSector')}
                  </span>
                  <p className="font-medium text-on-surface dark:text-white">
                    {application.businessDetails?.industry || "Commercial Services"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scheme Applied For Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700">
            <h3 className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant dark:text-slate-400 mb-3">
              {t('targetGovInitiative')}
            </h3>
            <div className="flex items-center gap-3 bg-surface-container-low dark:bg-slate-900 p-4 rounded-xl">
              <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">account_balance</span>
              </div>
              <div>
                <h4 className="font-headline-md text-base font-bold text-on-surface dark:text-white">
                  {t('scheme_' + (application.schemeIds?.[0] || ''), {}, application.schemeName)}
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400">
                  {t('category')}: {t('category_' + application.schemeCategory.replace(/ /g, '_'), {}, application.schemeCategory)}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">account_balance_wallet</span>
                <span>{t('bankDetails')}</span>
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span> {t('linkedVerified')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('bankName')}
                </span>
                <p className="font-bold text-on-surface dark:text-white">
                  {application.bankDetails?.bankName || "State Bank of India"}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('accountNumber')}
                </span>
                <p className="font-mono font-bold text-on-surface dark:text-white">
                  {application.bankDetails?.accountNumber || "**** **** 9824"}
                </p>
              </div>

              <div>
                <span className="text-on-surface-variant dark:text-slate-400 block mb-1 font-semibold">
                  {t('ifscCode')}
                </span>
                <p className="font-mono font-bold text-on-surface dark:text-white">
                  {application.bankDetails?.ifsc || "SBIN0001234"}
                </p>
              </div>
            </div>
          </div>

          {/* Submitted Documents Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700">
            <h2 className="text-base sm:text-lg font-headline-md font-bold text-on-surface dark:text-white mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">description</span>
              <span>{t('verificationDocuments')}</span>
            </h2>

            <div className="flex flex-col gap-3">
              {application.documents?.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low dark:bg-slate-900 hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-on-surface dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                        {doc.size} • Uploaded {doc.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => showToast(`Previewing ${doc.name}`, 'info')}
                      className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-slate-800 text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors"
                      title="Preview Document"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button
                      onClick={() => showToast(`Downloaded ${doc.name}`, 'success')}
                      className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-slate-800 text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors"
                      title="Download Document"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) - Sticky Verdict & Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
          {/* Review Verdict Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-slate-700 overflow-hidden">
            <div className="p-5 bg-primary text-on-primary">
              <h3 className="text-base font-headline-md font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">gavel</span>
                <span>{t('reviewVerdict')}</span>
              </h3>
              <p className="text-xs mt-0.5 opacity-90">
                {t('finalizeVerdictSubtitle')}
              </p>
            </div>

            <div className="p-6">
              {/* Error if rejecting without mandatory reason */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Notes Textarea */}
              <label className="block text-xs font-label-bold text-on-surface dark:text-slate-200 mb-2">
                {t('rejectionReasonPrompt')}
              </label>
              <textarea
                value={rejectionNotes}
                onChange={(e) => {
                  setRejectionNotes(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full h-28 bg-surface-container-low dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-700 rounded-xl p-3 text-xs text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-outline-variant"
                placeholder={t('rejectionNotesPlaceholder')}
              />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 mt-5">
                {/* Approve Button */}
                <button
                  onClick={handleApprove}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-label-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{t('approveApplication')}</span>
                </button>

                {/* Reject Button (requires reason) */}
                <button
                  onClick={handleReject}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-error to-[#991b1b] text-white font-label-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>{t('rejectApplication')}</span>
                </button>

                <div className="h-[1px] bg-outline-variant/30 dark:bg-slate-700 my-1" />

                {/* Review Later Workflow Action */}
                <button
                  onClick={handleReviewLater}
                  className="w-full py-2.5 px-4 rounded-xl bg-transparent text-on-surface dark:text-slate-300 font-label-bold text-xs flex items-center justify-center gap-2 border border-outline-variant dark:border-slate-700 hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>{t('markReviewLater')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700">
            <h3 className="font-headline-md text-sm font-bold text-on-surface dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">history</span>
              <span>{t('appTimelineVerification')}</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-variant dark:before:bg-slate-700 text-xs">
              {application.timeline?.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full z-10 ${
                      step.completed ? 'bg-primary ring-2 ring-white' : 'bg-outline-variant ring-2 ring-white'
                    }`}
                  />
                  <p className="font-bold text-on-surface dark:text-white leading-tight">
                    {t('timeline_' + step.title.toLowerCase().replace(/ /g, '_'), {}, step.title)}
                  </p>
                  <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                    {step.date === 'Pending' ? t('pending') : step.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Card */}
          <div className="rounded-2xl overflow-hidden shadow-md h-40 relative group border border-outline-variant/30 dark:border-slate-700">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_G929012FJZUPFOzEq_Sty7y4_bwL8gtX8ItnYs7Yc8uToQIDBxcJ3yXwHej8Ye3F0ETO9UQ4IDfaJTwEyL-10kl-0wdo0_Mkkd_KhH0ItpUXkP7Dnwjtfl9oLHg-Ex9DbI418YEvxVIJf0U3-JktjMeAFG4ytoTEdaV3BtDr6GnHdHKSAo26Cp_XvSwHaczIvzME9FBBuoAo0OeyqkXwnlQfBYdTjAt19JeVL374r-o3qo0siIKo1A')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 text-white">
              <p className="text-[10px] font-label-bold uppercase tracking-wider opacity-80">
                {t('registeredJurisdiction', {}, 'Registered Jurisdiction')}
              </p>
              <p className="text-sm font-bold font-headline-md">
                {application.userState || "Uttar Pradesh, India"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
