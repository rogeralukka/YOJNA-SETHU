import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { swaggerSpec } from './config/swagger';
import apiRoutes from './routes';
import { globalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { ApiResponse } from './utils/response';

export const app = express();

// Security Middlewares
app.use(helmet());

const allowedOrigins = config.CORS_ORIGIN.split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS allowlist'));
      }
    },
    credentials: true,
  })
);

// Body Parsing with Request Size Limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiting
app.use(globalRateLimiter);

// Interactive API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  return ApiResponse.success(
    res,
    {
      status: 'UP',
      timestamp: new Date().toISOString(),
      demoMode: config.DEMO_MODE,
      environment: config.NODE_ENV,
    },
    'YojanaSetu Backend Service is healthy'
  );
});

// API Routes Versioning
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use(errorHandler);
