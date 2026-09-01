import { InvalidSourceError, ValidationError } from '../utils/errors';

export class SchemeValidationService {
  /**
   * Validate official source URL security rules (Section 25)
   */
  public static validateSourceUrl(url?: string | null): boolean {
    if (!url) return true;

    // Reject non-HTTPS or unsafe schemes
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') {
        throw new InvalidSourceError('Source URL must use HTTPS protocol');
      }

      const lower = url.toLowerCase();
      if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('file:')) {
        throw new InvalidSourceError('Insecure URL scheme rejected');
      }
      return true;
    } catch (err: any) {
      if (err instanceof InvalidSourceError) throw err;
      throw new InvalidSourceError('Malformed source URL provided');
    }
  }

  /**
   * Check if domain is an official government domain (.gov.in or .nic.in)
   */
  public static isOfficialGovernmentDomain(url?: string | null): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      return hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in');
    } catch {
      return false;
    }
  }

  /**
   * Validate age and income range logic
   */
  public static validateRanges(minAge?: number | null, maxAge?: number | null, minIncome?: number | null, maxIncome?: number | null) {
    if (minAge !== undefined && minAge !== null && maxAge !== undefined && maxAge !== null) {
      if (minAge > maxAge) {
        throw new ValidationError('Minimum age cannot be greater than maximum age');
      }
    }
    if (minIncome !== undefined && minIncome !== null && maxIncome !== undefined && maxIncome !== null) {
      if (minIncome > maxIncome) {
        throw new ValidationError('Minimum income cannot be greater than maximum income');
      }
    }
  }
}
