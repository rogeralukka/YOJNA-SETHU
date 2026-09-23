import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import TopNav from "../components/layout/TopNav";

/**
 * NotFoundPage (404 Error Page)
 * Reuses the shared system TopNav component for 100% pixel parity.
 * Clean, minimal 404 canvas with zero extraneous clutter.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const hasSession = Boolean(localStorage.getItem("nagrikpath_session"));

  const handleGoHome = () => {
    navigate(hasSession ? "/home" : "/");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(hasSession ? "/home" : "/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-[#08090A] text-neutral-900 dark:text-neutral-100 selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Shared Application TopNav */}
      <TopNav isPublic={!hasSession} />

      {/* Main Centered 404 Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Massive 404 Display */}
        <div
          className="text-8xl sm:text-9xl font-extrabold tracking-tight text-neutral-200 dark:text-white/[0.07] select-none leading-none mb-2"
          aria-hidden="true"
        >
          404
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Page not found
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-md text-center mt-2 mb-8 leading-relaxed">
          Sorry, we couldn’t find the page you’re looking for. It may have been moved or doesn’t exist.
        </p>

        {/* Clean Action Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleGoHome}
            type="button"
            className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium px-5 py-2.5 rounded-xl transition-all text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleGoBack}
            type="button"
            className="w-full sm:w-auto border border-neutral-300 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium px-5 py-2.5 rounded-xl transition-all text-sm inline-flex items-center justify-center cursor-pointer active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 mr-1.5" />
            <span>Go Back</span>
          </button>
        </div>
      </main>
    </div>
  );
}
