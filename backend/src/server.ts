import { app } from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';

async function startServer() {
  await connectDatabase();

  const server = app.listen(config.PORT, () => {
    logger.info(`🚀 YojanaSetu Backend running on port ${config.PORT}`);
    logger.info(`📚 Swagger Documentation available at http://localhost:${config.PORT}/api/docs`);
    logger.info(`🛡️ DEMO_MODE = ${config.DEMO_MODE}`);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

startServer();
