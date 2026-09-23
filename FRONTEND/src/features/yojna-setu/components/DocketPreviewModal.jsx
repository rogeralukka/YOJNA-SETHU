import React, { useState, useEffect, useMemo } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import { hashString, verifyPinHash } from '../../../lib/utils/hash';
import { buildDocket } from '../../../engine/docket';
import {
  FileText,
  X,
  Award,
  Code,
  Link2,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Check
} from 'lucide-react';

/**
 * DocketPreviewModal:
 * Two-tab modal providing human-readable entitlement staging and machine-readable JSON-LD proof.
 * Enforces Esc ownership, 3-attempt PIN lockout, zero plaintext PIN storage, and deterministic hash computation.
 */
export function DocketPreviewModal({ isOpen, onClose, scheme }) {
  const { activeMember, setPin } = useHousehold();

  const [activeTab, setActiveTab] = useState('human'); // 'human' | 'json'
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [isConsentVerified, setIsConsentVerified] = useState(false);
  const [isStaging, setIsStaging] = useState(false);
  const [isStagedSuccessfully, setIsStagedSuccessfully] = useState(false);

  // Esc key listener for modal
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLockedOut || lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setIsLockedOut(false);
          setFailedAttempts(0);
          setPinError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLockedOut, lockoutSeconds]);

  // Reset local interactive state when modal opens for a new scheme
  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setPinError('');
      setIsStaging(false);
      setIsStagedSuccessfully(false);
      setIsConsentVerified(false);
    }
  }, [isOpen, scheme?.id]);

  // Invariant Deterministic Local Docket Hash
  const localDocketHash = useMemo(() => {
    if (!scheme || !activeMember) return '0x00000000';

    const verifiedUris = (scheme.delta?.fulfilledDocs || [])
      .map((d) => d.uri)
      .filter(Boolean);

    const canonicalPayload = JSON.stringify({
      applicantId: activeMember.memberId || activeMember.id || '',
      consentType: activeMember.age >= 18 ? 'APPLICANT_SEC_6_1' : 'GUARDIAN_SEC_9',
      schemeId: scheme.id || '',
      verifiedCredentialUris: [...verifiedUris].sort()
    });

    const hash = hashString(canonicalPayload);
    return hash ? `0x${hash}` : '0x00000000';
  }, [scheme, activeMember]);

  if (!isOpen || !scheme || !activeMember) return null;

  const hasEnrolledPin = Boolean(activeMember.consents?.pin);
  const isMinor = (activeMember.age || 0) < 18;
  const consentReceiptText = isMinor
    ? 'Guardian consent receipt (Sec 9)'
    : 'Applicant consent receipt (PIN-verified, Sec 6(1))';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    const cleanPin = pinInput.trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      setPinError('Please enter a valid 4-digit PIN.');
      return;
    }

    if (!hasEnrolledPin) {
      // Set 4-Digit Citizen PIN to Authorize
      setPin(activeMember.memberId, cleanPin);
      setIsConsentVerified(true);
      setPinError('');
      setPinInput('');
    } else {
      // Enter 4-Digit Citizen PIN to Authorize
      const isValid = verifyPinHash(cleanPin, activeMember.consents.pin);
      if (isValid) {
        setIsConsentVerified(true);
        setPinError('');
        setPinInput('');
        setFailedAttempts(0);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        setPinInput('');

        if (nextAttempts >= 3) {
          setIsLockedOut(true);
          setLockoutSeconds(30);
          setPinError('Too many failed attempts. Security lockout active (30s).');
        } else {
          setPinError(`Incorrect PIN. ${3 - nextAttempts} attempt(s) remaining.`);
        }
      }
    }
  };

  const handleStageDocket = () => {
    if (!isConsentVerified || isStaging || isLockedOut) return;

    setIsStaging(true);
    setTimeout(() => {
      setIsStaging(false);
      setIsStagedSuccessfully(true);
    }, 1500);
  };

  // Construct JSON-LD machine-readable payload
  const delta = scheme.delta || { fulfilledDocs: [], missingDocs: [], expiredDocs: [] };
  const baseDocket = buildDocket(
    activeMember,
    scheme,
    delta.fulfilledDocs,
    delta.missingDocs,
    delta.expiredDocs
  );

  const machineReadablePayload = {
    ...baseDocket,
    docketHash: localDocketHash,
    proof: {
      proofType: 'PoC-Placeholder-Unsigned',
      note: 'Unsigned prototype packet — production signing via DigiLocker VC issuer in finale architecture.',
      consentReceipt: isConsentVerified ? consentReceiptText : 'PENDING_AUTHORIZATION'
    }
  };

  return (
    <div
      data-modal-open="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-[#EDEDED]">
                Application Docket Synthesis
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#8A8F98]">
                Verifiable Credential Service Packet · {scheme.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors"
            title="Close Modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center px-6 pt-3 border-b border-neutral-200 dark:border-white/[0.08] gap-4 bg-neutral-50 dark:bg-[#0F1115]">
          <button
            onClick={() => setActiveTab('human')}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'human'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 dark:text-[#8A8F98] hover:text-neutral-900 dark:hover:text-[#EDEDED]'
            }`}
          >
            <Award className="w-4 h-4" />
            Entitlement Docket
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'json'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 dark:text-[#8A8F98] hover:text-neutral-900 dark:hover:text-[#EDEDED]'
            }`}
          >
            <Code className="w-4 h-4" />
            Machine-Readable JSON-LD
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {activeTab === 'human' ? (
            /* TAB 1: Human-Readable Entitlement Docket */
            <div className="space-y-5">
              {/* Applicant Credentials Summary */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98] block">
                  Applicant Credentials & Entitlement Summary
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 dark:text-[#8A8F98] block">Applicant Name</span>
                    <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">{activeMember.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-[#8A8F98] block">Aadhaar (Masked)</span>
                    <span className="font-mono font-semibold text-neutral-900 dark:text-[#EDEDED]">{activeMember.maskedAadhaar}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-[#8A8F98] block">Age / Category</span>
                    <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">{activeMember.age} Yrs · {activeMember.category}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-[#8A8F98] block">Sector</span>
                    <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">{scheme.sector}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500 dark:text-[#8A8F98] block">Target Scheme</span>
                    <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">{scheme.name}</span>
                  </div>
                </div>
              </div>

              {/* Verified DigiLocker URI Pointers */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98] block">
                  Verified DigiLocker Credential Pointers ({delta.fulfilledDocs.length})
                </span>
                <div className="space-y-1.5">
                  {delta.fulfilledDocs.map((doc) => (
                    <div
                      key={doc.docTag}
                      className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#16191F] border border-neutral-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-neutral-800 dark:text-[#EDEDED]">{doc.label}</span>
                      </div>
                      <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                        {doc.uri || `digilocker://${doc.docTag.toLowerCase()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inline Consent Authorization Well */}
              <div className="p-4 rounded-xl bg-neutral-100/90 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#EDEDED] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    Citizen Consent & Authorization
                  </span>
                  {isConsentVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Authorized
                    </span>
                  )}
                </div>

                {!isConsentVerified ? (
                  <form onSubmit={handlePinSubmit} className="space-y-2.5">
                    <label className="block text-xs text-neutral-600 dark:text-[#8A8F98]">
                      {hasEnrolledPin
                        ? 'Enter 4-Digit Citizen PIN to Authorize'
                        : 'Set 4-Digit Citizen PIN to Authorize'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPinInput(val);
                          setPinError('');
                        }}
                        disabled={isLockedOut}
                        placeholder="••••"
                        className="w-32 px-3 py-2 text-center text-base tracking-widest font-mono rounded-lg bg-white dark:bg-[#0F1115] border border-neutral-300 dark:border-white/[0.1] text-neutral-900 dark:text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isLockedOut || pinInput.length !== 4}
                        className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors"
                      >
                        {hasEnrolledPin ? 'Verify PIN' : 'Set & Authorize'}
                      </button>
                    </div>

                    {pinError && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                        {pinError}
                      </p>
                    )}
                    {isLockedOut && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        Lockout active: retry in {lockoutSeconds}s
                      </p>
                    )}
                  </form>
                ) : (
                  /* Consent Receipt Render */
                  <div className="p-3 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 text-xs space-y-1">
                    <div className="font-semibold text-emerald-800 dark:text-emerald-400">
                      {consentReceiptText}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-600 dark:text-[#8A8F98]">
                      Local Docket Hash: <span className="text-blue-600 dark:text-blue-400 font-bold">{localDocketHash}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Staged Success Banner if staged */}
              {isStagedSuccessfully && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    Docket Staged Successfully!
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    PoC simulation — packet staged locally. Zero transmission to any ministry system.
                  </p>
                  <div className="text-[11px] font-mono text-neutral-600 dark:text-[#8A8F98]">
                    Invariant Hash: <span className="font-bold text-neutral-900 dark:text-[#EDEDED]">{localDocketHash}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Machine-Readable JSON-LD / W3C VC Payload */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98]">
                  W3C VC Canonical Staging Payload (JSON-LD)
                </span>
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                  {localDocketHash}
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-neutral-900 dark:bg-[#08090A] text-neutral-200 font-mono text-xs overflow-x-auto border border-neutral-800 dark:border-white/[0.08] leading-relaxed max-h-[340px]">
                {JSON.stringify(machineReadablePayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#0F1115] flex items-center justify-between gap-4">
          <div className="hidden sm:block text-xs font-mono text-neutral-500 dark:text-[#8A8F98]">
            DOCKET: <span className="font-bold text-neutral-800 dark:text-[#EDEDED]">{localDocketHash}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 dark:text-[#8A8F98] hover:bg-neutral-200 dark:hover:bg-[#16191F] transition-colors"
            >
              Close
            </button>

            {activeTab === 'human' && (
              <button
                onClick={handleStageDocket}
                disabled={!isConsentVerified || isStaging || isLockedOut || isStagedSuccessfully}
                className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                {isStaging ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Staging Locally...
                  </>
                ) : isStagedSuccessfully ? (
                  <>
                    <Check className="w-4 h-4" />
                    Staged Locally
                  </>
                ) : (
                  'Stage Docket for Gateway Ingestion (PoC)'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocketPreviewModal;

