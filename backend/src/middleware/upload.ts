import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { ValidationError } from '../utils/errors';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new ValidationError('Invalid file format. Only PDF, JPG, JPEG, and PNG files up to 10MB are allowed.'));
  }
  
  cb(null, true);
};

export const documentUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
  fileFilter,
});

export function generateRandomFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${randomBytes}${ext}`;
}
