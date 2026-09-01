export function renderAdminLogin() {
  return `
    <div style="min-height: calc(100vh - var(--navbar-height)); display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="glass-modal" style="max-width: 460px; box-shadow: var(--shadow-xl); border: 1px solid var(--border-color);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="emblem-icon" style="margin: 0 auto 12px; width: 50px; height: 50px; font-size: 26px; background: linear-gradient(135deg, #1e40af, #0d9488);">🛡️</div>
          <h2 style="font-size: 1.4rem; font-weight: 800;">Official Administrator Portal</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Secure access for Government Verification Officers & Super Administrators
          </p>
        </div>

        <form onsubmit="window.app.handleAdminLogin(event)">
          <div class="form-group">
            <label class="form-label">Official Admin ID or Email</label>
            <input type="text" id="admin-id" class="form-control" placeholder="superadmin@gov.in or admin@gov.in" required />
          </div>

          <div class="form-group">
            <label class="form-label">Admin Security Password</label>
            <input type="password" id="admin-password" class="form-control" placeholder="••••••••" required />
          </div>

          <div style="background: var(--bg-tertiary); border-radius: var(--radius-sm); padding: 10px; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 16px;">
            <strong>Demo Credentials:</strong><br/>
            • <strong>Super Admin:</strong> <code>superadmin@gov.in</code> / <code>SuperAdmin@123</code> (Scheme CRUD + Approvals)<br/>
            • <strong>Normal Admin:</strong> <code>admin@gov.in</code> / <code>Admin@123</code> (Approve/Reject Only)
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">
            🔒 Secure Admin Login
          </button>

          <div style="text-align: center; margin-top: 18px;">
            <a href="javascript:void(0)" onclick="window.app.navigate('dashboard')" style="font-size: 0.85rem; color: var(--text-secondary);">
              ← Back to Citizen Portal
            </a>
          </div>
        </form>
      </div>
    </div>
  `;
}
