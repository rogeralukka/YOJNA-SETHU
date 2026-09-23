import React, { useState } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import { useSchemeEvaluation } from '../../../features/yojna-setu/hooks/useSchemeEvaluation';
import { useLang } from '../../context/LangContext';
import { useData } from '../../context/DataContext';
import { verifyPinHash, hashString } from '../../../lib/utils/hash';
import {
  Share2,
  X,
  Lock,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Check,
  Copy,
  FileDown,
  ArrowRight
} from 'lucide-react';

export const ShareEligibility = () => {
  const { activeMember } = useHousehold();
  const { evaluatedSchemes, totalEligible, eligibleReadyCount, eligibleBlockedCount } = useSchemeEvaluation();
  const { showToast, navigateTo } = useData();
  const { t } = useLang();

  const [pin, setPin] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const eligibleList = evaluatedSchemes.filter((s) => s.state !== 'INELIGIBLE');

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setPinError('Please enter your 4-digit security PIN.');
      return;
    }

    if (activeMember?.pinHash) {
      if (verifyPinHash(pin, activeMember.pinHash)) {
        setIsPinVerified(true);
        setPinError('');
      } else {
        setPinError('Incorrect PIN. Please check your credentials.');
      }
    } else {
      if (pin.length === 4) {
        setIsPinVerified(true);
        setPinError('');
      } else {
        setPinError('PIN must be 4 digits.');
      }
    }
  };

  // Generate deterministic client-side share token
  const sharePayload = JSON.stringify({
    memberId: activeMember?.id || 'citizen',
    name: activeMember?.name || 'Citizen',
    totalEligible,
    eligibleReadyCount,
    eligibleBlockedCount,
    schemes: eligibleList.map((s) => s.id).sort()
  });

  const shareCode = `NP-SHR-${hashString(sharePayload) || '4F89A2B1'}`.toUpperCase();
  const shareUrl = `${window.location.origin}/share/eligibility?code=${shareCode}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setIsCopied(true);
    showToast(t('linkCopiedToast') || 'Share link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    showToast('Generating official offline summary certificate...');
    window.print();
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 sm:p-6 lg:p-10 min-h-[calc(100vh-64px)]">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F1115] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/[0.08] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-neutral-50/70 dark:bg-[#16191F] border-b border-neutral-200 dark:border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED]">
                {t('shareEligibilityTitle') || 'Share Your Eligibility'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#8A8F98] mt-0.5">
                Consent-Gated Offline Eligibility Packet
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#16191F] hover:bg-neutral-200 dark:hover:bg-[#1D212A] text-neutral-500 dark:text-[#8A8F98] hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors flex items-center justify-center cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Content */}
        {!isPinVerified ? (
          /* PIN Verification Gate */
          <div className="p-6 sm:p-8 relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] mb-1">
              Citizen Authorization Required
            </h3>
            <p className="text-xs text-neutral-500 dark:text-[#8A8F98] max-w-sm mb-6">
              Enter the 4-digit citizen security PIN for <strong>{activeMember?.name || 'Citizen'}</strong> to authorize generation of the eligibility share code.
            </p>

            <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="••••"
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-neutral-100 dark:bg-[#16191F] border border-neutral-300 dark:border-white/[0.08] rounded-2xl text-neutral-900 dark:text-[#EDEDED] outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-500 mt-2 font-medium">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Unlock Share Summary</span>
              </button>
            </form>
          </div>
        ) : (
          /* Verified Share Summary */
          <div className="p-6 sm:p-8 relative z-10 flex flex-col gap-6">
            {/* Applicant Summary Card */}
            <div className="bg-neutral-50 dark:bg-[#16191F] rounded-2xl p-5 shadow-xs border border-neutral-200 dark:border-white/[0.08] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#EDEDED]">
                  Applicant Profile Summary
                </span>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Resident</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-neutral-500 dark:text-[#8A8F98]">Full Name</span>
                  <span className="font-semibold text-neutral-800 dark:text-[#EDEDED] truncate">
                    {activeMember?.name || 'Citizen'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-neutral-500 dark:text-[#8A8F98]">Age</span>
                  <span className="font-semibold text-neutral-800 dark:text-[#EDEDED]">
                    {activeMember?.age || 19} Years
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-neutral-500 dark:text-[#8A8F98]">State</span>
                  <span className="font-semibold text-neutral-800 dark:text-[#EDEDED]">
                    {activeMember?.state || 'Telangana'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-neutral-500 dark:text-[#8A8F98]">Category</span>
                  <span className="font-semibold text-neutral-800 dark:text-[#EDEDED]">
                    {activeMember?.category || 'OBC'}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 sm:col-span-2">
                  <span className="text-neutral-500 dark:text-[#8A8F98]">Discovered Entitlements</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {totalEligible} Schemes ({eligibleReadyCount} Ready · {eligibleBlockedCount} Action Pending)
                  </span>
                </div>
              </div>
            </div>

            {/* Qualified Schemes List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#EDEDED]">
                Eligible Schemes ({eligibleList.length})
              </h3>

              <ul className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                {eligibleList.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08]"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate">
                        {s.name}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-[#8A8F98]">
                        {s.benefitSummary || s.benefit || 'Direct Entitlement'} · {s.level || 'CENTRAL'} Level
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share Code Box */}
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98] block">
                  Deterministic Offline Share Code
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate block">
                  {shareCode}
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0F1115] hover:bg-neutral-200 dark:hover:bg-[#252A35] text-neutral-800 dark:text-[#EDEDED] text-xs font-semibold border border-neutral-200 dark:border-white/[0.08] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {isPinVerified && (
          <div className="flex items-center justify-end gap-3 p-5 sm:p-6 bg-neutral-50/70 dark:bg-[#16191F] border-t border-neutral-200 dark:border-white/[0.08] relative z-10">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1115] hover:bg-neutral-100 dark:hover:bg-[#1D212A] transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareEligibility;
