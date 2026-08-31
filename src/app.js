import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/index.js';

const app = express();

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts/styles for single page UI
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

// Serve frontend static assets from public/
const publicPath = path.resolve(process.cwd(), 'public');
app.use(express.static(publicPath));

// Master API Routes
app.use('/api', apiRoutes);

// SPA fallback: any other route serves index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Global Error handler
app.use(errorHandler);

export default app;
