import { z } from 'zod';

export const createBusinessCardSchema = z.object({
  body: z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    businessType: z.string().min(2, 'Business type is required'),
    gstNumberMasked: z.string().optional(),
    panLast4: z.string().regex(/^[0-9]{4}$/).optional(),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    email: z.string().email('Invalid business email'),
    annualTurnover: z.number().min(0, 'Annual turnover must be >= 0'),
    employeeCount: z.number().int().min(0, 'Employee count must be >= 0'),
    industryCategory: z.string().min(2, 'Industry category is required'),
    yearsInOperation: z.number().int().min(0, 'Years in operation must be >= 0'),
    udyamRegistrationMasked: z.string().optional(),
  }),
});

export const updateBusinessCardSchema = z.object({
  body: createBusinessCardSchema.shape.body.partial(),
});
