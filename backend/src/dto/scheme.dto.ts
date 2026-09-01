export interface PublicSchemeDto {
  id: string;
  schemeId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  department: {
    id: string;
    name: string;
    slug: string;
    ministry?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  schemeType: string;
  isBusinessScheme: boolean;
  eligibility: {
    minAge?: number | null;
    maxAge?: number | null;
    minIncome?: number | null;
    maxIncome?: number | null;
    description?: string | null;
    states: string[];
    categories: string[];
    rules?: any;
  };
  deadline?: string | null;
  documentsRequired: Array<{
    id: string;
    documentType: string;
    documentName: string;
    description?: string | null;
    isMandatory: boolean;
    acceptedFormats?: any;
  }>;
  additionalFields: Array<{
    id: string;
    fieldKey: string;
    label: string;
    description?: string | null;
    fieldType: string;
    isRequired: boolean;
    validationRules?: any;
    options?: any;
    displayOrder: number;
  }>;
  translations?: Array<{
    languageCode: string;
    name: string;
    shortDescription: string;
    description: string;
    eligibilityDescription?: string | null;
  }>;
  source: {
    name?: string | null;
    url?: string | null;
    identifier?: string | null;
    lastVerifiedAt?: string | null;
    verificationStatus: string;
  };
  isNew: boolean;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function formatSchemeDto(scheme: any, requestedLanguage?: string): PublicSchemeDto {
  // If language requested (e.g. 'hi') and translation exists, localize name/description
  let name = scheme.name;
  let shortDescription = scheme.shortDescription;
  let description = scheme.description;
  let eligibilityDescription = scheme.eligibilityDescription;

  if (requestedLanguage && requestedLanguage !== 'en' && Array.isArray(scheme.translations)) {
    const translation = scheme.translations.find((t: any) => t.languageCode === requestedLanguage);
    if (translation) {
      name = translation.name || name;
      shortDescription = translation.shortDescription || shortDescription;
      description = translation.description || description;
      eligibilityDescription = translation.eligibilityDescription || eligibilityDescription;
    }
  }

  const states = Array.isArray(scheme.states)
    ? scheme.states.map((s: any) => s.state?.code || s.stateCode).filter(Boolean)
    : [];

  const categories = Array.isArray(scheme.eligibilityCategories)
    ? scheme.eligibilityCategories.map((c: any) => c.category?.code || c.categoryCode).filter(Boolean)
    : [];

  return {
    id: scheme.id,
    schemeId: scheme.schemeId,
    name,
    slug: scheme.slug,
    shortDescription,
    description,
    department: {
      id: scheme.department?.id || scheme.departmentId,
      name: scheme.department?.name || '',
      slug: scheme.department?.slug || '',
      ministry: scheme.department?.ministry || null,
    },
    category: {
      id: scheme.category?.id || scheme.categoryId,
      name: scheme.category?.name || '',
      slug: scheme.category?.slug || '',
    },
    schemeType: scheme.schemeType,
    isBusinessScheme: scheme.isBusinessScheme || scheme.schemeType === 'BUSINESS' || scheme.schemeType === 'BOTH',
    eligibility: {
      minAge: scheme.minAge,
      maxAge: scheme.maxAge,
      minIncome: scheme.minIncome,
      maxIncome: scheme.maxIncome,
      description: eligibilityDescription,
      states,
      categories,
      rules: scheme.rulesJson || null,
    },
    deadline: scheme.deadline ? new Date(scheme.deadline).toISOString() : null,
    documentsRequired: Array.isArray(scheme.documentRequirements)
      ? scheme.documentRequirements.map((d: any) => ({
          id: d.id,
          documentType: d.documentType,
          documentName: d.documentName,
          description: d.description || null,
          isMandatory: d.isMandatory,
          acceptedFormats: d.acceptedFormats || null,
        }))
      : [],
    additionalFields: Array.isArray(scheme.additionalFields)
      ? scheme.additionalFields.map((f: any) => ({
          id: f.id,
          fieldKey: f.fieldKey,
          label: f.label,
          description: f.description || null,
          fieldType: f.fieldType,
          isRequired: f.isRequired,
          validationRules: f.validationRules || null,
          options: f.options || null,
          displayOrder: f.displayOrder || 0,
        }))
      : [],
    translations: Array.isArray(scheme.translations)
      ? scheme.translations.map((t: any) => ({
          languageCode: t.languageCode,
          name: t.name,
          shortDescription: t.shortDescription,
          description: t.description,
          eligibilityDescription: t.eligibilityDescription || null,
        }))
      : [],
    source: {
      name: scheme.sourceName || null,
      url: scheme.sourceUrl || null,
      identifier: scheme.sourceIdentifier || null,
      lastVerifiedAt: scheme.lastVerifiedAt ? new Date(scheme.lastVerifiedAt).toISOString() : null,
      verificationStatus: scheme.verificationStatus || 'UNVERIFIED',
    },
    isNew: scheme.isNew,
    isActive: scheme.isActive,
    status: scheme.status,
    createdAt: new Date(scheme.createdAt).toISOString(),
    updatedAt: new Date(scheme.updatedAt).toISOString(),
  };
}
