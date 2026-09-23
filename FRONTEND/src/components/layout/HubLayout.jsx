import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import AgenticDrawer from "../../features/agent/AgenticDrawer";

/**
 * HubLayout: Viewport App Shell for NagrikPath Main Services (Home, Jan Manch, Notifications).
 * - Root: h-screen max-h-screen w-full flex flex-col overflow-hidden
 * - TopNav: shrink-0 (pinned at top)
 * - Body Row: flex-1 flex overflow-hidden min-h-0 w-full
 * - Sidebar: stationary left column
 * - Main: flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar (THE ONLY SCROLLING CONTAINER)
 */
export default function HubLayout() {
  return (
    <div className="h-screen max-h-screen w-full flex flex-col overflow-hidden bg-neutral-50 dark:bg-[#08090A] text-slate-900 dark:text-[#EDEDED] transition-colors duration-300 ease-in-out">
      {/* Pinned Top Navigation Bar */}
      <TopNav isPublic={false} />

      {/* Body Row Container */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        {/* Stationary Sidebar */}
        <Sidebar />

        {/* Main Content Area (THE ONLY SCROLLING CONTAINER) */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Action Agent Telemetry Drawer */}
      <AgenticDrawer />
    </div>
  );
}
