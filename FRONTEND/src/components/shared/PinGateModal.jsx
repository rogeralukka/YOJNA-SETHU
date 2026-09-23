import React, { useState, useEffect, useRef } from "react";
import { useHousehold } from "../../context/HouseholdContext";
import { useUI } from "../../context/UIContext";

/**
 * PinGateModal manages Consent PIN enrollment and verification for member profile switching.
 * Strictly adheres to:
 * 1. ENROLL mode when pin is null
 * 2. VERIFY mode when pin exists (3 failed attempts = temporary lockout)
 * 3. Cancel / outside click reverts selection with ZERO state mutation
 * 4. Modal owns the Esc key
 */
export default function PinGateModal({ isOpen, targetMember, onSuccess, onCancel }) {
  const { verifyPin, setPin } = useHousehold();
  const { registerModalOpen, registerModalClose } = useUI();

  const [enteredPin, setEnteredPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const modalRef = useRef(null);

  // Register open/close with UIContext to suppress global Esc listener
  useEffect(() => {
    if (isOpen) {
      registerModalOpen();
      // Reset local state when modal opens
      setEnteredPin("");
      setConfirmPin("");
      setError(null);
    }
    return () => {
      if (isOpen) {
        registerModalClose();
      }
    };
  }, [isOpen, registerModalOpen, registerModalClose]);

  // Modal owns Esc key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  if (!isOpen || !targetMember) return null;

  const isEnrollMode = !targetMember.consents?.pin;

  const handleCancel = () => {
    setEnteredPin("");
    setConfirmPin("");
    setError(null);
    onCancel();
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(enteredPin)) {
      setError("PIN must be exactly 4 numeric digits.");
      return;
    }
    if (enteredPin !== confirmPin) {
      setError("PIN confirmation does not match.");
      return;
    }

    setPin(targetMember.memberId, enteredPin);
    onSuccess(targetMember);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (!/^\d{4}$/.test(enteredPin)) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }

    const isValid = verifyPin(targetMember.memberId, enteredPin);
    if (isValid) {
      setFailedAttempts(0);
      onSuccess(targetMember);
    } else {
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      setEnteredPin("");
      if (nextCount >= 3) {
        setIsLockedOut(true);
        setError("Temporary Lockout: Maximum attempts exceeded (3/3). Profile access suspended.");
      } else {
        setError(`Incorrect PIN. ${3 - nextCount} attempt(s) remaining.`);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={handleCancel}
      data-modal-open="true"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-[#0F1115] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-white/[0.08] p-6 sm:p-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔐</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#EDEDED]">
                {isEnrollMode
                  ? `Set Consent PIN for ${targetMember.name}`
                  : `Enter Consent PIN for ${targetMember.name}`}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-1">
              {isEnrollMode
                ? "First-time setup: Enroll a 4-digit Consent PIN to delegate credential access."
                : "Verify authorization before accessing citizen's credentials and ledger."}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] text-lg font-semibold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Member Context Pill */}
        <div className="bg-slate-50 dark:bg-[#16191F] border border-slate-100 dark:border-white/[0.08] p-3 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-[#EDEDED]">
              {targetMember.name}
            </span>{" "}
            <span className="text-slate-500 dark:text-[#8A8F98]">
              ({targetMember.relation}, Age {targetMember.age})
            </span>
          </div>
          <span className="font-mono text-slate-500 dark:text-[#8A8F98]/70 text-[11px]">
            {targetMember.maskedAadhaar}
          </span>
        </div>

        {/* Form Body */}
        {isEnrollMode ? (
          <form onSubmit={handleEnrollSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Create 4-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full text-center tracking-[1em] text-lg font-mono px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#16191F] text-slate-900 dark:text-[#EDEDED] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Confirm 4-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full text-center tracking-[1em] text-lg font-mono px-3 py-2 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#16191F] text-slate-900 dark:text-[#EDEDED] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-md border border-red-200 dark:border-red-900/50">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-[#1D212A] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
              >
                Set PIN & Switch
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Enter 4-Digit Consent PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                autoFocus
                disabled={isLockedOut}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className={`w-full text-center tracking-[1em] text-lg font-mono px-3 py-2 rounded-lg border focus:outline-none ${
                  isLockedOut
                    ? "bg-slate-100 dark:bg-[#16191F] text-slate-400 dark:text-[#8A8F98] border-slate-300 dark:border-white/10 cursor-not-allowed"
                    : "border-slate-300 dark:border-white/10 bg-white dark:bg-[#16191F] text-slate-900 dark:text-[#EDEDED] focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </div>

            {error && (
              <div
                className={`text-xs font-medium p-2.5 rounded-md border ${
                  isLockedOut
                    ? "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-800"
                    : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
                }`}
              >
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-[#1D212A] transition"
              >
                {isLockedOut ? "Close" : "Cancel"}
              </button>
              {!isLockedOut && (
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                >
                  Verify & Switch
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
