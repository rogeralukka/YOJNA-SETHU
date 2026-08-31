import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderAdminDashboard(statsData) {
  const stats = statsData?.stats || {
    totalUsers: 0,
    totalBusinesses: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  };

  const isSuperAdmin = state.role === 'super_admin';

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">📊 ${t('adminDashboard')}</h2>
            <span class="badge-tag" style="background: var(--brand-primary); color: #fff;">
              ${isSuperAdmin ? '👑 Super Admin' : '🛡️ Verification Officer'}
            </span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
            Real-time welfare application volume, processing metrics, category distribution, and demographic trends.
          </p>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('admin-applications')">
            📑 Review Applications
          </button>
          ${isSuperAdmin ? `
            <button class="btn btn-primary btn-sm" onclick="window.app.navigate('scheme-management')" style="background: var(--brand-accent); border: none;">
              ⚙️ ${t('manageSchemes')}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Stats KPI Cards Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Users</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--brand-primary); margin-top: 4px;">${stats.totalUsers}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Registered Citizens</span>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Businesses</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--brand-secondary); margin-top: 4px;">${stats.totalBusinesses}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">MSMEs & Agri Units</span>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Applications</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${stats.totalApplications}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">All Submissions</span>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid #fcd34d; border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--warning); text-transform: uppercase;">Pending Review</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--warning); margin-top: 4px;">${stats.pendingApplications}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Awaiting Decision</span>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid #86efac; border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--success); text-transform: uppercase;">Approved</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--success); margin-top: 4px;">${stats.approvedApplications}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Sanctioned</span>
        </div>

        <div style="background: var(--bg-secondary); border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--danger); text-transform: uppercase;">Rejected</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--danger); margin-top: 4px;">${stats.rejectedApplications}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Ineligible / Incomplete</span>
        </div>
      </div>

      <!-- Interactive Visual Analytics Charts Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Applications by Category (Pie Chart) -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">🍰 Applications by Category</h3>
          <div id="category-pie-chart-container" style="min-height: 240px; display: flex; align-items: center; justify-content: center;">
            Loading chart...
          </div>
        </div>

        <!-- Top 5 Most Applied Schemes (Bar Chart) -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
          <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">🏆 Top 5 Most Applied Schemes</h3>
          <div id="top5-bar-chart-container" style="min-height: 240px;">
            Loading ranking...
          </div>
        </div>
      </div>

      <!-- Applications Monthly Trend (Line Chart) -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
        <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">📈 Application Volume Trends</h3>
        <div id="trend-line-chart-container" style="min-height: 180px;">
          Loading monthly trends...
        </div>
      </div>
    </div>
  `;
}
