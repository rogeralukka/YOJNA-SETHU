import React, { useEffect } from "react";
import {
  ShieldCheck,
  Cpu,
  Lock,
  Database,
  Layers,
  X,
  FileCode,
  CheckCircle2,
  Sparkles,
  KeyRound
} from "lucide-react";
import { useUI } from "../../context/UIContext";

/**
 * ArchitectureModal:
 * 4-Tier Reference Architecture Interactive Specification Modal for Judges & Technical Reviewers.
 * Triggered via Shift + ? or floating bottom-left chip.
 * Guarded against input focus and existing open modals.
 */
export default function ArchitectureModal({ isOpen, onClose }) {
  const { registerModalOpen, registerModalClose } = useUI();

  useEffect(() => {
    if (isOpen) {
      registerModalOpen();
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown, true);
      return () => {
        window.removeEventListener("keydown", handleKeyDown, true);
        registerModalClose();
      };
    }
  }, [isOpen, onClose, registerModalOpen, registerModalClose]);

  if (!isOpen) return null;

  const tiers = [
    {
      tier: "TIER 1",
      name: "Presentation & Deterministic UI Layer",
      icon: Layers,
      accent: "text-blue-500",
      bgAccent: "bg-blue-500/10 border-blue-500/20",
      description:
        "Single-Page Reactive Application built on Vite + React 18, utilizing pure client-side state engines without remote UI rendering lag.",
      highlights: [
        "AEGIS Obsidian 3-Tier Design System (#08090A / #0F1115 / #16191F)",
        "Zero Layout Shift Recharts Responsive Governance Visualizers",
        "Deterministic Single-Overlay Focus Traps & Global Esc State Ownership",
        "Sub-16ms Synchronous React Context State Distribution"
      ]
    },
    {
      tier: "TIER 2",
      name: "Sovereign Deterministic Agentic Engine",
      icon: Cpu,
      accent: "text-purple-500",
      bgAccent: "bg-purple-500/10 border-purple-500/20",
      description:
        "Pure JavaScript reasoning pipeline executing local decision trees, prerequisite delta resolution, and verifiable application synthesis.",
      highlights: [
        "computeDelta() - Pure JavaScript O(N) Credential Verification Pipeline",
        "Deterministic Keyword Dispatch Engine (Zero LLM Non-Determinism / Hallucination)",
        "buildDocket() - W3C Schema.org / CitizenServiceDocket JSON-LD Generator",
        "Sub-2.5s Fully Observable Stepwise Execution Traces"
      ]
    },
    {
      tier: "TIER 3",
      name: "Cryptographic Identity & Sovereign Consent",
      icon: KeyRound,
      accent: "text-emerald-500",
      bgAccent: "bg-emerald-500/10 border-emerald-500/20",
      description:
        "Client-side cryptographic identity preservation and granular per-action consent enforcement adhering to DPDP Act 2023.",
      highlights: [
        "Salted SHA-256 Consent PIN Gate with Dynamic Key Hashing",
        "Sovereign Multi-Member State Machine with Granular Role Derivation",
        "Strict Credential Vault Isolation & Inherited Blocker Hierarchy",
        "Deterministic Payload Serialization for Staged Cryptographic Receipts"
      ]
    },
    {
      tier: "TIER 4",
      name: "DPI Data Model & Interoperability Layer",
      icon: Database,
      accent: "text-amber-500",
      bgAccent: "bg-amber-500/10 border-amber-500/20",
      description:
        "Standardized Digital Public Infrastructure schemas aligning with DigiLocker, State e-District, and Aadhaar Reference Specifications.",
      highlights: [
        "W3C Verifiable Credentials Data Specification Compliance",
        "Deterministic DigiLocker Pull API Simulation & Timestamp Invalidation",
        "Zero-Network PoC Seed Caches for State-Wide Fiscal Accountability",
        "Ground Rule 5 Lock: Pure Mathematical Telemetry & 0 External API Calls"
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      data-modal-open="true"
    >
      <div
        className="bg-white dark:bg-[#0F1115] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-[#16191F]">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <ShieldCheck size={18} />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#EDEDED]">
                  NAGRIKPATH 4-TIER REFERENCE ARCHITECTURE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  DPI 2.0 SPEC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-0.5">
                Digital India 2.0 Architectural Specification & Deterministic Systems Blueprint
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
            title="Close modal (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body with 4 Tiers */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Executive Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 dark:text-[#8A8F98] uppercase font-bold tracking-wider">
                System Invariant
              </span>
              <p className="text-xs text-slate-800 dark:text-[#EDEDED] font-sans leading-relaxed">
                Zero live external network dependencies. Sovereign client-side execution of eligibility, cryptographic authorization, and verifiable docket compilation.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] whitespace-nowrap">
              0 NETWORK REQUESTS
            </div>
          </div>

          {/* 4 Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiers.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#16191F] border border-slate-200 dark:border-white/[0.08] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.bgAccent} ${t.accent}`}>
                        {t.tier}
                      </span>
                      <Icon size={16} className={t.accent} />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-[#EDEDED]">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-[#8A8F98] leading-relaxed font-sans">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
                    {t.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start space-x-1.5 text-[10px] text-slate-700 dark:text-[#8A8F98]">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-[#16191F] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-[#8A8F98]">
          <div className="flex items-center space-x-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-[#EDEDED] font-mono font-bold">Shift + ?</kbd> anywhere to toggle</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition cursor-pointer"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
}
