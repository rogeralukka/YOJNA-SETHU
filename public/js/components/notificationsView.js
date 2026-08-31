import { t } from '../i18n.js';

export function renderNotificationsView(notifications = [], unreadCount = 0) {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">🔔 ${t('notifications')}</h2>
            ${unreadCount > 0 ? `<span class="badge-tag badge-new">${unreadCount} Unread</span>` : ''}
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
            Official scheme announcements, application approvals, rejection reasons, and welfare updates.
          </p>
        </div>

        ${unreadCount > 0 ? `
          <button class="btn btn-secondary btn-sm" onclick="window.app.markAllNotificationsRead()">
            ✔ ${t('markAllRead')}
          </button>
        ` : ''}
      </div>

      <!-- Notifications Feed -->
      ${notifications.length === 0 ? `
        <div style="text-align: center; padding: 70px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔕</div>
          <h3 style="font-size: 1.2rem; font-weight: 700;">${t('noNotifications')}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">You are all caught up on your scheme updates.</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${notifications.map(n => {
            const typeIcons = {
              application_submitted: '📤',
              application_approved: '🎉',
              application_rejected: '⚠️',
              scheme_added: '🚀',
              scheme_updated: '📢',
              system: 'ℹ️'
            };

            return `
              <div style="background: var(--bg-secondary); border: 1px solid ${!n.isRead ? 'var(--brand-primary)' : 'var(--border-color)'}; border-left: 4px solid ${!n.isRead ? 'var(--brand-accent)' : 'var(--border-color)'}; border-radius: var(--radius-md); padding: 18px 22px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; box-shadow: var(--shadow-sm);">
                <div style="display: flex; gap: 14px; align-items: flex-start; flex: 1;">
                  <div style="font-size: 1.6rem; min-width: 32px;">
                    ${typeIcons[n.type] || '🔔'}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                      <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${n.title}</h4>
                      ${!n.isRead ? `<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--brand-accent); display: inline-block;"></span>` : ''}
                    </div>
                    <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.45;">
                      ${n.message}
                    </p>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
                      ${new Date(n.createdAt).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                ${!n.isRead ? `
                  <button class="btn btn-secondary btn-sm" onclick="window.app.markNotificationRead('${n.id}')" title="Mark as read" style="font-size: 0.78rem;">
                    Mark Read
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}
