import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderProfileView(profileData, completionData, documents = []) {
  const user = profileData || state.user || {};
  const completion = completionData || { percentage: 0, missingFields: [] };

  const docTypes = [
    { key: 'aadhaar', label: 'Aadhaar Card (UIDAI)' },
    { key: 'pan', label: 'PAN Card (Income Tax)' },
    { key: 'voter_id', label: 'Voter ID Card (ECI)' },
    { key: 'income_cert', label: 'Income Certificate (Tehsildar / SDO)' },
    { key: 'caste_cert', label: 'Caste Certificate (if applicable)' },
    { key: 'other', label: 'Any Other Supporting Document' }
  ];

  const docMap = {};
  documents.forEach(d => {
    docMap[d.docType] = d;
  });

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Profile Header Banner & Completion Progress -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 18px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800;">
              ${user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">${user.fullName || 'Citizen User'}</h2>
              <div style="font-size: 0.88rem; color: var(--text-muted);">${user.email} • 📱 ${user.mobile}</div>
              <div style="font-size: 0.78rem; color: var(--brand-primary); font-weight: 600; margin-top: 4px;">Role: Verified Citizen</div>
            </div>
          </div>

          <button class="btn btn-secondary btn-sm" onclick="window.app.logout()" style="color: var(--danger);">
            🚪 ${t('logout')}
          </button>
        </div>

        <!-- Completion Checklist Banner -->
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
              🎯 Profile Completion: ${completion.percentage}%
            </span>
            <span class="badge-tag ${completion.percentage === 100 ? 'badge-approved' : 'badge-urgent'}">
              ${completion.percentage === 100 ? '✔ Fully Completed' : 'Missing Details Required'}
            </span>
          </div>

          <div style="width: 100%; height: 10px; background: var(--bg-primary); border-radius: 999px; overflow: hidden; margin-bottom: 12px;">
            <div style="width: ${completion.percentage}%; height: 100%; background: linear-gradient(90deg, #ea580c, #16a34a); border-radius: 999px;"></div>
          </div>

          ${completion.missingFields && completion.missingFields.length > 0 ? `
            <div style="font-size: 0.82rem; color: var(--text-secondary);">
              <strong>Missing for 100% auto-fill:</strong> ${completion.missingFields.join(', ')}
            </div>
          ` : `
            <div style="font-size: 0.82rem; color: var(--success); font-weight: 600;">
              ✨ Your profile is completely up-to-date! All scheme applications will be automatically pre-filled.
            </div>
          `}
        </div>
      </div>

      <!-- Main Profile Settings Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Left Column: Personal & Bank Details Edit Form -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Personal Profile Form -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 16px;">👤 Personal Information</h3>
            <form onsubmit="window.app.handleUpdateProfile(event)">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="prof-name" class="form-control" value="${user.fullName || ''}" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <input type="tel" id="prof-mobile" class="form-control" value="${user.mobile || ''}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Age</label>
                  <input type="number" id="prof-age" class="form-control" value="${user.age || ''}" placeholder="Age in years" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">State</label>
                  <input type="text" id="prof-state" class="form-control" value="${user.state || ''}" placeholder="e.g. Maharashtra" />
                </div>
                <div class="form-group">
                  <label class="form-label">Social Category</label>
                  <select id="prof-category" class="form-control">
                    <option value="General" ${user.category === 'General' ? 'selected' : ''}>General</option>
                    <option value="OBC" ${user.category === 'OBC' ? 'selected' : ''}>OBC</option>
                    <option value="SC" ${user.category === 'SC' ? 'selected' : ''}>SC</option>
                    <option value="ST" ${user.category === 'ST' ? 'selected' : ''}>ST</option>
                    <option value="EWS" ${user.category === 'EWS' ? 'selected' : ''}>EWS</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Annual Family Income (₹)</label>
                  <input type="number" id="prof-income" class="form-control" value="${user.annualIncome || ''}" placeholder="Annual Income" />
                </div>
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select id="prof-gender" class="form-control">
                    <option value="Male" ${user.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${user.gender === 'Female' ? 'selected' : ''}>Female</option>
                    <option value="Other" ${user.gender === 'Other' ? 'selected' : ''}>Other</option>
                  </select>
                </div>
              </div>

              <h4 style="font-size: 1rem; font-weight: 800; margin: 20px 0 12px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                🏦 Direct Benefit Transfer (DBT) Bank Account
              </h4>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Account Holder Name</label>
                  <input type="text" id="prof-acc-holder" class="form-control" value="${user.accountHolderName || ''}" placeholder="Holder Name" />
                </div>
                <div class="form-group">
                  <label class="form-label">Bank Name</label>
                  <input type="text" id="prof-bank-name" class="form-control" value="${user.bankName || ''}" placeholder="e.g. State Bank of India" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Account Number</label>
                  <input type="text" id="prof-acc-num" class="form-control" value="${user.accountNumber || ''}" placeholder="Account Number" />
                </div>
                <div class="form-group">
                  <label class="form-label">IFSC Code</label>
                  <input type="text" id="prof-ifsc" class="form-control" value="${user.ifscCode || ''}" placeholder="SBIN0001234" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 12px;">
                💾 Save Profile & Bank Details
              </button>
            </form>
          </div>

          <!-- Change Password Form -->
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 16px;">🔑 Change Password</h3>
            <form onsubmit="window.app.handleChangePassword(event)">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" id="old-pwd" class="form-control" placeholder="••••••••" required />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <input type="password" id="new-pwd" class="form-control" placeholder="••••••••" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Confirm New Password</label>
                  <input type="password" id="confirm-new-pwd" class="form-control" placeholder="••••••••" required />
                </div>
              </div>
              <button type="submit" class="btn btn-secondary" style="width: 100%;">
                Update Password
              </button>
            </form>
          </div>
        </div>

        <!-- Right Column: Document Upload Dropzones (Upload once, use for all applications) -->
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 18px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">📁 Documents Repository</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
              Upload verified documents once (PDF/PNG/JPG up to 10MB) to attach automatically to all scheme applications.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${docTypes.map(doc => {
              const uploaded = docMap[doc.key];

              return `
                <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                  <div style="flex: 1; min-width: 200px;">
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${doc.label}</div>
                    ${uploaded ? `
                      <div style="font-size: 0.78rem; color: var(--success); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                        <span>✔ Uploaded:</span>
                        <a href="${uploaded.fileUrl}" target="_blank" style="text-decoration: underline;">${uploaded.fileName}</a>
                      </div>
                    ` : `
                      <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                        Not uploaded yet
                      </div>
                    `}
                  </div>

                  <div style="display: flex; align-items: center; gap: 10px;">
                    <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                      📤 ${uploaded ? 'Replace' : 'Upload'}
                      <input type="file" style="display: none;" accept=".pdf,.png,.jpg,.jpeg" onchange="window.app.handleDocumentUpload('${doc.key}', this.files[0])" />
                    </label>

                    ${uploaded ? `
                      <button class="btn btn-secondary btn-sm" onclick="window.app.handleDeleteDocument('${uploaded.id}')" title="Delete Document" style="color: var(--danger); padding: 6px 10px;">
                        🗑️
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
