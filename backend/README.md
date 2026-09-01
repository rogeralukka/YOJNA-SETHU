# YojanaSetu Backend — Hackathon Production-Minded Specification

> **Tagline:** "Find Every Government Scheme You May Qualify For"  
> YojanaSetu is a privacy-first government-scheme discovery platform. A citizen provides basic demographic criteria (age, state, district, category, annual income) to discover government schemes for which they appear potentially eligible.

---

## 🚀 Phase 1: Minimal FastAPI Foundation

This repository contains the backend for **YojanaSetu**, built with FastAPI following production-minded design patterns and privacy-by-design constraints.

### 📋 Prerequisites

- **Python 3.12+** (Verified compatible with Python 3.12 - 3.14)
- `pip` package manager

---

## 🔧 Setup & Installation Instructions

### 1. Create Virtual Environment

Navigate to the `backend` directory and create a virtual environment:

**On Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**On Linux / macOS:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

Install required Python packages from `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

*(Note: `.env` is ignored by git to ensure secrets and environment configurations are never committed).*

---

## 🏃 Running the Application Server

Start the Uvicorn development server with live reload:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## 🧪 Testing the Health Endpoint & Documentation

- **Health Check Endpoint:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- **Swagger Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Documentation:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Running Automated Tests

Run unit tests using `pytest`:

```bash
pytest
```

---

## 🛡️ Security & Privacy Guarantees

- **No Data Persistence of Citizens:** Citizen inputs are treated as stateless transient payloads evaluated strictly in memory.
- **Data Minimization:** No personal data logging, no storage of Aadhaar/PAN or user credentials.
- **CORS Restrictions:** Configured origins prevent unauthorized cross-domain access.
