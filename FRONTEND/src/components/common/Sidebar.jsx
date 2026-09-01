import React from 'react';
import { useData, CITIZEN_VIEWS } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const Sidebar = () => {
  const { currentView, navigateTo, isSidebarCollapsed, setIsSidebarCollapsed } = useData();
  const { t } = useLang();

  const activeView = CITIZEN_VIEWS.includes(currentView) ? currentView : 'dashboard';

  const navItems = [
    { key: 'dashboard', label: t('dashboard'), icon: 'dashboard', path: 'dashboard' },
    { key: 'my-business', label: t('myBusiness'), icon: 'storefront', path: 'my-business' },
    { key: 'my-applications', label: t('myApplications'), icon: 'description', path: 'my-applications' },
    { key: 'bookmarks', label: t('bookmarks'), icon: 'bookmark', path: 'bookmarks' },
    { key: 'notifications', label: t('notificationsUpdates'), icon: 'notifications', path: 'notifications' },
    { key: 'share-eligibility', label: t('shareEligibility'), icon: 'share', path: 'share-eligibility' },
  ];

  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/30 dark:border-slate-800 z-40 transition-all duration-300 overflow-y-auto overflow-x-hidden ${
          isSidebarCollapsed ? 'w-0 lg:w-20 -translate-x-full lg:translate-x-0' : 'w-64 translate-x-0'
        }`}
      >
        <nav className="flex flex-col gap-1.5 p-3 sm:p-4">
          {navItems.map((item) => {
            const isActive = activeView === item.path;
            return (
              <button
                key={item.key}
                onClick={() => {
                  navigateTo(item.path);
                  if (window.innerWidth < 1024) {
                    setIsSidebarCollapsed(true);
                  }
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-md shadow-primary/10'
                    : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:text-on-surface dark:hover:text-white'
                }`}
                title={item.label}
              >
                <span
                  className={`material-symbols-outlined text-[22px] shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white font-semibold' : 'text-on-surface-variant dark:text-slate-400 group-hover:text-primary'
                  }`}
                >
                  {item.icon}
                </span>

                <span
                  className={`text-body-md text-sm whitespace-nowrap transition-opacity duration-200 ${
                    isSidebarCollapsed ? 'lg:hidden' : 'block'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
