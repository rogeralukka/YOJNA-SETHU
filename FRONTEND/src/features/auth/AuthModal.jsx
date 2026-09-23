import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../context/UIContext";

/**
 * AuthModal: Secure access modal supporting Login and Register views.
 * Strictly enforces:
 * 1. ONLY ONE view at a time (Login OR Register)
 * 2. No admin login path
 * 3. Mock auth sets localStorage "nagrikpath_session"
 * 4. OTP simulated and visibly labeled "PoC simulation"
 * 5. One-click button labeled exactly: "Simulate OTP (PoC)"
 * 6. Modal owns the Esc key
 */
export default function AuthModal({ onClose }) {
  const navigate = useNavigate();
  const { registerModalOpen, registerModalClose } = useUI();

  const [view, setView] = useState("login"); // "login" | "register"

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("rahul.kumar@gov.in");
  const [loginPassword, setLoginPassword] = useState("••••••••");

  // Register form state
  const [regPhone, setRegPhone] = useState("+91 98765 43210");
  const [regOtp, setRegOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSimulated, setOtpSimulated] = useState(false);
  const [regName, setRegName] = useState("Rahul Kumar");
  const [regAge, setRegAge] = useState("24");
  const [regGender, setRegGender] = useState("Male");

  // Body scroll lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Esc key management
  useEffect(() => {
    registerModalOpen();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      registerModalClose();
    };
  }, [registerModalOpen, registerModalClose]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const completeLogin = (userName, phone) => {
    try {
      localStorage.setItem(
        "nagrikpath_session",
        JSON.stringify({
          user: userName || "Rahul Kumar",
          phone: phone || "+91 98765 43210",
          token: "nagrik_poc_session_token_xyz",
          authenticatedAt: new Date().toISOString()
        })
      );
    } catch (e) {
      console.error("Failed to set session", e);
    }
    if (onClose) onClose();
    navigate("/home");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    completeLogin("Rahul Kumar", "+91 98765 43210");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    completeLogin(regName || "Rahul Kumar", regPhone);
  };

  const handleSimulateOtp = () => {
    setRegOtp("123456");
    setOtpSent(true);
    setOtpSimulated(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={handleClose}
      data-modal-open="true"
    >
      <div
        className="bg-white dark:bg-[#0F1115] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200/80 dark:border-white/[0.08] relative z-[110] space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#EDEDED]">
              Secure Access
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] text-xl font-bold cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#16191F] transition"
          >
            ✕
          </button>
        </div>

        {/* View Switcher Tabs (Login OR Register, ONLY ONE AT A TIME) */}
        <div className="flex border-b border-slate-200 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => setView("login")}
            className={`pb-2 text-sm font-bold border-b-2 mr-6 transition ${
              view === "login"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-400 dark:text-[#8A8F98] hover:text-slate-600 dark:hover:text-[#EDEDED]"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setView("register")}
            className={`pb-2 text-sm font-bold border-b-2 transition ${
              view === "register"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-400 dark:text-[#8A8F98] hover:text-slate-600 dark:hover:text-[#EDEDED]"
            }`}
          >
            Register
          </button>
        </div>

        {/* STATE A — LOGIN VIEW */}
        {view === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Email / Mobile
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Enter email or mobile"
                required
                className="bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition hover:shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Login →</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                New here? Register now
              </button>
            </div>
          </form>
        )}

        {/* STATE B — REGISTER VIEW */}
        {view === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            {/* OTP Section with PoC Simulation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98]">
                  OTP Verification
                </label>
                {otpSimulated && (
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                    PoC simulation
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={regOtp}
                  onChange={(e) => setRegOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  required
                  className="flex-1 bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="px-3.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-white/10 text-slate-700 dark:text-[#EDEDED] hover:bg-slate-100 dark:hover:bg-[#16191F] cursor-pointer transition"
                >
                  {otpSent ? "Resend" : "Send OTP"}
                </button>
              </div>

              {/* Exact required one-click button */}
              <div className="mt-1.5 flex justify-end">
                <button
                  type="button"
                  onClick={handleSimulateOtp}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 px-2.5 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/60 transition cursor-pointer"
                >
                  Simulate OTP (PoC)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Citizen Full Name"
                required
                className="bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={regAge}
                  onChange={(e) => setRegAge(e.target.value)}
                  placeholder="Age"
                  className="bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8A8F98] mb-1">
                  Gender
                </label>
                <select
                  value={regGender}
                  onChange={(e) => setRegGender(e.target.value)}
                  className="bg-slate-50 dark:bg-[#16191F] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-[#EDEDED] rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition hover:shadow-md flex items-center justify-center space-x-2 mt-2 cursor-pointer"
            >
              <span>Register →</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Already have account? Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
