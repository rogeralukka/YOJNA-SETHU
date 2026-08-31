import { prisma } from '../db/prisma.js';
import { storageService } from '../services/storageService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const uploadDocument = async (req, res, next) => {
  try {
    const { docType } = req.body;
    const file = req.file;

    if (!file) {
      return sendError(res, 'No file uploaded. Please provide a document file.', 400);
    }

    if (!docType) {
      return sendError(res, 'Document type (docType) is required (e.g. aadhaar, pan, voter_id, income_cert, caste_cert, other).', 400);
    }

    // Upload through dual-mode storage service (Cloud S3 or local disk)
    const storedFile = await storageService.uploadFile({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      folder: `documents/${req.user.id}`
    });

    // Check if user already has this docType uploaded
    const existingDoc = await prisma.document.findFirst({
      where: {
        userId: req.user.id,
        docType
      }
    });

    let documentRecord;

    if (existingDoc) {
      // Delete old file from storage
      await storageService.deleteFile(existingDoc.fileName);

      documentRecord = await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          fileName: storedFile.fileName,
          fileUrl: storedFile.fileUrl,
          mimeType: storedFile.mimeType,
          fileSize: storedFile.fileSize
        }
      });
    } else {
      documentRecord = await prisma.document.create({
        data: {
          userId: req.user.id,
          docType,
          fileName: storedFile.fileName,
          fileUrl: storedFile.fileUrl,
          mimeType: storedFile.mimeType,
          fileSize: storedFile.fileSize
        }
      });
    }

    return sendSuccess(res, documentRecord, 'Document uploaded successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyDocuments = async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: 'desc' }
    });

    return sendSuccess(res, documents, 'Documents retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const getDocuments = getMyDocuments;

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!document) {
      return sendError(res, 'Document not found or unauthorized.', 404);
    }

    // Delete from storage
    await storageService.deleteFile(document.fileName);

    await prisma.document.delete({
      where: { id }
    });

    return sendSuccess(res, null, 'Document deleted successfully.');
  } catch (error) {
    next(error);
  }
};
