import { state } from './state.js';
import { api } from './api.js';
import { showToast } from './toast.js';
import { renderCategoryPieChart, renderTop5BarChart, renderTrendLineChart } from './charts.js';

// Components
import { renderNavbar } from './components/navbar.js';
import { renderSidebar } from './components/sidebar.js';
import { renderLandingPage } from './components/landingPage.js';
import { renderAuthModal } from './components/authModal.js';
import { renderAdminLogin } from './components/adminLogin.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderBusinessView, renderBusinessFormModal } from './components/businessView.js';
import { renderApplicationsView, renderApplicationDetailPage } from './components/applicationsView.js';
import { renderBookmarksView } from './components/bookmarksView.js';
import { renderNotificationsView } from './components/notificationsView.js';
import { renderShareModal } from './components/shareModal.js';
import { renderSchemeDetailPage } from './components/schemeDetail.js';
import { renderApplicationFormModal } from './components/applicationFormModal.js';
import { renderProfileView } from './components/profileView.js';
import { renderAdminDashboard } from './components/adminDashboard.js';
import { renderAdminApplications } from './components/adminApplications.js';
import { renderAdminReviewPage } from './components/adminReview.js';
import { renderSchemeManagement } from './components/schemeManagement.js';
import { renderSchemeFormModal } from './components/schemeFormModal.js';

class ApplicationController {
  constructor() {
    this.currentSlide = 1;
    this.slideInterval = null;
    this.filters = {
      search: '',
      category: 'All',
      entity: 'all',
      sortBy: 'latest',
      eligibleOnly: 'false'
    };
    this.appFilters = {
      search: '',
      entity: 'all',
      status: 'all',
      sortBy: 'latest'
    };
    this.adminAppFilters = {
      search: '',
      status: 'all'
    };
  }

  async init() {
    state.subscribe(() => this.render());
    document.documentElement.setAttribute('data-theme', state.theme);

    // Check existing token
    const token = api.getToken();
    if (token) {
      try {
        const meRes = await api.getMe();
        state.setUser(meRes.data);
        if (state.role === 'admin' || state.role === 'super_admin') {
          await this.navigate('admin-dashboard');
        } else {
          await this.navigate('dashboard');
        }
        await this.loadInitialUserData();
      } catch (err) {
        api.setToken(null);
        state.setUser(null);
        state.setView('landing');
      }
    } else {
      state.setView('landing');
    }

    this.startHeroSlideshow();
    this.render();
  }

  startHeroSlideshow() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.slideInterval = setInterval(() => {
      if (state.activeView === 'landing') {
        const nextSlide = (this.currentSlide % 4) + 1;
        this.setHeroSlide(nextSlide);
      }
    }, 5000);
  }

  setHeroSlide(slideIndex) {
    this.currentSlide = slideIndex;
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.slide-dot');
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx + 1 === slideIndex);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx + 1 === slideIndex);
    });
  }

  async loadInitialUserData() {
    try {
      if (state.role === 'user') {
        const [bizRes, catRes, notifRes] = await Promise.all([
          api.getBusinesses(),
          api.getSchemeCategories(),
          api.getNotifications()
        ]);
        state.businesses = bizRes.data || [];
        state.categories = catRes.data || [];
        state.notifications = notifRes.data.notifications || [];
        state.unreadNotificationsCount = notifRes.data.unreadCount || 0;
        await this.fetchSchemes();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async fetchSchemes() {
    try {
      const params = {
        ...this.filters,
        businessId: state.selectedEntity !== 'you' ? state.selectedEntity : ''
      };
      const res = await api.getSchemes(params);
      state.schemes = res.data.schemes || [];
      state.dashboardGreeting = res.data.greetingMessage;
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  }

  async navigate(view, subPage = null, extraData = {}) {
    state.setView(view, subPage, extraData);

    try {
      if (view === 'dashboard') {
        await this.fetchSchemes();
      } else if (view === 'business') {
        const res = await api.getBusinesses();
        state.businesses = res.data || [];
      } else if (view === 'applications') {
        const res = await api.getMyApplications(this.appFilters);
        this.cachedApplications = res.data || [];
      } else if (view === 'bookmarks') {
        const res = await api.getBookmarks();
        this.cachedBookmarks = res.data || [];
      } else if (view === 'notifications') {
        const res = await api.getNotifications();
        state.notifications = res.data.notifications || [];
        state.unreadNotificationsCount = res.data.unreadCount || 0;
      } else if (view === 'profile') {
        const [profRes, compRes, docRes] = await Promise.all([
          api.getProfile(),
          api.getProfileCompletion(),
          api.getDocuments()
        ]);
        this.cachedProfile = profRes.data;
        this.cachedCompletion = compRes.data;
        this.cachedDocuments = docRes.data || [];
      } else if (view === 'admin-dashboard') {
        const res = await api.getAdminStats();
        this.cachedAdminStats = res.data;
      } else if (view === 'admin-applications') {
        const res = await api.getAdminApplications(this.adminAppFilters);
        this.cachedAdminApplications = res.data.applications || [];
      } else if (view === 'scheme-management') {
        const res = await api.getSchemes({ limit: 100 });
        this.cachedAllSchemes = res.data.schemes || [];
      }
    } catch (err) {
      console.error('Navigation data load error:', err);
    }

    this.render();

    // Render charts if on admin dashboard
    if (view === 'admin-dashboard' && this.cachedAdminStats) {
      setTimeout(() => {
        renderCategoryPieChart('category-pie-chart-container', this.cachedAdminStats.charts.applicationsByCategory);
        renderTop5BarChart('top5-bar-chart-container', this.cachedAdminStats.charts.top5Schemes);
        renderTrendLineChart('trend-line-chart-container', this.cachedAdminStats.charts.applicationsTrend);
      }, 50);
    }
  }

  // Auth Modals
  openAuthModal(tab = 'login') {
    let modalContainer = document.getElementById('modal-root');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-root';
      document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = renderAuthModal(tab);
    setTimeout(() => {
      const modal = document.getElementById('auth-modal');
      if (modal) modal.classList.add('active');
    }, 10);
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthTab(tab) {
    this.openAuthModal(tab);
  }

  async handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await api.login({ identifier, password });
      api.setToken(res.data.token);
      state.setUser(res.data.user);
      this.closeAuthModal();
      showToast(res.message, 'success');
      await this.loadInitialUserData();
      this.navigate('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const mobile = document.getElementById('reg-mobile').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    try {
      const res = await api.register({ fullName, email, mobile, password, confirmPassword });
      api.setToken(res.data.token);
      state.setUser(res.data.user);
      this.closeAuthModal();
      showToast(res.message, 'success');
      await this.loadInitialUserData();
      this.navigate('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async handleAdminLogin(e) {
    e.preventDefault();
    const adminId = document.getElementById('admin-id').value;
    const password = document.getElementById('admin-password').value;

    try {
      const res = await api.adminLogin({ adminId, password });
      api.setToken(res.data.token);
      state.setUser(res.data.admin);
      showToast(res.message, 'success');
      this.navigate('admin-dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  logout() {
    api.setToken(null);
    state.setUser(null);
    state.setView('landing');
    showToast('Logged out successfully.', 'info');
  }

  // Dashboard Filters & Search
  async handleEntityChange(entityId) {
    state.setSelectedEntity(entityId);
    await this.fetchSchemes();
    this.render();
  }

  async handleSchemeSearch(query) {
    this.filters.search = query;
    await this.fetchSchemes();
    this.render();
  }

  async handleCategoryFilter(cat) {
    this.filters.category = cat;
    await this.fetchSchemes();
    this.render();
  }

  async handleEntityFilter(type) {
    this.filters.entity = type;
    await this.fetchSchemes();
    this.render();
  }

  async handleSortFilter(sortBy) {
    this.filters.sortBy = sortBy;
    await this.fetchSchemes();
    this.render();
  }

  async handleEligibleOnlyToggle(checked) {
    this.filters.eligibleOnly = checked ? 'true' : 'false';
    await this.fetchSchemes();
    this.render();
  }

  toggleSchemeSelect(schemeId) {
    state.toggleSelectedScheme(schemeId);
  }

  clearSelectedSchemes() {
    state.clearSelectedSchemes();
  }

  async toggleBookmark(schemeId) {
    try {
      const res = await api.toggleBookmark(schemeId);
      showToast(res.message, 'success');
      await this.fetchSchemes();
      if (state.activeView === 'bookmarks') {
        const bRes = await api.getBookmarks();
        this.cachedBookmarks = bRes.data || [];
      }
      this.render();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Scheme Detail
  async openSchemeDetail(schemeId) {
    try {
      const res = await api.getSchemeById(schemeId, state.selectedEntity !== 'you' ? state.selectedEntity : '');
      this.cachedSchemeDetail = res.data;
      state.setView('dashboard', 'scheme-detail', { schemeId });
      this.render();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Applications View Filters
  async handleAppSearch(query) {
    this.appFilters.search = query;
    const res = await api.getMyApplications(this.appFilters);
    this.cachedApplications = res.data || [];
    this.render();
  }

  async handleAppEntityFilter(entity) {
    this.appFilters.entity = entity;
    const res = await api.getMyApplications(this.appFilters);
    this.cachedApplications = res.data || [];
    this.render();
  }

  async handleAppStatusFilter(status) {
    this.appFilters.status = status;
    const res = await api.getMyApplications(this.appFilters);
    this.cachedApplications = res.data || [];
    this.render();
  }

  async handleAppSortFilter(sortBy) {
    this.appFilters.sortBy = sortBy;
    const res = await api.getMyApplications(this.appFilters);
    this.cachedApplications = res.data || [];
    this.render();
  }

  // Application Entity Switcher in Form
  handleApplicationEntitySwitch(bizId) {
    const business = state.businesses.find(b => b.id === bizId);
    if (business) {
      showToast(`Selected enterprise profile: ${business.name}`, 'info');
    }
  }

  // Admin Applications Search & Filter
  async handleAdminAppSearch(query) {
    this.adminAppFilters.search = query;
    const res = await api.getAdminApplications(this.adminAppFilters);
    this.cachedAdminApplications = res.data.applications || [];
    this.render();
  }

  async handleAdminAppStatusFilter(status) {
    this.adminAppFilters.status = status;
    const res = await api.getAdminApplications(this.adminAppFilters);
    this.cachedAdminApplications = res.data.applications || [];
    this.render();
  }

  // Applications
  openApplicationModal(schemeIds = []) {
    let modalContainer = document.getElementById('modal-root');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-root';
      document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = renderApplicationFormModal(schemeIds);
  }

  closeApplicationModal() {
    const modal = document.getElementById('application-modal');
    if (modal) modal.remove();
  }

  async handleSubmitApplication(e, schemeIds) {
    e.preventDefault();
    const entityValue = document.getElementById('apply-entity-select').value;
    const isBusiness = entityValue !== 'personal' && entityValue !== '';

    const payload = {
      schemeIds,
      entity: isBusiness ? 'business' : 'personal',
      businessCardId: isBusiness ? entityValue : null
    };

    try {
      const res = await api.applySchemes(payload);
      this.closeApplicationModal();
      state.clearSelectedSchemes();
      showToast(res.message, 'success');
      this.navigate('applications');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async openApplicationDetail(applicationId) {
    try {
      const res = await api.getApplicationById(applicationId);
      this.cachedAppDetail = res.data;
      state.setView('applications', 'application-detail', { applicationId });
      this.render();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Business Modal
  openBusinessFormModal(businessId = null) {
    const business = businessId ? state.businesses.find(b => b.id === businessId) : null;
    let modalContainer = document.getElementById('modal-root');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-root';
      document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = renderBusinessFormModal(business);
  }

  closeBusinessFormModal() {
    const modal = document.getElementById('business-modal');
    if (modal) modal.remove();
  }

  async handleSaveBusiness(e, businessId = '') {
    e.preventDefault();
    const payload = {
      name: document.getElementById('biz-name').value,
      type: document.getElementById('biz-type').value,
      industryCategory: document.getElementById('biz-industry').value,
      gstNumber: document.getElementById('biz-gst').value,
      panNumber: document.getElementById('biz-pan').value,
      address: document.getElementById('biz-address').value,
      phone: document.getElementById('biz-phone').value,
      email: document.getElementById('biz-email').value,
      turnover: document.getElementById('biz-turnover').value,
      employeeCount: document.getElementById('biz-employees').value,
      yearsInOperation: document.getElementById('biz-years').value,
      udyamNumber: document.getElementById('biz-udyam').value
    };

    try {
      let res;
      if (businessId) {
        res = await api.updateBusiness(businessId, payload);
      } else {
        res = await api.createBusiness(payload);
      }
      this.closeBusinessFormModal();
      showToast(res.message, 'success');
      const bRes = await api.getBusinesses();
      state.businesses = bRes.data || [];
      this.render();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async deleteBusiness(id) {
    if (!confirm('Are you sure you want to delete this business profile?')) return;
    try {
      const res = await api.deleteBusiness(id);
      showToast(res.message, 'success');
      const bRes = await api.getBusinesses();
      state.businesses = bRes.data || [];
      this.render();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async selectBusinessAndCheckEligibility(businessId) {
    state.setSelectedEntity(businessId);
    await this.fetchSchemes();
    this.navigate('dashboard');
  }

  // Profile Update & Documents
  async handleUpdateProfile(e) {
    e.preventDefault();
    const payload = {
      fullName: document.getElementById('prof-name').value,
      mobile: document.getElementById('prof-mobile').value,
      age: document.getElementById('prof-age').value,
      state: document.getElementById('prof-state').value,
      category: document.getElementById('prof-category').value,
      annualIncome: document.getElementById('prof-income').value,
      gender: document.getElementById('prof-gender').value,
      accountHolderName: document.getElementById('prof-acc-holder').value,
      bankName: document.getElementById('prof-bank-name').value,
      accountNumber: document.getElementById('prof-acc-num').value,
      ifscCode: document.getElementById('prof-ifsc').value
    };

    try {
      const res = await api.updateProfile(payload);
      state.setUser(res.data);
      showToast(res.message, 'success');
      this.navigate('profile');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async handleChangePassword(e) {
    e.preventDefault();
    const oldPassword = document.getElementById('old-pwd').value;
    const newPassword = document.getElementById('new-pwd').value;
    const confirmNewPassword = document.getElementById('confirm-new-pwd').value;

    try {
      const res = await api.changePassword({ oldPassword, newPassword, confirmNewPassword });
      showToast(res.message, 'success');
      document.getElementById('old-pwd').value = '';
      document.getElementById('new-pwd').value = '';
      document.getElementById('confirm-new-pwd').value = '';
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async handleDocumentUpload(docType, file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);

    try {
      const res = await api.uploadDocument(formData);
      showToast(res.message, 'success');
      this.navigate('profile');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async handleDeleteDocument(id) {
    try {
      const res = await api.deleteDocument(id);
      showToast(res.message, 'success');
      this.navigate('profile');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Share Modal
  async openShareModal() {
    try {
      const res = await api.getShareableEligibility(state.selectedEntity !== 'you' ? state.selectedEntity : '');
      let modalContainer = document.getElementById('modal-root');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-root';
        document.body.appendChild(modalContainer);
      }
      modalContainer.innerHTML = renderShareModal(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.remove();
  }

  copyShareLink() {
    const input = document.getElementById('share-link-input');
    if (input) {
      input.select();
      navigator.clipboard.writeText(input.value);
      showToast('Shareable link copied to clipboard!', 'success');
    }
  }

  // Notifications
  async markNotificationRead(id) {
    try {
      await api.markNotificationRead(id);
      this.navigate('notifications');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async markAllNotificationsRead() {
    try {
      const res = await api.markAllNotificationsRead();
      showToast(res.message, 'success');
      this.navigate('notifications');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Admin Reviews
  async openAdminReview(applicationId) {
    try {
      const res = await api.getAdminApplicationReview(applicationId);
      this.cachedReviewData = res.data;
      state.setView('admin-applications', 'admin-review', { applicationId });
      this.render();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async handleApproveApplication(applicationId) {
    if (!confirm('Are you sure you want to officially approve and sanction this application?')) return;
    try {
      const res = await api.updateApplicationStatus(applicationId, { status: 'approved' });
      showToast(res.message, 'success');
      this.navigate('admin-applications');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  openRejectModal() {
    const modal = document.getElementById('reject-modal');
    if (modal) modal.classList.add('active');
  }

  closeRejectModal() {
    const modal = document.getElementById('reject-modal');
    if (modal) modal.classList.remove('active');
  }

  async handleRejectApplication(e, applicationId) {
    e.preventDefault();
    const adminComment = document.getElementById('reject-comment').value;

    try {
      const res = await api.updateApplicationStatus(applicationId, { status: 'rejected', adminComment });
      this.closeRejectModal();
      showToast(res.message, 'success');
      this.navigate('admin-applications');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Super Admin Scheme Form Modal
  async openSchemeFormModal(schemeId = null) {
    let scheme = null;
    if (schemeId) {
      const sRes = await api.getSchemeById(schemeId);
      scheme = sRes.data;
    }
    let modalContainer = document.getElementById('modal-root');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-root';
      document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = renderSchemeFormModal(scheme);
  }

  closeSchemeFormModal() {
    const modal = document.getElementById('scheme-modal');
    if (modal) modal.remove();
  }

  async handleSaveScheme(e, schemeId = '') {
    e.preventDefault();
    const payload = {
      name: document.getElementById('sch-name').value,
      department: document.getElementById('sch-dept').value,
      category: document.getElementById('sch-cat').value,
      description: document.getElementById('sch-desc').value,
      minAge: document.getElementById('sch-min-age').value,
      maxAge: document.getElementById('sch-max-age').value,
      maxIncome: document.getElementById('sch-max-income').value,
      targetGender: document.getElementById('sch-gender').value,
      isBusinessScheme: document.getElementById('sch-is-business').checked,
      deadline: document.getElementById('sch-deadline').value || null,
      officialUrl: document.getElementById('sch-url').value || null
    };

    try {
      let res;
      if (schemeId) {
        res = await api.updateScheme(schemeId, payload);
      } else {
        res = await api.createScheme(payload);
      }
      this.closeSchemeFormModal();
      showToast(res.message, 'success');
      this.navigate('scheme-management');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async deleteScheme(id) {
    if (!confirm('Are you sure you want to permanently delete this scheme?')) return;
    try {
      const res = await api.deleteScheme(id);
      showToast(res.message, 'success');
      this.navigate('scheme-management');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // UI Utilities
  toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.setTheme(nextTheme);
  }

  changeLanguage(lang) {
    state.setLanguage(lang);
  }

  toggleSidebar() {
    const sidebar = document.getElementById('left-sidebar');
    const content = document.getElementById('content-area');
    if (sidebar) sidebar.classList.toggle('collapsed');
    if (content) content.classList.toggle('collapsed');
  }

  toggleProfileMenu() {
    const menu = document.getElementById('profile-menu');
    if (menu) {
      menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
    }
  }

  // Master Render Loop
  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    if (state.activeView === 'landing') {
      root.innerHTML = renderLandingPage();
      return;
    }

    if (state.activeView === 'admin-login') {
      root.innerHTML = `
        <div class="app-container">
          ${renderNavbar()}
          <main class="main-layout" style="margin-left: 0;">
            <div style="width: 100%;">
              ${renderAdminLogin()}
            </div>
          </main>
        </div>
      `;
      return;
    }

    // Main App Shell Layout
    let viewContent = '';

    if (state.activeView === 'dashboard') {
      if (state.activeSubPage === 'scheme-detail') {
        viewContent = renderSchemeDetailPage(this.cachedSchemeDetail);
      } else {
        viewContent = renderDashboardView();
      }
    } else if (state.activeView === 'business') {
      viewContent = renderBusinessView();
    } else if (state.activeView === 'applications') {
      if (state.activeSubPage === 'application-detail') {
        viewContent = renderApplicationDetailPage(this.cachedAppDetail);
      } else {
        viewContent = renderApplicationsView(this.cachedApplications || []);
      }
    } else if (state.activeView === 'bookmarks') {
      viewContent = renderBookmarksView(this.cachedBookmarks || []);
    } else if (state.activeView === 'notifications') {
      viewContent = renderNotificationsView(state.notifications, state.unreadNotificationsCount);
    } else if (state.activeView === 'profile') {
      viewContent = renderProfileView(this.cachedProfile, this.cachedCompletion, this.cachedDocuments);
    } else if (state.activeView === 'admin-dashboard') {
      viewContent = renderAdminDashboard(this.cachedAdminStats);
    } else if (state.activeView === 'admin-applications') {
      if (state.activeSubPage === 'admin-review') {
        viewContent = renderAdminReviewPage(this.cachedReviewData);
      } else {
        viewContent = renderAdminApplications(this.cachedAdminApplications || []);
      }
    } else if (state.activeView === 'scheme-management') {
      viewContent = renderSchemeManagement(this.cachedAllSchemes || []);
    }

    root.innerHTML = `
      <div class="app-container">
        ${renderNavbar()}
        <div class="main-layout">
          ${renderSidebar()}
          <main class="content-area" id="content-area" style="margin-left: var(--sidebar-width);">
            ${viewContent}
          </main>
        </div>
      </div>
    `;
  }
}

window.app = new ApplicationController();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
