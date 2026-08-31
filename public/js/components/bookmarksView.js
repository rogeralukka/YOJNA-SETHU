import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderBookmarksView(bookmarks = []) {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Header -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">⭐ ${t('bookmarks')}</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">
          Saved government schemes for quick access, eligibility verification, and multi-scheme applications.
        </p>
      </div>

      <!-- Bookmarked Schemes Grid -->
      ${bookmarks.length === 0 ? `
        <div style="text-align: center; padding: 70px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 12px;">⭐</div>
          <h3 style="font-size: 1.2rem; font-weight: 700;">${t('noBookmarks')}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Click the star icon on any scheme card to bookmark it here.</p>
          <button class="btn btn-primary" style="margin-top: 18px;" onclick="window.app.navigate('dashboard')">
            Explore All Schemes →
          </button>
        </div>
      ` : `
        <div class="schemes-grid">
          ${bookmarks.map(scheme => `
            <div class="scheme-card">
              <div class="scheme-card-header">
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${scheme.isNew ? `<span class="badge-tag badge-new">${t('newTag')}</span>` : ''}
                  ${scheme.isUrgent ? `<span class="badge-tag badge-urgent">⏳ ${t('urgent')}</span>` : ''}
                  <span class="badge-tag ${scheme.isEligible ? 'badge-eligible' : 'badge-tag'}" style="${!scheme.isEligible ? 'background: var(--bg-tertiary); color: var(--text-muted);' : ''}">
                    ${scheme.isEligible ? `✔ ${t('eligible')}` : `✕ ${t('notEligible')}`}
                  </span>
                </div>

                <button class="btn btn-secondary btn-sm" onclick="window.app.toggleBookmark('${scheme.id}')" title="Remove bookmark" style="color: #eab308; font-size: 1.1rem; padding: 4px 8px;">
                  ★
                </button>
              </div>

              <h3 class="scheme-title">${scheme.name}</h3>
              <p class="scheme-dept">🏛️ ${scheme.department} • <strong>${scheme.category}</strong></p>

              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 12px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${scheme.description}
              </p>

              <div class="scheme-meta-row">
                <div class="deadline-text">
                  📅 ${scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN') : 'Ongoing'}
                </div>

                <div style="margin-left: auto; display: flex; gap: 8px;">
                  <button class="btn btn-outline btn-sm" onclick="window.app.openSchemeDetail('${scheme.id}')">
                    ${t('viewDetails')}
                  </button>
                  <button class="btn btn-primary btn-sm" onclick="window.app.openApplicationModal(['${scheme.id}'])">
                    ${t('applyNow')}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}
