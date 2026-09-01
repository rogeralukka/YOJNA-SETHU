import { GovernmentSchemeProvider, ExternalSchemeData } from '../integrations/scheme-provider.interface';
import { SchemeService } from './scheme.service';
import { PrismaClient, VerificationStatus } from '@prisma/client';
import { ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

export class SchemeImportService {
  /**
   * Import schemes safely from external providers (Section 39)
   */
  public static async importFromProvider(provider: GovernmentSchemeProvider, query?: string) {
    const rawItems = await provider.fetchSchemes(query);
    const results = {
      totalFetched: rawItems.length,
      importedCount: 0,
      skippedCount: 0,
      errors: [] as string[],
    };

    for (const item of rawItems) {
      try {
        if (!provider.validateScheme(item)) {
          results.skippedCount++;
          results.errors.push(`Validation failed for item: ${item.name}`);
          continue;
        }

        // Resolve or create department
        const deptSlug = item.departmentName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let dept = await prisma.department.findFirst({ where: { OR: [{ slug: deptSlug }, { name: item.departmentName }] } });
        if (!dept) {
          dept = await prisma.department.create({
            data: { name: item.departmentName, slug: deptSlug, ministry: item.departmentName },
          });
        }

        // Resolve or create category
        const catSlug = item.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let cat = await prisma.schemeCategory.findFirst({ where: { OR: [{ slug: catSlug }, { name: item.categoryName }] } });
        if (!cat) {
          cat = await prisma.schemeCategory.create({
            data: { name: item.categoryName, slug: catSlug, description: item.categoryName },
          });
        }

        // Create Scheme via SchemeService with UNVERIFIED status initially (Section 39 rule)
        await SchemeService.createScheme({
          name: item.name,
          shortDescription: item.shortDescription,
          description: item.description,
          departmentId: dept.id,
          categoryId: cat.id,
          schemeType: item.schemeType,
          minAge: item.minAge,
          maxAge: item.maxAge,
          minIncome: item.minIncome,
          maxIncome: item.maxIncome,
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          sourceIdentifier: item.externalId,
          verificationStatus: VerificationStatus.UNVERIFIED,
          states: item.states || ['ALL_INDIA'],
          categories: item.categories || ['GENERAL'],
        });

        results.importedCount++;
      } catch (err: any) {
        results.skippedCount++;
        results.errors.push(`Failed to import ${item.name}: ${err.message}`);
      }
    }

    return results;
  }
}
