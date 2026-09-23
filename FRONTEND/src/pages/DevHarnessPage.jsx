import React, { useState } from "react";
import TopNav from "../components/layout/TopNav";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { JanManchSkeleton, SchemeGridSkeleton } from "../components/shared/skeletons";
import { ShieldAlert, Layers, LayoutGrid } from "lucide-react";

function CrashComponent({ shouldCrash }) {
  if (shouldCrash) {
    throw new Error("Simulated rendering crash in Financial Analytics Widget.");
  }
  return (
    <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-[#EDEDED] font-medium text-sm">
      Component is operating normally without errors.
    </div>
  );
}

/**
 * DevHarnessPage (/dev/harness):
 * Clean sandbox route for verifying error boundaries and skeletons inside the standard app shell.
 */
export default function DevHarnessPage() {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-neutral-50 dark:bg-[#08090A] text-neutral-900 dark:text-white">
      {/* Real Shared Top Navigation Bar */}
      <TopNav />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 sm:p-8 space-y-10">
        {/* Section 1: Error Boundary Sandbox */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-[#EDEDED] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span>Error Boundary Isolation</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Simulate a subtree rendering exception to test the fallback container and component reload trigger.
              </p>
            </div>
            <button
              onClick={() => setShouldCrash((prev) => !prev)}
              type="button"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-[#16191F] dark:hover:bg-[#1D212A] text-neutral-800 dark:text-[#EDEDED] border border-neutral-300 dark:border-white/[0.08] transition-colors cursor-pointer"
            >
              {shouldCrash ? "Reset Normal State" : "Simulate Crash"}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <ErrorBoundary moduleName="Financial Analytics Widget">
              <CrashComponent shouldCrash={shouldCrash} />
            </ErrorBoundary>
          </div>
        </section>

        {/* Section 2: Jan Manch Skeletons */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-[#EDEDED] flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span>Jan Manch Analytics Skeletons</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Dual-axis financial/physical charts wireframes matching exact container dimensions with zero CLS.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <JanManchSkeleton />
          </div>
        </section>

        {/* Section 3: Yojna Scheme Grid Skeletons */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-[#EDEDED] flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span>Yojna Setu Scheme Grid Skeletons</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              3-column scheme recommendation card placeholders rendering during citizen evaluation transitions.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <SchemeGridSkeleton count={3} />
          </div>
        </section>
      </main>
    </div>
  );
}
