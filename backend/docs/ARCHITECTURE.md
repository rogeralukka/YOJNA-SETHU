# YojanaSetu System Architecture

YojanaSetu is designed following modular layered architecture principles to ensure decoupling, testability, and high scalability.

```
┌───────────────────────────────────────────────────────────┐
│                    Client Applications                    │
│                 (Web / Mobile Frontend)                   │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTPS / REST API
┌─────────────────────────────▼─────────────────────────────┐
│                    Express API Gateway                    │
│         Helmet | CORS | RateLimiter | Zod Validate        │
└─────────────────────────────┬─────────────────────────────┘
                              │ Routes & Controllers
┌─────────────────────────────▼─────────────────────────────┐
│                     Business Services                     │
│ ┌──────────────────────┐   ┌────────────────────────────┐ │
│ │  Auth & UserService  │   │     EligibilityEngine      │ │
│ ├──────────────────────┤   ├────────────────────────────┤ │
│ │  ApplicationService  │   │    AdminAnalyticsService   │ │
│ └──────────────────────┘   └────────────────────────────┘ │
└─────────────────────────────┬─────────────────────────────┘
                              │ Data Access Layer
┌─────────────────────────────▼─────────────────────────────┐
│                   Prisma ORM Data Model                   │
│   User | BusinessCard | Scheme | Application | AuditLog   │
└─────────────────────────────┬─────────────────────────────┘
                              │ PostgreSQL
┌─────────────────────────────▼─────────────────────────────┐
│                    PostgreSQL Database                    │
└───────────────────────────────────────────────────────────┘
```

---

## 1. Modular Directory Structure

- `src/config/`: App configuration (Zod env validation, Winston logger, Prisma client, Swagger).
- `src/middleware/`: Global error handler, JWT authentication, RBAC, Rate limiters, Zod validators, Multer upload security.
- `src/schemas/`: Zod request schemas.
- `src/services/`: Core domain logic (Auth, User, BusinessCard, EligibilityEngine, Scheme, Application, Notification, Analytics).
- `src/integrations/`: Integration wrappers for external services (Resend, FCM, Cloudinary, DigiLocker, API Setu) with automatic `DEMO_MODE` mock handlers.
- `src/controllers/`: HTTP request-response handlers.
- `src/routes/`: Route declarations mounted under `/api/v1/`.

---

## 2. Server-Side Eligibility Engine

The `EligibilityService` evaluates citizen demographic criteria against structured scheme JSON rules in memory:

```typescript
EligibilityResult = {
  eligible: boolean,
  reasons: string[],
  missingRequirements: string[],
  requiredDocuments: string[]
}
```

Frontend eligibility logic is treated as non-authoritative. The backend re-evaluates all eligibility rules during bulk application submission inside database transactions.

---

## 3. Database Entity Relationship Model

- `User` 1---N `RefreshToken`
- `User` 1---N `BusinessCard`
- `User` 1---N `Application`
- `User` 1---N `Notification`
- `User` 1---N `Bookmark` N---1 `Scheme`
- `BusinessCard` 1---N `Application`
