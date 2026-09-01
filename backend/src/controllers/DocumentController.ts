import { Request, Response, NextFunction } from 'express';
import { DocumentStorageService } from '../integrations/DocumentStorageService';
import { ApiResponse } from '../utils/response';
import { ValidationError } from '../utils/errors';
import { AuditService } from '../services/AuditService';

export class DocumentController {
  static async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ValidationError('No document file provided');
      }

      const meta = await DocumentStorageService.uploadDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      await AuditService.log({
        actorUserId: req.user!.id,
        action: 'DOCUMENT_UPLOADED',
        resourceType: 'Document',
        resourceId: meta.objectName,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      return ApiResponse.success(res, meta, 'Document uploaded securely', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getSignedDocumentView(req: Request, res: Response, next: NextFunction) {
    try {
      const { objectName } = req.params;
      const signedUrl = DocumentStorageService.getSignedUrl(objectName);
      return ApiResponse.success(res, { signedUrl }, 'Signed view URL generated');
    } catch (err) {
      next(err);
    }
  }
}
