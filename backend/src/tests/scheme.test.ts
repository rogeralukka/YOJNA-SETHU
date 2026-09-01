import request from 'supertest';
import { app } from '../app';
import { SchemeService } from '../services/scheme.service';
import { SchemeSearchService } from '../services/scheme-search.service';
import { SchemeVersionService } from '../services/scheme-version.service';
import { generateAccessToken } from '../utils/security';

describe('Government Scheme Database API & Security Tests', () => {
  const superAdminToken = generateAccessToken({
    id: 'super_admin_1',
    userId: 'USR_SUPER_ADMIN_1',
    email: 'superadmin@yojanasetu.gov.in',
    role: 'SUPER_ADMIN',
  });

  const normalUserToken = generateAccessToken({
    id: 'user_1',
    userId: 'USR_USER_1',
    email: 'user@gmail.com',
    role: 'USER',
  });

  const mockScheme = {
    id: 'b7a8c9d0-1234-5678-9abc-def012345678',
    schemeId: 'SCH_000001',
    name: 'PM-KISAN',
    slug: 'pm-kisan',
    shortDescription: 'Income support for landholding farmers.',
    description: 'Pradhan Mantri Kisan Samman Nidhi scheme details.',
    department: { id: 'd1', name: 'Ministry of Agriculture', slug: 'ministry-of-agriculture' },
    category: { id: 'c1', name: 'Agriculture', slug: 'agriculture' },
    schemeType: 'PERSONAL',
    isBusinessScheme: false,
    eligibility: {
      minAge: 18,
      maxAge: 75,
      minIncome: 0,
      maxIncome: 250000,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST'],
    },
    deadline: '2026-12-31T23:59:59.000Z',
    documentsRequired: [],
    additionalFields: [],
    source: {
      name: 'PM KISAN Portal',
      url: 'https://pmkisan.gov.in',
      verificationStatus: 'VERIFIED',
    },
    isNew: true,
    isActive: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Public Scheme APIs', () => {
    it('GET /api/v1/schemes should return paginated scheme list', async () => {
      jest.spyOn(SchemeService, 'querySchemes').mockResolvedValueOnce({
        schemes: [mockScheme] as any,
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const res = await request(app).get('/api/v1/schemes');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.total).toBe(1);
    });

    it('GET /api/v1/schemes/search should return search results', async () => {
      jest.spyOn(SchemeSearchService, 'searchSchemes').mockResolvedValueOnce({
        schemes: [mockScheme] as any,
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const res = await request(app).get('/api/v1/schemes/search?q=farmer');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].schemeId).toBe('SCH_000001');
    });

    it('GET /api/v1/schemes/:schemeId should return single scheme', async () => {
      jest.spyOn(SchemeService, 'getSchemeById').mockResolvedValueOnce(mockScheme as any);

      const res = await request(app).get('/api/v1/schemes/SCH_000001');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('PM-KISAN');
    });
  });

  describe('Input Validation & Security Hardening', () => {
    it('POST /api/v1/admin/schemes with minAge > maxAge should reject with 400 Validation Error', async () => {
      const res = await request(app)
        .post('/api/v1/admin/schemes')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: 'Invalid Scheme',
          shortDescription: 'Short description text here',
          description: 'Long description text explaining the scheme in full detail',
          departmentId: '123e4567-e89b-12d3-a456-426614174000',
          categoryId: '123e4567-e89b-12d3-a456-426614174001',
          minAge: 60,
          maxAge: 18, // Invalid: minAge > maxAge
          states: ['ALL_INDIA'],
          categories: ['GENERAL'],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/v1/admin/schemes with non-HTTPS sourceUrl should reject with 400 Error', async () => {
      const res = await request(app)
        .post('/api/v1/admin/schemes')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: 'Malicious URL Scheme',
          shortDescription: 'Short description text here',
          description: 'Long description text explaining the scheme in full detail',
          departmentId: '123e4567-e89b-12d3-a456-426614174000',
          categoryId: '123e4567-e89b-12d3-a456-426614174001',
          sourceUrl: 'javascript:alert(1)', // Unsafe URL
          states: ['ALL_INDIA'],
          categories: ['GENERAL'],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/admin/schemes by regular user should return 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/admin/schemes')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({
          name: 'Unauthorized Scheme Creation',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('Admin Operations & Version History', () => {
    it('DELETE /api/v1/admin/schemes/:schemeId should archive scheme (Soft Delete)', async () => {
      const archivedMock = { ...mockScheme, status: 'ARCHIVED', isActive: false };
      jest.spyOn(SchemeService, 'archiveScheme').mockResolvedValueOnce(archivedMock as any);

      const res = await request(app)
        .delete('/api/v1/admin/schemes/SCH_000001')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ARCHIVED');
    });

    it('GET /api/v1/admin/schemes/:schemeId/versions should return version history', async () => {
      const mockVersions = [
        { id: 'v1', versionNumber: 1, snapshot: mockScheme, createdAt: new Date() },
      ];
      jest.spyOn(SchemeVersionService, 'getSchemeVersions').mockResolvedValueOnce(mockVersions as any);

      const res = await request(app)
        .get('/api/v1/admin/schemes/SCH_000001/versions')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });
  });
});
