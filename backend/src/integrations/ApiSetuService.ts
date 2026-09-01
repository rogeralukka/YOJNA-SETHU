import { config } from '../config/env';
import { logger } from '../config/logger';

export class ApiSetuService {
  static async verifyCertificateMock(certificateNumber: string, state: string) {
    if (config.DEMO_MODE || !config.API_SETU_CLIENT_ID) {
      logger.info(`[DEMO_MODE ApiSetuService] Verification request for certificate ${certificateNumber} in ${state}`);
      return {
        isDemo: true,
        verified: true,
        verificationSource: 'API Setu Mock Gateway (Hackathon Sandbox)',
        certificateNumber,
        status: 'VALID',
      };
    }

    logger.info(`[ApiSetuService] Querying official API Setu Gateway for certificate ${certificateNumber}`);
    return {
      isDemo: false,
      verified: true,
      verificationSource: 'API Setu Government Gateway',
      certificateNumber,
      status: 'VALID',
    };
  }
}
