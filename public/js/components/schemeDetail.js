import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderSchemeDetailPage(scheme) {
  if (!scheme) return '';

  const states = scheme.states || ['All'];
  const categories = scheme.categories || ['All'];
  const docs = scheme.documentsRequired || [];

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Top Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('dashboard')">
          ← Back to Results
        </button>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="window.app.toggleBookmark('${scheme.id}')">
            ${scheme.isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
          </button>
          <button class="btn btn-primary" onclick="window.app.openApplicationModal(['${scheme.id}'])">
            🚀 ${t('applyNow')}
          </button>
        </div>
      </div>

      <!-- Scheme Header Banner -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
          ${scheme.isNew ? `<span class="badge-tag badge-new">${t('newTag')}</span>` : ''}
          ${scheme.isUrgent ? `<span class="badge-tag badge-urgent">⏳ ${t('urgent')}</span>` : ''}
          <span class="badge-tag ${scheme.isEligible ? 'badge-eligible' : 'badge-tag'}" style="${!scheme.isEligible ? 'background: var(--bg-tertiary); color: var(--text-muted);' : ''}">
            ${scheme.isEligible ? `✔ ${t('eligible')}` : `✕ ${t('notEligible')}`}
          </span>
          <span class="badge-tag" style="background: var(--bg-tertiary); color: var(--brand-primary); font-weight: 700;">
            ${scheme.category}
          </span>
        </div>

        <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
          ${scheme.name}
        </h1>
        <p style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">
          🏛️ <strong>Department:</strong> ${scheme.department}
        </p>

        <!-- Eligibility Status Box -->
        ${scheme.matchedCriteria && scheme.matchedCriteria.length > 0 ? `
          <div style="background: var(--success-bg); border-left: 4px solid var(--success); padding: 14px 18px; border-radius: var(--radius-sm); margin-top: 20px; font-size: 0.88rem; color: var(--success);">
            <strong>Eligibility Status:</strong> You meet the criteria for this scheme:
            <ul style="margin: 6px 0 0 20px;">
              ${scheme.matchedCriteria.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${scheme.eligibilityReasons && scheme.eligibilityReasons.length > 0 && !scheme.isEligible ? `
          <div style="background: var(--danger-bg); border-left: 4px solid var(--danger); padding: 14px 18px; border-radius: var(--radius-sm); margin-top: 20px; font-size: 0.88rem; color: var(--danger);">
            <strong>Eligibility Remarks:</strong>
            <ul style="margin: 6px 0 0 20px;">
              ${scheme.eligibilityReasons.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <!-- Content Grid -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <!-- Left Column: Description & Detailed Criteria -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 12px;">Overview & Objectives</h3>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
              ${scheme.description}
            </p>

            ${scheme.benefits ? `
              <h4 style="font-size: 1.05rem; font-weight: 700; margin: 20px 0 8px;">Key Scheme Benefits & Subsidies</h4>
              <p style="font-size: 0.92rem; color: var(--brand-secondary); font-weight: 600; line-height: 1.5;">
                💰 ${scheme.benefits}
              </p>
            ` : ''}
          </div>

          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 14px;">Detailed Eligibility Criteria</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: var(--text-secondary);">
              <li style="display: flex; align-items: center; gap: 10px;">
                <span>👥</span> <strong>Age Limit:</strong> ${scheme.minAge || 0} to ${scheme.maxAge || 'No limit'} years
              </li>
              <li style="display: flex; align-items: center; gap: 10px;">
                <span>📍</span> <strong>Applicable States:</strong> ${states.join(', ')}
              </li>
              <li style="display: flex; align-items: center; gap: 10px;">
                <span>🏷️</span> <strong>Social Categories:</strong> ${categories.join(', ')}
              </li>
              <li style="display: flex; align-items: center; gap: 10px;">
                <span>💳</span> <strong>Income Ceiling:</strong> ${scheme.maxIncome ? `Up to ₹${scheme.maxIncome.toLocaleString('en-IN')}/year` : 'No upper income restriction'}
              </li>
              <li style="display: flex; align-items: center; gap: 10px;">
                <span>🏢</span> <strong>Scheme Entity:</strong> ${scheme.isBusinessScheme ? 'MSME / Business Enterprise' : 'Individual Citizen / Family'}
              </li>
            </ul>
          </div>
        </div>

        <!-- Right Column: Required Documents & Application Box -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 14px;">Required Documents</h3>
            ${docs.length === 0 ? `
              <p style="font-size: 0.85rem; color: var(--text-muted);">Standard identity verification documents.</p>
            ` : `
              <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: var(--text-secondary); margin-left: 18px;">
                ${docs.map(d => `
                  <li><strong>${d.toUpperCase().replace('_', ' ')}</strong> (Upload once in profile to auto-fill)</li>
                `).join('')}
              </ul>
            `}

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-color);">
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">Application Deadline:</div>
              <div style="font-weight: 800; font-size: 1rem; color: var(--brand-primary); margin-bottom: 18px;">
                📅 ${scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'Ongoing / Open Throughout Year'}
              </div>

              <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="window.app.openApplicationModal(['${scheme.id}'])">
                Apply Now →
              </button>
            </div>
          </div>

          ${scheme.officialUrl ? `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px; text-align: center;">
              <a href="${scheme.officialUrl}" target="_blank" style="font-size: 0.88rem; font-weight: 600;">
                🔗 Visit Official Department Portal ↗
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
