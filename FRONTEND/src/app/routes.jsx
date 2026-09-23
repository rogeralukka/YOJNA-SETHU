import React from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import HubLayout from "../components/layout/HubLayout";
import ProfileLayout from "../components/layout/ProfileLayout";
import YojnaLayout from "../components/layout/YojnaLayout";
import ShellLayout from "../components/layout/ShellLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import HomeDashboard from "../pages/HomeDashboard";
import JanManchPage from "../pages/JanManchPage";
import NotificationsPage from "../pages/NotificationsPage";
import UnifiedFamilyProfile from "../pages/UnifiedFamilyProfile";
import YojnaSetuDashboard from "../pages/YojnaSetuDashboard";
import DomainShellPage from "../pages/DomainShellPage";
import DevHarnessPage from "../pages/DevHarnessPage";
import NotFoundPage from "../pages/NotFoundPage";

/**
 * RequireAuth Guard:
 * Checks localStorage for "nagrikpath_session".
 * Redirects unauthenticated traffic to /auth while preserving origin location.
 */
export function RequireAuth({ children }) {
  const session = localStorage.getItem("nagrikpath_session");
  const location = useLocation();

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * NagrikPath AppRoutes:
 * Exact routes:
 *   /, /auth, /home, /jan-manch, /notifications, /profile,
 *   /yojna-setu, /shiksha-setu, /rozgar-setu, /kisan-setu, /nagar-setu,
 *   /404, plus dev-only /dev/harness, and wildcard catch-all.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Dev-Only Harness Route */}
      <Route path="/dev/harness" element={<DevHarnessPage />} />

      {/* Explicit 404 Route */}
      <Route path="/404" element={<NotFoundPage />} />

      {/* Protected Routes (RequireAuth) */}
      <Route element={<RequireAuth />}>
        {/* Hub Pages */}
        <Route element={<HubLayout />}>
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/jan-manch" element={<JanManchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Profile Full-Screen Takeover */}
        <Route element={<ProfileLayout />}>
          <Route path="/profile" element={<UnifiedFamilyProfile />} />
        </Route>

        {/* Yojna Setu Module (Existing standalone layout skeleton) */}
        <Route element={<YojnaLayout />}>
          <Route path="/yojna-setu" element={<YojnaSetuDashboard />} />
        </Route>

        {/* Pipeline Domain Shells */}
        <Route element={<ShellLayout />}>
          <Route path="/shiksha-setu" element={<DomainShellPage />} />
          <Route path="/rozgar-setu" element={<DomainShellPage />} />
          <Route path="/kisan-setu" element={<DomainShellPage />} />
          <Route path="/nagar-setu" element={<DomainShellPage />} />
        </Route>
      </Route>

      {/* Wildcard Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
