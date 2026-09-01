import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/index.js';
import { swaggerSpec, getSwaggerHtml } from './config/swagger.js';

const app = express();

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow Swagger UI and inline scripts
  crossOriginResourcePolicy: false // Allow documents/PDFs to be loaded across origins
}));
app.use(cors({
  origin: '*', // Allow frontend client
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static uploads directory for documents/images
const uploadsPath = path.resolve(process.cwd(), config.uploadDir);
app.use('/uploads', express.static(uploadsPath));

// Serve frontend static assets from public/ if present
const publicPath = path.resolve(process.cwd(), 'public');
app.use(express.static(publicPath));

// Interactive Swagger OpenAPI Documentation
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(getSwaggerHtml());
});

// Master API Routes
app.use('/api', apiRoutes);

// SPA fallback: any other route serves index.html if present
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.redirect('/api-docs');
  }
});

// Global Error handler
app.use(errorHandler);

export default app;
