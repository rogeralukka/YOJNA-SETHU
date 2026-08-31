import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderApplicationsView(applications = []) {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">📝 ${t('myApplications')}</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
          Track real-time administrative status, sanction orders, and review feedback for all your submitted applications.
        </p>

        <!-- Filters & Search Toolbar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border-color);">
          <input 
            type="text" 
            id="app-search-input" 
            class="form-control" 
            style="max-width: 320px;" 
            placeholder="Search by scheme name..." 
            oninput="window.app.handleAppSearch(this.value)"
          />

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <!-- Entity Filter -->
            <select id="app-entity-filter" class="form-control" style="width: auto;" onchange="window.app.handleAppEntityFilter(this.value)">
              <option value="all">Filter: All Applications</option>
              <option value="personal">Personal / Individual</option>
              <option value="business">Business / Enterprise</option>
            </select>

            <!-- Status Filter -->
            <select id="app-status-filter" class="form-control" style="width: auto;" onchange="window.app.handleAppStatusFilter(this.value)">
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <!-- Sort Filter -->
            <select id="app-sort-filter" class="form-control" style="width: auto;" onchange="window.app.handleAppSortFilter(this.value)">
              <option value="latest">Sort: Latest</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Applications List -->
      ${applications.length === 0 ? `
        <div style="text-align: center; padding: 70px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 12px;">📄</div>
          <h3 style="font-size: 1.2rem; font-weight: 700;">${t('noApplications')}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Explore eligible schemes and submit your first application.</p>
          <button class="btn btn-primary" style="margin-top: 18px;" onclick="window.app.navigate('dashboard')">
            Browse Eligible Schemes →
          </button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${applications.map(app => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; box-shadow: var(--shadow-sm);">
              <div style="flex: 1; min-width: 260px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span class="badge-tag badge-${app.status}">
                    ${app.status === 'pending' ? '⏳ Pending' : app.status === 'approved' ? '✔ Approved' : '✕ Rejected'}
                  </span>
                  <span class="badge-tag" style="background: var(--bg-tertiary); color: var(--text-secondary);">
                    Entity: <strong>${app.entity}</strong>
                  </span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">
                    Applied on: ${new Date(app.appliedOn).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">
                  ${app.schemeName}
                </h3>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
                  🏛️ ${app.department || 'Government Department'} • ${app.category || 'Welfare'}
                </p>

                ${app.adminComment ? `
                  <div style="background: var(--danger-bg); border-left: 3px solid var(--danger); padding: 8px 12px; border-radius: 4px; font-size: 0.82rem; color: var(--danger); margin-top: 10px;">
                    <strong>Admin Remark / Rejection Reason:</strong> "${app.adminComment}"
                  </div>
                ` : ''}
              </div>

              <!-- View Details Action -->
              <div>
                <button class="btn btn-outline btn-sm" onclick="window.app.openApplicationDetail('${app.id}')">
                  ${t('viewDetails')} & Timeline →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

export function renderApplicationDetailPage(application) {
  if (!application) return '';

  const snapshot = application.snapshotData || {};
  const timeline = application.timeline || [];

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Top Navigation -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('applications')">
          ← Back to Applications
        </button>
        <span class="badge-tag badge-${application.status}" style="font-size: 0.9rem; padding: 6px 14px;">
          Status: ${application.status.toUpperCase()}
        </span>
      </div>

      <!-- Application Card -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">${application.scheme.name}</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
              🏛️ ${application.scheme.department} • <strong>${application.scheme.category}</strong>
            </p>
          </div>
          <div style="text-align: right; font-size: 0.85rem; color: var(--text-secondary);">
            <div>Application ID: <code>${application.id}</code></div>
            <div>Applied On: <strong>${new Date(application.appliedAt).toLocaleString('en-IN')}</strong></div>
            <div>Last Updated: <strong>${new Date(application.updatedAt).toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        <!-- Application Timeline -->
        <div style="margin: 28px 0; padding: 20px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 18px; color: var(--text-primary);">Application Progress Timeline</h4>
          <div style="display: flex; flex-direction: column; gap: 16px; position: relative;">
            ${timeline.map((step, i) => `
              <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: ${step.status === 'completed' ? 'var(--success)' : step.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">
                  ${step.status === 'completed' ? '✔' : step.status === 'rejected' ? '✕' : '●'}
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${step.title}</div>
                  <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${step.description}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${new Date(step.date).toLocaleString('en-IN')}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Frozen Snapshot Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Applicant Info -->
          <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">Applicant Snapshot</h4>
            <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px;">
              <div>Name: <strong>${snapshot.applicant?.fullName || application.user?.fullName}</strong></div>
              <div>Email: <strong>${snapshot.applicant?.email || application.user?.email}</strong></div>
              <div>Phone: <strong>${snapshot.applicant?.mobile || application.user?.mobile}</strong></div>
              <div>Category: <strong>${snapshot.applicant?.category || 'General'}</strong></div>
              <div>State: <strong>${snapshot.applicant?.state || 'N/A'}</strong></div>
            </div>
          </div>

          <!-- Entity / Bank Info -->
          <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">Entity & Bank Details</h4>
            <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 6px;">
              <div>Entity Applied: <strong>${application.entity === 'personal' ? 'Individual Citizen' : (application.businessCard?.name || 'Business')}</strong></div>
              <div>Bank Name: <strong>${snapshot.bankDetails?.bankName || 'State Bank of India'}</strong></div>
              <div>Account Number: <strong>${snapshot.bankDetails?.accountNumber || '••••••••'}</strong></div>
              <div>IFSC Code: <strong>${snapshot.bankDetails?.ifscCode || 'N/A'}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
