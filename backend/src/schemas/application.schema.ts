import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    schemeId: z.string().min(1, 'Scheme ID is required'),
    businessCardId: z.string().optional().nullable(),
    additionalDetails: z.record(z.any()).optional(),
  }),
});

export const bulkApplicationSchema = z.object({
  body: z.object({
    schemeIds: z.array(z.string().min(1)).min(1, 'At least one scheme ID is required'),
    businessCardId: z.string().optional().nullable(),
    additionalDetails: z.record(z.any()).optional(),
  }),
});

export const approveApplicationSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
  }),
});

export const rejectApplicationSchema = z.object({
  body: z.object({
    comment: z.string().min(1, 'Admin comment is mandatory for rejection'),
  }),
});
