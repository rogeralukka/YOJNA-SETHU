import React from 'react';
import { useData, ADMIN_VIEWS } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Clock,
  Sliders,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

export const AdminSidebar = () => {
  const { currentView, navigateTo, isSidebarCollapsed, setIsSidebarCollapsed } = useData();
  const { t } = useLang();

  const activeView = ADMIN_VIEWS.includes(currentView) ? currentView : 'admin-overview';

  const navItems = [
    { key: 'overview', label: t('overview') || 'Overview', icon: LayoutDashboard, path: 'admin-overview' },
    { key: 'all-applications', label: t('allApplications') || 'All Applications', icon: FileText, path: 'admin-all-applications' },
    { key: 'review-applications', label: t('reviewApplications') || 'Review Applications', icon: CheckSquare, path: 'admin-review-application' },
    { key: 'review-later', label: t('reviewLater') || 'Review Later', icon: Clock, path: 'admin-review-later' },
    { key: 'scheme-management', label: t('schemeManagement') || 'Scheme Management', icon: Sliders, path: 'admin-scheme-management' },
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

export default AdminSidebar;
