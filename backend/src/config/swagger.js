/**
 * OpenAPI 3.0.0 Specification and Swagger UI Renderer for YojnaSetu
 */

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'YojnaSetu (योजनासेतु) - Official API Documentation',
    version: '1.0.0',
    description: 'Complete API reference for YojnaSetu national entitlement gateway. Supports multi-role RBAC, deterministic eligibility evaluation, multi-scheme batch apply, DigiLocker OAuth2, real-time SSE notifications, PDF report generation, and administrative governance.',
    contact: {
      name: 'YojnaSetu Engineering Team',
      url: 'https://github.com/rogeralukka/YOJNA-SETHU'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Primary API Gateway'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Bearer token obtained from /auth/login or /auth/admin-login'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System Health'],
        summary: 'Service Health Check',
        responses: { 200: { description: 'API Server is operational and database connected' } }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication & Security'],
        summary: 'Citizen Registration',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'mobile', 'password'],
                properties: {
                  fullName: { type: 'string', example: 'Aarav Sharma' },
                  email: { type: 'string', example: 'aarav.sharma@example.com' },
                  mobile: { type: 'string', example: '9876543210' },
                  password: { type: 'string', example: 'User@123' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Registration successful, returns JWT token' } }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication & Security'],
        summary: 'Citizen Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'password'],
                properties: {
                  identifier: { type: 'string', example: 'aarav.sharma@example.com' },
                  password: { type: 'string', example: 'User@123' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Login successful, returns JWT token' } }
      }
    },
    '/auth/admin-login': {
      post: {
        tags: ['Authentication & Security'],
        summary: 'Administrative / Super Admin Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['adminId', 'password'],
                properties: {
                  adminId: { type: 'string', example: 'admin@gov.in' },
                  password: { type: 'string', example: 'Admin@123' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Admin authentication successful' } }
      }
    },
    '/auth/send-otp': {
      post: {
        tags: ['Authentication & Security'],
        summary: 'Generate & Dispatch SMS OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier'],
                properties: {
                  identifier: { type: 'string', example: '9876543210' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'OTP dispatched successfully' } }
      }
    },
    '/schemes': {
      get: {
        tags: ['Schemes & Eligibility'],
        summary: 'Query & Search Government Schemes',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search keywords' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Scheme category filter' },
          { name: 'entity', in: 'query', schema: { type: 'string', enum: ['all', 'personal', 'business'] } }
        ],
        responses: { 200: { description: 'Returns schemes decorated with matched eligibility criteria' } }
      }
    },
    '/applications/apply': {
      post: {
        tags: ['Multi-Scheme Applications'],
        summary: 'Submit Multi-Scheme Batch Application',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['schemeIds', 'entity'],
                properties: {
                  schemeIds: { type: 'array', items: { type: 'string' } },
                  entity: { type: 'string', enum: ['personal', 'business'] },
                  businessCardId: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Batch applications created with frozen snapshot' } }
      }
    },
    '/admin/dashboard/stats': {
      get: {
        tags: ['Admin Governance & Analytics'],
        summary: 'Department KPI Analytics & Chart Datasets',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Returns KPI cards, Category Pie chart, Top 5 Bar chart, Monthly Trend' } }
      }
    },
    '/eligibility/download-pdf': {
      get: {
        tags: ['Schemes & Eligibility'],
        summary: 'Download Official PDF Eligibility Certificate',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Streams A4 PDF document (application/pdf)' } }
      }
    }
  }
};

export function getSwaggerHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>YojnaSetu API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5/favicon-32x32.png" sizes="32x32" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; font-family: sans-serif; }
    .topbar { display: none; }
    .swagger-ui .info { margin: 24px 0; }
    .swagger-ui .info .title { color: #003fb1; font-weight: 700; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: '/api/docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
}
