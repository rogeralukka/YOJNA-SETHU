# Government Scheme Portal - Complete Backend API Documentation

Welcome to the comprehensive backend API reference for the Government Scheme Portal. This backend powers all citizen workflows, dynamic business management, eligibility calculations, batch applications, admin governance, and audit trails.

## Base URL
```
http://localhost:5000/api
```

---

## 1. Authentication & Authorization (`/api/auth`)

### 1.1 Rate Limiting Headers
All authentication endpoints are protected by an in-memory sliding window rate limiter:
- `X-RateLimit-Limit`: Maximum allowed attempts per window (30 requests / 15 minutes).
- `X-RateLimit-Remaining`: Remaining attempts.
- `Retry-After`: Retry delay in seconds if 429 status is returned.

### 1.2 User Registration
- **Method & Route**: `POST /api/auth/register`
- **Request Body**:
```json
{
  "fullName": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "mobile": "9876543210",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful! Welcome to the Scheme Portal.",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Aarav Sharma",
      "email": "aarav.sharma@example.com",
      "mobile": "9876543210",
      "role": "user"
    },
    "token": "eyJhbGciOi..."
  }
}
```

### 1.3 User Login
- **Method & Route**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "identifier": "aarav.sharma@example.com", // or mobile number
  "password": "Password@123"
}
```

### 1.4 Admin Login (Super Admin vs Normal Admin)
- **Method & Route**: `POST /api/auth/admin-login`
- **Request Body**:
```json
{
  "adminId": "superadmin@gov.in", // or "admin@gov.in"
  "password": "SuperAdmin@123"
}
```

### 1.5 Get Current Profile & Counts
- **Method & Route**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Profile & Document Management (`/api/profile`, `/api/documents`)

### 2.1 Get & Update Profile
- `GET /api/profile`
- `PUT /api/profile`: Updates category, state, income, age, gender, and DBT bank account info.

### 2.2 Profile Completion Score
- `GET /api/profile/completion`: Returns % completed and missing fields checklist for auto-fill readiness.

### 2.3 Password Change
- `POST /api/profile/change-password`: `{ "oldPassword": "...", "newPassword": "..." }`

### 2.4 Document Uploads (Aadhaar, PAN, Voter ID, Certificates)
- `POST /api/documents/upload` (Multipart Form Data: `file`, `docType`)
- `GET /api/documents`
- `DELETE /api/documents/:id`

---

## 3. Schemes Engine & Eligibility (`/api/schemes`)

### 3.1 Browse & Search Schemes Feed
- `GET /api/schemes`
- **Query Parameters**: `search`, `category`, `entity` (all/personal/business), `sortBy` (latest/deadline), `businessId`, `eligibleOnly` (true/false).
- **Attributes per scheme**: `isNew`, `isUrgent`, `isEligible`, `matchedCriteria`, `eligibilityReasons`, `isBookmarked`.

### 3.2 Scheme Details
- `GET /api/schemes/:id?businessId=...`

### 3.3 Super Admin Scheme CRUD
- `POST /api/schemes` (Super Admin): Auto-broadcasts notification to all eligible citizens.
- `PUT /api/schemes/:id` (Super Admin): Auto-notifies existing applicants.
- `DELETE /api/schemes/:id` (Super Admin)

---

## 4. Dynamic Business Profiles (`/api/business`)

- `GET /api/business`: List user's registered business cards.
- `POST /api/business`: Register new enterprise profile.
- `PUT /api/business/:id`: Update enterprise card.
- `DELETE /api/business/:id`: Delete card.
- `GET /api/business/:id/eligibility`: Filter all matching schemes for that business.

---

## 5. Multi-Scheme Applications (`/api/applications`)

### 5.1 Submit Application (Single or Batch Multi-Apply)
- `POST /api/applications/apply`
```json
{
  "schemeIds": ["scheme-id-1", "scheme-id-2"],
  "entity": "personal", // or "business"
  "businessCardId": "business-id" // if entity is "business"
}
```

### 5.2 My Applications & Timeline
- `GET /api/applications/my`: Query by `search`, `entity`, `status`, `sortBy`.
- `GET /api/applications/:id`: Full details with timeline progression stages.
- `GET /api/applications/my/export-csv`: Streams user's submission records as a downloadable CSV file.

---

## 6. Real-Time Notifications & Bookmarks (`/api/notifications`, `/api/bookmarks`)

- `GET /api/notifications`: Feed + unread count.
- `GET /api/notifications/stream`: **Server-Sent Events (SSE)** real-time push stream.
- `PUT /api/notifications/read-all`: Mark all as read.
- `PUT /api/notifications/:id/read`: Mark single notification read.
- `POST /api/bookmarks/toggle/:schemeId`: Add/remove bookmark.
- `GET /api/bookmarks`: List saved schemes.

---

## 7. Share Eligibility & PDF Download (`/api/eligibility`)

- `GET /api/eligibility/share?businessId=...`: Shareable eligibility summary with link.
- `GET /api/eligibility/download-pdf?businessId=...`: Streams styled official PDF summary report (`pdfkit`).
- `GET /api/eligibility/public/:userId`: Public link verification endpoint.

---

## 8. Admin Governance & Analytics (`/api/admin`)

- `GET /api/admin/dashboard/stats`: KPI cards + Category Pie chart data + Top 5 Schemes Bar chart data + Monthly Trend Line chart data.
- `GET /api/admin/applications`: Searchable applications table with status/date filters.
- `GET /api/admin/applications/export-csv`: Streams complete applications registry as a CSV document.
- `GET /api/admin/applications/:id/review`: Full applicant inspection view.
- `PUT /api/admin/applications/:id/status`: Approve or Reject with mandatory comment.
- `GET /api/admin/audit-logs`: System audit trail logging logins, scheme updates, and approval/rejection decisions.
