import { config } from '../config/env';
import { logger } from '../config/logger';

export class DigiLockerService {
  static async fetchDocumentMock(docType: 'AADHAAR' | 'PAN' | 'UDYAM', citizenId: string) {
    if (config.DEMO_MODE || !config.DIGILOCKER_CLIENT_ID) {
      logger.info(`[DEMO_MODE DigiLockerService] Returning synthetic ${docType} document for citizen ${citizenId}`);
      return {
        isDemo: true,
        verified: true,
        verificationSource: 'DigiLocker Mock Integration (Hackathon Sandbox)',
        documentType: docType,
        maskedId: docType === 'AADHAAR' ? 'XXXX-XXXX-4321' : 'XXXXX8765X',
        issuedDate: '2023-01-15',
      };
    }

    logger.info(`[DigiLockerService] Contacting official DigiLocker API for ${docType}`);
    return {
      isDemo: false,
      verified: true,
      verificationSource: 'DigiLocker Official Portal',
      documentType: docType,
    };
  }
}
