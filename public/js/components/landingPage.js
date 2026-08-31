import { t } from '../i18n.js';

export function renderLandingPage() {
  return `
    <div class="hero-slideshow-container">
      <!-- Top Brand Header -->
      <div class="hero-top-bar">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="emblem-icon">🏛️</div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;">Government Scheme Portal</h2>
            <p style="font-size: 0.8rem; color: #94a3b8;">Official Direct Entitlement Gateway</p>
          </div>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary btn-sm" onclick="window.app.openAuthModal('admin')">
            🔒 Admin Portal
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.app.openAuthModal('login')">
            Citizen Login
          </button>
        </div>
      </div>

      <!-- Slideshow Hero Area -->
      <div class="hero-main-content">
        <!-- Slide 1 -->
        <div class="slide-item active" id="hero-slide-1">
          <div class="slide-tag">✨ Personalized Welfare</div>
          <h1 class="slide-headline">Discover government schemes tailored for you</h1>
          <p class="slide-subtext">
            Smart eligibility matching connects you with hundreds of central and state government entitlements in seconds based on your age, income, and social category.
          </p>
        </div>

        <!-- Slide 2 -->
        <div class="slide-item" id="hero-slide-2">
          <div class="slide-tag">🎯 Universal Access</div>
          <h1 class="slide-headline">Students, farmers, women, entrepreneurs – everyone benefits</h1>
          <p class="slide-subtext">
            From educational scholarships and agricultural direct income support to healthcare safety nets, get direct access to official government programs.
          </p>
        </div>

        <!-- Slide 3 -->
        <div class="slide-item" id="hero-slide-3">
          <div class="slide-tag">💼 For Business Owners</div>
          <h1 class="slide-headline">Add your business & find tailored enterprise schemes</h1>
          <p class="slide-subtext">
            Register multiple dynamic business cards, evaluate MSME subsidies, Mudra loans, PMEGP grants, and Stand-Up India financing tailored to your enterprise.
          </p>
        </div>

        <!-- Slide 4 -->
        <div class="slide-item" id="hero-slide-4">
          <div class="slide-tag">⚡ Direct Processing</div>
          <h1 class="slide-headline">Apply directly on our platform – your one-stop solution</h1>
          <p class="slide-subtext">
            Auto-fill applications with uploaded verified documents, apply to multiple schemes in one single click, and track your application approval status live.
          </p>
        </div>

        <!-- CTA Button -->
        <div style="display: flex; align-items: center; gap: 18px; margin-top: 10px;">
          <button class="btn btn-primary btn-lg" onclick="window.app.openAuthModal('register')" style="background: linear-gradient(135deg, #f97316, #ea580c); font-size: 1.15rem; padding: 16px 36px; box-shadow: 0 10px 25px rgba(234, 88, 12, 0.4);">
            🚀 ${t('getStarted')}
          </button>
          <button class="btn btn-secondary btn-lg" onclick="window.app.openAuthModal('login')" style="background: rgba(255,255,255,0.12); color: #ffffff; border-color: rgba(255,255,255,0.25);">
            Existing User Login
          </button>
        </div>

        <!-- Slide Indicators -->
        <div class="slide-indicators">
          <div class="slide-dot active" onclick="window.app.setHeroSlide(1)"></div>
          <div class="slide-dot" onclick="window.app.setHeroSlide(2)"></div>
          <div class="slide-dot" onclick="window.app.setHeroSlide(3)"></div>
          <div class="slide-dot" onclick="window.app.setHeroSlide(4)"></div>
        </div>
      </div>

      <!-- Trust Badges Bar -->
      <div class="trust-badges-bar">
        <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">
          Trusted Integrations & Partners:
        </div>
        <div class="trust-badges-list">
          <div class="trust-badge-item">
            <div class="trust-badge-logo">🇮🇳</div>
            <span>MyGov India</span>
          </div>
          <div class="trust-badge-item">
            <div class="trust-badge-logo">🌐</div>
            <span>Digital India</span>
          </div>
          <div class="trust-badge-item">
            <div class="trust-badge-logo">🎓</div>
            <span>AICTE Approved</span>
          </div>
          <div class="trust-badge-item">
            <div class="trust-badge-logo">🛡️</div>
            <span>National Data Safe</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
