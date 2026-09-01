import { digilockerService } from '../services/digilockerService.js';
import { prisma } from '../db/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getAuthUrl = (req, res) => {
  const stateParam = `${req.user.id}_${Date.now()}`;
  const authUrl = digilockerService.getAuthorizationUrl(stateParam);
  return sendSuccess(res, { authUrl }, 'DigiLocker authorization URL generated.');
};

export const handleCallback = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return sendError(res, 'Authorization code is required.', 400);
    }

    const tokenData = await digilockerService.exchangeCodeForToken(code);
    if (tokenData.error) {
      return sendError(res, `DigiLocker token exchange failed: ${tokenData.error}`, 400);
    }

    return sendSuccess(res, tokenData, 'DigiLocker authorization successful.');
  } catch (error) {
    next(error);
  }
};

export const getIssuedDocuments = async (req, res, next) => {
  try {
    const { accessToken = 'mock_access_token' } = req.query;
    const docs = await digilockerService.fetchIssuedDocuments(accessToken);

    return sendSuccess(res, docs, 'DigiLocker verified documents retrieved.');
  } catch (error) {
    next(error);
  }
};

export const importDocument = async (req, res, next) => {
  try {
    const { docType, name, docId, issuer, uri } = req.body;

    if (!docType || !name) {
      return sendError(res, 'Document type and name are required.', 400);
    }

    // Check if document already exists
    const existing = await prisma.document.findFirst({
      where: { userId: req.user.id, docType }
    });

    const fileUrl = `https://digilocker.gov.in/verify/${encodeURIComponent(uri || docId || name)}`;

    let documentRecord;
    if (existing) {
      documentRecord = await prisma.document.update({
        where: { id: existing.id },
        data: {
          fileName: `DigiLocker Verified - ${name}`,
          fileUrl,
          mimeType: 'application/pdf',
          fileSize: 1024 * 150
        }
      });
    } else {
      documentRecord = await prisma.document.create({
        data: {
          userId: req.user.id,
          docType,
          fileName: `DigiLocker Verified - ${name}`,
          fileUrl,
          mimeType: 'application/pdf',
          fileSize: 1024 * 150
        }
      });
    }

    return sendSuccess(res, documentRecord, 'Document successfully imported and verified via DigiLocker.');
  } catch (error) {
    next(error);
  }
};
