import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderBusinessView() {
  const businesses = state.businesses || [];

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">🏢 ${t('myBusiness')}</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
            Manage your registered MSME, agricultural, and commercial business profiles to check enterprise scheme eligibility.
          </p>
        </div>

        <button class="btn btn-primary" onclick="window.app.openBusinessFormModal()">
          + ${t('addBusiness')}
        </button>
      </div>

      <!-- Business Cards Grid -->
      ${businesses.length === 0 ? `
        <!-- Empty State -->
        <div style="text-align: center; padding: 80px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 3.5rem; margin-bottom: 16px;">🏢</div>
          <h3 style="font-size: 1.3rem; font-weight: 700;">${t('noBusinesses')}</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 480px; margin: 8px auto 24px;">
            Add your enterprise profile once with GST/PAN and turnover to evaluate subsidies, PMEGP loans, and Mudra financing tailored for your sector.
          </p>
          <button class="btn btn-primary btn-lg" onclick="window.app.openBusinessFormModal()">
            + Add Your First Business
          </button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 22px;">
          ${businesses.map(b => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm);">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
                  <span class="badge-tag" style="background: rgba(30, 64, 175, 0.1); color: var(--brand-primary);">
                    ${b.type}
                  </span>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-sm" onclick="window.app.openBusinessFormModal('${b.id}')" title="Edit Business">
                      ✏️ Edit
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.app.deleteBusiness('${b.id}')" title="Delete" style="color: var(--danger);">
                      🗑️
                    </button>
                  </div>
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
                  ${b.name}
                </h3>
                <p style="font-size: 0.85rem; color: var(--brand-secondary); font-weight: 600; margin-bottom: 14px;">
                  Industry: ${b.industryCategory || 'General Commercial'}
                </p>

                <!-- Key Attributes -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--bg-tertiary); border-radius: var(--radius-md); padding: 12px; font-size: 0.82rem; margin-bottom: 18px;">
                  <div>
                    <span style="color: var(--text-muted); display: block;">Turnover</span>
                    <strong>${b.turnover}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block;">Employees</span>
                    <strong>${b.employeeCount}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block;">GST Number</span>
                    <strong>${b.gstNumber || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span style="color: var(--text-muted); display: block;">PAN Number</span>
                    <strong>${b.panNumber || 'Not provided'}</strong>
                  </div>
                </div>
              </div>

              <!-- Action -->
              <button class="btn btn-primary" style="width: 100%;" onclick="window.app.selectBusinessAndCheckEligibility('${b.id}')">
                🎯 Check Eligibility for this Business →
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

export function renderBusinessFormModal(business = null) {
  const isEdit = !!business;

  return `
    <div class="modal-overlay active" id="business-modal" onclick="if(event.target===this) window.app.closeBusinessFormModal()">
      <div class="glass-modal" style="max-width: 640px;">
        <button class="modal-close-btn" onclick="window.app.closeBusinessFormModal()">✕</button>

        <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 6px;">
          ${isEdit ? 'Edit Business Profile' : 'Add New Business Profile'}
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
          Fill in your enterprise details to match tailored subsidies and business schemes.
        </p>

        <form onsubmit="window.app.handleSaveBusiness(event, '${business?.id || ''}')">
          <div class="form-group">
            <label class="form-label">Business Name *</label>
            <input type="text" id="biz-name" class="form-control" value="${business?.name || ''}" placeholder="e.g. Patel Organic Textiles" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Business Type *</label>
              <select id="biz-type" class="form-control" required>
                <option value="Manufacturing" ${business?.type === 'Manufacturing' ? 'selected' : ''}>Manufacturing</option>
                <option value="Services" ${business?.type === 'Services' ? 'selected' : ''}>Services</option>
                <option value="Retail" ${business?.type === 'Retail' ? 'selected' : ''}>Retail</option>
                <option value="Agriculture" ${business?.type === 'Agriculture' ? 'selected' : ''}>Agriculture</option>
                <option value="Other" ${business?.type === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Industry Category *</label>
              <select id="biz-industry" class="form-control" required>
                <option value="Textiles" ${business?.industryCategory === 'Textiles' ? 'selected' : ''}>Textiles & Handloom</option>
                <option value="IT" ${business?.industryCategory === 'IT' ? 'selected' : ''}>IT & Technology</option>
                <option value="Food Processing" ${business?.industryCategory === 'Food Processing' ? 'selected' : ''}>Food Processing</option>
                <option value="Handicrafts" ${business?.industryCategory === 'Handicrafts' ? 'selected' : ''}>Handicrafts & Artisans</option>
                <option value="Chemicals" ${business?.industryCategory === 'Chemicals' ? 'selected' : ''}>Chemicals & Pharma</option>
                <option value="Agri-Tech" ${business?.industryCategory === 'Agri-Tech' ? 'selected' : ''}>Agri-Tech</option>
                <option value="Renewable Energy" ${business?.industryCategory === 'Renewable Energy' ? 'selected' : ''}>Renewable Energy</option>
                <option value="General" ${business?.industryCategory === 'General' ? 'selected' : ''}>General</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">GST Number (Optional)</label>
              <input type="text" id="biz-gst" class="form-control" value="${business?.gstNumber || ''}" placeholder="24AAACP1234A1Z5" />
            </div>

            <div class="form-group">
              <label class="form-label">PAN Number (Optional)</label>
              <input type="text" id="biz-pan" class="form-control" value="${business?.panNumber || ''}" placeholder="AAACP1234A" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Registered Address *</label>
            <input type="text" id="biz-address" class="form-control" value="${business?.address || ''}" placeholder="Plot 45, GIDC Industrial Estate, Surat, Gujarat" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" id="biz-phone" class="form-control" value="${business?.phone || ''}" placeholder="9876543211" required />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" id="biz-email" class="form-control" value="${business?.email || ''}" placeholder="contact@company.in" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Turnover *</label>
              <select id="biz-turnover" class="form-control" required>
                <option value="<1L" ${business?.turnover === '<1L' ? 'selected' : ''}>&lt; 1 Lakh</option>
                <option value="1L-10L" ${business?.turnover === '1L-10L' ? 'selected' : ''}>1L - 10L</option>
                <option value="10L-50L" ${business?.turnover === '10L-50L' ? 'selected' : ''}>10L - 50L</option>
                <option value="50L-1Cr" ${business?.turnover === '50L-1Cr' ? 'selected' : ''}>50L - 1 Cr</option>
                <option value=">1Cr" ${business?.turnover === '>1Cr' ? 'selected' : ''}>&gt; 1 Crore</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Employees *</label>
              <select id="biz-employees" class="form-control" required>
                <option value="1-10" ${business?.employeeCount === '1-10' ? 'selected' : ''}>1 - 10</option>
                <option value="11-50" ${business?.employeeCount === '11-50' ? 'selected' : ''}>11 - 50</option>
                <option value="51-200" ${business?.employeeCount === '51-200' ? 'selected' : ''}>51 - 200</option>
                <option value=">200" ${business?.employeeCount === '>200' ? 'selected' : ''}>&gt; 200</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Years in Op. *</label>
              <select id="biz-years" class="form-control" required>
                <option value="<1" ${business?.yearsInOperation === '<1' ? 'selected' : ''}>&lt; 1 Year</option>
                <option value="1-3" ${business?.yearsInOperation === '1-3' ? 'selected' : ''}>1 - 3 Years</option>
                <option value="3-5" ${business?.yearsInOperation === '3-5' ? 'selected' : ''}>3 - 5 Years</option>
                <option value="5-10" ${business?.yearsInOperation === '5-10' ? 'selected' : ''}>5 - 10 Years</option>
                <option value=">10" ${business?.yearsInOperation === '>10' ? 'selected' : ''}>&gt; 10 Years</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Udyam Registration Number (Optional)</label>
            <input type="text" id="biz-udyam" class="form-control" value="${business?.udyamNumber || ''}" placeholder="UDYAM-GJ-01-0012345" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-secondary" onclick="window.app.closeBusinessFormModal()">
              ${t('cancel')}
            </button>
            <button type="submit" class="btn btn-primary">
              💾 ${isEdit ? 'Update Business Card' : 'Save Business Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
