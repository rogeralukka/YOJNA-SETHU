# YojanaSetu — Scheme Management API Integration Guide

This document describes how the main backend services and frontend clients consume the **Scheme Database & Management Module**.

---

## 1. Base URL
All scheme APIs are exposed under the `/api/v1` prefix.

---

## 2. Public / User-Facing Endpoints

| Method | Endpoint | Description | Query Parameters / Payload |
|--------|----------|-------------|----------------------------|
| `GET` | `/api/v1/schemes` | List active schemes with filtering & pagination | `page`, `limit`, `category`, `department`, `state`, `schemeType`, `minAge`, `maxAge`, `income`, `isNew`, `deadline`, `language`, `sortBy`, `sortOrder` |
| `GET` | `/api/v1/schemes/search` | Full-text indexed search | `q` (required query string), `page`, `limit` |
| `GET` | `/api/v1/schemes/:schemeId` | Retrieve single scheme details | `:schemeId` (UUID or human-readable `SCH_000001`) |
| `GET` | `/api/v1/schemes/categories` | Retrieve list of scheme categories | None |
| `GET` | `/api/v1/schemes/departments` | Retrieve list of government departments | None |
| `GET` | `/api/v1/schemes/states` | Retrieve list of supported states & `ALL_INDIA` | None |
| `GET` | `/api/v1/schemes/:schemeId/eligibility-rules` | Retrieve structured eligibility criteria | `:schemeId` |
| `GET` | `/api/v1/schemes/:schemeId/documents` | Retrieve required document specifications | `:schemeId` |
| `GET` | `/api/v1/schemes/:schemeId/additional-fields` | Retrieve scheme-specific custom input fields | `:schemeId` |

---

## 3. Internal Service-to-Service Contract

The backend eligibility engine developed by team members consumes structured eligibility rules via:

```http
GET /api/v1/internal/schemes/:schemeId/eligibility
Authorization: Bearer <service_token>
```

### Response Schema:
```json
{
  "success": true,
  "data": {
    "schemeId": "SCH_000001",
    "name": "PM-KISAN",
    "schemeType": "PERSONAL",
    "isBusinessScheme": false,
    "eligibilityRules": {
      "minAge": 18,
      "maxAge": 75,
      "minIncome": 0,
      "maxIncome": 250000,
      "applicableStates": ["ALL_INDIA"],
      "eligibleCategories": ["GENERAL", "SC", "ST", "OBC", "EWS"],
      "rulesJson": {
        "occupation": ["FARMER"],
        "customConditions": ["Applicant must own cultivable agricultural land."]
      },
      "description": "Small and marginal landholding farmer families."
    }
  }
}
```

---

## 4. Admin Management Endpoints

> [!IMPORTANT]
> **RBAC Guarding**
> - Read operations (`GET /api/v1/admin/schemes`) require **`ADMIN`** or **`SUPER_ADMIN`** role.
> - Mutation operations (`POST`, `PATCH`, `DELETE`, `publish`, `archive`, `verify`, `import`) strictly require **`SUPER_ADMIN`** role.

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/admin/schemes` | View schemes across all statuses | `ADMIN`, `SUPER_ADMIN` |
| `GET` | `/api/v1/admin/schemes/:schemeId/versions` | View audit version snapshots | `ADMIN`, `SUPER_ADMIN` |
| `POST` | `/api/v1/admin/schemes` | Create new scheme | `SUPER_ADMIN` |
| `PATCH` | `/api/v1/admin/schemes/:schemeId` | Update scheme and bump version | `SUPER_ADMIN` |
| `DELETE` | `/api/v1/admin/schemes/:schemeId` | Soft-delete / Archive scheme | `SUPER_ADMIN` |
| `POST` | `/api/v1/admin/schemes/:schemeId/publish` | Set scheme status to ACTIVE | `SUPER_ADMIN` |
| `POST` | `/api/v1/admin/schemes/:schemeId/archive` | Set scheme status to ARCHIVED | `SUPER_ADMIN` |
| `POST` | `/api/v1/admin/schemes/:schemeId/verify` | Verify official source URL | `SUPER_ADMIN` |
| `POST` | `/api/v1/admin/schemes/import` | Import schemes from MyScheme / ApiSetu / DataGov | `SUPER_ADMIN` |

---

## 5. Standardized Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response:
```json
{
  "success": true,
  "message": "Schemes retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Controlled Error Codes:
- `SCHEME_NOT_FOUND` (404)
- `INVALID_SCHEME` (400)
- `INVALID_SOURCE` (400)
- `DUPLICATE_SCHEME` (409)
- `SCHEME_ARCHIVED` (400)
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `TOO_MANY_REQUESTS` (429)
