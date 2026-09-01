import { t } from '../i18n.js';

export function renderSchemeFormModal(scheme = null) {
  const isEdit = !!scheme;

  const states = ['All', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Rajasthan', 'Madhya Pradesh'];
  const categories = ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'];
  const bizTypes = ['All', 'Manufacturing', 'Services', 'Retail', 'Agriculture'];
  const docOptions = ['aadhaar', 'pan', 'voter_id', 'income_cert', 'caste_cert'];

  const selectedStates = scheme?.states || ['All'];
  const selectedCats = scheme?.categories || ['All'];
  const selectedBiz = scheme?.businessTypes || ['All'];
  const selectedDocs = scheme?.documentsRequired || [];

  return `
    <div class="modal-overlay active" id="scheme-modal" onclick="if(event.target===this) window.app.closeSchemeFormModal()">
      <div class="glass-modal" style="max-width: 720px;">
        <button class="modal-close-btn" onclick="window.app.closeSchemeFormModal()">✕</button>

        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
          ${isEdit ? '✏️ Edit Government Scheme' : '➕ Add New Government Scheme'}
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
          ${isEdit ? 'Updating this scheme will automatically notify all active applicants.' : 'Publishing this scheme will automatically notify all matching eligible citizens.'}
        </p>

        <form onsubmit="window.app.handleSaveScheme(event, '${scheme?.id || ''}')">
          <div class="form-group">
            <label class="form-label">Scheme Name (English) *</label>
            <input type="text" id="sch-name" class="form-control" value="${scheme?.name || ''}" placeholder="e.g. AICTE Pragati Scholarship for Girls" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Government Department / Ministry *</label>
              <input type="text" id="sch-dept" class="form-control" value="${scheme?.department || ''}" placeholder="e.g. Ministry of Education" required />
            </div>

            <div class="form-group">
              <label class="form-label">Category *</label>
              <select id="sch-cat" class="form-control" required>
                <option value="Education" ${scheme?.category === 'Education' ? 'selected' : ''}>Education & Scholarships</option>
                <option value="Agriculture" ${scheme?.category === 'Agriculture' ? 'selected' : ''}>Agriculture & Farmers</option>
                <option value="Finance" ${scheme?.category === 'Finance' ? 'selected' : ''}>Finance & Micro-credit</option>
                <option value="MSME" ${scheme?.category === 'MSME' ? 'selected' : ''}>MSME & Subsidies</option>
                <option value="Health" ${scheme?.category === 'Health' ? 'selected' : ''}>Health & Assurance</option>
                <option value="Skills" ${scheme?.category === 'Skills' ? 'selected' : ''}>Skills & Employment</option>
                <option value="Women & Child" ${scheme?.category === 'Women & Child' ? 'selected' : ''}>Women & Child Development</option>
                <option value="Entrepreneurship" ${scheme?.category === 'Entrepreneurship' ? 'selected' : ''}>Entrepreneurship & Startups</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Scheme Description & Terms *</label>
            <textarea id="sch-desc" class="form-control" rows="3" placeholder="Provide full scheme objectives and scope..." required>${scheme?.description || ''}</textarea>
          </div>

          <!-- Eligibility Rules Section -->
          <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin: 16px 0;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">⚙️ Eligibility Rules Engine</h4>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Min Age</label>
                <input type="number" id="sch-min-age" class="form-control" value="${scheme?.minAge ?? 0}" />
              </div>
              <div class="form-group">
                <label class="form-label">Max Age</label>
                <input type="number" id="sch-max-age" class="form-control" value="${scheme?.maxAge ?? 100}" />
              </div>
              <div class="form-group">
                <label class="form-label">Max Income Ceiling (₹)</label>
                <input type="number" id="sch-max-income" class="form-control" value="${scheme?.maxIncome || ''}" placeholder="e.g. 500000" />
              </div>
            </div>

            <!-- Target Gender & Entity Type -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Target Gender</label>
                <select id="sch-gender" class="form-control">
                  <option value="All" ${scheme?.targetGender === 'All' ? 'selected' : ''}>All Genders</option>
                  <option value="Female" ${scheme?.targetGender === 'Female' ? 'selected' : ''}>Female Only</option>
                  <option value="Male" ${scheme?.targetGender === 'Male' ? 'selected' : ''}>Male Only</option>
                </select>
              </div>

              <div class="form-group" style="justify-content: center;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; margin-top: 22px;">
                  <input type="checkbox" id="sch-is-business" ${scheme?.isBusinessScheme ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--brand-primary);" />
                  <span>Is this a Business / MSME Scheme?</span>
                </label>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Application Deadline</label>
              <input type="date" id="sch-deadline" class="form-control" value="${scheme?.deadline ? new Date(scheme.deadline).toISOString().split('T')[0] : ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Official Portal URL (Optional)</label>
              <input type="url" id="sch-url" class="form-control" value="${scheme?.officialUrl || ''}" placeholder="https://..." />
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeSchemeFormModal()">
              ${t('cancel')}
            </button>
            <button type="submit" class="btn btn-primary">
              💾 Save Scheme
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
