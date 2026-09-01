import { z } from 'zod';
import { SchemeType, SchemeStatus, VerificationStatus, DocumentType, FieldType } from '../types/scheme.types';

// Helper URL validator (Section 25 - URL Security)
const safeUrlSchema = z.string().trim().refine(
  (val) => {
    if (!val) return true;
    try {
      const parsed = new URL(val);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'Source URL must be a valid HTTPS URL (http, javascript:, data:, file: are not allowed)' }
);

export const createSchemeSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Scheme name must be at least 3 characters').max(200, 'Scheme name max 200 characters'),
    slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500, 'Short description max 500 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    departmentId: z.string().uuid('Invalid Department ID format'),
    categoryId: z.string().uuid('Invalid Category ID format'),
    schemeType: z.nativeEnum(SchemeType).default(SchemeType.PERSONAL),
    eligibilityDescription: z.string().optional(),
    minAge: z.number().int().min(0).max(120).optional().nullable(),
    maxAge: z.number().int().min(0).max(120).optional().nullable(),
    minIncome: z.number().min(0).optional().nullable(),
    maxIncome: z.number().min(0).optional().nullable(),
    rulesJson: z.record(z.any()).optional().nullable(),
    deadline: z.string().datetime().optional().nullable().or(z.date().optional()),
    sourceName: z.string().max(200).optional().nullable(),
    sourceUrl: safeUrlSchema.optional().nullable(),
    sourceIdentifier: z.string().max(100).optional().nullable(),
    verificationStatus: z.nativeEnum(VerificationStatus).optional().default(VerificationStatus.UNVERIFIED),
    states: z.array(z.string()).min(1, 'At least one state code (e.g. ALL_INDIA or TN) is required'),
    categories: z.array(z.string()).min(1, 'At least one category code (e.g. GENERAL, SC) is required'),
    documents: z.array(
      z.object({
        documentType: z.nativeEnum(DocumentType),
        documentName: z.string().min(2),
        description: z.string().optional(),
        isMandatory: z.boolean().default(true),
        acceptedFormats: z.array(z.string()).optional(),
      })
    ).optional(),
    additionalFields: z.array(
      z.object({
        fieldKey: z.string().min(2).regex(/^[a-z0-9_]+$/, 'Field key must be snake_case'),
        label: z.string().min(2),
        description: z.string().optional(),
        fieldType: z.nativeEnum(FieldType),
        isRequired: z.boolean().default(false),
        validationRules: z.record(z.any()).optional(),
        options: z.array(z.string()).optional(),
        displayOrder: z.number().int().optional().default(0),
      })
    ).optional(),
    translations: z.array(
      z.object({
        languageCode: z.string().min(2).max(5),
        name: z.string().min(3),
        shortDescription: z.string().min(10),
        description: z.string().min(20),
        eligibilityDescription: z.string().optional(),
      })
    ).optional(),
  }).refine(
    (data) => {
      if (data.minAge !== undefined && data.minAge !== null && data.maxAge !== undefined && data.maxAge !== null) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    { message: 'minAge cannot be greater than maxAge', path: ['minAge'] }
  ).refine(
    (data) => {
      if (data.minIncome !== undefined && data.minIncome !== null && data.maxIncome !== undefined && data.maxIncome !== null) {
        return data.minIncome <= data.maxIncome;
      }
      return true;
    },
    { message: 'minIncome cannot be greater than maxIncome', path: ['minIncome'] }
  ),
});

export const updateSchemeSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(200).optional(),
    shortDescription: z.string().min(10).max(500).optional(),
    description: z.string().min(20).optional(),
    departmentId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    schemeType: z.nativeEnum(SchemeType).optional(),
    eligibilityDescription: z.string().optional(),
    minAge: z.number().int().min(0).max(120).optional().nullable(),
    maxAge: z.number().int().min(0).max(120).optional().nullable(),
    minIncome: z.number().min(0).optional().nullable(),
    maxIncome: z.number().min(0).optional().nullable(),
    rulesJson: z.record(z.any()).optional().nullable(),
    deadline: z.string().datetime().optional().nullable(),
    status: z.nativeEnum(SchemeStatus).optional(),
    sourceName: z.string().max(200).optional().nullable(),
    sourceUrl: safeUrlSchema.optional().nullable(),
    sourceIdentifier: z.string().max(100).optional().nullable(),
    verificationStatus: z.nativeEnum(VerificationStatus).optional(),
    states: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    documents: z.array(
      z.object({
        documentType: z.nativeEnum(DocumentType),
        documentName: z.string().min(2),
        description: z.string().optional(),
        isMandatory: z.boolean().default(true),
        acceptedFormats: z.array(z.string()).optional(),
      })
    ).optional(),
    additionalFields: z.array(
      z.object({
        fieldKey: z.string().min(2),
        label: z.string().min(2),
        description: z.string().optional(),
        fieldType: z.nativeEnum(FieldType),
        isRequired: z.boolean().default(false),
        validationRules: z.record(z.any()).optional(),
        options: z.array(z.string()).optional(),
        displayOrder: z.number().int().optional(),
      })
    ).optional(),
    translations: z.array(
      z.object({
        languageCode: z.string().min(2).max(5),
        name: z.string().min(3),
        shortDescription: z.string().min(10),
        description: z.string().min(20),
        eligibilityDescription: z.string().optional(),
      })
    ).optional(),
    changeReason: z.string().optional(),
  }).refine(
    (data) => {
      if (data.minAge !== undefined && data.minAge !== null && data.maxAge !== undefined && data.maxAge !== null) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    { message: 'minAge cannot be greater than maxAge', path: ['minAge'] }
  ).refine(
    (data) => {
      if (data.minIncome !== undefined && data.minIncome !== null && data.maxIncome !== undefined && data.maxIncome !== null) {
        return data.minIncome <= data.maxIncome;
      }
      return true;
    },
    { message: 'minIncome cannot be greater than maxIncome', path: ['minIncome'] }
  ),
});

export const schemeQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    q: z.string().optional(),
    category: z.string().optional(),
    department: z.string().optional(),
    state: z.string().optional(),
    schemeType: z.nativeEnum(SchemeType).optional(),
    minAge: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxAge: z.string().regex(/^\d+$/).transform(Number).optional(),
    income: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    isNew: z.string().transform((val) => val === 'true').optional(),
    status: z.nativeEnum(SchemeStatus).optional(),
    deadline: z.string().optional(),
    language: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'deadline', 'name']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
