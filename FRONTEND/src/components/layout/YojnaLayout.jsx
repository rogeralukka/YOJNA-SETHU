import React from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { LangProvider } from "../../yojna/context/LangContext";
import { AuthProvider } from "../../yojna/context/AuthContext";
import { DataProvider } from "../../yojna/context/DataContext";

/**
 * YojnaLayout: Standalone module Viewport App Shell for Yojna Setu.
 * - Root: h-screen max-h-screen w-full flex flex-col overflow-hidden
 * - TopNav: shrink-0 (pinned at top)
 * - Body: flex-1 flex overflow-hidden min-h-0 w-full
 */
export default function YojnaLayout() {
  return (
    <LangProvider>
      <AuthProvider>
        <DataProvider>
          <div className="h-screen max-h-screen w-full overflow-hidden bg-neutral-50 dark:bg-[#08090A] text-neutral-900 dark:text-[#EDEDED] flex flex-col font-body-lg">
            <TopNav isPublic={false} />
            <div className="flex-1 flex overflow-hidden min-h-0 w-full">
              <Outlet />
            </div>
          </div>
        </DataProvider>
      </AuthProvider>
    </LangProvider>
  );
}
