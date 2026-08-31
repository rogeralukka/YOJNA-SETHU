import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File too large. Maximum allowed size is 10MB.', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target ? err.meta.target.join(', ') : 'Unique constraint';
    return sendError(res, `A record with this ${field} already exists.`, 409);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'Requested resource was not found.', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return sendError(res, message, statusCode);
};

export const notFoundHandler = (req, res) => {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};
