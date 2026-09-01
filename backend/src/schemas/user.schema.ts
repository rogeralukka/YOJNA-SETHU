import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).optional(),
      phone: z.string().regex(/^[0-9]{10}$/).optional(),
      age: z.number().int().min(18).max(120).optional(),
      state: z.string().min(2).optional(),
      category: z.enum(['GENERAL', 'OBC', 'SC', 'ST', 'EWS']).optional(),
      annualIncome: z.number().min(0).optional(),
      profilePictureUrl: z.string().url().optional(),
      aadhaarLast4: z.string().regex(/^[0-9]{4}$/).optional(),
      panLast4: z.string().regex(/^[0-9]{4}$/).optional(),
      bankName: z.string().optional(),
      bankAccountLast4: z.string().regex(/^[0-9]{4}$/).optional(),
      bankIfsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/).optional(),
    })
    .strict(), // Strictly rejects extra fields like role, isAdmin, passwordHash, etc.
});
