import { SchemeRepository } from '../repositories/scheme.repository';
import { SchemeNotFoundError } from '../utils/errors';

export class SchemeVersionService {
  /**
   * Get version history for a given scheme
   */
  public static async getSchemeVersions(schemeId: string) {
    const versions = await SchemeRepository.getVersionHistory(schemeId);
    if (!versions) {
      throw new SchemeNotFoundError(`Scheme with ID ${schemeId} not found`);
    }
    return versions;
  }
}
