# 🇮🇳 YOJNA-SETHU (Government Scheme Portal)

> **Official National Entitlement & Welfare Gateway** — A full-stack, enterprise-grade portal connecting individual citizens, students, farmers, women, and enterprise owners with Central and State Government schemes with automated eligibility calculation, dynamic business profiles, multi-scheme batch applications, administrative review workflows, and real-time notifications.

---

## 🌟 Key Highlights & Features

- 🏛️ **12 Integrated Workflow Pages & Modals:**
  - **Landing Page (Splash Screen):** 4-slide hero slideshow with trust badges (*MyGov, Digital India, AICTE*).
  - **Glassmorphism Auth Modal:** Seamless Login and Registration with bcrypt encryption and JWT sessions.
  - **Dedicated Admin Login:** Strict Role-Based Access Control (**Super Admin** vs **Normal Verification Admin**).
  - **Citizen Dashboard:** Real-time search, category filters, sorting by latest/deadline, and dynamic "NEW" and "URGENT" badges.
  - **Smart Rule-Based Eligibility Engine:** Evaluates Age, State, Social Category, Annual Income, Target Gender, and Enterprise attributes in real time.
  - **Dynamic Entity Switcher:** Instantly switch eligibility context between `"You"` (Individual Citizen) and any registered business.
  - **My Business (Enterprise Profiles):** Manage unlimited MSME/Agri/Retail cards with 1-click eligibility check.
  - **Multi-Scheme Combined Applications:** Floating sticky apply bar with frozen applicant/bank snapshots.
  - **My Applications & Visual Timeline:** 3-stage progress tracking (Submitted $\rightarrow$ Under Review $\rightarrow$ Approved/Rejected).
  - **Official Administrative Review Inspector:** Inspect applicant profile, DBT bank account, and uploaded documents with 1-click Approve and Reject (with mandatory comments).
  - **Super Admin Scheme Management CRUD:** Add/Edit/Delete Central & State schemes with automated user notification broadcasting.
  - **Profile & Document Repository:** Profile completion progress bar (% audit) and document upload dropzones (Aadhaar, PAN, Voter ID, Income & Caste Certificates).
  - **Visual Analytics Dashboard:** Interactive SVG Category Pie chart, Top 5 Schemes Bar chart, and Trend Line chart.
  - **Bilingual & Theme Support:** English and Hindi localization + Dark and Light mode toggle.

- ⚡ **Enterprise & Production Backend:**
  - **Multi-Database Support:** Dual-mode Prisma ORM supporting SQLite (`dev.db`) and PostgreSQL (Supabase, AWS RDS, Neon).
  - **High-Speed Redis Caching:** `ioredis` layer with in-memory LRU fallback and automatic cache invalidation.
  - **Real-Time Notification Streaming:** Server-Sent Events (SSE) via `/api/notifications/stream`.
  - **Web Push Notifications:** VAPID / FCM protocol for background desktop and mobile alerts.
  - **Transactional Email Gateway:** Nodemailer engine with branded HTML templates (Welcome, Application receipts, Approval / Rejection remarks, OTP).
  - **SMS & Mobile OTP Gateway:** Twilio & Fast2SMS integration with 10-minute expiry and rate limiting.
  - **Dual-Mode Cloud Object Storage:** AWS S3 / Cloudflare R2 / MinIO / Local disk upload handler.
  - **National DigiLocker Gateway:** OAuth2 consent, token exchange, and verified document import.
  - **Automated Offsite Database Backups:** Daily 24-hour backup cron job streaming snapshots to AWS S3.
  - **Security Rate Limiting & Governance Audit Trail:** In-memory sliding window rate limiter + `AuditLog` model.
  - **CSV Data Export Engine:** 1-click exports for Admin applications registry and Citizen submission history.
  - **Downloadable Styled PDF Reports:** Official summary report generator powered by `pdfkit`.

---

## 🛠️ Monorepo Architecture

```
YOJNA-SETHU/
├── FRONTEND/                      # 🌐 React 19 + Vite 6 + Tailwind CSS Frontend (Vercel Live)
│   ├── src/                       # Components, DataContext, AuthContext, 13-Language Translations
│   └── package.json
│
├── BACKEND/                       # ⚙️ Unified Production Express Backend & API Engine
│   ├── src/
│   │   ├── controllers/           # Auth, Admin, Applications, Schemes, Business, DigiLocker
│   │   ├── services/              # Eligibility Engine, SSE, Web Push, PDFKit, Nodemailer, SMS
│   │   ├── middleware/            # JWT RBAC, Rate Limiting, File Uploads
│   │   └── config/swagger.js      # 🌟 Interactive Swagger OpenAPI Documentation (/api-docs)
│   ├── prisma/                    # Dual SQLite & PostgreSQL Schema + Seeder
│   ├── test/                      # 50 Passing Automated E2E Tests (21 Suites)
│   └── package.json
│
├── .github/workflows/ci-cd.yml    # 🚀 Production CI/CD Pipeline (Tests & Builds)
├── docker-compose.yml             # 🐳 Multi-service Docker Orchestration
├── Dockerfile                     # 📦 Multi-stage Production Container Build
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js 20+ LTS installed
- Git installed

### 2. Backend Setup & Run Tests
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm test          # Runs 21 test suites (50 passing assertions)
npm start         # Starts backend API on http://localhost:5000 (Swagger docs at /api-docs)
```

### 3. Frontend Setup
```bash
cd FRONTEND
npm install
npm run dev       # Starts Vite development server on http://localhost:5173
```

### 3. Setup Database & Seed Initial Schemes
```bash
# Push schema to SQLite database
npx prisma db push

# Seed 12 realistic Central & State schemes, demo users, and admin accounts
npm run seed
```

### 4. Run Automated Test Suite (50 Passing Tests)
```bash
npm test
```

### 5. Start the Application
```bash
npm start
```
Open **`http://localhost:5000`** in your browser.

---

## 🔑 Demo & Test Credentials

| Role | Email / Admin ID | Password | Key Permissions & Features |
|---|---|---|---|
| **Super Admin** | `superadmin@gov.in` | `SuperAdmin@123` | Full Scheme CRUD, Analytics, Application reviews, Backups, CSV exports |
| **Verification Admin** | `admin@gov.in` | `Admin@123` | Application review, 1-click Approve, Reject with remarks |
| **Citizen (Student)** | `aarav.sharma@example.com` | `User@123` | Individual citizen profile, student scholarships & DBT bank account |
| **Business Owner** | `pooja.patel@example.com` | `User@123` | 2 Registered Business Cards (Textiles & Food Processing), MSME subsidies |

---

## 📡 API Reference Overview

```
POST   /api/auth/register                   # Citizen Registration
POST   /api/auth/login                      # Email/Mobile Password Login
POST   /api/auth/send-otp                   # Mobile/Email OTP Dispatch
POST   /api/auth/verify-otp                 # Mobile/Email OTP Verification
POST   /api/auth/admin-login                # Admin / Super Admin Login
GET    /api/auth/me                         # Active Profile & Notification Counts
GET    /api/profile/completion              # Profile Audit & Completion % Score
POST   /api/documents/upload                # Document Dropzone Upload (S3 / Local)
GET    /api/schemes                         # Search & Filter Active Schemes (with Eligibility)
POST   /api/schemes                         # Super Admin: Create New Scheme
GET    /api/business                        # List User's Dynamic Business Cards
POST   /api/applications/apply              # Single or Multi-Scheme Batch Application
GET    /api/applications/my                 # User Submitted Applications Tracking
GET    /api/applications/my/export-csv      # User Submissions CSV Export
GET    /api/notifications                   # Notifications Feed & Unread Badge Count
GET    /api/notifications/stream            # Live Server-Sent Events (SSE) Stream
GET    /api/notifications/push/public-key   # Web Push VAPID Public Key
POST   /api/notifications/push/subscribe    # Register Web Push Device Subscription
GET    /api/eligibility/download-pdf        # Download Styled PDF Eligibility Report
GET    /api/admin/dashboard/stats           # Admin KPI Stats & Visual Chart Datasets
GET    /api/admin/applications/export-csv   # Admin Complete Applications CSV Export
GET    /api/admin/audit-logs                # System Governance Audit Trail
POST   /api/admin/backup/trigger            # Super Admin: Trigger Database Backup
GET    /api/digilocker/auth-url             # DigiLocker OAuth2 Consent URL
```

Full documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 🚢 Production Deployment

Refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for 1-click deployment on **Render**, **AWS EC2**, or **DigitalOcean Docker**.

---

## 📜 License
Licensed under the [MIT License](LICENSE).
