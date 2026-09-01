import { GovernmentSchemeProvider, ExternalSchemeData } from '../scheme-provider.interface';

export class ApiSetuProvider implements GovernmentSchemeProvider {
  public providerName = 'ApiSetu Government Integration Provider';

  public async fetchSchemes(query?: string): Promise<ExternalSchemeData[]> {
    return [
      {
        externalId: 'APISETU_001',
        name: 'PM Awas Yojana (Urban)',
        shortDescription: 'Housing for All in Urban Areas.',
        description: 'PMAY-U addresses urban housing shortage among EWS/LIG and MIG categories.',
        departmentName: 'Ministry of Housing and Urban Affairs',
        categoryName: 'Housing',
        schemeType: 'PERSONAL',
        minAge: 21,
        maxAge: 70,
        maxIncome: 1800000,
        sourceName: 'API Setu Portal',
        sourceUrl: 'https://apisetu.gov.in',
        states: ['ALL_INDIA'],
        categories: ['EWS', 'GENERAL', 'OBC', 'SC', 'ST'],
      },
    ];
  }

  public async fetchSchemeDetails(externalId: string): Promise<ExternalSchemeData | null> {
    const list = await this.fetchSchemes();
    return list.find((s) => s.externalId === externalId) || null;
  }

  public validateScheme(data: ExternalSchemeData): boolean {
    return Boolean(data.name && data.sourceUrl && data.sourceUrl.startsWith('https://'));
  }
}
