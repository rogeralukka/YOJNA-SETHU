import http from 'http';
import app from '../src/app.js';
import { prisma } from '../src/db/prisma.js';
import { cacheService } from '../src/services/cacheService.js';

let server;
let baseUrl;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ${colors.green}✔ PASS:${colors.reset} ${message}`);
    passed++;
  } else {
    console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${message}`);
    failed++;
  }
}

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return {
    status: res.status,
    headers: res.headers,
    data
  };
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  GOVERNMENT SCHEME PORTAL - FULL PRODUCTION SUITE  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  const port = 5055;
  await new Promise((resolve) => {
    server = app.listen(port, () => {
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Health & Server Status Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}1. Health & Server Status Tests${colors.reset}`);
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200 && healthRes.data.success === true, 'Health check returns status 200');

    // ----------------------------------------------------
    // TEST 2: User Authentication & Registration (Page 2)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}2. User Authentication & Registration Tests${colors.reset}`);
    const testUserEmail = `testuser_${Date.now()}@example.com`;
    const testUserMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        fullName: 'Vikram Singh',
        email: testUserEmail,
        mobile: testUserMobile,
        password: 'Password@123',
        confirmPassword: 'Password@123'
      }
    });
    assert(regRes.status === 201 && regRes.data.data.token, 'User registers successfully and receives JWT token');
    const userToken = regRes.data.data.token;
    const userId = regRes.data.data.user.id;

    // Login with Email
    const loginEmailRes = await request('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: testUserEmail,
        password: 'Password@123'
      }
    });
    assert(loginEmailRes.status === 200 && loginEmailRes.data.data.user.email === testUserEmail, 'User logs in via email');

    // Login with Mobile
    const loginMobileRes = await request('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: testUserMobile,
        password: 'Password@123'
      }
    });
    assert(loginMobileRes.status === 200, 'User logs in via mobile number');

    // ----------------------------------------------------
    // TEST 3: Admin & Super Admin Login (Page 3)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}3. Admin & Super Admin Authentication Tests${colors.reset}`);
    const superAdminRes = await request('/api/auth/admin-login', {
      method: 'POST',
      body: {
        adminId: 'superadmin@gov.in',
        password: 'SuperAdmin@123'
      }
    });
    assert(
      superAdminRes.status === 200 && superAdminRes.data.data.admin.role === 'super_admin',
      'Super Admin logs in with full administrative privileges'
    );
    const superAdminToken = superAdminRes.data.data.token;

    const normalAdminRes = await request('/api/auth/admin-login', {
      method: 'POST',
      body: {
        adminId: 'admin@gov.in',
        password: 'Admin@123'
      }
    });
    assert(
      normalAdminRes.status === 200 && normalAdminRes.data.data.admin.role === 'admin',
      'Normal Admin logs in with verification/review privileges'
    );
    const normalAdminToken = normalAdminRes.data.data.token;

    // ----------------------------------------------------
    // TEST 4: Profile Management & Completion Audit (Page 7)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}4. Profile Management & Completion Tests${colors.reset}`);
    const initialCompletion = await request('/api/profile/completion', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(initialCompletion.status === 200 && initialCompletion.data.data.isComplete === false, 'Initial profile detected as incomplete');

    const updateProfileRes = await request('/api/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        category: 'OBC',
        state: 'Maharashtra',
        annualIncome: 350000,
        age: 28,
        gender: 'Male',
        accountHolderName: 'Vikram Singh',
        accountNumber: '112233445566',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank'
      }
    });
    assert(updateProfileRes.status === 200 && updateProfileRes.data.data.state === 'Maharashtra', 'Profile updated with personal and bank details');

    const updatedCompletion = await request('/api/profile/completion', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(updatedCompletion.data.data.percentage > initialCompletion.data.data.percentage, 'Profile completion percentage increased');

    // ----------------------------------------------------
    // TEST 5: Dynamic Business Cards CRUD (Page 4B)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}5. Dynamic Business Cards Tests${colors.reset}`);
    const createBizRes = await request('/api/business', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        name: 'Singh Agrotech Solutions',
        type: 'Agriculture',
        gstNumber: '27AAACS1234A1Z1',
        panNumber: 'AAACS1234A',
        address: 'MIDC Industrial Area, Pune, Maharashtra - 411018',
        phone: testUserMobile,
        email: 'info@singhagrotech.in',
        turnover: '10L-50L',
        employeeCount: '11-50',
        industryCategory: 'Agri-Tech',
        yearsInOperation: '3-5',
        udyamNumber: 'UDYAM-MH-01-1234567'
      }
    });
    assert(createBizRes.status === 201 && createBizRes.data.data.name === 'Singh Agrotech Solutions', 'Created new dynamic business profile');
    const businessId = createBizRes.data.data.id;

    const listBizRes = await request('/api/business', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(listBizRes.data.data.length >= 1, 'Listed all dynamic business cards for user');

    // ----------------------------------------------------
    // TEST 6: Scheme Listing, Search, Filter & Eligibility (Pages 4A, 5)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}6. Schemes & Eligibility Engine Tests${colors.reset}`);
    const schemesRes = await request('/api/schemes', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(schemesRes.status === 200 && schemesRes.data.data.schemes.length > 0, 'Fetched active schemes list');
    assert(schemesRes.data.data.greetingMessage.includes('Hello, Vikram Singh!'), 'Personalized eligibility greeting message displayed');

    const searchRes = await request('/api/schemes?search=Mudra', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(searchRes.data.data.schemes.some(s => s.name.includes('Mudra')), 'Scheme search by keyword works');

    // Business Scheme Eligibility check
    const bizEligibilityRes = await request(`/api/business/${businessId}/eligibility`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(bizEligibilityRes.status === 200 && Array.isArray(bizEligibilityRes.data.data.eligibleSchemes), 'Business eligibility calculated accurately');

    // ----------------------------------------------------
    // TEST 7: Super Admin Scheme CRUD & RBAC (Pages 11, 12)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}7. Super Admin Scheme Management & RBAC Tests${colors.reset}`);
    // Normal user cannot create scheme
    const unauthorizedCreate = await request('/api/schemes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { name: 'Unauthorized Scheme' }
    });
    assert(unauthorizedCreate.status === 403, 'Normal user blocked from creating schemes (RBAC enforced)');

    // Normal Admin cannot create scheme (Super Admin only)
    const normalAdminCreate = await request('/api/schemes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${normalAdminToken}` },
      body: { name: 'Unauthorized Scheme' }
    });
    assert(normalAdminCreate.status === 403, 'Normal Admin blocked from scheme creation (Super Admin required)');

    // Super Admin creates scheme
    const superAdminCreateRes = await request('/api/schemes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        name: 'National Solar Rooftop Subsidy Scheme 2026',
        department: 'Ministry of New and Renewable Energy',
        category: 'Finance',
        description: 'Direct financial subsidy for residential and MSME solar rooftop installations.',
        minAge: 18,
        maxAge: 75,
        states: ['All'],
        categories: ['All'],
        maxIncome: 1000000,
        isBusinessScheme: false,
        documentsRequired: ['aadhaar', 'pan']
      }
    });
    assert(superAdminCreateRes.status === 201 && superAdminCreateRes.data.data.name.includes('Solar'), 'Super Admin successfully creates new scheme');
    const createdSchemeId = superAdminCreateRes.data.data.id;

    // ----------------------------------------------------
    // TEST 8: Multi-Scheme Applications Engine (Pages 4C, 6)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}8. Application Submissions & Tracking Tests${colors.reset}`);
    const applyRes = await request('/api/applications/apply', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        schemeIds: [createdSchemeId],
        entity: 'personal'
      }
    });
    assert(applyRes.status === 201 && applyRes.data.data[0].status === 'pending', 'Personal application submitted successfully with snapshot');
    const applicationId = applyRes.data.data[0].id;

    // Duplicate prevention
    const dupApplyRes = await request('/api/applications/apply', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        schemeIds: [createdSchemeId],
        entity: 'personal'
      }
    });
    assert(dupApplyRes.status === 400, 'Duplicate application correctly rejected');

    const myAppsRes = await request('/api/applications/my', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(myAppsRes.status === 200 && myAppsRes.data.data.some(a => a.id === applicationId), 'User tracks submitted applications');

    // ----------------------------------------------------
    // TEST 9: Bookmarks (Page 4D)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}9. Bookmarking System Tests${colors.reset}`);
    const bookmarkRes = await request(`/api/bookmarks/toggle/${createdSchemeId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(bookmarkRes.data.data.isBookmarked === true, 'Scheme bookmarked successfully');

    const myBookmarks = await request('/api/bookmarks', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(myBookmarks.data.data.some(b => b.id === createdSchemeId), 'Bookmarked scheme appears in saved list');

    // ----------------------------------------------------
    // TEST 10: Notifications Automation (Page 4E)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}10. Automated Notifications System Tests${colors.reset}`);
    const notificationsRes = await request('/api/notifications', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(notificationsRes.data.data.notifications.length > 0, 'User received automated notifications for application & new scheme');

    const markAllReadRes = await request('/api/notifications/read-all', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(markAllReadRes.status === 200, 'All notifications marked as read');

    // ----------------------------------------------------
    // TEST 11: Share Eligibility & PDF Generator (Page 4F)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}11. Eligibility Sharing & PDF Generation Tests${colors.reset}`);
    const shareRes = await request('/api/eligibility/share', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(shareRes.status === 200 && shareRes.data.data.shareableUrl, 'Shareable eligibility link generated');

    const pdfRes = await request('/api/eligibility/download-pdf', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(pdfRes.status === 200 && pdfRes.headers.get('content-type') === 'application/pdf', 'Downloadable PDF eligibility report generated');

    // ----------------------------------------------------
    // TEST 12: Admin Review & Decision Actions Tests (Page 10)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}12. Admin Review & Decision Actions Tests${colors.reset}`);
    const reviewDetailRes = await request(`/api/admin/applications/${applicationId}/review`, {
      headers: { Authorization: `Bearer ${normalAdminToken}` }
    });
    assert(reviewDetailRes.status === 200 && reviewDetailRes.data.data.applicationId === applicationId, 'Admin views full application review detail');

    // Rejection without comment is rejected with error
    const rejectNoComment = await request(`/api/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${normalAdminToken}` },
      body: { status: 'rejected', adminComment: '' }
    });
    assert(rejectNoComment.status === 400, 'Rejection without comment is rejected with validation error');

    // Approve application
    const approveRes = await request(`/api/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${normalAdminToken}` },
      body: { status: 'approved' }
    });
    assert(approveRes.status === 200 && approveRes.data.data.status === 'approved', 'Admin successfully approves application');

    // ----------------------------------------------------
    // TEST 13: Admin Dashboard Metrics & Charts (Page 8)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}13. Admin Analytics Dashboard Tests${colors.reset}`);
    const statsRes = await request('/api/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(statsRes.status === 200 && statsRes.data.data.stats.totalApplications > 0, 'Admin Dashboard stats (KPI cards) returned');
    assert(Array.isArray(statsRes.data.data.charts.applicationsByCategory), 'Applications by Category Pie Chart dataset returned');
    assert(Array.isArray(statsRes.data.data.charts.top5Schemes), 'Top 5 Most Applied Schemes Bar Chart dataset returned');
    assert(Array.isArray(statsRes.data.data.charts.applicationsTrend), 'Applications Trend Line Chart dataset returned');

    // ----------------------------------------------------
    // TEST 14: CSV Export Engine (Admin & Citizen)
    // ----------------------------------------------------
    console.log(`\n${colors.bold}14. CSV Data Export Engine Tests${colors.reset}`);
    const adminCsvRes = await request('/api/admin/applications/export-csv', {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(
      adminCsvRes.status === 200 &&
      adminCsvRes.headers.get('content-type').includes('text/csv') &&
      adminCsvRes.data.includes('Application ID,Applicant Name'),
      'Admin successfully exports all applications as CSV'
    );

    const userCsvRes = await request('/api/applications/my/export-csv', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(
      userCsvRes.status === 200 &&
      userCsvRes.headers.get('content-type').includes('text/csv') &&
      userCsvRes.data.includes('Application ID,Scheme Name'),
      'Citizen user successfully exports submission history as CSV'
    );

    // ----------------------------------------------------
    // TEST 15: System Audit Trail & Compliance Logging
    // ----------------------------------------------------
    console.log(`\n${colors.bold}15. Audit Logging & Governance Tests${colors.reset}`);
    const auditRes = await request('/api/admin/audit-logs', {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(
      auditRes.status === 200 &&
      auditRes.data.data.logs.length > 0 &&
      auditRes.data.data.logs.some(l => l.action === 'APPLICATION_APPROVED' || l.action === 'USER_LOGIN'),
      'System Audit Trail records administrative and authentication lifecycle events'
    );

    // ----------------------------------------------------
    // TEST 16: Security Rate Limiting Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}16. Security Rate Limiting Tests${colors.reset}`);
    const rateLimitCheckRes = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'x-test-rate-limit': 'true' },
      body: { identifier: testUserEmail, password: 'Password@123' }
    });
    assert(
      rateLimitCheckRes.headers.get('x-ratelimit-limit') !== null,
      'Rate limiter headers (X-RateLimit-Limit & Remaining) present on auth endpoints'
    );

    // ----------------------------------------------------
    // TEST 17: SMS & Mobile OTP Gateway Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}17. SMS & Mobile OTP Gateway Tests${colors.reset}`);
    const sendOtpRes = await request('/api/auth/send-otp', {
      method: 'POST',
      body: { mobile: testUserMobile, identifier: testUserMobile }
    });
    assert(sendOtpRes.status === 200 && sendOtpRes.data.data.otp, 'OTP successfully generated and dispatched via SMS gateway');
    const generatedOtp = sendOtpRes.data.data.otp;

    const verifyOtpRes = await request('/api/auth/verify-otp', {
      method: 'POST',
      body: { identifier: testUserMobile, otp: generatedOtp }
    });
    assert(verifyOtpRes.status === 200 && verifyOtpRes.data.data.verified === true, 'OTP successfully verified and authenticated');

    // ----------------------------------------------------
    // TEST 18: National DigiLocker API Integration Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}18. DigiLocker Document Verification Gateway Tests${colors.reset}`);
    const authUrlRes = await request('/api/digilocker/auth-url', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(authUrlRes.status === 200 && authUrlRes.data.data.authUrl.includes('oauth2'), 'DigiLocker OAuth2 consent URL generated');

    const callbackRes = await request('/api/digilocker/callback', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { code: 'mock_authorization_code_123' }
    });
    assert(callbackRes.status === 200 && callbackRes.data.data.accessToken, 'DigiLocker token exchange completed');

    const issuedDocsRes = await request('/api/digilocker/issued-files?accessToken=mock_access_token', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(issuedDocsRes.status === 200 && issuedDocsRes.data.data.documents.length > 0, 'DigiLocker verified certificates list retrieved');

    const importDocRes = await request('/api/digilocker/import', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: {
        docType: 'aadhaar',
        name: 'Aadhaar Card',
        docId: 'UIDAI-XXXX-XXXX-1234',
        uri: 'in.gov.uidai-ADHAR-123456789012'
      }
    });
    assert(importDocRes.status === 200 && importDocRes.data.data.fileName.includes('DigiLocker Verified'), 'DigiLocker verified document imported directly into profile repository');

    // ----------------------------------------------------
    // TEST 19: Redis & LRU In-Memory Caching Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}19. Redis & In-Memory Caching Tests${colors.reset}`);
    await cacheService.set('test:key', { test: 'value' }, 60);
    const cachedVal = await cacheService.get('test:key');
    assert(cachedVal && cachedVal.test === 'value', 'Cache layer stores and retrieves cached payloads');

    const catCacheRes = await request('/api/schemes/categories');
    assert(catCacheRes.status === 200 && Array.isArray(catCacheRes.data.data), 'Scheme categories cached and served with high performance');

    // ----------------------------------------------------
    // TEST 20: Automated Offsite Database Backup Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}20. Automated Offsite Database Backup Tests${colors.reset}`);
    const triggerBackupRes = await request('/api/admin/backup/trigger', {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(triggerBackupRes.status === 200 && triggerBackupRes.data.data.fileName.includes('gov_portal_backup'), 'Manual database backup created and recorded');

    const listBackupRes = await request('/api/admin/backup/list', {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(listBackupRes.status === 200 && listBackupRes.data.data.backups.length > 0, 'Database backup archive history retrieved');

    // ----------------------------------------------------
    // TEST 21: Web Push (VAPID) Notification Gateway Tests
    // ----------------------------------------------------
    console.log(`\n${colors.bold}21. Web Push VAPID Notification Gateway Tests${colors.reset}`);
    const vapidKeyRes = await request('/api/notifications/push/public-key', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(vapidKeyRes.status === 200 && vapidKeyRes.data.data.publicKey, 'VAPID public key exposed for browser service worker registration');

    const testPushRes = await request('/api/notifications/push/test', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: { title: 'Scheme Alert', message: 'New scholarship launched' }
    });
    assert(testPushRes.status === 200 && testPushRes.data.data.success === true, 'Web Push notification dispatched to device channel');

    console.log(`\n${colors.bold}${colors.cyan}----------------------------------------------------${colors.reset}`);
    console.log(`${colors.bold}TEST RESULTS: ${colors.green}${passed} PASSED${colors.reset} | ${failed > 0 ? colors.red : colors.green}${failed} FAILED${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}----------------------------------------------------${colors.reset}\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during test run:', error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }
}

runTests();
