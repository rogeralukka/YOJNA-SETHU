import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';
import { useData } from '../../context/DataContext';
import { LanguageDropdown } from './LanguageDropdown';

export const Topbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { notifications, navigateTo, isSidebarCollapsed, setIsSidebarCollapsed } = useData();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest/90 dark:bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-between px-4 sm:px-8 border-b border-outline-variant/30 dark:border-slate-800 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Left Branding & Sidebar Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Sidebar"
          aria-label="Toggle Navigation Sidebar"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isSidebarCollapsed ? 'menu' : 'menu_open'}
          </span>
        </button>

        <div
          onClick={() => navigateTo(isAdmin ? 'admin-overview' : 'dashboard')}
          className="cursor-pointer flex items-center gap-2"
        >
          <span className="text-primary font-headline-md text-xl sm:text-2xl font-bold tracking-tight">
            {t('brandName')}
          </span>
          {isAdmin && (
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-primary-fixed/50 text-on-primary-fixed text-xs font-label-bold uppercase tracking-wider">
              {t('adminPortal')}
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Dropdown */}
        <LanguageDropdown />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-surface-container-low dark:hover:bg-slate-800 rounded-full transition-colors text-on-surface-variant dark:text-slate-200"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Icon with Badge (for Citizens) */}
        {!isAdmin && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 hover:bg-surface-container-low dark:hover:bg-slate-800 rounded-full transition-colors text-on-surface-variant dark:text-slate-200 relative"
              title="Notifications"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface-container-lowest dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {/* Quick Notifications Popover */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl shadow-2xl border border-outline-variant/30 dark:border-slate-700 py-3 z-50 animate-fade-in-up">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-outline-variant/20 dark:border-slate-700">
                  <span className="font-label-bold text-sm text-on-surface dark:text-white">
                    {t('notificationsUpdates')}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {unreadNotifs.length} {t('newBadgeCount')}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/10 dark:divide-slate-700/50">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        navigateTo('notifications');
                      }}
                      className={`p-3.5 hover:bg-surface-container-low dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-primary' : 'bg-transparent'}`}></span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body-md text-xs font-semibold text-on-surface dark:text-slate-100 truncate">
                            {notif.title}
                          </p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-slate-400 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-on-surface-variant/70 dark:text-slate-500 mt-1 block">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 px-4 border-t border-outline-variant/20 dark:border-slate-700 text-center">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigateTo('notifications');
                    }}
                    className="text-xs font-label-bold text-primary dark:text-primary-fixed hover:underline"
                  >
                    {t('viewAllNotifications')}
                                    </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Avatar & Dropdown */}
        <div className="relative border-l border-outline-variant/30 dark:border-slate-700 pl-3 sm:pl-4" ref={profileRef}>
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-label-bold text-on-surface dark:text-slate-100">
                {isAdmin ? 'Admin Officer' : user.name}
              </p>
              <p className="text-[11px] text-on-surface-variant dark:text-slate-400">
                {isAdmin ? 'admin@yojanasetu.gov.in' : user.email}
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-bold text-xs shadow-md transition-transform group-hover:scale-105">
              {isAdmin ? (
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl shadow-2xl border border-outline-variant/30 dark:border-slate-700 py-3 z-50 animate-fade-in-up">
              <div className="px-4 py-2 border-b border-outline-variant/20 dark:border-slate-700">
                <p className="font-label-bold text-sm text-on-surface dark:text-white">
                  {isAdmin ? 'Admin Portal' : user.name}
                </p>
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400 truncate">
                  {isAdmin ? 'admin_001' : user.email}
                </p>
              </div>

              <div className="py-2 space-y-1">
                {!isAdmin && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigateTo('profile');
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-xs font-medium text-on-surface dark:text-slate-200 hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">account_circle</span>
                    <span>{t('profile')}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 text-xs font-medium text-error hover:bg-error-container/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
