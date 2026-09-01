export function renderAdminReviewPage(reviewData) {
  if (!reviewData) return '';

  const app = reviewData;
  const user = app.applicantUser || {};
  const business = app.businessDetails;
  const bank = app.bankDetails || {};
  const docs = app.documents || [];
  const scheme = app.scheme || {};

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Top Navigation -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('admin-applications')">
          ← Back to Applications List
        </button>
        <span class="badge-tag badge-${app.status}" style="font-size: 0.9rem; padding: 6px 14px;">
          Current Status: ${app.status.toUpperCase()}
        </span>
      </div>

      <!-- Main Review Header -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
          <div>
            <span class="badge-tag" style="background: rgba(30,64,175,0.1); color: var(--brand-primary); margin-bottom: 6px;">
              ${scheme.category}
            </span>
            <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">${scheme.name}</h1>
            <p style="color: var(--text-muted); font-size: 0.88rem;">🏛️ ${scheme.department}</p>
          </div>

          <div style="text-align: right; font-size: 0.85rem; color: var(--text-secondary);">
            <div>Application ID: <code>${app.applicationId}</code></div>
            <div>Submitted On: <strong>${new Date(app.appliedAt).toLocaleString('en-IN')}</strong></div>
          </div>
        </div>

        ${app.adminComment ? `
          <div style="background: var(--danger-bg); border-left: 4px solid var(--danger); padding: 12px 18px; border-radius: var(--radius-sm); margin-top: 18px; font-size: 0.88rem; color: var(--danger);">
            <strong>Recorded Administrative Rejection Remark:</strong> "${app.adminComment}"
          </div>
        ` : ''}
      </div>

      <!-- Applicant & Business Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Applicant Information -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px;">👤 Applicant Profile Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.88rem;">
            <div><span style="color: var(--text-muted); display: block;">Full Name</span><strong>${user.fullName || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Email Address</span><strong>${user.email || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Mobile Phone</span><strong>${user.mobile || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Age / Gender</span><strong>${user.age ? `${user.age} Yrs` : 'N/A'} • ${user.gender || 'All'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">State / UT</span><strong>${user.state || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Social Category</span><strong>${user.category || 'General'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Annual Income</span><strong>${user.annualIncome ? `₹${user.annualIncome.toLocaleString('en-IN')}` : 'Not specified'}</strong></div>
          </div>

          <h4 style="font-size: 1rem; font-weight: 800; margin: 20px 0 10px; padding-top: 14px; border-top: 1px solid var(--border-color);">
            🏦 Verified Bank Account (DBT)
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.88rem;">
            <div><span style="color: var(--text-muted); display: block;">Account Holder</span><strong>${bank.accountHolderName || user.fullName || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Bank Name</span><strong>${bank.bankName || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">Account Number</span><strong>${bank.accountNumber || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted); display: block;">IFSC Code</span><strong>${bank.ifscCode || 'N/A'}</strong></div>
          </div>
        </div>

        <!-- Business & Uploaded Documents -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${business ? `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
              <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px;">🏢 Enterprise / Business Profile</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.88rem;">
                <div><span style="color: var(--text-muted); display: block;">Enterprise Name</span><strong>${business.name}</strong></div>
                <div><span style="color: var(--text-muted); display: block;">Enterprise Type</span><strong>${business.type}</strong></div>
                <div><span style="color: var(--text-muted); display: block;">Industry Category</span><strong>${business.industryCategory}</strong></div>
                <div><span style="color: var(--text-muted); display: block;">Turnover</span><strong>${business.turnover}</strong></div>
                <div><span style="color: var(--text-muted); display: block;">GST Number</span><strong>${business.gstNumber || 'Not provided'}</strong></div>
                <div><span style="color: var(--text-muted); display: block;">Udyam Number</span><strong>${business.udyamNumber || 'Not provided'}</strong></div>
              </div>
            </div>
          ` : ''}

          <!-- Uploaded Documents Repository -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 14px;">📁 Uploaded Identity & Verification Documents</h3>
            ${docs.length === 0 ? `
              <p style="font-size: 0.85rem; color: var(--text-muted);">No documents uploaded yet by applicant.</p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${docs.map(doc => `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-tertiary); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.85rem;">
                    <div>
                      <strong>${doc.docType.toUpperCase().replace('_', ' ')}</strong>
                      <span style="color: var(--text-muted); font-size: 0.78rem; margin-left: 8px;">(${doc.fileName})</span>
                    </div>
                    <a href="${doc.fileUrl}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.78rem;">
                      👁️ View Document ↗
                    </a>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Decision Action Panel -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 800;">Administrative Review Decision</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Taking a decision will automatically dispatch an official notification alert to the applicant.</p>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn btn-danger" onclick="window.app.openRejectModal('${app.applicationId}')">
            ✕ Reject Application
          </button>
          <button class="btn btn-primary" onclick="window.app.handleApproveApplication('${app.applicationId}')" style="background: var(--success); border-color: var(--success);">
            ✔ Approve & Sanction Application
          </button>
        </div>
      </div>

      <!-- Rejection Modal -->
      <div class="modal-overlay" id="reject-modal" onclick="if(event.target===this) window.app.closeRejectModal()">
        <div class="glass-modal" style="max-width: 500px;">
          <button class="modal-close-btn" onclick="window.app.closeRejectModal()">✕</button>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--danger); margin-bottom: 6px;">Reject Application</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            Please provide a mandatory justification remark or reason for rejection to notify the applicant.
          </p>

          <form onsubmit="window.app.handleRejectApplication(event, '${app.applicationId}')">
            <div class="form-group">
              <label class="form-label">Mandatory Admin Rejection Remark *</label>
              <textarea id="reject-comment" class="form-control" rows="4" placeholder="e.g. Annual turnover exceeds threshold limit, or Income certificate document is not legible..." required></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
              <button type="button" class="btn btn-secondary" onclick="window.app.closeRejectModal()">Cancel</button>
              <button type="submit" class="btn btn-danger">Confirm Rejection</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
