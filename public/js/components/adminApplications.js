import { t } from '../i18n.js';

export function renderAdminApplications(applications = []) {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">📑 Welfare Applications Management</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
          Filter, search, and review citizen & enterprise scheme applications for administrative sanction or rejection.
        </p>

        <!-- Search & Filters Toolbar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border-color);">
          <input 
            type="text" 
            id="admin-app-search" 
            class="form-control" 
            style="max-width: 320px;" 
            placeholder="Search by scheme, user, or business..." 
            oninput="window.app.handleAdminAppSearch(this.value)"
          />

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <!-- Status Filter -->
            <select id="admin-app-status-filter" class="form-control" style="width: auto;" onchange="window.app.handleAdminAppStatusFilter(this.value)">
              <option value="all">Status: All Submissions</option>
              <option value="pending">⏳ Pending Review Only</option>
              <option value="approved">✔ Approved</option>
              <option value="rejected">✕ Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
          <thead>
            <tr style="background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase;">
              <th style="padding: 14px 18px;">Applicant / Entity</th>
              <th style="padding: 14px 18px;">Scheme Target</th>
              <th style="padding: 14px 18px;">Status</th>
              <th style="padding: 14px 18px;">Applied On</th>
              <th style="padding: 14px 18px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${applications.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
                  No applications found matching the search criteria.
                </td>
              </tr>
            ` : applications.map(app => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 14px 18px;">
                  <div style="font-weight: 700; color: var(--text-primary);">${app.userName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${app.userEmail || ''} • ${app.entity}</div>
                </td>
                <td style="padding: 14px 18px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${app.schemeName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${app.department || ''}</div>
                </td>
                <td style="padding: 14px 18px;">
                  <span class="badge-tag badge-${app.status}">
                    ${app.status === 'pending' ? '⏳ Pending' : app.status === 'approved' ? '✔ Approved' : '✕ Rejected'}
                  </span>
                </td>
                <td style="padding: 14px 18px; color: var(--text-muted); font-size: 0.82rem;">
                  ${new Date(app.appliedOn).toLocaleDateString('en-IN')}
                </td>
                <td style="padding: 14px 18px; text-align: right;">
                  <button class="btn btn-primary btn-sm" onclick="window.app.openAdminReview('${app.applicationId}')">
                    Inspect & Review →
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
