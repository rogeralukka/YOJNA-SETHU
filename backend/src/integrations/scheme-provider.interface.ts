export interface ExternalSchemeData {
  externalId: string;
  name: string;
  shortDescription: string;
  description: string;
  departmentName: string;
  categoryName: string;
  schemeType: 'PERSONAL' | 'BUSINESS' | 'BOTH';
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maxIncome?: number;
  sourceName: string;
  sourceUrl: string;
  deadline?: string;
  states?: string[];
  categories?: string[];
}

export interface GovernmentSchemeProvider {
  providerName: string;
  fetchSchemes(query?: string): Promise<ExternalSchemeData[]>;
  fetchSchemeDetails(externalId: string): Promise<ExternalSchemeData | null>;
  validateScheme(data: ExternalSchemeData): boolean;
}
