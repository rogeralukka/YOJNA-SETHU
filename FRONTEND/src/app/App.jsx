import React, { useEffect } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { HouseholdProvider } from "../context/HouseholdContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import { UIProvider, useUI } from "../context/UIContext";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import AppRoutes from "./routes";

/**
 * Global Esc listener:
 * Navigates to /home when authenticated.
 * Fully suppressed while ANY modal or drawer is open. Modals own the Esc key.
 * Strictly NO keydown listener attached to F11.
 */
function GlobalEscHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isModalOpen } = useUI();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        // If ANY modal or drawer is active in UIContext or DOM, suppress global Esc-to-/home
        if (isModalOpen || document.querySelector('[data-modal-open="true"]')) {
          return;
        }

        const session = localStorage.getItem("nagrikpath_session");
        if (session && location.pathname !== "/home") {
          navigate("/home");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, location.pathname, isModalOpen]);

  return null;
}

/**
 * Root App component.
 * Provider order strictly enforced:
 * Router OUTERMOST, then HouseholdProvider > ThemeProvider > LanguageProvider > UIProvider.
 * No provider may sit outside Router.
 */
export default function App() {
  return (
    <BrowserRouter>
      <HouseholdProvider>
        <ThemeProvider>
          <LanguageProvider>
            <UIProvider>
              <GlobalEscHandler />
              <ErrorBoundary moduleName="NagrikPath Application" fullPage={true}>
                <AppRoutes />
              </ErrorBoundary>
            </UIProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HouseholdProvider>
    </BrowserRouter>
  );
}
