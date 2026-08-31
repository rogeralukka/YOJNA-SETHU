// Global Reactive Store for Government Scheme Portal

class AppState {
  constructor() {
    this.user = null;
    this.role = 'guest'; // 'guest' | 'user' | 'admin' | 'super_admin'
    this.activeView = 'landing'; // 'landing' | 'dashboard' | 'business' | 'applications' | 'bookmarks' | 'notifications' | 'profile' | 'admin-dashboard' | 'admin-applications' | 'scheme-management'
    this.activeSubPage = null; // for nested detail views e.g. 'scheme-detail', 'application-detail', 'admin-review'
    this.selectedSchemeId = null;
    this.selectedApplicationId = null;
    this.selectedEntity = 'you'; // 'you' or businessId
    this.selectedSchemesForApply = new Set();
    this.businesses = [];
    this.schemes = [];
    this.categories = [];
    this.notifications = [];
    this.unreadNotificationsCount = 0;
    this.theme = localStorage.getItem('gov_theme') || 'light';
    this.language = localStorage.getItem('gov_lang') || 'en';
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }

  setUser(user) {
    this.user = user;
    this.role = user ? user.role : 'guest';
    this.notify();
  }

  setView(view, subPage = null, extraData = {}) {
    this.activeView = view;
    this.activeSubPage = subPage;
    if (extraData.schemeId) this.selectedSchemeId = extraData.schemeId;
    if (extraData.applicationId) this.selectedApplicationId = extraData.applicationId;
    this.notify();
  }

  setSelectedEntity(entity) {
    this.selectedEntity = entity;
    this.notify();
  }

  toggleSelectedScheme(schemeId) {
    if (this.selectedSchemesForApply.has(schemeId)) {
      this.selectedSchemesForApply.delete(schemeId);
    } else {
      this.selectedSchemesForApply.add(schemeId);
    }
    this.notify();
  }

  clearSelectedSchemes() {
    this.selectedSchemesForApply.clear();
    this.notify();
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('gov_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem('gov_lang', lang);
    this.notify();
  }
}

export const state = new AppState();
