export enum SchemeType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
  BOTH = 'BOTH',
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  OUTDATED = 'OUTDATED',
  ARCHIVED = 'ARCHIVED',
}

export enum SchemeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

export enum FieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
}

export enum DocumentType {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  INCOME_CERTIFICATE = 'INCOME_CERTIFICATE',
  CASTE_CERTIFICATE = 'CASTE_CERTIFICATE',
  LAND_DOCUMENT = 'LAND_DOCUMENT',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BUSINESS_REGISTRATION = 'BUSINESS_REGISTRATION',
  UDYAM_CERTIFICATE = 'UDYAM_CERTIFICATE',
  OTHER = 'OTHER',
}

export interface SchemeQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  department?: string;
  state?: string;
  schemeType?: SchemeType;
  minAge?: number;
  maxAge?: number;
  income?: number;
  isNew?: boolean;
  status?: SchemeStatus;
  deadline?: string;
  language?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'deadline' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
