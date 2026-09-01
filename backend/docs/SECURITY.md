# YojanaSetu Security Architecture & Privacy Policy

> **Core Principle:** SECURITY > CONVENIENCE | PRIVACY > DEMO EFFECT | BACKEND AUTHORIZATION > FRONTEND VALIDATION

---

## 1. Authentication & JWT Rotation
- **Short-Lived Access Tokens**: Signed with `JWT_ACCESS_SECRET`, expiration time default `15m`.
- **Refresh Token Rotation**: Issued upon login and updated on every `/api/v1/auth/refresh` request. Old refresh tokens are marked as revoked.
- **Token Reuse Detection**: If a revoked refresh token is presented, the system detects replay attacks and transactionally invalidates ALL active tokens for that user ID.
- **Password Hashing**: Bcrypt with salt rounds = 12. Password hashes are excluded from all query outputs and API responses.

---

## 2. Insecure Direct Object Reference (IDOR) Protection
- Business card and application management endpoints explicitly verify `resource.userId === req.user.id`.
- Changing `cardId` or `applicationId` in URL path params yields `403 Forbidden` if the resource does not belong to the requesting user.

---

## 3. Mass Assignment Prevention
- User profile updates explicitly use Zod `.strict()` validation.
- Fields such as `role`, `isAdmin`, `isSuperAdmin`, `passwordHash`, `createdAt`, and `updatedAt` are ignored or cause validation errors if injected into update payloads.

---

## 4. Government Document Privacy & Storage Security
- **No Real Citizen PII**: In `DEMO_MODE=true`, synthetic document identifiers (e.g. `XXXX-XXXX-4321`) are processed.
- **File Upload Protection**:
  - File extension and MIME type allowlist (PDF, JPG, JPEG, PNG).
  - Maximum upload file size enforced at 10 MB per file.
  - Original filenames are discarded and replaced with crypto-random UUIDs.
  - Documents are stored outside public web roots and accessed via short-lived signed URLs.

---

## 5. Audit Logging & Sensitive Data Masking
- All sensitive operations (Login, Logout, Failed Login, Profile Modifications, Scheme CRUD, Application Decisions) are recorded in `AuditLog`.
- **Redaction Rules**: Passwords, access tokens, refresh tokens, Aadhaar numbers, and full bank account details are automatically stripped or replaced with `[REDACTED]` prior to writing audit logs.

---

## 6. Rate Limiting & Denial-of-Service Defense
- Express Rate Limiters enforce:
  - Auth routes (`/login`, `/register`): Max 10 requests per 15 minutes.
  - Global API routes: Max 200 requests per 15 minutes.
- Request size limit set to 10MB to prevent memory exhaustion attacks.
