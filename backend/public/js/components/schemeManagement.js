import { t } from '../i18n.js';

export function renderSchemeManagement(schemes = []) {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">⚙️ ${t('manageSchemes')}</h2>
            <span class="badge-tag badge-new">Super Admin Privileges</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
            Create new Central & State welfare initiatives, edit eligibility parameters, and manage active scheme listings.
          </p>
        </div>

        <button class="btn btn-primary" onclick="window.app.openSchemeFormModal()">
          + ${t('addNewScheme')}
        </button>
      </div>

      <!-- Schemes Management Table -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
          <thead>
            <tr style="background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase;">
              <th style="padding: 14px 18px;">Scheme Title</th>
              <th style="padding: 14px 18px;">Department</th>
              <th style="padding: 14px 18px;">Category</th>
              <th style="padding: 14px 18px;">Target Type</th>
              <th style="padding: 14px 18px;">Status</th>
              <th style="padding: 14px 18px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${schemes.map(s => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 14px 18px;">
                  <div style="font-weight: 700; color: var(--text-primary);">${s.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">
                    Deadline: ${s.deadline ? new Date(s.deadline).toLocaleDateString('en-IN') : 'Ongoing'}
                  </div>
                </td>
                <td style="padding: 14px 18px; color: var(--text-secondary);">${s.department}</td>
                <td style="padding: 14px 18px;">
                  <span class="badge-tag" style="background: rgba(30,64,175,0.1); color: var(--brand-primary);">
                    ${s.category}
                  </span>
                </td>
                <td style="padding: 14px 18px;">
                  <span class="badge-tag" style="background: var(--bg-tertiary);">
                    ${s.isBusinessScheme ? '🏢 MSME' : '👤 Citizen'}
                  </span>
                </td>
                <td style="padding: 14px 18px;">
                  <span class="badge-tag ${s.isActive ? 'badge-approved' : 'badge-rejected'}">
                    ${s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style="padding: 14px 18px; text-align: right;">
                  <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="window.app.openSchemeFormModal('${s.id}')">
                      ✏️ Edit
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.app.deleteScheme('${s.id}')" style="color: var(--danger);">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
