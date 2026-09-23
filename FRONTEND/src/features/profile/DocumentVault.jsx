import React, { useState } from "react";
import {
  FolderKanban,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Loader2,
  Lock,
  UserCheck
} from "lucide-react";
import { useHousehold } from "../../context/HouseholdContext";
import PinGateModal from "../../components/shared/PinGateModal";

/**
 * Format ISO date string (YYYY-MM-DD or ISO-8601) to DD-MM-YYYY per Global Rules.
 */
function formatDate(isoStr) {
  if (!isoStr) return "N/A";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    return isoStr;
  }
}

export default function DocumentVault() {
  const {
    household,
    activeMemberId,
    activeMember,
    headOfHousehold,
    setActiveMember,
    simulateIssuancePull
  } = useHousehold();

  const [pinTargetMember, setPinTargetMember] = useState(null);
  const [showPiiTooltip, setShowPiiTooltip] = useState(false);
  const [pullingDocs, setPullingDocs] = useState({});
  const [pullToast, setPullToast] = useState(null);

  const members = household?.members || [];
  const currentMember = activeMember || members[0];

  // Check if Ramesh (Head) has an expired income certificate that blocks dependents (like Priya)
  const headIncomeDoc = headOfHousehold?.documents?.find((d) => d.docTag === "DOC_INCOME_CERT");
  const isHeadIncomeExpired = !!headIncomeDoc && (headIncomeDoc.isExpired || headIncomeDoc.status === "EXPIRED");

  // Show inherited blocker banner on Priya's view if Head's income doc is expired
  const showInheritedBlocker = currentMember?.memberId !== headOfHousehold?.memberId && isHeadIncomeExpired;

  const handleMemberTabClick = (targetMember) => {
    if (targetMember.memberId === activeMemberId) return;
    // Single Source of Truth for Member Switching (Addendum 2): Open PinGateModal
    setPinTargetMember(targetMember);
  };

  const handlePinSuccess = (targetMember) => {
    setPinTargetMember(null);
    // Simultaneously updates DocumentVault and TopNav ProfileChip via context
    setActiveMember(targetMember.memberId);
  };

  const handlePinCancel = () => {
    setPinTargetMember(null);
  };

  const handleFetchIssuance = (memberId, docTag) => {
    const key = `${memberId}_${docTag}`;
    setPullingDocs((prev) => ({ ...prev, [key]: true }));

    setTimeout(() => {
      simulateIssuancePull(memberId, docTag);
      setPullingDocs((prev) => ({ ...prev, [key]: false }));
      setPullToast("Latest Income Certificate verified & updated via State e-District DigiLocker Pull API!");
      setTimeout(() => setPullToast(null), 5000);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-[#0F1115] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Toast Notification */}
      {pullToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-xs font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-white shrink-0" />
          <span>{pullToast}</span>
          <button
            onClick={() => setPullToast(null)}
            className="text-white/80 hover:text-white font-bold ml-2 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Card Header & PII Tooltip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.08] pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400">
            <FolderKanban size={20} />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#EDEDED]">
              Document Ledger (DigiLocker URI Pointers)
            </h2>

            {/* Clickable PII Tooltip Badge (Rule 20 / Item 6) */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setShowPiiTooltip((prev) => !prev)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                aria-label="Zero Raw PII Storage Protocol Information"
              >
                <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
                <span>Zero Raw PII Storage Protocol</span>
                <Info size={12} className="text-blue-500" />
              </button>

              {showPiiTooltip && (
                <div className="absolute left-0 top-8 z-50 w-80 p-4 rounded-xl bg-white dark:bg-[#0F1115] shadow-xl border border-slate-200 dark:border-white/[0.08] text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-[#EDEDED]">
                    <span>Data Privacy & Security Architecture</span>
                    <button
                      onClick={() => setShowPiiTooltip(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-[#8A8F98] leading-relaxed text-[11px]">
                    NagrikPath never stores plaintext Aadhaar numbers, biometric payloads, or uploaded files on central servers.
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-[#8A8F98]/80 pt-1">
                    <li className="flex items-start space-x-1.5">
                      <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>DigiLocker URI Pointers:</strong> All verification records link directly to authoritative issuer endpoints.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Consent Gated:</strong> Every credential access requires the citizen's 4-digit PIN.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-400 dark:text-[#8A8F98] font-mono self-start sm:self-auto">
          DigiLocker Pulled Records
        </span>
      </div>

      {/* MEMBER VAULT SWITCHER TABS (Single Source of Truth, Addendum 2) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8A8F98]">
          Select Citizen Member Vault (Consent PIN Verification Required)
        </div>
        <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-white/[0.08] pb-3">
          {members.map((m) => {
            const isActive = m.memberId === currentMember.memberId;
            return (
              <button
                key={m.memberId}
                type="button"
                onClick={() => handleMemberTabClick(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-slate-50 dark:bg-[#16191F] text-slate-600 dark:text-[#8A8F98] border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-[#1D212A] dark:hover:text-[#EDEDED]"
                }`}
              >
                <UserCheck size={14} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{m.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-[#08090A] text-slate-600 dark:text-[#8A8F98]"}`}>
                  {m.relation}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* INHERITED SCHEME BLOCKER BANNER (Addendum 3) */}
      {showInheritedBlocker && (
        <div className="p-4 rounded-xl bg-rose-500/[0.06] dark:bg-rose-500/[0.08] border border-rose-500/20 text-rose-900 dark:text-rose-200 space-y-1.5 animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold text-xs">
            <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Inherited Entitlement Blocker Notice</span>
          </div>
          {/* Exact String from Specification (Item 6 & Addendum 3) */}
          <p className="text-xs font-semibold pl-6 text-rose-600 dark:text-rose-400">
            Inherited from Head of Household — EXPIRED (31-03-2024)
          </p>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 pl-6 leading-relaxed">
            Welfare schemes requiring household income verification (e.g. Post-Matric OBC Scholarship) are currently blocked.
          </p>
          <div className="pl-6 pt-1">
            <button
              type="button"
              onClick={() => {
                const ramesh = members.find((m) => m.name.includes("Ramesh") || m.relation === "Head") || headOfHousehold;
                if (ramesh) handleMemberTabClick(ramesh);
              }}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer inline-flex items-center space-x-1"
            >
              <span>Switch to Ramesh Kumar's vault to pull latest issuance →</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE MEMBER'S OWN DOCUMENTS GRID ONLY (Item 19 & Addendum 3) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-900 dark:text-[#EDEDED]">
              {currentMember.name}'s Verified Credentials Vault
            </span>
            <span className="text-xs text-slate-400 dark:text-[#8A8F98] font-mono">
              ({currentMember.maskedAadhaar})
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-[#8A8F98] font-medium">
            {currentMember.documents?.length || 0} Registered Document(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {currentMember.documents?.map((doc, dIdx) => {
            const isExpired = doc.isExpired || doc.status === "EXPIRED";
            const pullKey = `${currentMember.memberId}_${doc.docTag}`;
            const isPulling = !!pullingDocs[pullKey];

            return (
              <div
                key={dIdx}
                className={`h-full flex flex-col justify-between p-5 rounded-2xl border text-xs shadow-sm transition-all duration-200 ${
                  isExpired
                    ? "border-rose-500/30 bg-rose-500/[0.04] dark:bg-rose-500/[0.08]"
                    : "border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#16191F]"
                }`}
              >
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-[#EDEDED]">
                      {doc.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        isExpired
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      {isExpired ? (
                        "EXPIRED"
                      ) : (
                        <>
                          <span>VERIFIED</span>
                          <Check size={11} />
                        </>
                      )}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-[#8A8F98] flex-1">
                    <div>Issuer: <span className="font-semibold text-slate-700 dark:text-[#EDEDED]">{doc.issuer}</span></div>
                    <div className="font-mono text-[10px] truncate text-slate-400 dark:text-[#8A8F98]/70">URI: {doc.uri}</div>
                    <div>Issued On: <span className="font-medium text-slate-600 dark:text-[#EDEDED]">{formatDate(doc.issuedOn)}</span></div>
                    {doc.expiresOn && (
                      <div className={isExpired ? "font-bold text-red-600 dark:text-red-400" : ""}>
                        Expires On: {formatDate(doc.expiresOn)}
                      </div>
                    )}
                    {isExpired && (
                      <div className="font-semibold text-red-600 dark:text-red-400 pt-1 text-xs">
                        Document EXPIRED ({formatDate(doc.expiresOn)})
                      </div>
                    )}
                  </div>
                </div>

                {/* Exact DPI Action Button with 1.5s simulated loading (Item 5 & Item 7) */}
                {isExpired && doc.docTag === "DOC_INCOME_CERT" && (
                  <div className="pt-3 mt-3 border-t border-red-200 dark:border-red-900/40">
                    <button
                      type="button"
                      disabled={isPulling}
                      onClick={() => handleFetchIssuance(currentMember.memberId, doc.docTag)}
                      className="w-full text-center px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
                    >
                      {isPulling ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span>Pulling from State e-District...</span>
                        </>
                      ) : (
                        <span>Fetch Latest Issuance (State e-District via DigiLocker Pull API)</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PinGateModal for Gated Vault Member Switching */}
      {pinTargetMember && (
        <PinGateModal
          isOpen={!!pinTargetMember}
          targetMember={pinTargetMember}
          onSuccess={handlePinSuccess}
          onCancel={handlePinCancel}
        />
      )}
    </div>
  );
}
