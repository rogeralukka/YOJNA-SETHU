import React, { useState, useEffect } from "react";
import { useHousehold } from "./context/HouseholdContext";
import { schemaRegistry } from "./engine/schemaRegistry";
import { computeDelta } from "./engine/deltaResolver";
import { buildDocket } from "./engine/docket";
import ScenarioSwitcher from "./features/dev/ScenarioSwitcher";
import ArchitectureModal from "./features/judge/ArchitectureModal";
import { Layers } from "lucide-react";

export default function Phase1Harness() {
  const {
    household,
    activeMemberId,
    activeMember,
    headOfHousehold,
    setActiveMember,
    simulateIssuancePull,
    resetToFactorySeed
  } = useHousehold();

  const [hasRun, setHasRun] = useState(true);
  const [deltaResult, setDeltaResult] = useState(null);
  const [docket, setDocket] = useState(null);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  const targetScheme = schemaRegistry["post-matric-obc"];

  // Re-run resolution when household or activeMemberId updates, if already executed
  useEffect(() => {
    if (activeMember && headOfHousehold) {
      const delta = computeDelta(activeMember, headOfHousehold, targetScheme);
      const doc = buildDocket(
        activeMember,
        targetScheme,
        delta.fulfilledDocs,
        delta.missingDocs,
        delta.expiredDocs
      );
      setDeltaResult(delta);
      setDocket(doc);
    }
  }, [household, activeMemberId]);

  const handleRunDeltaResolver = () => {
    setHasRun(true);
    const delta = computeDelta(activeMember, headOfHousehold, targetScheme);
    const doc = buildDocket(
      activeMember,
      targetScheme,
      delta.fulfilledDocs,
      delta.missingDocs,
      delta.expiredDocs
    );
    setDeltaResult(delta);
    setDocket(doc);
  };

  const handleFetchLatestIssuance = () => {
    // Ramesh is the Head of Household who holds the income certificate
    simulateIssuancePull(headOfHousehold.memberId, "DOC_INCOME_CERT");
  };

  const handleResetDemo = () => {
    resetToFactorySeed();
    setHasRun(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                NagrikPath Phase 1 Test Harness
              </h1>
              <p className="text-sm text-slate-600">
                Digital India 2.0 Reference Architecture — Engine & State Verification
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsArchModalOpen(true)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Layers size={13} className="text-blue-400" />
                <span>4-Tier Architecture Spec</span>
              </button>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Dev Harness
              </span>
            </div>
          </div>
        </header>

        {/* Phase 6: Deterministic Scenario Switcher */}
        <ScenarioSwitcher
          onScenarioApplied={() => {
            setHasRun(true);
          }}
        />

        {/* Architecture Specification Modal (Dev/Harness only) */}
        <ArchitectureModal
          isOpen={isArchModalOpen}
          onClose={() => setIsArchModalOpen(false)}
        />

        {/* Target Scheme Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Target Scheme
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                {targetScheme.name} ({targetScheme.level})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sector: {targetScheme.sector} | Requires: Aadhaar, OBC Caste Cert (Inherited), Income Cert (Inherited, max 12m), College Bonafide
              </p>
            </div>
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition cursor-pointer"
            >
              Reset Demo
            </button>
          </div>
        </div>

        {/* Control Bar: Active Member Selector & Run Button */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label
                htmlFor="member-select"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Active Citizen Member (Default: Priya)
              </label>
              <select
                id="member-select"
                value={activeMemberId}
                onChange={(e) => setActiveMember(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {household?.members?.map((member) => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.name} ({member.relation}, Age: {member.age}, {member.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRunDeltaResolver}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition"
              >
                Run Delta Resolver
              </button>
            </div>
          </div>

          {activeMember && (
            <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
              <span><strong>Selected:</strong> {activeMember.name}</span>
              <span><strong>Masked Aadhaar:</strong> {activeMember.maskedAadhaar}</span>
              <span><strong>Head of Household:</strong> {headOfHousehold?.name} ({headOfHousehold?.maskedAadhaar})</span>
              <span><strong>Held Documents:</strong> {activeMember.documents?.map(d => d.docTag).join(", ") || "None"}</span>
            </div>
          )}
        </div>

        {/* Results Area */}
        {hasRun && deltaResult && (
          <div className="space-y-6">
            {/* RED BLOCKED STATE PANEL */}
            {deltaResult.status === "BLOCKED" && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                    <h3 className="text-base font-bold text-red-900">
                      Delta Resolution: Pipeline Blocked
                    </h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded bg-red-600 text-white tracking-wider">
                    BLOCKED
                  </span>
                </div>

                <p className="text-sm text-red-800">
                  Citizen requirements are incomplete or contain expired credentials. Cannot compile ready docket.
                </p>

                {/* Expired Documents List */}
                {deltaResult.expiredDocs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">
                      Expired Credentials Requiring Verification:
                    </h4>
                    <div className="space-y-2">
                      {deltaResult.expiredDocs.map((doc, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-red-300 rounded p-3 text-sm text-red-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-semibold text-red-950">
                              {doc.label} ({doc.docTag})
                            </div>
                            <div className="text-xs text-red-700 font-medium mt-0.5">
                              {doc.inheritedFromHead
                                ? "Inherited from Head of Household — EXPIRED (31-03-2024)"
                                : `Document EXPIRED (${doc.formattedExpiry})`}
                            </div>
                          </div>

                          {/* Action Button for Expired Inherited Doc */}
                          {doc.docTag === "DOC_INCOME_CERT" && (
                            <button
                              onClick={handleFetchLatestIssuance}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded transition shadow-sm whitespace-nowrap"
                            >
                              Fetch Latest Issuance (State e-District via DigiLocker Pull API)
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Documents List */}
                {deltaResult.missingDocs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">
                      Missing Credentials:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-red-800 bg-white border border-red-200 rounded p-3">
                      {deltaResult.missingDocs.map((doc, idx) => (
                        <li key={idx}>
                          {doc.label} ({doc.docTag}) — Status: {doc.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fulfilled Docs Summary */}
                {deltaResult.fulfilledDocs.length > 0 && (
                  <div className="pt-2 border-t border-red-200">
                    <h4 className="text-xs font-semibold text-red-900 mb-1">
                      Fulfilled Credentials (3 of 4)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {deltaResult.fulfilledDocs.map((doc, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded border border-red-200"
                        >
                          ✓ {doc.label} {doc.inheritedFromHead ? "(Inherited)" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GREEN UNLOCKED STATE PANEL */}
            {deltaResult.status === "READY" && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-5 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-600"></span>
                    <h3 className="text-base font-bold text-green-900">
                      Delta Resolution: Requirements Satisfied
                    </h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded bg-green-600 text-white tracking-wider">
                    READY
                  </span>
                </div>

                <p className="text-sm text-green-800">
                  All scheme prerequisites and credentials are confirmed valid. Digital docket successfully compiled.
                </p>

                {/* Fulfilled Documents Clean List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-green-900">
                    Fulfilled Documents:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {deltaResult.fulfilledDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-green-200 rounded p-3 text-xs text-slate-700 shadow-xs"
                      >
                        <div className="font-semibold text-slate-900 text-sm flex items-center justify-between">
                          <span>{doc.label}</span>
                          <span className="text-green-600 font-bold">✓ Valid</span>
                        </div>
                        <div className="text-slate-500 mt-1">
                          Tag: <code className="bg-slate-100 px-1 rounded">{doc.docTag}</code>
                        </div>
                        <div className="text-slate-500">
                          Issuer: {doc.issuer}
                        </div>
                        <div className="text-slate-500">
                          URI: <span className="font-mono text-[11px]">{doc.uri}</span>
                        </div>
                        {doc.inheritedFromHead && (
                          <div className="mt-1 text-blue-700 font-medium">
                            Inherited from Head of Household ({doc.ownerMemberId})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* JSON-LD Preformatted Block */}
                {docket && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-green-900">
                        JSON-LD Citizen Service Docket Payload:
                      </h4>
                      <span className="text-[11px] text-green-700 font-mono">
                        Schema.org / CitizenServiceDocket
                      </span>
                    </div>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-96 border border-slate-800">
                      {JSON.stringify(docket, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
