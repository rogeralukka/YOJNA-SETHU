# Complete Production Deployment Guide

This guide details the three most effective strategies for deploying the **Government Scheme Portal** to live cloud infrastructure with zero downtime, automated SSL certificates, high availability, and database backups.

---

## Strategy Comparison Matrix

| Feature | Option 1: Render / Railway (Recommended) | Option 2: AWS / DigitalOcean VPS | Option 3: Vercel + AWS / Supabase |
|---|---|---|---|
| **Setup Time** | 3 minutes (1-Click) | 15 minutes | 10 minutes |
| **Cost** | Free Tier available / $7/mo | $5 – $12/mo (Fixed) | Free Tier available / $15/mo |
| **SSL / HTTPS** | Automatic & Managed | Let's Encrypt (Certbot) | Automatic & Managed |
| **Database** | Managed PostgreSQL (Automatic) | PostgreSQL in Docker | Managed Supabase / Neon |
| **Best For** | Prototyping, Demo, Quick Launch | Government Sovereignty & Full Control | High-traffic Distributed Scale |

---

## Option 1: 1-Click Cloud Deployment via Render (Easiest & Fastest)

Render supports Infrastructure-as-Code through the included [`render.yaml`](./render.yaml).

### Steps:
1. **Push your code to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "Government Scheme Portal Full Production Release"
   git remote add origin https://github.com/your-username/gov-scheme-portal.git
   git push -u origin main
   ```
2. **Log into [Render.com](https://render.com) and click "New" $\rightarrow$ "Blueprint".**
3. Select your GitHub repository. Render will automatically read `render.yaml` and provision:
   - **Unified Web Service** (Node.js 20 runtime on port 5000)
   - **Managed PostgreSQL Database**
   - **Automated Health Checks** on `/api/health`
   - **Free Global SSL / HTTPS**
4. Click **Apply** — your website is live in ~2 minutes at `https://government-scheme-portal.onrender.com`.

---

## Option 2: Dedicated Cloud VPS (AWS EC2 / DigitalOcean / Hetzner)

For government data sovereignty, fixed cost, and dedicated hardware:

### Steps:
1. **Provision a Linux VPS** (Ubuntu 22.04 / 24.04 LTS).
2. **Install Docker & Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   ```
3. **Clone your repository & launch with Docker Compose:**
   ```bash
   git clone https://github.com/your-username/gov-scheme-portal.git
   cd gov-scheme-portal
   docker-compose up -d --build
   ```
4. **Point your domain DNS** (A Record $\rightarrow$ VPS Public IP).
5. **Issue Free SSL using Certbot:**
   ```bash
   sudo apt install certbot -y
   sudo certbot certonly --standalone -d schemes.yourdomain.com
   ```

---

## Option 3: Production Environment Variables Reference

Ensure the following variables are configured in your hosting platform dashboard:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://user:password@host:5432/database_name"
JWT_SECRET=your_long_random_cryptographic_secret_key
CLIENT_URL=https://your-live-domain.com

# Optional Live Services:
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key
EMAIL_FROM="Government Scheme Portal <noreply@yourdomain.com>"

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

AWS_ACCESS_KEY_ID=your_s3_key
AWS_SECRET_ACCESS_KEY=your_s3_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=gov-scheme-portal-uploads
```

---

## Post-Deployment Health Verification

After deploying, verify the platform health:
```bash
curl https://your-live-domain.com/api/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Government Scheme Portal Backend API is running smoothly.",
  "timestamp": "2026-08-31T17:40:00.000Z"
}
```
