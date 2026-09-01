import { state } from '../state.js';
import { api } from '../api.js';
import { t } from '../i18n.js';

export function renderShareModal(shareData) {
  if (!shareData) return '';

  const user = shareData.user || {};
  const business = shareData.business;
  const eligibleSchemes = shareData.eligibleSchemes || [];
  const pdfDownloadUrl = api.downloadEligibilityPDFUrl(state.selectedEntity !== 'you' ? state.selectedEntity : '');

  return `
    <div class="modal-overlay active" id="share-modal" onclick="if(event.target===this) window.app.closeShareModal()">
      <div class="glass-modal" style="max-width: 580px;">
        <button class="modal-close-btn" onclick="window.app.closeShareModal()">✕</button>

        <div style="text-align: center; margin-bottom: 20px;">
          <div class="emblem-icon" style="margin: 0 auto 10px; width: 44px; height: 44px; font-size: 22px;">📜</div>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
            ${t('shareEligibility')}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Official summary card of eligible government schemes for ${business ? business.name : user.fullName}.
          </p>
        </div>

        <!-- Summary Box -->
        <div style="background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Entity</span>
              <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">
                ${business ? `🏢 ${business.name} (${business.type})` : `👤 ${user.fullName} (${user.state || 'India'})`}
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge-tag badge-eligible" style="font-size: 0.82rem; padding: 4px 12px;">
                ${eligibleSchemes.length} Schemes Matched
              </span>
            </div>
          </div>

          <div style="max-height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 4px;">
            ${eligibleSchemes.map((s, i) => `
              <div style="background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.82rem; display: flex; justify-content: space-between; align-items: center;">
                <span><strong>${i + 1}.</strong> ${s.name}</span>
                <span style="color: var(--brand-secondary); font-weight: 600; font-size: 0.75rem;">${s.category}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Share Actions -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Shareable Verification Link</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="share-link-input" class="form-control" value="${shareData.shareableUrl}" readonly />
              <button class="btn btn-secondary" onclick="window.app.copyShareLink()">
                📋 Copy
              </button>
            </div>
          </div>

          <a href="${pdfDownloadUrl}" target="_blank" class="btn btn-primary" style="width: 100%; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; padding: 12px;">
            📥 ${t('downloadPDF')}
          </a>
        </div>
      </div>
    </div>
  `;
}
