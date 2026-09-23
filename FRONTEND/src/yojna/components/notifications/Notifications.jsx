import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import {
  CheckCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Info,
  Bell,
  ArrowRight
} from 'lucide-react';

export const Notifications = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    schemes
  } = useData();
  const { t } = useLang();

  const todayNotifs = notifications.filter((n) => n.dateGroup === 'today');
  const yesterdayNotifs = notifications.filter((n) => n.dateGroup !== 'today');

  const handleActionClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.actionType === 'view_application') {
      navigateTo('my-applications');
    } else if (notif.actionType === 'apply_scheme') {
      const foundScheme = schemes.find((s) => s.id === notif.actionTarget);
      if (foundScheme) {
        navigateTo('application-form', [foundScheme]);
      } else {
        navigateTo('dashboard');
      }
    } else if (notif.actionType === 'update_document') {
      navigateTo('profile');
    }
  };

  const getNotifIconConfig = (type) => {
    switch (type) {
      case 'approved':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        };
      case 'scheme_added':
        return {
          icon: Sparkles,
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        };
      case 'rejected':
      case 'action_required':
        return {
          icon: AlertCircle,
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
        };
    }
  };

  const renderNotifCard = (notif) => {
    const iconConfig = getNotifIconConfig(notif.type);
    const NotifIcon = iconConfig.icon;

    return (
      <div
        key={notif.id}
        onClick={() => markNotificationAsRead(notif.id)}
        className={`relative bg-white dark:bg-[#0F1115] rounded-2xl p-5 sm:p-6 shadow-sm border border-neutral-200 dark:border-white/[0.08] hover:shadow-lg transition-all duration-300 flex gap-4 sm:gap-5 items-start group overflow-hidden cursor-pointer ${
          !notif.read ? 'bg-blue-50/20 dark:bg-[#16191F]/80' : ''
        }`}
      >
        {/* Unread Accent Bar & Dot */}
        {!notif.read && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500" />
        )}

        {/* Centered Avatar Circle with Clean SVG Icon */}
        <div className={`w-11 h-11 rounded-xl ${iconConfig.bg} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
          <NotifIcon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${iconConfig.bg}`}>
                {notif.badge || 'UPDATE'}
              </span>
              <span className="text-xs text-neutral-500 dark:text-[#8A8F98]">
                {notif.timestamp}
              </span>
            </div>

            {!notif.read && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Unread
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] mb-1">
            {notif.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#8A8F98] mb-3 leading-relaxed">
            {notif.message}
          </p>

          {/* Action CTAs */}
          {notif.actionType && notif.actionType !== 'info' && (
            <div className="pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(notif);
                }}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {notif.actionType === 'apply_scheme'
                    ? 'Apply Now'
                    : notif.actionType === 'update_document'
                    ? 'Update Document'
                    : 'View Details'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-12 py-8 pb-24 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-[#EDEDED] mb-1">
            {t('notificationsUpdates') || 'Notifications & Updates'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8A8F98]">
            {t('notificationsSubtitle') || 'Live alerts on scheme eligibility changes, verification progress, and newly notified welfare programs.'}
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] hover:bg-neutral-100 dark:hover:bg-[#1D212A] transition-all text-xs font-semibold shadow-xs cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-3xl text-center shadow-sm">
          <Bell className="w-12 h-12 text-neutral-400 dark:text-[#8A8F98] mb-3" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-[#EDEDED]">No Notifications</h3>
          <p className="text-xs text-neutral-500 dark:text-[#8A8F98]">You are all caught up with your latest updates!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Today Group */}
          {todayNotifs.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-[#8A8F98]">
                  TODAY
                </span>
                <div className="h-px bg-neutral-200 dark:bg-white/[0.08] flex-grow" />
              </div>
              <div className="flex flex-col gap-4">
                {todayNotifs.map(renderNotifCard)}
              </div>
            </div>
          )}

          {/* Yesterday / Earlier Group */}
          {yesterdayNotifs.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-[#8A8F98]">
                  YESTERDAY
                </span>
                <div className="h-px bg-neutral-200 dark:bg-white/[0.08] flex-grow" />
              </div>
              <div className="flex flex-col gap-4">
                {yesterdayNotifs.map(renderNotifCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
