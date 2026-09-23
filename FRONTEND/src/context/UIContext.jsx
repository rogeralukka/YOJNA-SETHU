import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [lastModule, setLastModule] = useState(null);
  const [openModalCount, setOpenModalCount] = useState(0);

  const location = useLocation();

  // Track module context
  useEffect(() => {
    const path = location.pathname;
    if (
      path.startsWith("/yojna-setu") ||
      path.startsWith("/shiksha-setu") ||
      path.startsWith("/rozgar-setu") ||
      path.startsWith("/kisan-setu") ||
      path.startsWith("/nagar-setu")
    ) {
      setLastModule(path);
    } else if (path !== "/profile") {
      // If navigating to hub pages, clear or retain context?
      // "The /profile context logo is resolved ONLY via React Router navigation state or a lastModule UI-context value.
      // Default to NagrikPath logo when state is absent."
      // So if navigated from home, lastModule is not an active module.
    }
  }, [location.pathname]);

  const registerModalOpen = useCallback(() => {
    setOpenModalCount((prev) => prev + 1);
  }, []);

  const registerModalClose = useCallback(() => {
    setOpenModalCount((prev) => Math.max(0, prev - 1));
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/auth") {
      setIsAuthModalOpen(false);
    }
  }, [location.pathname]);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <UIContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        lastModule,
        setLastModule,
        isModalOpen: openModalCount > 0 || isAuthModalOpen,
        registerModalOpen,
        registerModalClose,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

export default UIContext;
