import { PrismaClient, SchemeStatus, VerificationStatus, SchemeType, Prisma } from '@prisma/client';
import { SchemeQueryParams } from '../types/scheme.types';

const prisma = new PrismaClient();

export class SchemeRepository {
  private static includeRelations = {
    department: true,
    category: true,
    states: {
      include: {
        state: true,
      },
    },
    eligibilityCategories: {
      include: {
        category: true,
      },
    },
    documentRequirements: true,
    additionalFields: {
      orderBy: {
        displayOrder: 'asc' as const,
      },
    },
    translations: true,
  };

  /**
   * Helper to generate human-readable schemeId (e.g. SCH_000001)
   */
  public static async generateNextSchemeId(): Promise<string> {
    const lastScheme = await prisma.scheme.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { schemeId: true },
    });

    if (!lastScheme || !lastScheme.schemeId.startsWith('SCH_')) {
      return 'SCH_000001';
    }

    const numPart = parseInt(lastScheme.schemeId.replace('SCH_', ''), 10);
    if (isNaN(numPart)) {
      return `SCH_${Date.now().toString().slice(-6)}`;
    }

    const nextNum = numPart + 1;
    return `SCH_${nextNum.toString().padStart(6, '0')}`;
  }

  /**
   * Find schemes with filters, search, pagination, and sorting
   */
  public static async findMany(params: SchemeQueryParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.SchemeWhereInput = {};

    // Default status filter for public API: only ACTIVE schemes unless explicitly specified
    if (params.status) {
      where.status = params.status;
    } else {
      where.status = SchemeStatus.ACTIVE;
    }

    if (params.isNew !== undefined) {
      where.isNew = params.isNew;
    }

    if (params.schemeType) {
      where.schemeType = params.schemeType;
    }

    // Category filter by slug or id
    if (params.category) {
      where.category = {
        OR: [
          { id: params.category },
          { slug: { equals: params.category, mode: 'insensitive' } },
          { name: { equals: params.category, mode: 'insensitive' } },
        ],
      };
    }

    // Department filter by slug or id
    if (params.department) {
      where.department = {
        OR: [
          { id: params.department },
          { slug: { equals: params.department, mode: 'insensitive' } },
          { name: { equals: params.department, mode: 'insensitive' } },
        ],
      };
    }

    // State filter by code or id or ALL_INDIA
    if (params.state) {
      where.states = {
        some: {
          state: {
            OR: [
              { code: { equals: params.state, mode: 'insensitive' } },
              { code: 'ALL_INDIA' },
              { id: params.state },
              { name: { equals: params.state, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    // Demographic Eligibility Filters
    if (params.minAge !== undefined) {
      where.OR = [
        { maxAge: null },
        { maxAge: { gte: params.minAge } },
      ];
    }

    if (params.maxAge !== undefined) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { minAge: null },
            { minAge: { lte: params.maxAge } },
          ],
        },
      ];
    }

    if (params.income !== undefined) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { maxIncome: null },
            { maxIncome: { gte: params.income } },
          ],
        },
      ];
    }

    // Deadline filter (non-expired)
    if (params.deadline === 'active') {
      where.OR = [
        { deadline: null },
        { deadline: { gte: new Date() } },
      ];
    }

    // Text Search across name, shortDescription, description, category, department
    if (params.q) {
      const searchStr = params.q.trim();
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { name: { contains: searchStr, mode: 'insensitive' } },
            { shortDescription: { contains: searchStr, mode: 'insensitive' } },
            { description: { contains: searchStr, mode: 'insensitive' } },
            { category: { name: { contains: searchStr, mode: 'insensitive' } } },
            { department: { name: { contains: searchStr, mode: 'insensitive' } } },
          ],
        },
      ];
    }

    // Whitelisted Sort Fields
    const allowedSortFields = ['createdAt', 'updatedAt', 'deadline', 'name'];
    const sortBy = allowedSortFields.includes(params.sortBy || '') ? params.sortBy! : 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

    const [schemes, total] = await Promise.all([
      prisma.scheme.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: this.includeRelations,
      }),
      prisma.scheme.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      schemes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Find scheme by human-readable schemeId or internal UUID
   */
  public static async findByIdOrSchemeId(idOrSchemeId: string) {
    return prisma.scheme.findFirst({
      where: {
        OR: [
          { schemeId: idOrSchemeId },
          { id: idOrSchemeId },
          { slug: idOrSchemeId },
        ],
      },
      include: this.includeRelations,
    });
  }

  /**
   * Create new scheme with nested relations
   */
  public static async create(data: any) {
    const schemeId = data.schemeId || (await this.generateNextSchemeId());
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const isBusinessScheme = data.schemeType === SchemeType.BUSINESS || data.schemeType === SchemeType.BOTH;

    // Resolve States
    const stateRecords = await prisma.state.findMany({
      where: {
        OR: [
          { code: { in: data.states } },
          { id: { in: data.states } },
        ],
      },
    });

    // Resolve Eligibility Categories
    const categoryRecords = await prisma.eligibilityCategory.findMany({
      where: {
        OR: [
          { code: { in: data.categories } },
          { id: { in: data.categories } },
        ],
      },
    });

    const newScheme = await prisma.scheme.create({
      data: {
        schemeId,
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        departmentId: data.departmentId,
        categoryId: data.categoryId,
        schemeType: data.schemeType || SchemeType.PERSONAL,
        isBusinessScheme,
        eligibilityDescription: data.eligibilityDescription || null,
        minAge: data.minAge !== undefined ? data.minAge : null,
        maxAge: data.maxAge !== undefined ? data.maxAge : null,
        minIncome: data.minIncome !== undefined ? data.minIncome : null,
        maxIncome: data.maxIncome !== undefined ? data.maxIncome : null,
        rulesJson: data.rulesJson || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isNew: true,
        status: data.status || SchemeStatus.ACTIVE,
        sourceName: data.sourceName || null,
        sourceUrl: data.sourceUrl || null,
        sourceIdentifier: data.sourceIdentifier || null,
        verificationStatus: data.verificationStatus || VerificationStatus.UNVERIFIED,
        lastVerifiedAt: data.verificationStatus === VerificationStatus.VERIFIED ? new Date() : null,
        states: {
          create: stateRecords.map((st) => ({ stateId: st.id })),
        },
        eligibilityCategories: {
          create: categoryRecords.map((cat) => ({ categoryId: cat.id })),
        },
        documentRequirements: data.documents
          ? {
              create: data.documents.map((doc: any) => ({
                documentType: doc.documentType,
                documentName: doc.documentName,
                description: doc.description || null,
                isMandatory: doc.isMandatory !== undefined ? doc.isMandatory : true,
                acceptedFormats: doc.acceptedFormats || null,
              })),
            }
          : undefined,
        additionalFields: data.additionalFields
          ? {
              create: data.additionalFields.map((f: any) => ({
                fieldKey: f.fieldKey,
                label: f.label,
                description: f.description || null,
                fieldType: f.fieldType,
                isRequired: f.isRequired || false,
                validationRules: f.validationRules || null,
                options: f.options || null,
                displayOrder: f.displayOrder || 0,
              })),
            }
          : undefined,
        translations: data.translations
          ? {
              create: data.translations.map((t: any) => ({
                languageCode: t.languageCode,
                name: t.name,
                shortDescription: t.shortDescription,
                description: t.description,
                eligibilityDescription: t.eligibilityDescription || null,
              })),
            }
          : undefined,
      },
      include: this.includeRelations,
    });

    // Create Version Snapshot (Version 1)
    await prisma.schemeVersion.create({
      data: {
        schemeId: newScheme.id,
        versionNumber: 1,
        snapshot: newScheme as any,
        changedBy: data.actorUserId || 'ADMIN',
        changeReason: 'Initial Scheme Creation',
      },
    });

    return newScheme;
  }

  /**
   * Update scheme with audit snapshot (Version N+1)
   */
  public static async update(idOrSchemeId: string, data: any, actorUserId?: string) {
    const existing = await this.findByIdOrSchemeId(idOrSchemeId);
    if (!existing) return null;

    const nextVersionNumber = existing.versionNumber + 1;
    const isBusinessScheme = data.schemeType
      ? (data.schemeType === SchemeType.BUSINESS || data.schemeType === SchemeType.BOTH)
      : existing.isBusinessScheme;

    // Build update data
    const updatePayload: Prisma.SchemeUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.shortDescription && { shortDescription: data.shortDescription }),
      ...(data.description && { description: data.description }),
      ...(data.departmentId && { department: { connect: { id: data.departmentId } } }),
      ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
      ...(data.schemeType && { schemeType: data.schemeType, isBusinessScheme }),
      ...(data.eligibilityDescription !== undefined && { eligibilityDescription: data.eligibilityDescription }),
      ...(data.minAge !== undefined && { minAge: data.minAge }),
      ...(data.maxAge !== undefined && { maxAge: data.maxAge }),
      ...(data.minIncome !== undefined && { minIncome: data.minIncome }),
      ...(data.maxIncome !== undefined && { maxIncome: data.maxIncome }),
      ...(data.rulesJson !== undefined && { rulesJson: data.rulesJson }),
      ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
      ...(data.status && { status: data.status }),
      ...(data.sourceName !== undefined && { sourceName: data.sourceName }),
      ...(data.sourceUrl !== undefined && { sourceUrl: data.sourceUrl }),
      ...(data.sourceIdentifier !== undefined && { sourceIdentifier: data.sourceIdentifier }),
      ...(data.verificationStatus && {
        verificationStatus: data.verificationStatus,
        lastVerifiedAt: data.verificationStatus === VerificationStatus.VERIFIED ? new Date() : existing.lastVerifiedAt,
      }),
      versionNumber: nextVersionNumber,
    };

    // Replace States if passed
    if (data.states && Array.isArray(data.states)) {
      const stateRecords = await prisma.state.findMany({
        where: { OR: [{ code: { in: data.states } }, { id: { in: data.states } }] },
      });
      await prisma.schemeState.deleteMany({ where: { schemeId: existing.id } });
      await prisma.schemeState.createMany({
        data: stateRecords.map((st) => ({ schemeId: existing.id, stateId: st.id })),
      });
    }

    // Replace Category Eligibility if passed
    if (data.categories && Array.isArray(data.categories)) {
      const categoryRecords = await prisma.eligibilityCategory.findMany({
        where: { OR: [{ code: { in: data.categories } }, { id: { in: data.categories } }] },
      });
      await prisma.schemeCategoryEligibility.deleteMany({ where: { schemeId: existing.id } });
      await prisma.schemeCategoryEligibility.createMany({
        data: categoryRecords.map((cat) => ({ schemeId: existing.id, categoryId: cat.id })),
      });
    }

    // Replace Document Requirements if passed
    if (data.documents && Array.isArray(data.documents)) {
      await prisma.schemeDocumentRequirement.deleteMany({ where: { schemeId: existing.id } });
      for (const doc of data.documents) {
        await prisma.schemeDocumentRequirement.create({
          data: {
            schemeId: existing.id,
            documentType: doc.documentType,
            documentName: doc.documentName,
            description: doc.description || null,
            isMandatory: doc.isMandatory !== undefined ? doc.isMandatory : true,
            acceptedFormats: doc.acceptedFormats || null,
          },
        });
      }
    }

    // Replace Additional Fields if passed
    if (data.additionalFields && Array.isArray(data.additionalFields)) {
      await prisma.schemeAdditionalField.deleteMany({ where: { schemeId: existing.id } });
      for (const field of data.additionalFields) {
        await prisma.schemeAdditionalField.create({
          data: {
            schemeId: existing.id,
            fieldKey: field.fieldKey,
            label: field.label,
            description: field.description || null,
            fieldType: field.fieldType,
            isRequired: field.isRequired || false,
            validationRules: field.validationRules || null,
            options: field.options || null,
            displayOrder: field.displayOrder || 0,
          },
        });
      }
    }

    // Replace Translations if passed
    if (data.translations && Array.isArray(data.translations)) {
      await prisma.schemeTranslation.deleteMany({ where: { schemeId: existing.id } });
      for (const tr of data.translations) {
        await prisma.schemeTranslation.create({
          data: {
            schemeId: existing.id,
            languageCode: tr.languageCode,
            name: tr.name,
            shortDescription: tr.shortDescription,
            description: tr.description,
            eligibilityDescription: tr.eligibilityDescription || null,
          },
        });
      }
    }

    const updatedScheme = await prisma.scheme.update({
      where: { id: existing.id },
      data: updatePayload,
      include: this.includeRelations,
    });

    // Save Version Snapshot
    await prisma.schemeVersion.create({
      data: {
        schemeId: updatedScheme.id,
        versionNumber: nextVersionNumber,
        snapshot: updatedScheme as any,
        changedBy: actorUserId || 'ADMIN',
        changeReason: data.changeReason || `Updated to version ${nextVersionNumber}`,
      },
    });

    return updatedScheme;
  }

  /**
   * Soft Delete Scheme (sets status to ARCHIVED and isActive to false)
   */
  public static async softDelete(idOrSchemeId: string, actorUserId?: string) {
    const existing = await this.findByIdOrSchemeId(idOrSchemeId);
    if (!existing) return null;

    const archived = await prisma.scheme.update({
      where: { id: existing.id },
      data: {
        status: SchemeStatus.ARCHIVED,
        isActive: false,
        verificationStatus: VerificationStatus.ARCHIVED,
      },
      include: this.includeRelations,
    });

    // Audit snapshot for archiving
    await prisma.schemeVersion.create({
      data: {
        schemeId: archived.id,
        versionNumber: archived.versionNumber + 1,
        snapshot: archived as any,
        changedBy: actorUserId || 'ADMIN',
        changeReason: 'Scheme Soft Deleted / Archived',
      },
    });

    return archived;
  }

  /**
   * Publish Scheme (sets status to ACTIVE and isActive to true)
   */
  public static async publish(idOrSchemeId: string, actorUserId?: string) {
    const existing = await this.findByIdOrSchemeId(idOrSchemeId);
    if (!existing) return null;

    return prisma.scheme.update({
      where: { id: existing.id },
      data: {
        status: SchemeStatus.ACTIVE,
        isActive: true,
      },
      include: this.includeRelations,
    });
  }

  /**
   * Verify Scheme official source metadata
   */
  public static async verify(idOrSchemeId: string, verificationStatus: VerificationStatus = VerificationStatus.VERIFIED, actorUserId?: string) {
    const existing = await this.findByIdOrSchemeId(idOrSchemeId);
    if (!existing) return null;

    return prisma.scheme.update({
      where: { id: existing.id },
      data: {
        verificationStatus,
        lastVerifiedAt: new Date(),
      },
      include: this.includeRelations,
    });
  }

  /**
   * Get version history for a scheme
   */
  public static async getVersionHistory(idOrSchemeId: string) {
    const existing = await this.findByIdOrSchemeId(idOrSchemeId);
    if (!existing) return null;

    return prisma.schemeVersion.findMany({
      where: { schemeId: existing.id },
      orderBy: { versionNumber: 'desc' },
    });
  }
}
