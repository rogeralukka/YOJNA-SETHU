import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../shared/ThemeToggle";
import LanguageSelector from "../shared/LanguageSelector";
import ProfileChip from "../shared/ProfileChip";
import { useUI } from "../../context/UIContext";

/**
 * Context-aware TopNav component.
 * Left: Context-aware logo (NagrikPath on hub, module logo on modules, context logo on /profile).
 * Right: Fixed order: ThemeToggle -> LanguageSelector -> ProfileChip (or Get Started on public routes).
 * Logo click navigates to /home (or /) and acts as the escape hatch.
 * No F11 keydown listener.
 */
export default function TopNav({ isPublic = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lastModule, openAuthModal } = useUI();

  const pathname = location.pathname;

  // Determine which logo to render based on context
  // Rule: /profile context logo is resolved ONLY via React Router navigation state or lastModule.
  // Default to NagrikPath when state is absent.
  let activeModuleContext = null;

  if (pathname.startsWith("/yojna-setu")) {
    activeModuleContext = "yojna-setu";
  } else if (pathname.startsWith("/shiksha-setu")) {
    activeModuleContext = "shiksha-setu";
  } else if (pathname.startsWith("/rozgar-setu")) {
    activeModuleContext = "rozgar-setu";
  } else if (pathname.startsWith("/kisan-setu")) {
    activeModuleContext = "kisan-setu";
  } else if (pathname.startsWith("/nagar-setu")) {
    activeModuleContext = "nagar-setu";
  } else if (pathname === "/profile") {
    // Check navigation state first
    const fromPath = location.state?.from || lastModule || "";
    if (fromPath.includes("yojna-setu")) activeModuleContext = "yojna-setu";
    else if (fromPath.includes("shiksha-setu")) activeModuleContext = "shiksha-setu";
    else if (fromPath.includes("rozgar-setu")) activeModuleContext = "rozgar-setu";
    else if (fromPath.includes("kisan-setu")) activeModuleContext = "kisan-setu";
    else if (fromPath.includes("nagar-setu")) activeModuleContext = "nagar-setu";
    else activeModuleContext = null; // Default to NagrikPath
  }

  // Logo metadata
  const getLogoTitle = () => {
    switch (activeModuleContext) {
      case "yojna-setu":
        return "YojanaSetu";
      case "shiksha-setu":
        return "ShikshaSetu";
      case "rozgar-setu":
        return "RozgarSetu";
      case "kisan-setu":
        return "KisanSetu";
      case "nagar-setu":
        return "NagarSetu";
      default:
        return "NagrikPath";
    }
  };

  const logoTitle = getLogoTitle();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (activeModuleContext === "yojna-setu" && pathname === "/profile") {
      navigate("/yojna-setu");
      return;
    }
    const hasSession = localStorage.getItem("nagrikpath_session");
    navigate(hasSession ? "/home" : "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b-2 border-slate-300 dark:border-white/[0.08] bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-md shadow-xs transition-colors duration-300 ease-in-out">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side: Clean Brand Text Logo (Fix 1 & Fix 6) */}
        <div className="flex items-center space-x-2">
          <a
            href={activeModuleContext === "yojna-setu" ? "/yojna-setu" : "/home"}
            onClick={handleLogoClick}
            className="flex items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg py-1 px-1.5"
            title={activeModuleContext === "yojna-setu" ? "YojanaSetu" : "NagrikPath Hub"}
          >
            <span className="text-primary font-headline-md text-xl sm:text-2xl font-bold tracking-tight">
              {logoTitle}
            </span>
          </a>
        </div>

        {/* Right Side: Fixed Order (ThemeToggle -> LanguageSelector -> ProfileChip / Get Started) */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <LanguageSelector />

          {isPublic ? (
            <button
              type="button"
              onClick={openAuthModal}
              className="px-4 py-2 text-xs font-bold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition hover:shadow-md cursor-pointer"
            >
              Get Started
            </button>
          ) : (
            <ProfileChip />
          )}
        </div>
      </div>
    </header>
  );
}
