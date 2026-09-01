import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('--- NEON CLOUD DATABASE VERIFICATION ---');

  const [schemes, departments, categories, states, docs, versions] = await Promise.all([
    prisma.scheme.findMany({
      include: {
        department: true,
        category: true,
        states: { include: { state: true } },
        eligibilityCategories: { include: { category: true } },
        documentRequirements: true,
        additionalFields: true,
        translations: true,
      },
    }),
    prisma.department.findMany(),
    prisma.schemeCategory.findMany(),
    prisma.state.findMany(),
    prisma.schemeDocumentRequirement.findMany(),
    prisma.schemeVersion.findMany(),
  ]);

  console.log(`Total Departments: ${departments.length}`);
  console.log(`Total Categories: ${categories.length}`);
  console.log(`Total States: ${states.length}`);
  console.log(`Total Schemes: ${schemes.length}`);
  console.log(`Total Document Requirements: ${docs.length}`);
  console.log(`Total Version Snapshots: ${versions.length}\n`);

  schemes.forEach((s, idx) => {
    console.log(`[Scheme #${idx + 1}] ${s.schemeId} - ${s.name}`);
    console.log(`  Department: ${s.department.name}`);
    console.log(`  Category: ${s.category.name}`);
    console.log(`  Scheme Type: ${s.schemeType} (isBusinessScheme: ${s.isBusinessScheme})`);
    console.log(`  Status: ${s.status} | Verification: ${s.verificationStatus}`);
    console.log(`  Source: ${s.sourceName} (${s.sourceUrl})`);
    console.log(`  Age Range: ${s.minAge ?? 'N/A'} to ${s.maxAge ?? 'N/A'} years`);
    console.log(`  Income Limit: Max ₹${s.maxIncome ? s.maxIncome.toLocaleString() : 'No Limit'}`);
    console.log(`  Applicable States: ${s.states.map((st) => st.state.code).join(', ')}`);
    console.log(`  Social Categories: ${s.eligibilityCategories.map((ec) => ec.category.code).join(', ')}`);
    console.log(`  Required Documents (${s.documentRequirements.length}): ${s.documentRequirements.map((d) => d.documentName).join(', ')}`);
    console.log(`  Additional Fields (${s.additionalFields.length}): ${s.additionalFields.map((f) => f.label).join(', ')}`);
    console.log(`  Translations (${s.translations.length}): ${s.translations.map((t) => t.languageCode.toUpperCase()).join(', ')}`);
    console.log('----------------------------------------------------');
  });
}

checkDatabase()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
