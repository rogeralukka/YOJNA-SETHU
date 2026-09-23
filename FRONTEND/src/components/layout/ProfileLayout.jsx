import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";

/**
 * ProfileLayout: Full-screen takeover for Unified Family Profile within Viewport App Shell.
 * Isolated scrolling main container.
 */
export default function ProfileLayout() {
  return (
    <div className="h-screen max-h-screen w-full flex flex-col overflow-hidden bg-slate-100 dark:bg-[#08090A] text-slate-900 dark:text-[#EDEDED] transition-colors duration-300 ease-in-out">
      <TopNav isPublic={false} />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
