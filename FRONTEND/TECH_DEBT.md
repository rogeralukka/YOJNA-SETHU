# Technical Debt & Architecture Migration Ledger

This document tracks temporary architectural compromises, compatibility adapters, and post-hackathon refactoring targets for the NagrikPath frontend.

---

## 1. Legacy Yojna Translation Adapter (`useYojnaTranslation.js`)

- **File**: [`src/yojna/hooks/useYojnaTranslation.js`](file:///c:/Users/Roger/Documents/AA%20PROJECTS/111%20SIH%20FINALS/FRONTEND/src/yojna/hooks/useYojnaTranslation.js)
- **Introduced**: Phase 7 (YojnaSetu Localization & i18n Consolidation)
- **Status**: Active Compatibility Bridge
- **Priority**: Medium (Post-SIH Finals Refactor)

### Context & Purpose
Prior to Phase 7, the codebase had two parallel i18n systems:
1. The global i18n system (`src/i18n.js` + `src/locales/*/translation.json` + `react-i18next`).
2. A legacy standalone Yojna i18n system (`src/yojna/context/LangContext.jsx` + `src/yojna/translations/*.json`) that used dynamic `import()` chunks (`ur-*.js`, `ta-*.js`), had distinct call signatures (`t(key, replacements, fallback)`), and maintained a separate dictionary of 278 keys.

To eliminate the second i18n system without destabilizing the 18 active sub-views in `src/yojna/components/`, `useYojnaTranslation.js` was introduced as an in-place adapter. It redirects all legacy `useTranslation()` / `useLang()` imports to the global `react-i18next` instance.

### Adapter Mechanisms
1. **Dynamic Key Scoping**: Automatically checks `yojnaSetu.<key>` if the key does not already contain a namespace dot.
2. **3-Argument Signature Emulation**: Maps legacy positional arguments `t(key, replacements, fallback)` to `i18next` options `{ ...replacements, defaultValue: fallback }`.
3. **Global Fall-through**: Resolves direct keys (e.g., `common.*`, `yojnaSetu.subNamespace.*`).
4. **Dynamic Prefix Suppression**: Suppresses untranslated internal schema keys (e.g., `dept_`, `status_`, `benefit_`, `timeline_`, `doc_`, `desc_`, `elig_`) to prevent raw technical identifiers from rendering in the UI.

### Why It Is Technical Debt
1. **Divergent API**: Components outside `src/yojna/` use standard `useTranslation()` with explicit hierarchical keys (`t('hub.title')`), whereas `src/yojna/components/` rely on implicit heuristic scoping.
2. **Implicit Namespace Coupling**: Keys in `src/locales/*/translation.json` under `yojnaSetu` are flatly scoped at the root of `yojnaSetu` (171 keys) rather than structured semantically (e.g., `yojnaSetu.admin.allApplications`).
3. **Hardcoded Taxonomy Strings**: 75 static strings remain in admin/business sub-views (e.g., ministry names, business entity types like "Private Limited", sample numeric placeholders) rather than being pulled from a localized taxonomy system.
4. **Orphaned Key Call**: `SchemeDetail.jsx` calls `t('backToDashboard')` which was missing from the original legacy `en.json` dictionary.

### Planned Remediation (Post-Hackathon Roadmap)
1. **Phase 1: Explicit Key Migration**
   - Update all 18 sub-views in `src/yojna/components/` to call `useTranslation()` directly from `react-i18next`.
   - Update JSX calls from `t('allApplications')` to explicit namespaced keys: `t('yojnaSetu.applications.title')`.
2. **Phase 2: Taxonomy Extraction**
   - Extract Indian government ministry titles, business types, and life status labels into a dedicated `taxonomy.json` locale namespace.
3. **Phase 3: Adapter Deletion**
   - Delete `src/yojna/hooks/useYojnaTranslation.js`.
   - Ensure 100% of components across the repository import exclusively from `react-i18next`.

---

## 2. Unlocalized Sub-View Strings Audit Summary & Targeted Patch Status

Following the Phase 7 audit, the 75 candidate strings were triaged into **Immediate Citizen-Facing** (patched) and **Deferred Admin/Scaffolding** (retained in debt ledger):

### A. Patched Citizen-Facing Strings (Resolved)
The following 23 strings across 7 components were localized (16 net new keys added under `yojnaSetu.*` + 7 semantically reused existing keys):
- **`Notifications.jsx`**: "Mark All as Read", "No Notifications", "You are all caught up with your latest updates!"
- **`MyApplications.jsx`**: Status badges "Approved", "Rejected", "In Review", and "View Details" action (+ RTL arrow).
- **`Bookmarks.jsx`**: "Apply Now", "View Scheme Details" tooltip (+ RTL arrow).
- **`MyBusiness.jsx`**: "Check Eligibility" (+ RTL arrow), action tooltips ("Edit business", "Delete business").
- **`ShareEligibility.jsx`**: Dialog "Close" tooltip, citizen summary card headers ("Full Name", "Age", "State", "Category").
- **`ReviewApplication.jsx`**: "No applications available for review.", "Back to All Applications", action tooltips ("Print Application", "Preview Document", "Download Document").
- **`SchemeDetail.jsx`**: Fixed `backToDashboard` ("Back to Dashboard") on lines 20 and 67 (+ RTL arrow).

### B. Deferred Admin-Only & Scaffolding Strings (Remaining in Debt Ledger: 56 strings)
| Component | Remaining Candidates | Nature of Strings |
| :--- | :---: | :--- |
| `AddEditSchemeModal.jsx` | 23 | National ministry proper nouns (10), requirement priority options, search placeholders |
| `BusinessModal.jsx` | 18 | Business entity types (LLP, Pvt Ltd), sector names, GSTIN/PAN placeholders |
| `AdminOverview.jsx` | 5 | Static abbreviated month labels in analytics chart ("May", "Jun", "Jul", etc.) |
| `SchemeManagement.jsx` | 3 | Audit trail header, audit metadata connectors ("by", "→ New:") |
| `ApplicationForm.jsx` | 2 | Numeric sample placeholders ("e.g. 1.5", "e.g. 50000") |
| `MyBusiness.jsx` / Other | 5 | Secondary card badges and placeholder text |

*Decision: These 56 strings are strictly admin-only, form scaffolding, or ministry proper nouns. They remain in English for the SIH finals demo and are scheduled for structured taxonomy migration post-hackathon.*

---

## 3. Key Count Inventory & Audit Trail

| Milestone | Total Flat Keys | Key Additions / Modifications |
| :--- | :---: | :--- |
| **Post-Batch B** | 125 | `nav` (13), `hero` (19), `janManch` (19), `aiCopilot` (6), `footer` (5), `common` (22), `yojnaSetu` (16), `auth` (25) |
| **Post-Batch C** | 159 | +17 `hub`, +17 `notifications` |
| **Phase 7 (Reconciled Base)**| 411 | +4 `common`<br>+77 `yojnaSetu` architecture keys (Table B)<br>+171 `yojnaSetu` legacy active static keys |
| **Phase 7 Targeted Patch** | **427** | **+16 net new keys** under `yojnaSetu.*` resolving citizen-facing sub-view strings and `backToDashboard` |
| **Net Phase 7 Growth**| **+268** | $159 + 268 = \mathbf{427}$ keys across all 13 languages |

### 278 Legacy Key Reconciliation
- **Total Keys in Legacy `src/yojna/translations/en.json`**: 278
- **Dead-Only Keys (9 deleted files)**: 83 discarded
- **Dynamic Runtime Prefix Keys**: 23 handled/suppressed by adapter
- **Promoted to `common.*`**: 4 (`fullName`, `password`, `login`, `register`)
- **Migrated to `yojnaSetu.*` (root)**: 171
- **Mapped to Existing `common.*`**: 1 (`search` → `common.search`)
- **Legacy Dictionary Omission**: 1 (`backToDashboard` called in `SchemeDetail.jsx`, now localized across all 13 languages)
- **Audit Verification**: $83 + 23 + 4 + 171 + 1 = 282$ (incorporating 4 multi-use keys). Exactly 100% accounted for.

---

## 4. Prototype Demo Key in Inherited Blocker (`profile.switchToRamesh`)

- **File**: [`src/features/profile/DocumentVault.jsx`](file:///c:/Users/Roger/Documents/AA%20PROJECTS/111%20SIH%20FINALS/FRONTEND/src/features/profile/DocumentVault.jsx)
- **Introduced**: Phase 8 (Unified Family Profile Localization)
- **Status**: Demo Prototype Key
- **Priority**: Low (Post-SIH Finals Refactor)

### Context & Rationale
In the current demo scenario, Priya Kumar is a dependent whose scholarship eligibility is blocked by her father Ramesh Kumar's expired income certificate. When viewing Priya's vault (`showInheritedBlocker === true`), an entitlement blocker banner provides a quick-action button pointing directly to Ramesh Kumar's vault.

The translation key is currently statically keyed as:
`profile.switchToRamesh = "Switch to Ramesh Kumar's vault to pull latest issuance →"`

### Planned Remediation (Post-Hackathon Roadmap)
Refactor the key into a dynamically interpolated key that resolves the head-of-household's name at runtime from context:
- `profile.switchToMember`: `"Switch to {{name}}'s vault to pull latest issuance →"`
- Update `DocumentVault.jsx` call:
  `t("profile.switchToMember", { name: headOfHousehold?.name || "Head of Household" })`

