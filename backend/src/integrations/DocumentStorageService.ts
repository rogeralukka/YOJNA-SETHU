import { config } from '../config/env';
import { logger } from '../config/logger';
import { generateRandomFileName } from '../middleware/upload';

export interface UploadedFileMeta {
  objectName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  signedUrl: string;
}

export class DocumentStorageService {
  static async uploadDocument(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadedFileMeta> {
    const objectName = generateRandomFileName(originalName);

    if (config.DEMO_MODE) {
      logger.info(`[DEMO_MODE DocumentStorage] Uploaded document ${objectName} (${fileBuffer.length} bytes)`);
      const signedUrl = this.getSignedUrl(objectName);
      return {
        objectName,
        originalName,
        mimeType,
        sizeBytes: fileBuffer.length,
        signedUrl,
      };
    }

    const signedUrl = this.getSignedUrl(objectName);
    return {
      objectName,
      originalName,
      mimeType,
      sizeBytes: fileBuffer.length,
      signedUrl,
    };
  }

  static getSignedUrl(objectName: string, expiresInMinutes: number = 15): string {
    const expires = Date.now() + expiresInMinutes * 60 * 1000;
    return `/api/v1/documents/signed-view/${objectName}?expires=${expires}&token=mock_signed_token_12345`;
  }
}
