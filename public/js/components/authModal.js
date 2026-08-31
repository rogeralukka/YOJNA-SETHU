import { t } from '../i18n.js';

export function renderAuthModal(activeTab = 'login') {
  return `
    <div class="modal-overlay" id="auth-modal" onclick="if(event.target===this) window.app.closeAuthModal()">
      <div class="glass-modal">
        <button class="modal-close-btn" onclick="window.app.closeAuthModal()">✕</button>

        <div style="text-align: center; margin-bottom: 24px;">
          <div class="emblem-icon" style="margin: 0 auto 12px; width: 48px; height: 48px; font-size: 24px;">🏛️</div>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary);">
            ${activeTab === 'login' ? 'Citizen Portal Login' : 'Create Citizen Account'}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            ${activeTab === 'login' ? 'Enter your credentials to access your schemes' : 'Register once to access hundreds of government entitlements'}
          </p>
        </div>

        <!-- Glass Tabs -->
        <div class="glass-tabs">
          <button class="glass-tab-btn ${activeTab === 'login' ? 'active' : ''}" onclick="window.app.switchAuthTab('login')">
            ${t('login')}
          </button>
          <button class="glass-tab-btn ${activeTab === 'register' ? 'active' : ''}" onclick="window.app.switchAuthTab('register')">
            ${t('register')}
          </button>
        </div>

        ${activeTab === 'login' ? `
          <!-- Login Form -->
          <form onsubmit="window.app.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email or Mobile Number</label>
              <input type="text" id="login-identifier" class="form-control" placeholder="e.g. aarav.sharma@example.com or 9876543210" required />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="login-password" class="form-control" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px; padding: 12px;">
              ${t('login')}
            </button>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; font-size: 0.85rem;">
              <a href="javascript:void(0)" onclick="window.app.switchAuthTab('register')" style="color: var(--text-secondary);">
                New user? <strong style="color: var(--brand-primary);">Register here</strong>
              </a>
              <a href="javascript:void(0)" onclick="window.app.closeAuthModal(); window.app.navigate('admin-login');" style="color: var(--brand-accent); font-weight: 600;">
                Login as Admin →
              </a>
            </div>
          </form>
        ` : `
          <!-- Register Form -->
          <form onsubmit="window.app.handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="reg-name" class="form-control" placeholder="e.g. Aarav Sharma" required />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="reg-email" class="form-control" placeholder="aarav.sharma@example.com" required />
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <input type="tel" id="reg-mobile" class="form-control" placeholder="9876543210" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="reg-password" class="form-control" placeholder="••••••••" required />
              </div>
              <div class="form-group">
                <label class="form-label">Confirm Password</label>
                <input type="password" id="reg-confirm-password" class="form-control" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px; padding: 12px;">
              ${t('register')} & Access Dashboard
            </button>

            <div style="text-align: center; margin-top: 20px; font-size: 0.85rem;">
              <span style="color: var(--text-secondary);">Already registered? </span>
              <a href="javascript:void(0)" onclick="window.app.switchAuthTab('login')">
                <strong style="color: var(--brand-primary);">Login here</strong>
              </a>
            </div>
          </form>
        `}
      </div>
    </div>
  `;
}
