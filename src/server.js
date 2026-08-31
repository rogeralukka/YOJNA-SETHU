import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './db/prisma.js';

const PORT = config.port;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully via Prisma.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Government Scheme Portal Backend Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${config.nodeEnv}`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🛑 Server closed and database disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
