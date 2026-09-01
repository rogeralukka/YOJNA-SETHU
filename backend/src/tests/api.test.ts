import request from 'supertest';
import { app } from '../app';
import { SchemeService } from '../services/scheme.service';

describe('YojanaSetu API Endpoints Integration Tests', () => {
  beforeEach(() => {
    jest.spyOn(SchemeService, 'querySchemes').mockResolvedValue({
      schemes: [
        {
          id: 'sch_1',
          schemeId: 'SCH_PMEGP_001',
          name: 'PMEGP',
          slug: 'pmegp',
          shortDescription: 'Employment generation',
          description: 'Prime Minister Employment Generation Programme',
          department: { id: 'd1', name: 'MSME', slug: 'msme' },
          category: { id: 'c1', name: 'Business', slug: 'business' },
          schemeType: 'BUSINESS',
          isBusinessScheme: true,
          eligibility: { states: ['ALL_INDIA'], categories: ['GENERAL'] },
          deadline: new Date().toISOString(),
          documentsRequired: [],
          additionalFields: [],
          source: { verificationStatus: 'VERIFIED' },
          isNew: true,
          isActive: true,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any,
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it('GET /api/v1/health should return health status 200 OK', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UP');
  });

  it('GET /api/v1/schemes should return public scheme list', async () => {
    const res = await request(app).get('/api/v1/schemes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].schemeId).toBe('SCH_PMEGP_001');
  });

  it('GET /api/v1/users/me without Authorization header should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/auth/register with weak password should return 400 Validation Error', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'invalid-email',
      phone: '123',
      password: 'weak',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/admin/applications/app_123/reject without mandatory comment should return 400 Error', async () => {
    const adminToken = require('../utils/security').generateAccessToken({
      id: 'admin_1',
      userId: 'USR_ADMIN_1',
      email: 'admin@yojanasetu.gov.in',
      role: 'ADMIN',
    });

    const res = await request(app)
      .patch('/api/v1/admin/applications/app_123/reject')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
