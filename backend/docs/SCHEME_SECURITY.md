# YojanaSetu — Scheme Module Security & Data Protection Policy

This document outlines the security controls, validation rules, RBAC authorization logic, and data protection policies implemented in the **Scheme Database & Management Module**.

---

## 1. Core Security Directives & Zero PII Guarantee

> [!CAUTION]
> **No Citizen PII In Scheme Database**
> This database stores ONLY public government scheme data. It MUST NEVER store:
> - User passwords or access/refresh tokens
> - Aadhaar numbers (full or masked)
> - PAN numbers or Bank Account details
> - User-uploaded identity documents

---

## 2. Mass Assignment Protection
- Incoming create (`POST /api/v1/admin/schemes`) and update (`PATCH /api/v1/admin/schemes/:schemeId`) payloads are strictly validated against white-listed Zod schemas (`createSchemeSchema` and `updateSchemeSchema`).
- Read-only fields such as `id`, `schemeId`, `versionNumber`, `createdAt`, `updatedAt`, `status`, and audit snapshots are server-controlled and CANNOT be set or overwritten directly by clients.

---

## 3. Official Source & URL Security Rules
- `sourceUrl` MUST be a valid HTTPS URL (`https://...`).
- Non-HTTPS protocols (`http:`, `javascript:`, `data:`, `file:`) and malformed URL strings are automatically rejected with `400 BAD_REQUEST`.
- Automatic verification (`verificationStatus = VERIFIED`) is granted only when the source URL domain matches official Indian government domain patterns (`.gov.in`, `.nic.in`).

---

## 4. SQL Injection Protections
- All database queries pass through Prisma's parameterized engine.
- Ordering parameters (`sortBy`) are strictly validated against a hard-coded whitelist (`createdAt`, `updatedAt`, `deadline`, `name`). Input string concatenation into SQL clauses is forbidden.

---

## 5. Soft Deletion & Audit Integrity
- Destructive physical deletion of scheme records is prohibited.
- Calling `DELETE /api/v1/admin/schemes/:schemeId` performs a soft-delete by setting `status = ARCHIVED` and `isActive = false`.
- Any modification to a scheme automatically creates an immutable audit snapshot in `SchemeVersion` with incremental version numbering, change reason, and actor ID.

---

## 6. RBAC & Administrative Authorization
- Read operations are accessible to public users and normal admins.
- Administrative mutation operations (`POST`, `PATCH`, `DELETE`, `publish`, `archive`, `verify`, `import`) require **`SUPER_ADMIN`** role. Client-supplied role headers or request body role fields are ignored.

---

## 7. Rate Limiting Policy
- Global Rate Limiter: 200 requests / 15 mins
- Scheme Search Limiter: 30 requests / 1 min
- Admin Mutation Operations: 100 requests / 15 mins
