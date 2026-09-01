# YojanaSetu API Documentation

All API endpoints are versioned under `/api/v1/`.

Interactive Swagger UI documentation is hosted live at:
`http://localhost:8000/api/docs`

---

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | SCHEME_DEADLINE_PASSED",
    "message": "Human readable error description",
    "details": []
  }
}
```

---

## Authentication APIs (`/api/v1/auth`)

### `POST /api/v1/auth/register`
- **Auth**: Public (Rate-Limited)
- **Body**:
  ```json
  {
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "phone": "9876543212",
    "password": "Password123!",
    "age": 32,
    "state": "Maharashtra",
    "category": "OBC",
    "annualIncome": 250000
  }
  ```
- **Returns**: `{ user, accessToken, refreshToken }`

### `POST /api/v1/auth/login`
- **Auth**: Public (Rate-Limited)
- **Body**:
  ```json
  {
    "email": "ramesh@example.com",
    "password": "Password123!"
  }
  ```
- **Returns**: `{ user, accessToken, refreshToken }`

### `POST /api/v1/auth/refresh`
- **Auth**: Public
- **Body**: `{ "refreshToken": "..." }`
- **Behavior**: Performs refresh token rotation. If a previously used/revoked token is submitted, token reuse detection triggers and all user sessions are immediately revoked.

### `POST /api/v1/auth/logout`
- **Auth**: Bearer Token (Optional)
- **Body**: `{ "refreshToken": "..." }`

---

## User Profile APIs (`/api/v1/users`)

### `GET /api/v1/users/me`
- **Auth**: Required (`USER`, `ADMIN`, `SUPER_ADMIN`)
- **Returns**: Complete user profile without password hash.

### `PATCH /api/v1/users/me/profile`
- **Auth**: Required
- **Body**: Profile update fields (`age`, `state`, `category`, `annualIncome`, etc.).
- **Protection**: Rejects mass assignment of system fields (`role`, `isAdmin`, `passwordHash`, `createdAt`).

---

## Business Card APIs (`/api/v1/business-cards`)

- `POST /api/v1/business-cards` — Create business card
- `GET /api/v1/business-cards` — List authenticated user's business cards
- `GET /api/v1/business-cards/:cardId` — Fetch business card (Enforces IDOR ownership check)
- `PATCH /api/v1/business-cards/:cardId` — Update business card (Enforces ownership)
- `DELETE /api/v1/business-cards/:cardId` — Delete business card (Enforces ownership)

---

## Scheme Discovery & Eligibility APIs (`/api/v1/schemes`)

- `GET /api/v1/schemes` — Search/filter public schemes with pagination and sorting.
- `GET /api/v1/schemes/eligible` — Evaluates user demographic + business card against server eligibility rules.
- `GET /api/v1/schemes/:schemeId` — Scheme details.
- `POST /api/v1/schemes` — **SUPER_ADMIN** Create scheme.
- `PATCH /api/v1/schemes/:schemeId` — **SUPER_ADMIN** Update scheme.
- `DELETE /api/v1/schemes/:schemeId` — **SUPER_ADMIN** Deactivate scheme.

---

## Multi-Scheme Application APIs (`/api/v1/applications`)

- `POST /api/v1/applications/bulk` — Submit multi-scheme combined application:
  ```json
  {
    "schemeIds": ["SCH_PMEGP_001", "SCH_MUDRA_003"],
    "businessCardId": "CARD_DEMO_001",
    "additionalDetails": { "loanRequired": 500000 }
  }
  ```
- `GET /api/v1/applications` — List authenticated user's applications.
- `GET /api/v1/applications/:applicationId` — View application detail.

---

## Admin Application APIs (`/api/v1/admin`)

- `GET /api/v1/admin/applications` — **ADMIN / SUPER_ADMIN** Filter & review applications.
- `PATCH /api/v1/admin/applications/:applicationId/approve` — Approve application (optional comment).
- `PATCH /api/v1/admin/applications/:applicationId/reject` — Reject application (**mandatory** `comment` required).
- `GET /api/v1/admin/analytics` — Dashboard analytics overview.

---

## Document APIs (`/api/v1/documents`)

- `POST /api/v1/documents/upload` — Upload PDF/JPG/PNG file (Max 10MB, random UUID object name).
- `GET /api/v1/documents/signed-view/:objectName` — Generate short-lived signed view URL.
