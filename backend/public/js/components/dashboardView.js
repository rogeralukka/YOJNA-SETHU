import { state } from '../state.js';
import { t } from '../i18n.js';

export function renderDashboardView() {
  const user = state.user || {};
  const businesses = state.businesses || [];
  const schemes = state.schemes || [];
  const selectedCount = state.selectedSchemesForApply.size;

  return `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Top Control Header: Entity Dropdown & Personalized Greeting -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
          <div>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Viewing Eligibility For</span>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">
              <!-- Entity Dropdown: "You" or Added Businesses -->
              <select id="entity-selector" class="form-control" style="font-size: 1.1rem; font-weight: 700; color: var(--brand-primary); min-width: 240px; padding: 8px 14px;" onchange="window.app.handleEntityChange(this.value)">
                <option value="you" ${state.selectedEntity === 'you' ? 'selected' : ''}>👤 You (${user.fullName || 'Individual Citizen'})</option>
                ${businesses.map(b => `
                  <option value="${b.id}" ${state.selectedEntity === b.id ? 'selected' : ''}>
                    🏢 ${b.name} (${b.type})
                  </option>
                `).join('')}
              </select>

              <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('business')" title="Manage or add more businesses">
                + Add Business
              </button>
            </div>
          </div>

          <!-- Greeting & Eligibility Counter -->
          <div style="background: linear-gradient(135deg, rgba(30, 64, 175, 0.08), rgba(13, 148, 136, 0.08)); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 20px; display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 2rem;">🇮🇳</div>
            <div>
              <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary);">
                ${state.dashboardGreeting || `Hello, ${user.fullName || 'Citizen'}!`}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">
                Matched based on your profile & active government notifications.
              </div>
            </div>
          </div>
        </div>

        <!-- Optional Banner: Complete Profile Prompt -->
        <div style="background: linear-gradient(90deg, #fef3c7, #fee2e2); border: 1px solid #fcd34d; border-radius: var(--radius-md); padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; color: #78350f;">
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem;">
            <span>⚡</span>
            <span><strong>Complete your profile:</strong> Upload Aadhaar/Income documents and bank details to auto-fill instant applications.</span>
          </div>
          <button class="btn btn-sm" style="background: #d97706; color: #ffffff;" onclick="window.app.navigate('profile')">
            Complete Profile →
          </button>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: space-between;">
        <!-- Search Input -->
        <div style="flex: 1; min-width: 280px; position: relative;">
          <input 
            type="text" 
            id="scheme-search-input" 
            class="form-control" 
            placeholder="${t('searchPlaceholder')}" 
            oninput="window.app.handleSchemeSearch(this.value)"
          />
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <!-- Category Filter -->
          <select id="scheme-category-filter" class="form-control" style="width: auto;" onchange="window.app.handleCategoryFilter(this.value)">
            <option value="All">${t('allCategories')}</option>
            ${state.categories.map(c => `
              <option value="${c.name}">${c.name} (${c.count})</option>
            `).join('')}
          </select>

          <!-- Entity Type Filter -->
          <select id="scheme-entity-filter" class="form-control" style="width: auto;" onchange="window.app.handleEntityFilter(this.value)">
            <option value="all">All Types (Individual & MSME)</option>
            <option value="personal">Citizen / Personal Only</option>
            <option value="business">Business / MSME Only</option>
          </select>

          <!-- Sort Filter -->
          <select id="scheme-sort-filter" class="form-control" style="width: auto;" onchange="window.app.handleSortFilter(this.value)">
            <option value="latest">Sort: ${t('latest')}</option>
            <option value="deadline">Sort: ${t('deadline')}</option>
          </select>

          <!-- Eligible Only Toggle -->
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer;">
            <input type="checkbox" id="eligible-only-toggle" onchange="window.app.handleEligibleOnlyToggle(this.checked)" />
            <span>Eligible Only</span>
          </label>
        </div>
      </div>

      <!-- Schemes Grid -->
      <div class="schemes-grid" id="schemes-cards-container">
        ${schemes.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
            <h3 style="font-size: 1.2rem; font-weight: 700;">No matching schemes found</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Try adjusting your keyword search or category filters.</p>
          </div>
        ` : schemes.map(scheme => `
          <div class="scheme-card">
            <div class="scheme-card-header">
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${scheme.isNew ? `<span class="badge-tag badge-new">${t('newTag')}</span>` : ''}
                ${scheme.isUrgent ? `<span class="badge-tag badge-urgent">⏳ ${t('urgent')}</span>` : ''}
                <span class="badge-tag ${scheme.isEligible ? 'badge-eligible' : 'badge-tag'}" style="${!scheme.isEligible ? 'background: var(--bg-tertiary); color: var(--text-muted);' : ''}">
                  ${scheme.isEligible ? `✔ ${t('eligible')}` : `✕ ${t('notEligible')}`}
                </span>
              </div>

              <!-- Multi-select Checkbox & Bookmark Icon -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <button class="btn btn-secondary btn-sm" onclick="window.app.toggleBookmark('${scheme.id}')" title="Bookmark scheme" style="padding: 4px 8px; font-size: 1rem;">
                  ${scheme.isBookmarked ? '⭐' : '☆'}
                </button>
                <input 
                  type="checkbox" 
                  style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--brand-primary);" 
                  ${state.selectedSchemesForApply.has(scheme.id) ? 'checked' : ''}
                  onchange="window.app.toggleSchemeSelect('${scheme.id}')"
                  title="Select for multi-apply"
                />
              </div>
            </div>

            <h3 class="scheme-title">${scheme.name}</h3>
            <p class="scheme-dept">🏛️ ${scheme.department} • <strong>${scheme.category}</strong></p>

            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 12px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${scheme.description}
            </p>

            ${scheme.eligibilityReasons && scheme.eligibilityReasons.length > 0 && !scheme.isEligible ? `
              <div style="font-size: 0.76rem; color: var(--danger); background: var(--danger-bg); padding: 6px 10px; border-radius: var(--radius-sm); margin-bottom: 12px;">
                ℹ ${scheme.eligibilityReasons[0]}
              </div>
            ` : ''}

            <div class="scheme-meta-row">
              <div class="deadline-text">
                📅 ${scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN') : 'Ongoing / No Deadline'}
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

      <!-- Sticky Floating Action Bar for Multi-Select Apply (Bottom of Page) -->
      ${selectedCount > 0 ? `
        <div class="sticky-action-bar">
          <div>
            <strong>${selectedCount} scheme${selectedCount > 1 ? 's' : ''} selected</strong>
            <span style="opacity: 0.75; font-size: 0.85rem; margin-left: 8px;">(Combined Single Application)</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="window.app.clearSelectedSchemes()" style="background: rgba(255,255,255,0.15); color: #fff; border: none;">
              Clear Selection
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.app.openApplicationModal(Array.from(state.selectedSchemesForApply))" style="background: var(--brand-accent); border: none;">
              🚀 ${t('applySelected')} (${selectedCount})
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
