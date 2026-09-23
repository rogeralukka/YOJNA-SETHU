import React, { Component } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import TopNav from "../layout/TopNav";

/**
 * Resilient React Error Boundary.
 * Catches runtime and rendering errors in subtree children, preventing full app crashes.
 * Supports both in-page widget isolation and full-page application shell fallback with real TopNav.
 * Adheres strictly to the Obsidian 3-tier dark and neutral light theme tokens.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled rendering error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      const { compact = false, moduleName, fullPage = false } = this.props;

      const fallbackCard = (
        <div
          className={`w-full max-w-lg bg-neutral-100 dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-2xl text-neutral-800 dark:text-[#EDEDED] transition-colors flex flex-col items-center justify-center text-center shadow-xs ${
            compact ? "p-4 sm:p-6 min-h-[160px]" : "p-8 sm:p-12 min-h-[220px]"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {/* Accent Alert Well */}
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3.5 border border-amber-200/60 dark:border-amber-800/40 shrink-0">
            <AlertTriangle className="w-5 h-5 shrink-0" />
          </div>

          {/* Headline */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-[#EDEDED] mb-1.5">
            {moduleName ? `${moduleName} temporarily unavailable` : "Module temporarily unavailable"}
          </h3>

          {/* Subtext */}
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8A8F98] max-w-md mx-auto mb-5 leading-relaxed">
            An error occurred while evaluating this section. Your citizen profile and active session remain secure.
          </p>

          {/* Reset Action */}
          <button
            onClick={this.handleReset}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Reload Component</span>
          </button>
        </div>
      );

      if (fullPage) {
        return (
          <div className="min-h-screen w-full flex flex-col bg-white dark:bg-[#08090A]">
            <TopNav />
            <div className="flex-1 flex items-center justify-center p-6">
              {fallbackCard}
            </div>
          </div>
        );
      }

      return (
        <div className="w-full flex items-center justify-center">
          {fallbackCard}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
