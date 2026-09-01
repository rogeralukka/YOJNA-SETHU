import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  sanitizeText,
} from '../utils/security';

describe('Security Utility Unit Tests', () => {
  it('should hash password and verify successfully', async () => {
    const raw = 'SecretPassword123!';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    const isValid = await verifyPassword(raw, hash);
    expect(isValid).toBe(true);
  });

  it('should fail verification for incorrect password', async () => {
    const raw = 'SecretPassword123!';
    const hash = await hashPassword(raw);
    const isValid = await verifyPassword('WrongPassword', hash);
    expect(isValid).toBe(false);
  });

  it('should sign and verify access tokens correctly', () => {
    const payload = {
      id: 'usr_123',
      userId: 'USR_123',
      email: 'test@example.com',
      role: 'USER',
    };
    const token = generateAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  it('should sanitize HTML script tags from input string to prevent XSS', () => {
    const maliciousInput = '<script>alert("xss")</script>Ramesh Kumar';
    const clean = sanitizeText(maliciousInput);
    expect(clean).toBe('alert("xss")Ramesh Kumar');
    expect(clean).not.toContain('<script>');
  });
});
