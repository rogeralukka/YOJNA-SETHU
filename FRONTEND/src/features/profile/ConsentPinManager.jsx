import React, { useState } from "react";
import { KeyRound, Lock, AlertTriangle } from "lucide-react";
import { useHousehold } from "../../context/HouseholdContext";
import PinGateModal from "../../components/shared/PinGateModal";

export default function ConsentPinManager() {
  const { household } = useHousehold();
  const [pinModalMember, setPinModalMember] = useState(null);

  const members = household?.members || [];

  const handleOpenPinModal = (member) => {
    setPinModalMember(member);
  };

  const handlePinSuccess = (member) => {
    setPinModalMember(null);
  };

  const handlePinCancel = () => {
    setPinModalMember(null);
  };

  return (
    <div className="bg-white dark:bg-[#0F1115] rounded-2xl border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Card Header */}
      <div className="border-b border-slate-100 dark:border-white/[0.08] pb-4 space-y-1">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400">
            <KeyRound size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#EDEDED]">
              Consent PIN Manager
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A8F98]">
              Per-member consent authorization PINs for credential and scheme applications
            </p>
          </div>
        </div>
      </div>

      {/* Member PIN Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {members.map((m) => {
          const hasPin = !!m.consents?.pin;
          return (
            <div
              key={m.memberId}
              className="p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16191F] flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-[#EDEDED]">
                  {m.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
                  {m.relation} • Age {m.age}
                </div>
                <div className="mt-3 text-xs font-semibold">
                  {hasPin ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>PIN Configured</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span>No PIN Set</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPinModal(m)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  hasPin
                    ? "bg-neutral-200/80 dark:bg-[#16191F] text-slate-800 dark:text-[#EDEDED] hover:bg-neutral-300 dark:hover:bg-[#1D212A] border border-neutral-300 dark:border-white/10"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                }`}
              >
                {hasPin ? "Update PIN" : "Set PIN"}
              </button>
            </div>
          );
        })}
      </div>

      {/* PinGateModal for Enrolling or Updating PIN */}
      {pinModalMember && (
        <PinGateModal
          isOpen={!!pinModalMember}
          targetMember={pinModalMember}
          onSuccess={handlePinSuccess}
          onCancel={handlePinCancel}
        />
      )}
    </div>
  );
}
