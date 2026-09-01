/**
 * YojnaSetu API Client Service
 * Connects frontend to the Express REST API backend with resilient offline fallback
 */

const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api'
);

function getAuthHeaders() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('yojanasetu_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  baseUrl: API_BASE,

  async healthCheck() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Auth Endpoints
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  },

  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    return await res.json();
  },

  async adminLogin(adminId, password) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, password })
    });
    return await res.json();
  },

  async sendOtp(identifier) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    return await res.json();
  },

  async verifyOtp(identifier, otp) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp })
    });
    return await res.json();
  },

  // Scheme Endpoints
  async getSchemes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/schemes${query ? '?' + query : ''}`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getSchemeById(id) {
    const res = await fetch(`${API_BASE}/schemes/${id}`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Multi-Scheme Batch Applications
  async applySchemes({ schemeIds, entity = 'personal', businessCardId = null }) {
    const res = await fetch(`${API_BASE}/applications/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ schemeIds, entity, businessCardId })
    });
    return await res.json();
  },

  async getMyApplications() {
    const res = await fetch(`${API_BASE}/applications/my`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Business Profiles
  async getBusinesses() {
    const res = await fetch(`${API_BASE}/business`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async createBusiness(businessData) {
    const res = await fetch(`${API_BASE}/business`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(businessData)
    });
    return await res.json();
  },

  // Profile & KYC
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return await res.json();
  },

  // Admin Governance
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async updateApplicationStatus(applicationId, status, adminComment = '') {
    const res = await fetch(`${API_BASE}/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminComment })
    });
    return await res.json();
  },

  // Download PDF Report
  async downloadPdfReport() {
    const res = await fetch(`${API_BASE}/eligibility/download-pdf`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('PDF generation failed');
    return await res.blob();
  }
};
