import React from 'react';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

// Common
import { Topbar } from './components/common/Topbar';
import { Sidebar } from './components/common/Sidebar';
import { AdminSidebar } from './components/common/AdminSidebar';
import { Toast } from './components/common/Toast';

// Auth & Landing
import { LandingPage } from './components/landing/LandingPage';
import { LoginRegisterModal } from './components/auth/LoginRegisterModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';

// Citizen Views
import { Dashboard } from './components/dashboard/Dashboard';
import { SchemeDetail } from './components/schemes/SchemeDetail';
import { ApplicationForm } from './components/applications/ApplicationForm';
import { MyBusiness } from './components/business/MyBusiness';
import { MyApplications } from './components/applications/MyApplications';
import { Bookmarks } from './components/bookmarks/Bookmarks';
import { Notifications } from './components/notifications/Notifications';
import { ShareEligibility } from './components/share/ShareEligibility';
import { Profile } from './components/profile/Profile';

// Admin Views
import { AdminOverview } from './components/admin/AdminOverview';
import { AllApplications } from './components/admin/AllApplications';
import { ReviewApplication } from './components/admin/ReviewApplication';
import { ReviewLater } from './components/admin/ReviewLater';
import { SchemeManagement } from './components/admin/SchemeManagement';

export const App = () => {
  const { role, isCitizen, isAdmin } = useAuth();
  const { currentView, isSidebarCollapsed } = useData();

  // Guest view renders the editorial landing slideshow with overlaid auth cards
  if (role === 'guest') {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <LandingPage />
        <LoginRegisterModal />
        <AdminLoginModal />
        <Toast />
      </div>
    );
  }

  // Citizen Application Experience
  if (isCitizen) {
    return (
      <div className="min-h-screen bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-100 flex flex-col font-body-lg">
        <Topbar />
        <Sidebar />

        <main
          className={`flex-1 transition-all duration-300 pt-16 ${
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'scheme-detail' && <SchemeDetail />}
          {currentView === 'application-form' && <ApplicationForm />}
          {currentView === 'my-business' && <MyBusiness />}
          {currentView === 'my-applications' && <MyApplications />}
          {currentView === 'bookmarks' && <Bookmarks />}
          {currentView === 'notifications' && <Notifications />}
          {currentView === 'share-eligibility' && <ShareEligibility />}
          {currentView === 'profile' && <Profile />}
        </main>

        <Toast />
      </div>
    );
  }

  // Admin Administration Experience
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-100 flex flex-col font-body-lg">
        <Topbar />
        <AdminSidebar />

        <main
          className={`flex-1 transition-all duration-300 pt-16 ${
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          {currentView === 'admin-overview' && <AdminOverview />}
          {currentView === 'admin-all-applications' && <AllApplications />}
          {currentView === 'admin-review-application' && <ReviewApplication />}
          {currentView === 'admin-review-later' && <ReviewLater />}
          {currentView === 'admin-scheme-management' && <SchemeManagement />}
        </main>

        <Toast />
      </div>
    );
  }

  return null;
};
