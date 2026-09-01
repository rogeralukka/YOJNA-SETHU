import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderApplicationFormModal(schemeIds = []) {
  const user = state.user || {};
  const businesses = state.businesses || [];
  const selectedSchemes = state.schemes.filter(s => schemeIds.includes(s.id));
  const hasBusinessScheme = selectedSchemes.some(s => s.isBusinessScheme);
  const defaultEntity = hasBusinessScheme ? (businesses[0]?.id || 'business') : 'personal';

  return `
    <div class="modal-overlay active" id="application-modal" onclick="if(event.target===this) window.app.closeApplicationModal()">
      <div class="glass-modal" style="max-width: 680px;">
        <button class="modal-close-btn" onclick="window.app.closeApplicationModal()">✕</button>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">
            📝 Government Scheme Application
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            ${schemeIds.length > 1 ? `Submitting combined application for ${schemeIds.length} schemes` : 'Review pre-filled information and submit your official application'}
          </p>
        </div>

        <!-- Selected Scheme(s) Read-Only List -->
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
            Target Schemes (${selectedSchemes.length})
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${selectedSchemes.map((s, idx) => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.88rem;">
                <div>
                  <strong>${idx + 1}. ${s.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${s.department}</div>
                </div>
                <span class="badge-tag" style="background: rgba(30,64,175,0.1); color: var(--brand-primary); font-size: 0.72rem;">
                  ${s.isBusinessScheme ? '🏢 MSME' : '👤 Citizen'}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <form onsubmit="window.app.handleSubmitApplication(event, ${JSON.stringify(schemeIds)})">
          <!-- Entity Selection -->
          <div class="form-group">
            <label class="form-label">Applying As (Entity) *</label>
            ${hasBusinessScheme ? `
              <select id="apply-entity-select" class="form-control" onchange="window.app.handleApplicationEntitySwitch(this.value)" required>
                ${businesses.length === 0 ? `
                  <option value="" disabled selected>No business registered. Please add a business first!</option>
                ` : businesses.map((b, i) => `
                  <option value="${b.id}" ${i === 0 ? 'selected' : ''}>🏢 ${b.name} (${b.type})</option>
                `).join('')}
              </select>
            ` : `
              <input type="text" class="form-control" value="👤 You (${user.fullName || 'Individual Citizen'})" readonly style="background: var(--bg-tertiary);" />
              <input type="hidden" id="apply-entity-select" value="personal" />
            `}
          </div>

          <!-- Auto-Filled Personal Details -->
          <div style="border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>👤 Applicant Profile Details</span>
              <span class="badge-tag badge-eligible" style="font-size: 0.68rem;">Auto-Filled from Profile</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="apply-name" class="form-control" value="${user.fullName || ''}" placeholder="Full Name" required />
              </div>
              <div class="form-group">
                <label class="form-label">Age</label>
                <input type="number" id="apply-age" class="form-control" value="${user.age || ''}" placeholder="Age in years" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">State</label>
                <input type="text" id="apply-state" class="form-control" value="${user.state || ''}" placeholder="State" required />
              </div>
              <div class="form-group">
                <label class="form-label">Social Category</label>
                <input type="text" id="apply-category" class="form-control" value="${user.category || 'General'}" placeholder="General/OBC/SC/ST" required />
              </div>
              <div class="form-group">
                <label class="form-label">Annual Income (₹)</label>
                <input type="number" id="apply-income" class="form-control" value="${user.annualIncome || ''}" placeholder="Annual Income" required />
              </div>
            </div>
          </div>

          <!-- Bank Details Section -->
          <div style="border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 16px;">
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span>🏦 Direct Benefit Transfer (DBT) Bank Account</span>
              <span class="badge-tag badge-eligible" style="font-size: 0.68rem;">Auto-Filled</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Account Holder Name</label>
                <input type="text" id="apply-acc-holder" class="form-control" value="${user.accountHolderName || user.fullName || ''}" placeholder="Holder Name" required />
              </div>
              <div class="form-group">
                <label class="form-label">Bank Name</label>
                <input type="text" id="apply-bank-name" class="form-control" value="${user.bankName || 'State Bank of India'}" placeholder="Bank Name" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Account Number</label>
                <input type="text" id="apply-acc-num" class="form-control" value="${user.accountNumber || ''}" placeholder="Account Number" required />
              </div>
              <div class="form-group">
                <label class="form-label">IFSC Code</label>
                <input type="text" id="apply-ifsc" class="form-control" value="${user.ifscCode || ''}" placeholder="e.g. SBIN0001234" required />
              </div>
            </div>
          </div>

          <!-- Verification Checkbox -->
          <div style="margin-top: 20px; background: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-sm);">
            <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" required style="margin-top: 3px; accent-color: var(--brand-primary);" />
              <span>I hereby declare that all information and uploaded documents provided above are genuine and true to the best of my knowledge under the Government of India Digital Portal terms.</span>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeApplicationModal()">
              ${t('cancel')}
            </button>
            <button type="submit" class="btn btn-primary" style="background: var(--brand-accent); border: none; padding: 12px 28px;">
              🚀 ${t('submitApplication')}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
