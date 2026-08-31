import React from 'react';
import { useLang } from '../../context/LangContext';

export const ApplicationDetailModal = ({ application, isOpen, onClose }) => {
  const { t } = useLang();

  if (!isOpen || !application) return null;

  const statusColors = {
    Approved: 'bg-[#E6F4EA] text-[#137333] border-emerald-200',
    Pending: 'bg-[#FEF7E0] text-[#B06000] border-amber-200',
    'In Review': 'bg-secondary-container text-on-secondary-container border-blue-200',
    Rejected: 'bg-[#FCE8E6] text-[#C5221F] border-red-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-outline-variant/30 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-surface-variant dark:border-slate-800 flex justify-between items-center bg-surface-container-low/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">
                {application.entityType === 'business' ? 'storefront' : 'person'}
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white truncate max-w-sm">
                {t('scheme_' + (application.schemeIds?.[0] || ''), {}, application.schemeName)}
              </h2>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-slate-400">
                <span className="font-mono font-semibold">{application.applicationId}</span>
                <span>•</span>
                <span>{t('applyingAs')}: {application.entityName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[application.status] || statusColors.Pending}`}>
              {t('status_' + application.status.toLowerCase().replace(/ /g, '_'), {}, application.status)}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-surface-container dark:hover:bg-slate-700 text-on-surface-variant dark:text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Rejection Alert if rejected */}
          {application.status === 'Rejected' && application.adminComment && (
            <div className="p-4 rounded-xl bg-error-container/30 dark:bg-error/20 border border-error/30 flex gap-3 text-xs">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                error
              </span>
              <div>
                <strong className="text-error font-label-bold block mb-0.5">
                  {t('rejectionReasonPrompt')}
                </strong>
                <p className="text-on-surface dark:text-slate-200 leading-relaxed">
                  {t('rejection_' + (application.schemeIds?.[0] || 'general'), {}, application.adminComment)}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant dark:text-slate-400 mb-4">
              {t('appTimelineVerification')}
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-variant dark:before:bg-slate-700">
              {application.timeline?.map((step, idx) => (
                <div key={idx} className="relative flex items-start group">
                  <div
                    className={`absolute -left-[23px] flex items-center justify-center w-5 h-5 rounded-full z-10 ${
                      step.completed
                        ? 'bg-primary text-white ring-4 ring-surface-container-lowest dark:ring-slate-900'
                        : 'bg-outline-variant/50 text-transparent ring-4 ring-surface-container-lowest dark:ring-slate-900'
                    }`}
                  >
                    {step.completed && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                  </div>

                  <div className="flex-1 bg-surface-container-low dark:bg-slate-800/80 rounded-xl p-4 ml-2">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-label-bold text-xs sm:text-sm font-semibold text-on-surface dark:text-white">
                        {t('timeline_' + step.title.toLowerCase().replace(/ /g, '_'), {}, step.title)}
                      </h4>
                      <span className="font-body-sm text-[11px] text-on-surface-variant dark:text-slate-400">
                        {step.date === 'Pending' ? t('pending') : step.date}
                      </span>
                    </div>
                    {step.desc && (
                      <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-300 mt-1">
                        {t('timelineDesc_' + step.title.toLowerCase().replace(/ /g, '_'), {}, step.desc)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicant & Bank Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-surface-container-low dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <span className="font-label-bold uppercase tracking-wider text-[10px] text-on-surface-variant dark:text-slate-400 block mb-2">
                {t('applicantDetails')}
              </span>
              <p className="font-medium text-on-surface dark:text-slate-200">
                <strong>{t('fullName')}:</strong> {application.userName}
              </p>
              <p className="font-medium text-on-surface dark:text-slate-200">
                <strong>{t('state')}:</strong> {application.userState} ({application.userCategory})
              </p>
              <p className="font-medium text-on-surface dark:text-slate-200">
                <strong>{t('mobile')}:</strong> {application.userPhone}
              </p>
            </div>

            <div className="p-4 bg-surface-container-low dark:bg-slate-800 rounded-xl space-y-1 text-xs">
              <span className="font-label-bold uppercase tracking-wider text-[10px] text-on-surface-variant dark:text-slate-400 block mb-2">
                {t('bankDetails')}
              </span>
              <p className="font-medium text-on-surface dark:text-slate-200">
                <strong>{t('bankName')}:</strong> {application.bankDetails?.bankName || "SBI"}
              </p>
              <p className="font-mono font-medium text-on-surface dark:text-slate-200">
                <strong>{t('accountNumber')}:</strong> {application.bankDetails?.accountNumber || "XXXX-9824"}
              </p>
              <p className="font-mono font-medium text-on-surface dark:text-slate-200">
                <strong>{t('ifscCode')}:</strong> {application.bankDetails?.ifsc || "SBIN0001234"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low/70 dark:bg-slate-800/70 border-t border-surface-container dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-primary text-white font-label-bold text-xs hover:bg-primary-container transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
