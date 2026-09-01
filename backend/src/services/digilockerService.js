// National DigiLocker API Integration Service

class DigiLockerService {
  constructor() {
    this.clientId = process.env.DIGILOCKER_CLIENT_ID || 'DEMO_DIGILOCKER_CLIENT_ID';
    this.clientSecret = process.env.DIGILOCKER_CLIENT_SECRET || 'DEMO_DIGILOCKER_CLIENT_SECRET';
    this.redirectUri = process.env.DIGILOCKER_REDIRECT_URI || 'http://localhost:5000/api/digilocker/callback';
    this.baseUrl = process.env.DIGILOCKER_API_BASE_URL || 'https://digilocker.meripehchaan.gov.in';
    this.isSandbox = process.env.DIGILOCKER_SANDBOX !== 'false';
  }

  getAuthorizationUrl(state = 'auth-state') {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state
    });

    const endpoint = this.isSandbox
      ? 'https://sandbox.digitallocker.gov.in/public/oauth2/1/authorize'
      : `${this.baseUrl}/public/oauth2/1/authorize`;

    return `${endpoint}?${params.toString()}`;
  }

  async exchangeCodeForToken(code) {
    if (this.isSandbox && code.startsWith('mock_')) {
      return {
        accessToken: `mock_access_token_${Date.now()}`,
        expiresIn: 3600,
        tokenType: 'Bearer',
        digilockerId: 'DL-998877665544'
      };
    }

    try {
      const tokenEndpoint = this.isSandbox
        ? 'https://sandbox.digitallocker.gov.in/public/oauth2/1/token'
        : `${this.baseUrl}/public/oauth2/1/token`;

      const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri
        }).toString()
      });

      return await response.json();
    } catch (error) {
      console.error('[DigiLocker] Token exchange error:', error.message);
      return { error: error.message };
    }
  }

  async fetchIssuedDocuments(accessToken) {
    if (this.isSandbox && accessToken.startsWith('mock_')) {
      // Return realistic verified simulated certificates for instant developer testing
      return {
        documents: [
          {
            docType: 'aadhaar',
            name: 'Aadhaar Card',
            docId: 'UIDAI-XXXX-XXXX-1234',
            issuer: 'Unique Identification Authority of India (UIDAI)',
            date: '2022-04-15',
            status: 'verified',
            uri: 'in.gov.uidai-ADHAR-123456789012'
          },
          {
            docType: 'pan',
            name: 'PAN Verification Record',
            docId: 'ABCDE1234F',
            issuer: 'Income Tax Department',
            date: '2021-08-10',
            status: 'verified',
            uri: 'in.gov.incometax-PANCR-ABCDE1234F'
          },
          {
            docType: 'income_cert',
            name: 'Income Certificate',
            docId: 'INC/2025/98765',
            issuer: 'Revenue Department / Tehsildar Office',
            date: '2025-01-20',
            status: 'verified',
            uri: 'in.gov.revenue-INCMC-98765'
          },
          {
            docType: 'caste_cert',
            name: 'Caste / Community Certificate',
            docId: 'CST/2024/44332',
            issuer: 'Sub-Divisional Magistrate (SDO)',
            date: '2024-03-12',
            status: 'verified',
            uri: 'in.gov.caste-CSTCR-44332'
          }
        ]
      };
    }

    try {
      const endpoint = `${this.baseUrl}/public/oauth2/1/files/issued`;
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('[DigiLocker] Fetch issued documents error:', error.message);
      return { error: error.message };
    }
  }
}

export const digilockerService = new DigiLockerService();
