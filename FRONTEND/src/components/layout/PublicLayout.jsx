import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import AuthModal from "../../features/auth/AuthModal";
import { useUI } from "../../context/UIContext";

/**
 * PublicLayout: Landing Page & Auth Modal
 * TopNav with ThemeToggle, LanguageSelector, Get Started.
 * No sidebar, no hamburger, no back button.
 */
export default function PublicLayout() {
  const { isAuthModalOpen, closeAuthModal } = useUI();

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden flex flex-col bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 ease-in-out">
      <TopNav isPublic={true} />
      <main className="flex-1 min-h-0 w-full relative overflow-hidden flex flex-col">
        <Outlet />
      </main>
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
    </div>
  );
}
