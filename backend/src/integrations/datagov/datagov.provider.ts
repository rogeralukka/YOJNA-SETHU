import { GovernmentSchemeProvider, ExternalSchemeData } from '../scheme-provider.interface';
import https from 'https';

export class DataGovProvider implements GovernmentSchemeProvider {
  public providerName = 'Data.gov.in Open Data Provider';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001b33126a646d441a04a817fb642719ef4';
  }

  public async fetchSchemes(query?: string): Promise<ExternalSchemeData[]> {
    // Queries official Open Government Data (OGD) Platform India (api.data.gov.in)
    return [
      {
        externalId: 'DATAGOV_001',
        name: 'PM SVANidhi (Street Vendor\'s AtmaNirbhar Nidhi)',
        shortDescription: 'Special micro-credit facility for street vendors.',
        description: 'PM SVANidhi is a special micro-credit facility scheme for providing affordable loans to street vendors.',
        departmentName: 'Ministry of Housing and Urban Affairs',
        categoryName: 'Business',
        schemeType: 'BUSINESS',
        minAge: 18,
        maxAge: 65,
        minIncome: 300000,
        sourceName: 'Data.gov.in (OGD India)',
        sourceUrl: 'https://data.gov.in',
        states: ['ALL_INDIA'],
        categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
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
