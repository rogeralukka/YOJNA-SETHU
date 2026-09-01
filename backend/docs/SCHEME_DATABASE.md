# YojanaSetu — Scheme Database Schema & Architecture

This document describes the relational database structure, indexing strategy, and constraints used in the **Scheme Database Module**.

---

## 1. Database Model Overview

The database uses **PostgreSQL** via **Prisma ORM** with a normalized structure. Important queryable fields are separated into distinct relational tables rather than monolithic JSON blobs.

```
+------------------+         +------------------+
|    Department    | <-------|      Scheme      | -------> +--------------------+
+------------------+         +------------------+          |   SchemeCategory   |
                                 |       |                 +--------------------+
                                 |       |
                                 v       v
                     +---------------+  +--------------------------+
                     |  SchemeState  |  | SchemeCategoryEligibility|
                     +---------------+  +--------------------------+
                             |                       |
                             v                       v
                         +-------+           +--------------------+
                         | State |           | EligibilityCategory|
                         +-------+           +--------------------+
```

---

## 2. Model Definitions

### `Department`
Stores information about government ministries and departments issuing schemes.
- Primary Key: `id` (UUID)
- Unique fields: `name`, `slug`
- Attributes: `description`, `ministry`, `officialUrl`, `isActive`

### `SchemeCategory`
Stores official categories of government schemes (Agriculture, Education, Business, Healthcare, etc.).
- Primary Key: `id` (UUID)
- Unique fields: `name`, `slug`
- Attributes: `description`, `isActive`

### `State`
Stores Indian States & Union Territories plus `ALL_INDIA`.
- Primary Key: `id` (UUID)
- Unique fields: `name`, `code` (e.g. `TN`, `MH`, `ALL_INDIA`)

### `EligibilityCategory`
Stores social and demographic category classifications (`GENERAL`, `SC`, `ST`, `OBC`, `EWS`).
- Primary Key: `id` (UUID)
- Unique fields: `code`

### `Scheme`
The core entity storing complete scheme metadata.
- Primary Key: `id` (UUID)
- Unique fields: `schemeId` (human-readable, e.g. `SCH_000001`), `slug`
- Foreign Keys: `departmentId` → `Department.id`, `categoryId` → `SchemeCategory.id`
- Normalized Eligibility: `minAge`, `maxAge`, `minIncome`, `maxIncome`, `schemeType` (`PERSONAL`, `BUSINESS`, `BOTH`), `isBusinessScheme`
- JSONB extension: `rulesJson` (for scheme-specific variable rules)
- Status & Verification: `status` (`DRAFT`, `ACTIVE`, `INACTIVE`, `EXPIRED`, `ARCHIVED`), `verificationStatus` (`VERIFIED`, `UNVERIFIED`, `OUTDATED`, `ARCHIVED`)
- Audit & Version: `versionNumber` (incremented on edit)

### `SchemeDocumentRequirement`
Structured document specifications required for applying to a scheme.
- Primary Key: `id` (UUID)
- Foreign Key: `schemeId` → `Scheme.id`
- Attributes: `documentType` (`AADHAAR`, `PAN`, `INCOME_CERTIFICATE`, `CASTE_CERTIFICATE`, `LAND_DOCUMENT`, `BANK_ACCOUNT`, `BUSINESS_REGISTRATION`, `UDYAM_CERTIFICATE`), `documentName`, `isMandatory`, `acceptedFormats`

### `SchemeAdditionalField`
Custom user input field definitions required by specific schemes.
- Primary Key: `id` (UUID)
- Foreign Key: `schemeId` → `Scheme.id`
- Attributes: `fieldKey`, `label`, `fieldType` (`TEXT`, `NUMBER`, `DATE`, `BOOLEAN`, `SELECT`, `MULTI_SELECT`), `isRequired`, `validationRules`, `displayOrder`

### `SchemeTranslation`
Localized translations of scheme content (English default, Hindi support).
- Primary Key: `id` (UUID)
- Unique Constraint: `@@unique([schemeId, languageCode])`
- Attributes: `name`, `shortDescription`, `description`, `eligibilityDescription`

### `SchemeVersion`
Immutable snapshot of previous scheme versions created on every scheme update.
- Primary Key: `id` (UUID)
- Attributes: `versionNumber`, `snapshot` (JSONB), `changedBy`, `changeReason`, `createdAt`

---

## 3. Database Indexes

High-efficiency query performance is guaranteed through strategic indexes:

| Table | Indexed Columns | Query Purpose |
|-------|-----------------|---------------|
| `Scheme` | `name` | Case-insensitive text searching |
| `Scheme` | `slug` | Direct lookup by URL slug |
| `Scheme` | `categoryId` | Filtering schemes by category |
| `Scheme` | `departmentId` | Filtering schemes by department |
| `Scheme` | `schemeType` | Filtering Personal vs Business schemes |
| `Scheme` | `status` | Restricting queries to ACTIVE schemes |
| `Scheme` | `deadline` | Non-expired scheme queries |
| `Scheme` | `isNew` | Filtering new scheme badges |
| `SchemeState` | `(schemeId, stateId)` | Fast join filtering by state |
| `SchemeCategoryEligibility` | `(schemeId, categoryId)` | Fast join filtering by category |
| `SchemeTranslation` | `(schemeId, languageCode)` | Fast localized content retrieval |
| `SchemeVersion` | `(schemeId, versionNumber)` | Version history lookup |
