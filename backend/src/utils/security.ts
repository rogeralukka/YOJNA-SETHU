import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UnauthorizedError } from './errors';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  id: string;
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN as any,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN as any,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}

export function sanitizeText(str: string): string {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>?/gm, '').trim();
}
