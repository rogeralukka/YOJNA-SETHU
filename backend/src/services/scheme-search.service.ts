import { SchemeRepository } from '../repositories/scheme.repository';
import { SchemeQueryParams } from '../types/scheme.types';
import { formatSchemeDto } from '../dto/scheme.dto';

export class SchemeSearchService {
  /**
   * Dedicated search method utilizing parameterized database query logic
   */
  public static async searchSchemes(params: SchemeQueryParams) {
    const result = await SchemeRepository.findMany(params);
    const formattedData = result.schemes.map((scheme) => formatSchemeDto(scheme, params.language));
    return {
      schemes: formattedData,
      pagination: result.pagination,
    };
  }
}
