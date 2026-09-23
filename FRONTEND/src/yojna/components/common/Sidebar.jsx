import React from 'react';
import { useData, CITIZEN_VIEWS } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Bookmark,
  Bell,
  Share2,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

export const Sidebar = () => {
  const { currentView, navigateTo, isSidebarCollapsed, setIsSidebarCollapsed } = useData();
  const { t } = useLang();

  const activeView = CITIZEN_VIEWS.includes(currentView) ? currentView : 'dashboard';

  const navItems = [
    { key: 'dashboard', label: t('dashboard') || 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    { key: 'my-business', label: t('myBusiness') || 'My Business', icon: Building2, path: 'my-business' },
    { key: 'my-applications', label: t('myApplications') || 'My Applications', icon: FileText, path: 'my-applications' },
    { key: 'bookmarks', label: t('bookmarks') || 'Bookmarks', icon: Bookmark, path: 'bookmarks' },
    { key: 'notifications', label: t('notificationsUpdates') || 'Notifications & Updates', icon: Bell, path: 'notifications' },
    { key: 'share-eligibility', label: t('shareEligibility') || 'Share Eligibility', icon: Share2, path: 'share-eligibility' },
  ];

  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`h-full shrink-0 z-30 bg-white dark:bg-[#0F1115] border-r border-neutral-200 dark:border-white/[0.08] shadow-xs transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Collapse Toggle Bar */}
        <div className="h-12 shrink-0 border-b border-neutral-200 dark:border-white/[0.08] flex items-center px-3.5 justify-start">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            type="button"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-xl text-neutral-600 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors focus:outline-none cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-5 h-5 text-neutral-600 dark:text-[#EDEDED]" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-neutral-600 dark:text-[#EDEDED]" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeView === item.path;
            const ItemIcon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => {
                  navigateTo(item.path);
                  if (window.innerWidth < 1024) {
                    setIsSidebarCollapsed(true);
                  }
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60 shadow-xs'
                    : 'text-neutral-600 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] hover:text-neutral-900 dark:hover:text-[#EDEDED]'
                } ${isSidebarCollapsed ? 'justify-center !space-x-0 px-2' : ''}`}
              >
                <ItemIcon
                  className={`shrink-0 w-5 h-5 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-neutral-500 dark:text-[#8A8F98]'
                  }`}
                />

                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
