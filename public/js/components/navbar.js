import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderNavbar() {
  const isAuth = !!state.user;
  const user = state.user || {};
  const isAdmin = state.role === 'admin' || state.role === 'super_admin';

  return `
    <nav class="top-navbar">
      <div class="nav-brand" onclick="window.app.navigate('dashboard')">
        <div class="emblem-icon">🏛️</div>
        <div class="brand-text">
          <h1>${t('portalName')}</h1>
          <span>${t('portalSubtitle')}</span>
        </div>
      </div>

      <div class="nav-actions">
        <!-- Language Switcher -->
        <select class="form-control" style="width: auto; padding: 6px 12px; font-size: 0.85rem;" onchange="window.app.changeLanguage(this.value)">
          <option value="en" ${state.language === 'en' ? 'selected' : ''}>English</option>
          <option value="hi" ${state.language === 'hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
        </select>

        <!-- Theme Toggle -->
        <button class="btn btn-secondary btn-sm" onclick="window.app.toggleTheme()" title="Toggle Dark/Light Mode">
          ${state.theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        ${isAuth ? `
          <!-- Profile Dropdown Trigger -->
          <div style="position: relative;" id="profile-dropdown-container">
            <button class="btn btn-secondary btn-sm" onclick="window.app.toggleProfileMenu()" style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: var(--brand-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">
                ${user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </span>
              <span style="font-weight: 600; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${user.fullName || 'User'}
              </span>
              <small style="opacity: 0.7;">▼</small>
            </button>

            <!-- Dropdown Menu -->
            <div id="profile-menu" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; width: 230px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-xl); padding: 10px; z-index: 60;">
              <div style="padding: 8px; border-bottom: 1px solid var(--border-color); margin-bottom: 6px;">
                <div style="font-weight: 700; font-size: 0.9rem;">${user.fullName}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</div>
                <div style="font-size: 0.72rem; color: var(--brand-primary); font-weight: 600; margin-top: 2px;">
                  Role: ${state.role.toUpperCase().replace('_', ' ')}
                </div>
              </div>

              ${!isAdmin ? `
                <button class="nav-item" onclick="window.app.navigate('profile'); window.app.toggleProfileMenu();" style="padding: 8px 10px; font-size: 0.85rem;">
                  👤 ${t('completeProfile')}
                </button>
              ` : ''}

              <button class="nav-item" onclick="window.app.logout()" style="padding: 8px 10px; font-size: 0.85rem; color: var(--danger);">
                🚪 ${t('logout')}
              </button>
            </div>
          </div>
        ` : `
          <button class="btn btn-primary btn-sm" onclick="window.app.openAuthModal('login')">
            ${t('login')}
          </button>
        `}
      </div>
    </nav>
  `;
}
