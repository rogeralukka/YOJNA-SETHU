import React, { useState } from "react";
import { computeDelta } from "../../engine/deltaResolver";
import { buildDocket } from "../../engine/docket";
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Download
} from "lucide-react";

/**
 * DocketModal:
 * Verifiable Citizen Service Docket (JSON-LD) Preview Modal.
 * Integrates directly with pure engine functions: computeDelta & buildDocket.
 */
export default function DocketModal({
  isOpen,
  onClose,
  scheme,
  activeMember,
  headOfHousehold,
  onSubmit
}) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !scheme || !activeMember) return null;

  // Evaluate live Delta & Docket from pure engine
  const delta = computeDelta(activeMember, headOfHousehold, scheme);
  const docket = buildDocket(
    activeMember,
    scheme,
    delta.fulfilledDocs,
    delta.missingDocs,
    delta.expiredDocs
  );

  const isReady = delta.status === "READY";

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(docket, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(docket, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Docket_${scheme.id}_${(activeMember.name || "Citizen").replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      data-modal-open="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F1115] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-white/[0.08] bg-neutral-50/50 dark:bg-[#16191F]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED]">
                Citizen Service Docket
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#8A8F98]">
                JSON-LD Verifiable Credential Packet • {scheme.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-[#16191F] text-neutral-500 dark:text-[#8A8F98] transition"
            aria-label="Close Docket Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-800 dark:text-[#EDEDED]">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              isReady
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
            }`}
          >
            {isReady ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold uppercase tracking-wider text-xs">
                Status: {delta.status} • {isReady ? "Complete Verifiable Ledger" : "Pending Document Verification"}
              </div>
              <p className="opacity-90 leading-relaxed">
                {isReady
                  ? "All required documents and entitlement credentials are valid, verified via DigiLocker, and compliant with validity ceilings."
                  : "Some documents are missing or have expired according to scheme guidelines. Resolve them to proceed."}
              </p>
            </div>
          </div>

          {/* Citizen Summary Card */}
          <div className="bg-neutral-50 dark:bg-[#16191F] rounded-2xl p-4 border border-neutral-200 dark:border-white/[0.08] text-xs space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98]">
              Active Beneficiary
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium">
              <div>
                <span className="text-neutral-400 block text-[10px]">Name</span>
                <span className="font-bold text-neutral-900 dark:text-[#EDEDED]">{activeMember.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Category</span>
                <span>{activeMember.category || "General"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Aadhaar (Masked)</span>
                <span className="font-mono">{activeMember.maskedAadhaar || "XXXX-XXXX-9012"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">Household Head</span>
                <span>{headOfHousehold?.name || activeMember.name}</span>
              </div>
            </div>
          </div>

          {/* Fulfilled Documents */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98]">
              Verified Documents ({delta.fulfilledDocs.length})
            </h3>
            {delta.fulfilledDocs.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No verified documents available.</p>
            ) : (
              <div className="space-y-2">
                {delta.fulfilledDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-[#EDEDED]">
                          {doc.label}
                        </span>
                        {doc.inheritedFromHead && (
                          <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            Inherited from Head
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing or Expired Documents (Delta) */}
          {(delta.missingDocs.length > 0 || delta.expiredDocs.length > 0) && (
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-500 dark:text-rose-400">
                Delta Requirements ({delta.missingDocs.length + delta.expiredDocs.length})
              </h3>
              <div className="space-y-2">
                {delta.expiredDocs.map((doc, idx) => (
                  <div
                    key={`exp-${idx}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{doc.label} — Expired ({doc.formattedExpiry})</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/50 dark:bg-amber-900/50">
                      RE-FETCH REQUIRED
                    </span>
                  </div>
                ))}
                {delta.missingDocs.map((doc, idx) => (
                  <div
                    key={`miss-${idx}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-900 dark:text-rose-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{doc.label} — Missing from Household Ledger</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200/50 dark:bg-rose-900/50">
                      UPLOAD REQUIRED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JSON-LD Raw Accordion */}
          <div className="pt-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              <span>{showRawJson ? "Hide JSON-LD Payload" : "View Verifiable JSON-LD Schema"}</span>
              {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRawJson && (
              <pre className="mt-2 p-3 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto max-h-48 border border-neutral-800">
                {JSON.stringify(docket, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-[#16191F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-[#1D212A] transition flex items-center gap-1.5 text-neutral-700 dark:text-neutral-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy JSON-LD"}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-[#1D212A] transition flex items-center gap-1.5 text-neutral-700 dark:text-neutral-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-[#1D212A] text-neutral-600 dark:text-[#8A8F98] transition"
            >
              Close
            </button>

            {onSubmit && (
              <button
                onClick={() => {
                  onSubmit(docket);
                  onClose();
                }}
                disabled={!isReady}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  isReady
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                    : "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed"
                }`}
              >
                Submit with Verified Docket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

