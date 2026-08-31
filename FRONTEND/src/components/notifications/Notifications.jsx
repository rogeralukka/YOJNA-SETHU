import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const Notifications = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    schemes,
    applications
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

  const getNotifIcon = (type) => {
    switch (type) {
      case 'approved':
        return { icon: 'check_circle', bg: 'bg-[#E8F5E9] dark:bg-emerald-950/60 text-[#1B5E20] dark:text-emerald-400' };
      case 'scheme_added':
        return { icon: 'new_releases', bg: 'bg-[#FFF8E1] dark:bg-amber-950/60 text-[#FF8F00] dark:text-amber-400' };
      case 'rejected':
      case 'action_required':
        return { icon: 'error', bg: 'bg-[#FFEBEE] dark:bg-red-950/60 text-[#C62828] dark:text-red-400' };
      default:
        return { icon: 'info', bg: 'bg-surface-container-high dark:bg-slate-700 text-secondary dark:text-slate-300' };
    }
  };

  const renderNotifCard = (notif) => {
    const iconStyle = getNotifIcon(notif.type);

    return (
      <div
        key={notif.id}
        onClick={() => markNotificationAsRead(notif.id)}
        className={`relative bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 hover:shadow-lg transition-all duration-300 flex gap-4 sm:gap-6 items-start group overflow-hidden ${
          !notif.read ? 'bg-primary/5 dark:bg-slate-800/90' : ''
        }`}
      >
        {/* Unread Accent Bar & Glowing Dot */}
        {!notif.read && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary dark:bg-primary-fixed" />
            <div className="absolute top-6 left-[-4px] w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest dark:ring-slate-800 animate-pulse" />
          </>
        )}

        {/* Icon Circle */}
        <div className={`w-12 h-12 rounded-full ${iconStyle.bg} flex items-center justify-center shrink-0 shadow-sm`}>
          <span className="material-symbols-outlined text-[24px]">
            {iconStyle.icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-status-badge font-bold flex items-center gap-1 ${iconStyle.bg}`}>
                {t('badge_' + notif.type, {}, notif.badge || t('update'))}
              </span>
              <span className="text-body-sm text-xs text-on-surface-variant dark:text-slate-400">
                {t('time_' + notif.id, {}, notif.timestamp)}
              </span>
            </div>

            {!notif.read && (
              <span className="text-[10px] font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">
                {t('unread')}
              </span>
            )}
          </div>

          <h3 className="text-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white mb-1">
            {t('notifTitle_' + notif.id, {}, notif.title)}
          </h3>

          <p className="text-body-md text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 mb-4 leading-relaxed">
            {t('notifMsg_' + notif.id, {}, notif.message)}
          </p>

          {/* Action CTAs */}
          {notif.actionType && notif.actionType !== 'info' && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(notif);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-bold hover:bg-primary-container transition-all shadow-sm"
              >
                {notif.actionType === 'apply_scheme'
                  ? t('applyNow')
                  : notif.actionType === 'update_document'
                  ? t('updateDocument')
                  : t('viewDetails')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-margin-desktop py-8 pb-24 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-headline-xl text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface dark:text-white mb-1">
            {t('notificationsUpdates')}
          </h1>
          <p className="text-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-slate-300">
            {t('notificationsSubtitle')}
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container dark:bg-slate-800 text-on-surface dark:text-slate-200 hover:bg-surface-container-high dark:hover:bg-slate-700 transition-all text-xs font-label-bold shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>{t('markAllRead')}</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low dark:bg-slate-800/40 rounded-3xl text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">notifications_off</span>
          <h3 className="text-lg font-bold text-on-surface dark:text-white">{t('noNotifications')}</h3>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">{t('allCaughtUp')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Today Group */}
          {todayNotifs.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-label-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  {t('today')}
                </span>
                <div className="h-[1px] bg-outline-variant/30 dark:bg-slate-700 flex-grow" />
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
                <span className="text-xs font-label-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400">
                  {t('yesterday')}
                </span>
                <div className="h-[1px] bg-outline-variant/30 dark:bg-slate-700 flex-grow" />
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
