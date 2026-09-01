// Centralized API Client Layer for Government Scheme Portal

const API_BASE = '/api';

export const api = {
  getToken() {
    return localStorage.getItem('gov_token') || null;
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('gov_token', token);
    } else {
      localStorage.removeItem('gov_token');
    }
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getToken();

    const headers = {
      ...(options.headers || {})
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions = {
      method: options.method || 'GET',
      headers
    };

    if (options.body) {
      fetchOptions.body = options.body instanceof FormData ? options.body : JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred during API request.');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // Auth
  register(payload) {
    return this.request('/auth/register', { method: 'POST', body: payload });
  },

  login(payload) {
    return this.request('/auth/login', { method: 'POST', body: payload });
  },

  adminLogin(payload) {
    return this.request('/auth/admin-login', { method: 'POST', body: payload });
  },

  getMe() {
    return this.request('/auth/me');
  },

  // Profile & Documents
  getProfile() {
    return this.request('/profile');
  },

  updateProfile(payload) {
    return this.request('/profile', { method: 'PUT', body: payload });
  },

  getProfileCompletion() {
    return this.request('/profile/completion');
  },

  changePassword(payload) {
    return this.request('/profile/change-password', { method: 'POST', body: payload });
  },

  uploadDocument(formData) {
    return this.request('/documents/upload', { method: 'POST', body: formData });
  },

  getDocuments() {
    return this.request('/documents');
  },

  deleteDocument(id) {
    return this.request(`/documents/${id}`, { method: 'DELETE' });
  },

  // Schemes
  getSchemes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/schemes${query ? `?${query}` : ''}`);
  },

  getSchemeById(id, businessId = '') {
    const query = businessId ? `?businessId=${businessId}` : '';
    return this.request(`/schemes/${id}${query}`);
  },

  getSchemeCategories() {
    return this.request('/schemes/categories');
  },

  createScheme(payload) {
    return this.request('/schemes', { method: 'POST', body: payload });
  },

  updateScheme(id, payload) {
    return this.request(`/schemes/${id}`, { method: 'PUT', body: payload });
  },

  deleteScheme(id) {
    return this.request(`/schemes/${id}`, { method: 'DELETE' });
  },

  // Business Cards
  getBusinesses() {
    return this.request('/business');
  },

  getBusinessById(id) {
    return this.request(`/business/${id}`);
  },

  createBusiness(payload) {
    return this.request('/business', { method: 'POST', body: payload });
  },

  updateBusiness(id, payload) {
    return this.request(`/business/${id}`, { method: 'PUT', body: payload });
  },

  deleteBusiness(id) {
    return this.request(`/business/${id}`, { method: 'DELETE' });
  },

  checkBusinessEligibility(id) {
    return this.request(`/business/${id}/eligibility`);
  },

  // Applications
  applySchemes(payload) {
    return this.request('/applications/apply', { method: 'POST', body: payload });
  },

  getMyApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/applications/my${query ? `?${query}` : ''}`);
  },

  getApplicationById(id) {
    return this.request(`/applications/${id}`);
  },

  // Bookmarks
  getBookmarks() {
    return this.request('/bookmarks');
  },

  toggleBookmark(schemeId) {
    return this.request(`/bookmarks/toggle/${schemeId}`, { method: 'POST' });
  },

  // Notifications
  getNotifications() {
    return this.request('/notifications');
  },

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  },

  markAllNotificationsRead() {
    return this.request('/notifications/read-all', { method: 'PUT' });
  },

  // Share & PDF
  getShareableEligibility(businessId = '') {
    const query = businessId ? `?businessId=${businessId}` : '';
    return this.request(`/eligibility/share${query}`);
  },

  downloadEligibilityPDFUrl(businessId = '') {
    const token = this.getToken();
    const query = businessId ? `&businessId=${businessId}` : '';
    return `${API_BASE}/eligibility/download-pdf?token=${token}${query}`;
  },

  // Admin
  getAdminStats() {
    return this.request('/admin/dashboard/stats');
  },

  getAdminApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/applications${query ? `?${query}` : ''}`);
  },

  getAdminApplicationReview(id) {
    return this.request(`/admin/applications/${id}/review`);
  },

  updateApplicationStatus(id, payload) {
    return this.request(`/admin/applications/${id}/status`, { method: 'PUT', body: payload });
  }
};
