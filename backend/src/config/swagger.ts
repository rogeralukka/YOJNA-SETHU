import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YojanaSetu Backend API',
      version: '1.0.0',
      description:
        'Production-Quality API Specification for YojanaSetu — One-Stop Platform for Government Scheme Discovery & Application.',
      contact: {
        name: 'YojanaSetu Engineering Team',
        email: 'support@yojanasetu.gov.in',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'V1 API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your short-lived access token',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
