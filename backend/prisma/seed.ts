import { PrismaClient, SchemeType, SchemeStatus, VerificationStatus, DocumentType, FieldType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Comprehensive Government Scheme Database into Neon PostgreSQL...');

  // 1. Seed Departments
  const departmentsData = [
    {
      name: 'Ministry of Agriculture & Farmers Welfare',
      slug: 'ministry-of-agriculture-and-farmers-welfare',
      description: 'Department responsible for formulation and administration of rules, regulations, and laws relating to agriculture in India.',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      officialUrl: 'https://agricoop.nic.in',
    },
    {
      name: 'Ministry of Education',
      slug: 'ministry-of-education',
      description: 'Department responsible for national policy on education and ensuring access to quality education.',
      ministry: 'Ministry of Education',
      officialUrl: 'https://www.education.gov.in',
    },
    {
      name: 'Ministry of Finance',
      slug: 'ministry-of-finance',
      description: 'Ministry concerned with the economy of India, serving as the Indian Treasury Department.',
      ministry: 'Ministry of Finance',
      officialUrl: 'https://finmin.nic.in',
    },
    {
      name: 'Ministry of Micro, Small and Medium Enterprises',
      slug: 'ministry-of-msme',
      description: 'Executive ministry responsible for the formulation and administration of rules for MSMEs.',
      ministry: 'Ministry of Micro, Small and Medium Enterprises',
      officialUrl: 'https://msme.gov.in',
    },
    {
      name: 'Ministry of Skill Development and Entrepreneurship',
      slug: 'ministry-of-skill-development',
      description: 'Ministry responsible for vocational training and skill development across India.',
      ministry: 'Ministry of Skill Development and Entrepreneurship',
      officialUrl: 'https://www.msde.gov.in',
    },
    {
      name: 'Ministry of Social Justice and Empowerment',
      slug: 'ministry-of-social-justice',
      description: 'Ministry responsible for welfare, social justice, and empowerment of disadvantaged sections of society.',
      ministry: 'Ministry of Social Justice and Empowerment',
      officialUrl: 'https://socialjustice.gov.in',
    },
    {
      name: 'Ministry of Health and Family Welfare',
      slug: 'ministry-of-health',
      description: 'Government ministry charged with health policy and family planning in India.',
      ministry: 'Ministry of Health and Family Welfare',
      officialUrl: 'https://mohfw.gov.in',
    },
    {
      name: 'Ministry of Housing and Urban Affairs',
      slug: 'ministry-of-housing-urban-affairs',
      description: 'Ministry formulating housing policy and urban infrastructure development schemes.',
      ministry: 'Ministry of Housing and Urban Affairs',
      officialUrl: 'https://mohua.gov.in',
    },
    {
      name: 'Ministry of Women and Child Development',
      slug: 'ministry-of-women-child-development',
      description: 'Ministry for formulation and administration of rules relating to women and child development.',
      ministry: 'Ministry of Women and Child Development',
      officialUrl: 'https://wcd.nic.in',
    },
  ];

  const departmentsMap: Record<string, string> = {};
  for (const dept of departmentsData) {
    const record = await prisma.department.upsert({
      where: { slug: dept.slug },
      update: dept,
      create: dept,
    });
    departmentsMap[dept.slug] = record.id;
  }

  // 2. Seed Scheme Categories
  const categoriesData = [
    { name: 'Agriculture', slug: 'agriculture', description: 'Farming, crop insurance, and agricultural credit schemes' },
    { name: 'Education', slug: 'education', description: 'Scholarships, student loans, and academic grants' },
    { name: 'Business', slug: 'business', description: 'MSME loans, startup grants, and industrial subsidies' },
    { name: 'Employment', slug: 'employment', description: 'Wage employment, self-employment, and job creation' },
    { name: 'Women & Child Development', slug: 'women-child-development', description: 'Maternal welfare, child care, and women empowerment' },
    { name: 'Healthcare', slug: 'healthcare', description: 'Medical insurance, health coverage, and hospital subsidies' },
    { name: 'Housing', slug: 'housing', description: 'Affordable housing subsidies and rural housing' },
    { name: 'Social Welfare', slug: 'social-welfare', description: 'Pensions, disability support, and social safety nets' },
    { name: 'Finance', slug: 'finance', description: 'Micro-finance, credit access, and insurance' },
    { name: 'Skill Development', slug: 'skill-development', description: 'Vocational training and skill certification programs' },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const record = await prisma.schemeCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoriesMap[cat.slug] = record.id;
  }

  // 3. Seed States
  const statesData = [
    { name: 'All India', code: 'ALL_INDIA' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'West Bengal', code: 'WB' },
    { name: 'Kerala', code: 'KL' },
  ];

  const statesMap: Record<string, string> = {};
  for (const st of statesData) {
    const record = await prisma.state.upsert({
      where: { code: st.code },
      update: st,
      create: st,
    });
    statesMap[st.code] = record.id;
  }

  // 4. Seed Eligibility Categories
  const eligibilityCategoriesData = [
    { code: 'GENERAL', name: 'General Category', description: 'Open to general category citizens' },
    { code: 'SC', name: 'Scheduled Castes', description: 'For Scheduled Castes applicants' },
    { code: 'ST', name: 'Scheduled Tribes', description: 'For Scheduled Tribes applicants' },
    { code: 'OBC', name: 'Other Backward Classes', description: 'For Other Backward Classes applicants' },
    { code: 'EWS', name: 'Economically Weaker Sections', description: 'For Economically Weaker Sections applicants' },
    { code: 'OTHER', name: 'Other Special Categories', description: 'Special sub-categories' },
  ];

  const eligibilityMap: Record<string, string> = {};
  for (const ec of eligibilityCategoriesData) {
    const record = await prisma.eligibilityCategory.upsert({
      where: { code: ec.code },
      update: ec,
      create: ec,
    });
    eligibilityMap[ec.code] = record.id;
  }

  // 5. Seed Real Indian Government Schemes
  const demoSchemes = [
    {
      schemeId: 'SCH_000001',
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      slug: 'pm-kisan-samman-nidhi',
      shortDescription: 'Income support of Rs. 6000 per year for all landholding farmer families across India.',
      description: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from Government of India. Under the scheme an income support of 6000/- per year in three equal installments is provided to all landholding farmer families.',
      departmentId: departmentsMap['ministry-of-agriculture-and-farmers-welfare'],
      categoryId: categoriesMap['agriculture'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'Small and marginal landholding farmer families having cultivable landholding up to 2 hectares.',
      minAge: 18,
      maxAge: 75,
      minIncome: 0,
      maxIncome: 250000,
      rulesJson: {
        occupation: ['FARMER'],
        farmerStatus: 'LANDOWNER',
        customConditions: ['Applicant must own cultivable agricultural land.'],
      },
      deadline: new Date('2026-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'Official PM-KISAN Portal',
      sourceUrl: 'https://pmkisan.gov.in',
      sourceIdentifier: 'GOI-AGRI-PMKISAN-2026',
      lastVerifiedAt: new Date('2026-08-30T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', description: 'Mandatory Aadhaar card linked with mobile number.', isMandatory: true, acceptedFormats: ['pdf', 'jpg', 'png'] },
        { documentType: DocumentType.LAND_DOCUMENT, documentName: 'Land Holding Ownership Proof', description: '7/12 extract or land passbook copy.', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BANK_ACCOUNT, documentName: 'Bank Passbook Copy', description: 'Bank account details for Direct Benefit Transfer (DBT).', isMandatory: true, acceptedFormats: ['pdf', 'jpg'] },
      ],
      additionalFields: [
        { fieldKey: 'land_area_acres', label: 'Total Land Area (in Acres)', description: 'Enter total agricultural land holding in acres.', fieldType: FieldType.NUMBER, isRequired: true, validationRules: { min: 0.1, max: 5.0 }, displayOrder: 1 },
        { fieldKey: 'khasra_number', label: 'Khasra / Survey Number', description: 'Land survey number recorded in revenue records.', fieldType: FieldType.TEXT, isRequired: true, displayOrder: 2 },
      ],
      translations: [
        { languageCode: 'en', name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)', shortDescription: 'Income support of Rs. 6000 per year for farmer families.', description: 'Pradhan Mantri Kisan Samman Nidhi provides financial support to landholding farmers across India.' },
        { languageCode: 'hi', name: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)', shortDescription: 'किसान परिवारों के लिए प्रति वर्ष 6000 रुपये की आय सहायता।', description: 'प्रधानमंत्री किसान सम्मान निधि योजना के तहत पात्र किसान परिवारों को 6000 रुपये प्रति वर्ष की वित्तीय सहायता दी जाती है।' },
      ],
    },
    {
      schemeId: 'SCH_000002',
      name: 'Prime Minister Employment Generation Programme (PMEGP)',
      slug: 'pmegp-employment-generation-programme',
      shortDescription: 'Credit-linked subsidy scheme for setting up new micro-enterprises in non-farm sector.',
      description: 'PMEGP is a credit-linked subsidy scheme administered by the Ministry of MSME to generate self-employment opportunities through establishment of micro-enterprises in rural and urban areas.',
      departmentId: departmentsMap['ministry-of-msme'],
      categoryId: categoriesMap['business'],
      schemeType: SchemeType.BUSINESS,
      isBusinessScheme: true,
      eligibilityDescription: 'Individuals above 18 years of age. For projects above Rs. 10 lakh in manufacturing, applicant must be 8th pass.',
      minAge: 18,
      maxAge: 65,
      minIncome: 0,
      maxIncome: 1000000,
      rulesJson: {
        businessType: ['PROPRIETORSHIP', 'PARTNERSHIP'],
        customConditions: ['Only new micro-enterprise projects are eligible.'],
      },
      deadline: new Date('2026-11-30T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'MSME Official PMEGP Portal',
      sourceUrl: 'https://www.kviconline.gov.in',
      sourceIdentifier: 'GOI-MSME-PMEGP-2026',
      lastVerifiedAt: new Date('2026-08-28T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.PAN, documentName: 'PAN Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BUSINESS_REGISTRATION, documentName: 'Detailed Project Report (DPR)', description: 'Project cost breakdown and financial projections.', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.UDYAM_CERTIFICATE, documentName: 'Udyam Registration Certificate', isMandatory: false, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'project_cost_inr', label: 'Proposed Project Cost (INR)', description: 'Total estimated cost for project setup.', fieldType: FieldType.NUMBER, isRequired: true, validationRules: { min: 50000, max: 5000000 }, displayOrder: 1 },
        { fieldKey: 'industry_sector', label: 'Industry Sector', description: 'Manufacturing, Service, or Trading sector.', fieldType: FieldType.SELECT, options: ['Manufacturing', 'Service', 'Trading'], isRequired: true, displayOrder: 2 },
      ],
      translations: [
        { languageCode: 'en', name: 'Prime Minister Employment Generation Programme (PMEGP)', shortDescription: 'Credit-linked subsidy scheme for setting up micro-enterprises.', description: 'Financial subsidy for establishing new micro enterprises in rural and urban areas.' },
        { languageCode: 'hi', name: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)', shortDescription: 'सूक्ष्म उद्यमों की स्थापना के लिए क्रेडिट-लिंक्ड सब्सिडी योजना।', description: 'ग्रामीण और शहरी क्षेत्रों में नए सूक्ष्म उद्यमों की स्थापना के लिए वित्तीय सहायता प्रदान की जाती है।' },
      ],
    },
    {
      schemeId: 'SCH_000003',
      name: 'Post-Matric Scholarship Scheme for SC Students',
      slug: 'post-matric-scholarship-sc-students',
      shortDescription: 'Financial assistance to SC students studying at post-matriculation or post-secondary stage.',
      description: 'Centrally Sponsored Scheme providing financial assistance to Scheduled Caste students for pursuing post-secondary courses in recognized institutions.',
      departmentId: departmentsMap['ministry-of-social-justice'],
      categoryId: categoriesMap['education'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'SC category students with family income not exceeding Rs. 2.50 lakh per annum.',
      minAge: 15,
      maxAge: 35,
      minIncome: 0,
      maxIncome: 250000,
      rulesJson: {
        studentStatus: 'ENROLLED',
        socialCategory: ['SC'],
      },
      deadline: new Date('2026-10-15T23:59:59.000Z'),
      isActive: true,
      isNew: false,
      status: SchemeStatus.ACTIVE,
      sourceName: 'National Scholarship Portal',
      sourceUrl: 'https://scholarships.gov.in',
      sourceIdentifier: 'GOI-NSP-PMSC-2026',
      lastVerifiedAt: new Date('2026-08-25T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA', 'TN', 'MH', 'UP'],
      categories: ['SC'],
      documents: [
        { documentType: DocumentType.CASTE_CERTIFICATE, documentName: 'Caste Certificate (SC)', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.INCOME_CERTIFICATE, documentName: 'Annual Family Income Certificate', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BANK_ACCOUNT, documentName: 'Aadhaar-Seeded Bank Passbook', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'course_name', label: 'Current Course / Program', description: 'Name of degree or diploma course enrolled in.', fieldType: FieldType.TEXT, isRequired: true, displayOrder: 1 },
        { fieldKey: 'institution_name', label: 'Educational Institution Name', fieldType: FieldType.TEXT, isRequired: true, displayOrder: 2 },
      ],
      translations: [
        { languageCode: 'en', name: 'Post-Matric Scholarship Scheme for SC Students', shortDescription: 'Scholarship assistance for SC students pursuing post-secondary education.', description: 'Financial support covering tuition fee and maintenance allowance for SC students.' },
        { languageCode: 'hi', name: 'अनुसूचित जाति के छात्रों के लिए उत्तर-मैट्रिक छात्रवृत्ति योजना', shortDescription: 'उच्च शिक्षा प्राप्त करने वाले एससी छात्रों के लिए छात्रवृत्ति।', description: 'मैट्रिक के बाद की पढ़ाई करने वाले अनुसूचित जाति के छात्रों को वित्तीय सहायता दी जाती है।' },
      ],
    },
    {
      schemeId: 'SCH_000004',
      name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
      slug: 'ayushman-bharat-pm-jay',
      shortDescription: 'Free health insurance coverage up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization.',
      description: 'PM-JAY is the world’s largest health insurance scheme fully financed by the government. It offers a cover of Rs. 500,000 per family per year for secondary and tertiary care hospitalization across public and private empanelled hospitals in India.',
      departmentId: departmentsMap['ministry-of-health'],
      categoryId: categoriesMap['healthcare'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'Low income families listed in SECC 2011 database or holding valid ration cards under rural/urban poor categories.',
      minAge: 0,
      maxAge: 100,
      minIncome: 0,
      maxIncome: 180000,
      rulesJson: {
        customConditions: ['Family must be listed in SECC 2011 or possess BPL / Antyodaya Ration Card.'],
      },
      deadline: new Date('2028-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'National Health Authority (NHA)',
      sourceUrl: 'https://pmjay.gov.in',
      sourceIdentifier: 'GOI-HEALTH-PMJAY-2026',
      lastVerifiedAt: new Date('2026-08-30T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card / Ayushman Card', isMandatory: true, acceptedFormats: ['pdf', 'jpg'] },
        { documentType: DocumentType.OTHER, documentName: 'Ration Card / SECC Proof', isMandatory: true, acceptedFormats: ['pdf', 'jpg'] },
      ],
      additionalFields: [
        { fieldKey: 'ration_card_number', label: 'Ration Card / Family Id Number', fieldType: FieldType.TEXT, isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'Ayushman Bharat (PM-JAY)', shortDescription: 'Free health insurance cover of Rs. 5 Lakh per family/year.', description: 'Ayushman Bharat PM-JAY provides health cover up to 5 lakh rupees for poor and vulnerable families.' },
        { languageCode: 'hi', name: 'आयुष्मान भारत (पीएम-जेएवाई)', shortDescription: 'प्रति परिवार प्रति वर्ष 5 लाख रुपये का मुफ्त स्वास्थ्य बीमा।', description: 'आयुष्मान भारत योजना के तहत गरीब और वंचित परिवारों को अस्पताल में भर्ती के लिए 5 लाख रुपये तक का मुफ्त इलाज प्रदान किया जाता है।' },
      ],
    },
    {
      schemeId: 'SCH_000005',
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      slug: 'pradhan-mantri-mudra-yojana',
      shortDescription: 'Collateral-free business loans up to Rs. 10 Lakh for non-corporate, non-farm micro and small enterprises.',
      description: 'PMMY enables micro and small enterprises to access collateral-free business credit under three categories: Shishu (loans up to Rs 50,000), Kishore (loans Rs 50,000 to Rs 5 Lakh), and Tarun (loans Rs 5 Lakh to Rs 10 Lakh).',
      departmentId: departmentsMap['ministry-of-finance'],
      categoryId: categoriesMap['finance'],
      schemeType: SchemeType.BOTH,
      isBusinessScheme: true,
      eligibilityDescription: 'Non-farm micro enterprises in manufacturing, trading, services, or agriculture-allied sectors.',
      minAge: 18,
      maxAge: 65,
      minIncome: 0,
      maxIncome: 1200000,
      rulesJson: {
        businessType: ['PROPRIETORSHIP', 'PARTNERSHIP', 'RETAILER', 'ARTISAN'],
      },
      deadline: new Date('2028-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'Official MUDRA Portal',
      sourceUrl: 'https://www.mudra.org.in',
      sourceIdentifier: 'GOI-FIN-MUDRA-2026',
      lastVerifiedAt: new Date('2026-08-29T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.PAN, documentName: 'PAN Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BUSINESS_REGISTRATION, documentName: 'Business Registration / License Proof', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BANK_ACCOUNT, documentName: '6 Months Bank Account Statement', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'mudra_loan_category', label: 'Mudra Category (Shishu / Kishore / Tarun)', fieldType: FieldType.SELECT, options: ['Shishu (Up to 50k)', 'Kishore (50k to 5L)', 'Tarun (5L to 10L)'], isRequired: true, displayOrder: 1 },
        { fieldKey: 'requested_loan_amount', label: 'Requested Loan Amount (INR)', fieldType: FieldType.NUMBER, isRequired: true, displayOrder: 2 },
      ],
      translations: [
        { languageCode: 'en', name: 'Pradhan Mantri Mudra Yojana (PMMY)', shortDescription: 'Collateral-free business loans up to Rs. 10 Lakh.', description: 'Pradhan Mantri Mudra Yojana provides easy business credit to micro enterprises without collateral.' },
        { languageCode: 'hi', name: 'प्रधानमंत्री मुद्रा योजना (PMMY)', shortDescription: 'बिना गारंटी 10 लाख रुपये तक का व्यापारिक ऋण।', description: 'मुद्रा योजना के माध्यम से छोटे व्यापारियों और सूक्ष्म उद्योगों को बिना किसी गारंटी के 10 लाख रुपये तक का लोन दिया जाता है।' },
      ],
    },
    {
      schemeId: 'SCH_000006',
      name: 'Pradhan Mantri Awas Yojana (PMAY-Urban & Gramin)',
      slug: 'pradhan-mantri-awas-yojana',
      shortDescription: 'Financial interest subsidy and direct grant support for constructing or purchasing pucca houses.',
      description: 'PMAY aims to achieve Housing for All by providing central interest subsidies and financial grants to eligible urban and rural families belonging to EWS, LIG, and MIG categories for home construction or renovation.',
      departmentId: departmentsMap['ministry-of-housing-urban-affairs'],
      categoryId: categoriesMap['housing'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'Beneficiary family must not own a pucca house in any part of India in their name or family members names.',
      minAge: 21,
      maxAge: 70,
      minIncome: 0,
      maxIncome: 600000,
      rulesJson: {
        customConditions: ['Beneficiary family must not own a pucca house anywhere in India.'],
      },
      deadline: new Date('2027-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: false,
      status: SchemeStatus.ACTIVE,
      sourceName: 'PMAY Official Portal',
      sourceUrl: 'https://pmaymis.gov.in',
      sourceIdentifier: 'GOI-HOUSING-PMAY-2026',
      lastVerifiedAt: new Date('2026-08-27T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card of all family members', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.INCOME_CERTIFICATE, documentName: 'Income Certificate', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.LAND_DOCUMENT, documentName: 'Land / House Ownership Document (if applicable)', isMandatory: false, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'annual_family_income', label: 'Annual Household Income (INR)', fieldType: FieldType.NUMBER, isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'Pradhan Mantri Awas Yojana (PMAY)', shortDescription: 'Housing grant and interest subsidy for building pucca houses.', description: 'PMAY scheme offers financial support and home loan interest subsidies to housing-deprived families.' },
        { languageCode: 'hi', name: 'प्रधानमंत्री आवास योजना (PMAY)', shortDescription: 'पक्का मकान बनाने के लिए वित्तीय सहायता और सब्सिडी।', description: 'प्रधानमंत्री आवास योजना के अंतर्गत बेघर और कच्चे मकानों में रहने वाले परिवारों को पक्का मकान बनाने के लिए आर्थिक मदद दी जाती है।' },
      ],
    },
    {
      schemeId: 'SCH_000007',
      name: 'PM Vishwakarma Scheme',
      slug: 'pm-vishwakarma-scheme',
      shortDescription: 'Skill training, Rs. 15000 toolkit incentive, and collateral-free credit up to Rs. 3 Lakh for traditional artisans and craftspeople.',
      description: 'PM Vishwakarma provides end-to-end holistic support to traditional artisans and craftspeople engaged in 18 traditional trades including carpenters, blacksmiths, goldsmiths, potters, cobblers, and weavers.',
      departmentId: departmentsMap['ministry-of-msme'],
      categoryId: categoriesMap['skill-development'],
      schemeType: SchemeType.BOTH,
      isBusinessScheme: true,
      eligibilityDescription: 'Artisans or craftspeople working with hands and tools in one of the 18 family-based traditional trades.',
      minAge: 18,
      maxAge: 70,
      minIncome: 0,
      maxIncome: 500000,
      rulesJson: {
        occupation: ['ARTISAN', 'CRAFTSPERSON'],
        tradesSupported: ['CARPENTER', 'BLACKSMITH', 'POTTER', 'COBBLER', 'WEAVER', 'TAILOR'],
      },
      deadline: new Date('2028-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'PM Vishwakarma Portal',
      sourceUrl: 'https://pmvishwakarma.gov.in',
      sourceIdentifier: 'GOI-MSME-VISHWAKARMA-2026',
      lastVerifiedAt: new Date('2026-08-30T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card (Mobile Linked)', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BANK_ACCOUNT, documentName: 'Bank Account Details', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'traditional_trade_name', label: 'Traditional Trade / Craft Name', fieldType: FieldType.SELECT, options: ['Carpenter (Suthar)', 'Blacksmith (Lohar)', 'Potter (Kumhaar)', 'Goldsmith (Sonar)', 'Tailor (Darzi)', 'Cobbler (Charmakar)'], isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'PM Vishwakarma Scheme', shortDescription: 'Toolkit incentive of Rs 15000 and credit support for traditional artisans.', description: 'PM Vishwakarma supports traditional artisans with skill training, modern toolkits, and low-interest credit.' },
        { languageCode: 'hi', name: 'पीएम विश्वकर्मा योजना', shortDescription: 'पारंपरिक कारीगरों के लिए 15000 रुपये टूलकिट और 3 लाख तक का लोन।', description: 'विश्वकर्मा योजना के तहत 18 पारंपरिक शिल्पकलाओं से जुड़े कारीगरों को मुफ्त प्रशिक्षण, टूलकिट और रियायती ब्याज पर लोन दिया जाता है।' },
      ],
    },
    {
      schemeId: 'SCH_000008',
      name: 'Sukanya Samriddhi Yojana (SSY)',
      slug: 'sukanya-samriddhi-yojana',
      shortDescription: 'High-interest tax-free small savings account for girl children under 10 years of age.',
      description: 'Sukanya Samriddhi Account is a government-backed small savings scheme designed for the education and marriage expenses of girl children with high interest rate and Section 80C tax benefits.',
      departmentId: departmentsMap['ministry-of-finance'],
      categoryId: categoriesMap['women-child-development'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'Girl child up to 10 years of age. Maximum two accounts per family (or three in case of twins).',
      minAge: 0,
      maxAge: 10,
      minIncome: 0,
      maxIncome: 10000000,
      rulesJson: {
        gender: ['FEMALE'],
      },
      deadline: new Date('2030-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: false,
      status: SchemeStatus.ACTIVE,
      sourceName: 'India Post Savings Portal',
      sourceUrl: 'https://www.indiapost.gov.in',
      sourceIdentifier: 'GOI-FIN-SSY-2026',
      lastVerifiedAt: new Date('2026-08-26T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.OTHER, documentName: 'Birth Certificate of Girl Child', isMandatory: true, acceptedFormats: ['pdf', 'jpg'] },
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar / ID Proof of Parent/Guardian', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'girl_child_age', label: 'Age of Girl Child (Years)', fieldType: FieldType.NUMBER, isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'Sukanya Samriddhi Yojana (SSY)', shortDescription: 'Tax-free small savings scheme for girl child education.', description: 'Sukanya Samriddhi Yojana provides high interest savings account for secure future of girl child.' },
        { languageCode: 'hi', name: 'सुकन्या समृद्धि योजना (SSY)', shortDescription: 'बालिकाओं के लिए उच्च ब्याज वाली छोटी बचत योजना।', description: 'सुकन्या समृद्धि योजना बेटियों की उच्च शिक्षा और उज्ज्वल भविष्य के लिए बचत का सबसे सुरक्षित सरकारी साधन है।' },
      ],
    },
    {
      schemeId: 'SCH_000009',
      name: 'Stand Up India Scheme',
      slug: 'stand-up-india-scheme',
      shortDescription: 'Bank loans between Rs. 10 Lakh and Rs. 1 Crore for SC/ST and Women entrepreneurs setting up greenfield enterprises.',
      description: 'Stand Up India facilitates bank loans between 10 lakh and 1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield manufacturing, services, or trading enterprises.',
      departmentId: departmentsMap['ministry-of-finance'],
      categoryId: categoriesMap['business'],
      schemeType: SchemeType.BUSINESS,
      isBusinessScheme: true,
      eligibilityDescription: 'SC/ST and/or Woman entrepreneurs above 18 years for setting up greenfield (first time) enterprises.',
      minAge: 18,
      maxAge: 65,
      minIncome: 0,
      maxIncome: 10000000,
      rulesJson: {
        socialCategory: ['SC', 'ST'],
        gender: ['FEMALE'],
        greenfieldProjectOnly: true,
      },
      deadline: new Date('2028-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'Stand Up India Official Portal',
      sourceUrl: 'https://www.standupmitra.in',
      sourceIdentifier: 'GOI-FIN-STANDUP-2026',
      lastVerifiedAt: new Date('2026-08-29T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['SC', 'ST', 'GENERAL', 'OBC'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.CASTE_CERTIFICATE, documentName: 'Caste Certificate (if SC/ST)', isMandatory: false, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BUSINESS_REGISTRATION, documentName: 'Detailed Project Report (DPR)', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'requested_loan_amount_lakhs', label: 'Requested Loan Amount (in Lakhs)', fieldType: FieldType.NUMBER, isRequired: true, validationRules: { min: 10, max: 100 }, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'Stand Up India Scheme', shortDescription: 'Bank loans up to 1 Crore for SC/ST and Women entrepreneurs.', description: 'Stand Up India provides bank financing for new greenfield projects promoted by SC, ST, or women entrepreneurs.' },
        { languageCode: 'hi', name: 'स्टैंड अप इंडिया योजना', shortDescription: 'एससी/एसटी और महिला उद्यमियों के लिए 10 लाख से 1 करोड़ तक का बैंक लोन।', description: 'स्टैंड अप इंडिया योजना का मुख्य उद्देश्य अनुसूचित जाति, जनजाति और महिला उद्यमियों को नया व्यवसाय शुरू करने के लिए ऋण उपलब्ध कराना है।' },
      ],
    },
    {
      schemeId: 'SCH_000010',
      name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
      slug: 'pradhan-mantri-kaushal-vikas-yojana',
      shortDescription: 'Free industry-relevant skill training, certification, and stipend support for Indian youth.',
      description: 'PMKVY is the flagship scheme of the Ministry of Skill Development & Entrepreneurship. It enables youth to take up industry-relevant skill training that helps them secure a better livelihood.',
      departmentId: departmentsMap['ministry-of-skill-development'],
      categoryId: categoriesMap['skill-development'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'Indian youth aged between 15 and 45 who are school/college dropouts or unemployed.',
      minAge: 15,
      maxAge: 45,
      minIncome: 0,
      maxIncome: 300000,
      rulesJson: {
        studentStatus: 'DROPOUT_OR_UNEMPLOYED',
      },
      deadline: new Date('2027-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'Skill India Digital Portal',
      sourceUrl: 'https://www.pmkvyofficial.org',
      sourceIdentifier: 'GOI-SKILL-PMKVY-2026',
      lastVerifiedAt: new Date('2026-08-28T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BANK_ACCOUNT, documentName: 'Bank Account Passbook Copy', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'preferred_skill_sector', label: 'Preferred Skill Training Sector', fieldType: FieldType.SELECT, options: ['IT & Electronics', 'Automotive', 'Healthcare Services', 'Apparel & Textiles', 'Retail & Hospitality'], isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)', shortDescription: 'Free skill development training and industry certification.', description: 'PMKVY offers free skill training and government certification for youth across India.' },
        { languageCode: 'hi', name: 'प्रधानमंत्री कौशल विकास योजना (PMKVY)', shortDescription: 'युवाओं के लिए मुफ्त कौशल प्रशिक्षण और प्रमाणन।', description: 'प्रधानमंत्री कौशल विकास योजना के तहत देश के युवाओं को रोजगारपरक कौशलों में मुफ्त ट्रेनिंग और सर्टिफिकेट दिया जाता है।' },
      ],
    },
    {
      schemeId: 'SCH_000011',
      name: 'PM SVANidhi (Street Vendor\'s AtmaNirbhar Nidhi)',
      slug: 'pm-svanidhi-street-vendors-scheme',
      shortDescription: 'Special affordable micro-credit working capital loans up to Rs. 50,000 for urban street vendors.',
      description: 'PM SVANidhi provides micro-credit working capital loans up to 50,000 to street vendors in urban areas with interest subsidy incentive on digital transactions.',
      departmentId: departmentsMap['ministry-of-housing-urban-affairs'],
      categoryId: categoriesMap['business'],
      schemeType: SchemeType.BOTH,
      isBusinessScheme: true,
      eligibilityDescription: 'Street vendors or hawkers engaged in vending in urban areas.',
      minAge: 18,
      maxAge: 65,
      minIncome: 0,
      maxIncome: 300000,
      rulesJson: {
        occupation: ['STREET_VENDOR', 'HAWKER'],
      },
      deadline: new Date('2027-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: true,
      status: SchemeStatus.ACTIVE,
      sourceName: 'PM SVANidhi Portal',
      sourceUrl: 'https://pmsvanidhi.mohua.gov.in',
      sourceIdentifier: 'GOI-HOUSING-SVANIDHI-2026',
      lastVerifiedAt: new Date('2026-08-30T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.OTHER, documentName: 'Certificate of Vending / Vendor ID Card', isMandatory: true, acceptedFormats: ['pdf', 'jpg'] },
      ],
      additionalFields: [
        { fieldKey: 'vending_location', label: 'Vending Spot / Marketplace Name', fieldType: FieldType.TEXT, isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'PM SVANidhi Scheme', shortDescription: 'Micro-credit working capital loans up to Rs. 50,000 for street vendors.', description: 'PM SVANidhi provides affordable loans and cashback incentives for urban street vendors.' },
        { languageCode: 'hi', name: 'पीएम स्वनिधि योजना', shortDescription: 'रेहड़ी-पटरी वालों के लिए 50,000 रुपये तक का आसान लोन।', description: 'पीएम स्वनिधि योजना के तहत स्ट्रीट वेंडर्स को अपना कारोबार बढ़ाने के लिए 50 हजार रुपये तक का ब्याज-सब्सिडी वाला लोन दिया जाता है।' },
      ],
    },
    {
      schemeId: 'SCH_000012',
      name: 'Atal Pension Yojana (APY)',
      slug: 'atal-pension-yojana',
      shortDescription: 'Guaranteed minimum monthly pension of Rs. 1000 to Rs. 5000 for unorganized sector workers.',
      description: 'Atal Pension Yojana is a government-backed pension scheme targeted at workers in the unorganized sector. Subscribers receive a guaranteed minimum monthly pension ranging from 1000 to 5000 per month starting at age 60.',
      departmentId: departmentsMap['ministry-of-finance'],
      categoryId: categoriesMap['social-welfare'],
      schemeType: SchemeType.PERSONAL,
      isBusinessScheme: false,
      eligibilityDescription: 'All Indian citizens in unorganized sector aged between 18 and 40 years holding a savings bank account.',
      minAge: 18,
      maxAge: 40,
      minIncome: 0,
      maxIncome: 500000,
      rulesJson: {
        customConditions: ['Applicant must be an Indian citizen between 18 and 40 years of age and not an income tax payer.'],
      },
      deadline: new Date('2030-12-31T23:59:59.000Z'),
      isActive: true,
      isNew: false,
      status: SchemeStatus.ACTIVE,
      sourceName: 'PFRDA Official Portal',
      sourceUrl: 'https://www.pfrda.org.in',
      sourceIdentifier: 'GOI-FIN-APY-2026',
      lastVerifiedAt: new Date('2026-08-25T00:00:00.000Z'),
      verificationStatus: VerificationStatus.VERIFIED,
      versionNumber: 1,
      states: ['ALL_INDIA'],
      categories: ['GENERAL', 'SC', 'ST', 'OBC', 'EWS'],
      documents: [
        { documentType: DocumentType.AADHAAR, documentName: 'Aadhaar Card', isMandatory: true, acceptedFormats: ['pdf'] },
        { documentType: DocumentType.BANK_ACCOUNT, documentName: 'Savings Bank Account Details with Auto-Debit', isMandatory: true, acceptedFormats: ['pdf'] },
      ],
      additionalFields: [
        { fieldKey: 'desired_pension_amount', label: 'Desired Monthly Pension Amount', fieldType: FieldType.SELECT, options: ['Rs 1,000 / month', 'Rs 2,000 / month', 'Rs 3,000 / month', 'Rs 4,000 / month', 'Rs 5,000 / month'], isRequired: true, displayOrder: 1 },
      ],
      translations: [
        { languageCode: 'en', name: 'Atal Pension Yojana (APY)', shortDescription: 'Guaranteed pension of Rs 1000 to Rs 5000/month after age 60.', description: 'Atal Pension Yojana secures the old age income of workers in unorganized sector.' },
        { languageCode: 'hi', name: 'अटल पेंशन योजना (APY)', shortDescription: '60 वर्ष की आयु के बाद 1000 से 5000 रुपये की मासिक पेंशन।', description: 'अटल पेंशन योजना के तहत असंगठित क्षेत्र के श्रमिकों को बुढ़ापे में नियमित सरकारी पेंशन की गारंटी मिलती है।' },
      ],
    },
  ];

  for (const s of demoSchemes) {
    const { states, categories, documents, additionalFields, translations, ...schemeFields } = s;

    const scheme = await prisma.scheme.upsert({
      where: { schemeId: schemeFields.schemeId },
      update: schemeFields,
      create: schemeFields,
    });

    // States join records
    await prisma.schemeState.deleteMany({ where: { schemeId: scheme.id } });
    for (const stCode of states) {
      const stId = statesMap[stCode];
      if (stId) {
        await prisma.schemeState.create({
          data: { schemeId: scheme.id, stateId: stId },
        });
      }
    }

    // Category eligibility join records
    await prisma.schemeCategoryEligibility.deleteMany({ where: { schemeId: scheme.id } });
    for (const catCode of categories) {
      const catId = eligibilityMap[catCode];
      if (catId) {
        await prisma.schemeCategoryEligibility.create({
          data: { schemeId: scheme.id, categoryId: catId },
        });
      }
    }

    // Documents
    await prisma.schemeDocumentRequirement.deleteMany({ where: { schemeId: scheme.id } });
    for (const doc of documents) {
      await prisma.schemeDocumentRequirement.create({
        data: { schemeId: scheme.id, ...doc },
      });
    }

    // Additional fields
    await prisma.schemeAdditionalField.deleteMany({ where: { schemeId: scheme.id } });
    for (const field of additionalFields) {
      await prisma.schemeAdditionalField.create({
        data: { schemeId: scheme.id, ...field },
      });
    }

    // Translations
    await prisma.schemeTranslation.deleteMany({ where: { schemeId: scheme.id } });
    for (const tr of translations) {
      await prisma.schemeTranslation.create({
        data: { schemeId: scheme.id, ...tr },
      });
    }

    // Create Initial Version Snapshot
    await prisma.schemeVersion.deleteMany({ where: { schemeId: scheme.id } });
    await prisma.schemeVersion.create({
      data: {
        schemeId: scheme.id,
        versionNumber: 1,
        snapshot: schemeFields as any,
        changedBy: 'SEED_SYSTEM',
        changeReason: 'Initial Seed Data Creation',
      },
    });
  }

  console.log('Comprehensive Government Scheme Database Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
