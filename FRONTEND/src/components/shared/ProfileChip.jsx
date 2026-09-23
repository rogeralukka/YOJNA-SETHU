import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ChevronDown, ArrowRight, Lock, AlertTriangle } from "lucide-react";
import { useHousehold } from "../../context/HouseholdContext";
import PinGateModal from "./PinGateModal";

/**
 * ProfileChip represents the persistent federated citizen identity bridge.
 * Shows active member name, dropdown list of members, and triggers PinGateModal on switch.
 * Navigating to /profile via this chip sends state: { from: location.pathname } for context logo resolution.
 */
export default function ProfileChip() {
  const { household, activeMemberId, activeMember, setActiveMember } = useHousehold();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pinTargetMember, setPinTargetMember] = useState(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const containerRef = useRef(null);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape" && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleMemberSelect = (member) => {
    setIsDropdownOpen(false);
    if (member.memberId === activeMemberId) {
      // Already active, do nothing
      return;
    }
    // Open PIN gate modal; DO NOT navigate, DO NOT mutate activeMember yet
    setPinTargetMember(member);
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = (verifiedMember) => {
    setActiveMember(verifiedMember.memberId);
    setIsPinModalOpen(false);
    setPinTargetMember(null);
  };

  const handlePinCancel = () => {
    setIsPinModalOpen(false);
    setPinTargetMember(null);
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={containerRef}>
        {/* Profile Chip Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1115] text-slate-800 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#16191F] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[11px] font-bold">
            <User size={12} />
          </div>
          <span className="max-w-[120px] truncate">{activeMember?.name || "Citizen"}</span>
          <ChevronDown
            size={13}
            className={`text-slate-400 dark:text-[#8A8F98] transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0F1115] shadow-xl rounded-2xl border border-slate-200 dark:border-white/[0.08] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Active Citizen Info */}
            <div className="px-3 py-2.5 bg-slate-50 dark:bg-[#16191F] border border-slate-100 dark:border-white/[0.08] rounded-xl mb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-[#EDEDED]">
                  {activeMember?.name}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900 px-2 py-0.5 rounded-full">
                  {activeMember?.relation}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#8A8F98] mt-1">
                Aadhaar: <span className="font-mono">{activeMember?.maskedAadhaar}</span>
              </div>
            </div>

            {/* Profile Navigation Link (passes state.from for Context Logo) */}
            <Link
              to="/profile"
              state={{ from: location.pathname }}
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#16191F] rounded-xl transition-colors"
            >
              <span>Unified Family Profile</span>
              <ArrowRight size={13} />
            </Link>

            <div className="border-t border-slate-100 dark:border-white/[0.08] my-2" />

            {/* Household Members Switcher */}
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8A8F98]">
              Switch Member Profile
            </div>
            <div className="space-y-1 mt-1">
              {household?.members?.map((m) => {
                const isSelected = m.memberId === activeMemberId;
                const hasPin = !!m.consents?.pin;
                return (
                  <button
                    key={m.memberId}
                    type="button"
                    onClick={() => handleMemberSelect(m)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60"
                        : "hover:bg-slate-100 dark:hover:bg-[#16191F] text-slate-600 dark:text-[#8A8F98] dark:hover:text-[#EDEDED]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span>{m.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-[#8A8F98]/70">
                        {m.relation} • Age {m.age}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                      {hasPin ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                          <Lock size={11} />
                          <span>PIN</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[10px]">
                          <AlertTriangle size={11} />
                          <span>No PIN</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Consent PIN Gate Modal */}
      <PinGateModal
        isOpen={isPinModalOpen}
        targetMember={pinTargetMember}
        onSuccess={handlePinSuccess}
        onCancel={handlePinCancel}
      />
    </>
  );
}
