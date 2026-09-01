import { GovernmentSchemeProvider, ExternalSchemeData } from '../scheme-provider.interface';

export class MySchemeProvider implements GovernmentSchemeProvider {
  public providerName = 'MyScheme.gov.in Provider';

  public async fetchSchemes(query?: string): Promise<ExternalSchemeData[]> {
    // Staging / Demo payload simulating external provider responses safely without hardcoding secrets
    return [
      {
        externalId: 'MYSCHEME_001',
        name: 'Pradhan Mantri Mudra Yojana (PMMY)',
        shortDescription: 'Loans up to 10 lakh to non-corporate, non-farm small/micro enterprises.',
        description: 'PMMY is a scheme launched by Hon’ble PM to provide loans up to 10 lakh to non-corporate, non-farm micro enterprises.',
        departmentName: 'Ministry of Finance',
        categoryName: 'Business',
        schemeType: 'BUSINESS',
        minAge: 18,
        maxAge: 65,
        maxIncome: 1000000,
        sourceName: 'MyScheme Portal',
        sourceUrl: 'https://myscheme.gov.in/schemes/pmmy',
        states: ['ALL_INDIA'],
        categories: ['GENERAL', 'OBC', 'SC', 'ST', 'EWS'],
      },
    ];
  }

  public async fetchSchemeDetails(externalId: string): Promise<ExternalSchemeData | null> {
    const schemes = await this.fetchSchemes();
    return schemes.find((s) => s.externalId === externalId) || null;
  }

  public validateScheme(data: ExternalSchemeData): boolean {
    return Boolean(data.name && data.sourceUrl && data.sourceUrl.startsWith('https://'));
  }
}
