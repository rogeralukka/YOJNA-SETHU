import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderSidebar() {
  const isAdmin = state.role === 'admin' || state.role === 'super_admin';
  const isSuperAdmin = state.role === 'super_admin';

  if (!state.user) {
    return ''; // No sidebar on landing screen
  }

  return `
    <aside class="left-sidebar" id="left-sidebar">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
        <button class="sidebar-toggle-btn" onclick="window.app.toggleSidebar()" title="Collapse/Expand">
          ⇋
        </button>
      </div>

      <nav class="sidebar-nav">
        ${!isAdmin ? `
          <!-- Citizen User Navigation -->
          <button class="nav-item ${state.activeView === 'dashboard' ? 'active' : ''}" onclick="window.app.navigate('dashboard')">
            <span class="icon">🏠</span>
            <span class="sidebar-text">${t('dashboard')}</span>
          </button>

          <button class="nav-item ${state.activeView === 'business' ? 'active' : ''}" onclick="window.app.navigate('business')">
            <span class="icon">💼</span>
            <span class="sidebar-text">${t('myBusiness')}</span>
          </button>

          <button class="nav-item ${state.activeView === 'applications' ? 'active' : ''}" onclick="window.app.navigate('applications')">
            <span class="icon">📝</span>
            <span class="sidebar-text">${t('myApplications')}</span>
          </button>

          <button class="nav-item ${state.activeView === 'bookmarks' ? 'active' : ''}" onclick="window.app.navigate('bookmarks')">
            <span class="icon">⭐</span>
            <span class="sidebar-text">${t('bookmarks')}</span>
          </button>

          <button class="nav-item ${state.activeView === 'notifications' ? 'active' : ''}" onclick="window.app.navigate('notifications')">
            <span class="icon">🔔</span>
            <span class="sidebar-text">${t('notifications')}</span>
            ${state.unreadNotificationsCount > 0 ? `<span class="badge">${state.unreadNotificationsCount}</span>` : ''}
          </button>

          <button class="nav-item" onclick="window.app.openShareModal()">
            <span class="icon">🔗</span>
            <span class="sidebar-text">${t('shareEligibility')}</span>
          </button>

          <div style="height: 1px; background: var(--border-color); margin: 12px 0;"></div>

          <button class="nav-item ${state.activeView === 'profile' ? 'active' : ''}" onclick="window.app.navigate('profile')">
            <span class="icon">👤</span>
            <span class="sidebar-text">${t('completeProfile')}</span>
          </button>
        ` : `
          <!-- Administrator Navigation -->
          <button class="nav-item ${state.activeView === 'admin-dashboard' ? 'active' : ''}" onclick="window.app.navigate('admin-dashboard')">
            <span class="icon">📊</span>
            <span class="sidebar-text">${t('adminDashboard')}</span>
          </button>

          <button class="nav-item ${state.activeView === 'admin-applications' ? 'active' : ''}" onclick="window.app.navigate('admin-applications')">
            <span class="icon">📑</span>
            <span class="sidebar-text">Review Applications</span>
          </button>

          ${isSuperAdmin ? `
            <button class="nav-item ${state.activeView === 'scheme-management' ? 'active' : ''}" onclick="window.app.navigate('scheme-management')">
              <span class="icon">⚙️</span>
              <span class="sidebar-text">${t('manageSchemes')}</span>
            </button>
          ` : ''}

          <div style="height: 1px; background: var(--border-color); margin: 12px 0;"></div>

          <button class="nav-item" onclick="window.app.navigate('dashboard')">
            <span class="icon">👁️</span>
            <span class="sidebar-text">Preview Citizen View</span>
          </button>
        `}
      </nav>
    </aside>
  `;
}
