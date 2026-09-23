import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData, CITIZEN_VIEWS, ADMIN_VIEWS } from "../yojna/context/DataContext";
import { useHousehold } from "../context/HouseholdContext";
import { useAuth } from "../yojna/context/AuthContext";

// Real Yojna Setu Components directly imported from repo source
import { Sidebar } from "../yojna/components/common/Sidebar";
import { AdminSidebar } from "../yojna/components/common/AdminSidebar";
import { Toast } from "../yojna/components/common/Toast";
import YojnaDashboard from "./yojna-setu/YojnaDashboard";
import { SchemeDetail } from "../yojna/components/schemes/SchemeDetail";
import { ApplicationForm } from "../yojna/components/applications/ApplicationForm";
import { MyBusiness } from "../yojna/components/business/MyBusiness";
import { MyApplications } from "../yojna/components/applications/MyApplications";
import { Bookmarks } from "../yojna/components/bookmarks/Bookmarks";
import { Notifications } from "../yojna/components/notifications/Notifications";
import { ShareEligibility } from "../yojna/components/share/ShareEligibility";
import { AdminOverview } from "../yojna/components/admin/AdminOverview";
import { AllApplications } from "../yojna/components/admin/AllApplications";
import { ReviewApplication } from "../yojna/components/admin/ReviewApplication";
import { ReviewLater } from "../yojna/components/admin/ReviewLater";
import { SchemeManagement } from "../yojna/components/admin/SchemeManagement";
import DocketModal from "../components/shared/DocketModal";

/**
 * YojnaSetuDashboard (/yojna-setu)
 * Thin orchestrator mounting real components from the Yojna Setu repository.
 * Configured as a stationary sidebar + isolated scrolling main container.
 */
export default function YojnaSetuDashboard() {
  const navigate = useNavigate();
  const { currentView, selectedSchemeId, schemes, createApplication, showToast } = useData();
  const { isAdmin } = useAuth();
  const { activeMember, headOfHousehold } = useHousehold();
  const [docketModalOpen, setDocketModalOpen] = useState(false);

  // If user requests profile view in Yojna, route to NagrikPath Unified Profile
  useEffect(() => {
    if (currentView === "profile") {
      navigate("/profile", { state: { from: "/yojna-setu" } });
    }
  }, [currentView, navigate]);

  const isAdminView = ADMIN_VIEWS.includes(currentView);
  const activeView = isAdminView ? currentView : (CITIZEN_VIEWS.includes(currentView) ? currentView : "dashboard");
  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  const handleDocketSubmit = (docketPayload) => {
    if (createApplication && selectedScheme) {
      createApplication(selectedScheme, {
        applicantName: activeMember?.name,
        docket: docketPayload
      });
      showToast?.("Application submitted with verified Docket!");
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">
      {/* Real Collapsible Sidebar / Admin Sidebar from Repo (Stationary) */}
      {isAdminView || isAdmin ? <AdminSidebar /> : <Sidebar />}

      {/* Main View Router delegating to Real Repo Components (THE ONLY SCROLLING CONTAINER) */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Citizen Views */}
          {activeView === "dashboard" && <YojnaDashboard />}
          {activeView === "scheme-detail" && <SchemeDetail onOpenDocket={() => setDocketModalOpen(true)} />}
          {activeView === "application-form" && <ApplicationForm />}
          {activeView === "my-business" && <MyBusiness />}
          {activeView === "my-applications" && <MyApplications />}
          {activeView === "bookmarks" && <Bookmarks />}
          {activeView === "notifications" && <Notifications />}
          {activeView === "share-eligibility" && <ShareEligibility />}

          {/* Admin Views */}
          {activeView === "admin-overview" && <AdminOverview />}
          {activeView === "admin-all-applications" && <AllApplications />}
          {activeView === "admin-review-application" && <ReviewApplication />}
          {activeView === "admin-review-later" && <ReviewLater />}
          {activeView === "admin-scheme-management" && <SchemeManagement />}
        </div>
      </main>

      {/* Real Toast System from Repo */}
      <Toast />

      {/* Verifiable Citizen Service Docket Modal */}
      <DocketModal
        isOpen={docketModalOpen}
        onClose={() => setDocketModalOpen(false)}
        scheme={selectedScheme}
        activeMember={activeMember}
        headOfHousehold={headOfHousehold}
        onSubmit={handleDocketSubmit}
      />
    </div>
  );
}
