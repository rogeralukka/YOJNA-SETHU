import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Government Scheme Portal...');

  // Clean existing records in cascade order
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.businessCard.deleteMany();
  await prisma.document.deleteMany();
  await prisma.scheme.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned up existing database records.');

  // Password hashes
  const superAdminPassword = await bcrypt.hash('SuperAdmin@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  // 1. Create Super Admin (Page 3 / Admin Privileges)
  const superAdmin = await prisma.user.create({
    data: {
      fullName: 'Super Administrator',
      email: 'superadmin@gov.in',
      mobile: '9800000001',
      password: superAdminPassword,
      role: 'super_admin'
    }
  });

  // 2. Create Normal Admin (Approve/Reject Only)
  const normalAdmin = await prisma.user.create({
    data: {
      fullName: 'Government Verification Officer',
      email: 'admin@gov.in',
      mobile: '9800000002',
      password: adminPassword,
      role: 'admin'
    }
  });

  // 3. Create Sample Citizen Users
  const userAarav = await prisma.user.create({
    data: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      mobile: '9876543210',
      password: userPassword,
      role: 'user',
      category: 'General',
      state: 'Maharashtra',
      annualIncome: 180000,
      age: 21,
      gender: 'Male',
      accountHolderName: 'Aarav Sharma',
      accountNumber: '123456789012',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India'
    }
  });

  const userPooja = await prisma.user.create({
    data: {
      fullName: 'Pooja Patel',
      email: 'pooja.patel@example.com',
      mobile: '9876543211',
      password: userPassword,
      role: 'user',
      category: 'OBC',
      state: 'Gujarat',
      annualIncome: 450000,
      age: 32,
      gender: 'Female',
      accountHolderName: 'Pooja Patel',
      accountNumber: '987654321098',
      ifscCode: 'HDFC0005678',
      bankName: 'HDFC Bank'
    }
  });

  const userRamesh = await prisma.user.create({
    data: {
      fullName: 'Ramesh Kumar',
      email: 'ramesh.kumar@example.com',
      mobile: '9876543212',
      password: userPassword,
      role: 'user',
      category: 'SC',
      state: 'Uttar Pradesh',
      annualIncome: 90000,
      age: 48,
      gender: 'Male',
      accountHolderName: 'Ramesh Kumar',
      accountNumber: '456789012345',
      ifscCode: 'PUNB0123400',
      bankName: 'Punjab National Bank'
    }
  });

  // 4. Create Sample Documents for Users
  await prisma.document.createMany({
    data: [
      {
        userId: userAarav.id,
        docType: 'aadhaar',
        fileName: 'aarav_aadhaar.pdf',
        fileUrl: '/uploads/sample_aadhaar.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024 * 350
      },
      {
        userId: userAarav.id,
        docType: 'income_cert',
        fileName: 'aarav_income_certificate.pdf',
        fileUrl: '/uploads/sample_income.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024 * 420
      },
      {
        userId: userPooja.id,
        docType: 'aadhaar',
        fileName: 'pooja_aadhaar.pdf',
        fileUrl: '/uploads/sample_aadhaar.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024 * 310
      },
      {
        userId: userPooja.id,
        docType: 'pan',
        fileName: 'pooja_pan.pdf',
        fileUrl: '/uploads/sample_pan.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024 * 280
      }
    ]
  });

  // 5. Create Dynamic Business Cards for Pooja (Page 4B)
  const business1 = await prisma.businessCard.create({
    data: {
      userId: userPooja.id,
      name: 'Patel Organic Textiles',
      type: 'Manufacturing',
      gstNumber: '24AAACP1234A1Z5',
      panNumber: 'AAACP1234A',
      address: 'Plot 45, GIDC Industrial Estate, Surat, Gujarat - 395006',
      phone: '9876543211',
      email: 'contact@pateltextiles.in',
      turnover: '10L-50L',
      employeeCount: '11-50',
      industryCategory: 'Textiles',
      yearsInOperation: '3-5',
      udyamNumber: 'UDYAM-GJ-01-0012345'
    }
  });

  const business2 = await prisma.businessCard.create({
    data: {
      userId: userPooja.id,
      name: 'Sunrise Agro & Food Processing',
      type: 'Agriculture',
      gstNumber: '24AAACP9999B1Z2',
      panNumber: 'AAACP9999B',
      address: 'Near APMC Market, Rajkot Highway, Ahmedabad, Gujarat - 380058',
      phone: '9876543211',
      email: 'info@sunriseagro.in',
      turnover: '50L-1Cr',
      employeeCount: '51-200',
      industryCategory: 'Food Processing',
      yearsInOperation: '5-10',
      udyamNumber: 'UDYAM-GJ-02-0098765'
    }
  });

  // 6. Create 15 Realistic Central & State Government Schemes
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const urgentDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const futureQuarter = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const schemesData = [
    {
      name: 'AICTE Pragati Scholarship for Girl Students',
      department: 'Ministry of Education & AICTE',
      category: 'Education',
      description: 'Provides annual financial assistance of ₹50,000 per annum to meritorious female students pursuing technical degree or diploma courses across approved institutions.',
      minAge: 16,
      maxAge: 25,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: 800000,
      targetGender: 'Female',
      businessTypes: JSON.stringify(['All']),
      isBusinessScheme: false,
      deadline: urgentDate,
      documentsRequired: JSON.stringify(['aadhaar', 'income_cert', 'voter_id']),
      benefits: '₹50,000 per annum towards college tuition and learning equipment.',
      officialUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati'
    },
    {
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      department: 'Ministry of Agriculture and Farmers Welfare',
      category: 'Agriculture',
      description: 'An income support scheme providing ₹6,000 per year in three equal instalments directly into the bank accounts of landholding farmer families across India.',
      minAge: 18,
      maxAge: 100,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: 250000,
      targetGender: 'All',
      businessTypes: JSON.stringify(['All']),
      isBusinessScheme: false,
      deadline: null,
      documentsRequired: JSON.stringify(['aadhaar', 'income_cert']),
      benefits: 'Direct Benefit Transfer (DBT) of ₹6,000 per annum in 3 installments.',
      officialUrl: 'https://pmkisan.gov.in'
    },
    {
      name: 'PMEGP (Prime Minister Employment Generation Programme)',
      department: 'Ministry of Micro, Small and Medium Enterprises',
      category: 'MSME',
      description: 'Credit-linked subsidy program to generate employment opportunities by establishing micro-enterprises in non-farm sectors. Subsidy ranges from 15% to 35% of project cost.',
      minAge: 18,
      maxAge: 65,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: null,
      targetGender: 'All',
      businessTypes: JSON.stringify(['Manufacturing', 'Services', 'Retail', 'Agriculture']),
      isBusinessScheme: true,
      deadline: futureQuarter,
      documentsRequired: JSON.stringify(['pan', 'aadhaar', 'caste_cert']),
      benefits: 'Bank financing with 15% to 35% margin money government subsidy up to ₹50 Lakhs.',
      officialUrl: 'https://www.kviconline.gov.in/pmegpeportal'
    },
    {
      name: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
      department: 'Ministry of Finance / SIDBI',
      category: 'Finance',
      description: 'Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
      minAge: 18,
      maxAge: 70,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['SC', 'ST', 'OBC', 'General']),
      maxIncome: null,
      targetGender: 'Female',
      businessTypes: JSON.stringify(['Manufacturing', 'Services', 'Agriculture', 'Retail']),
      isBusinessScheme: true,
      deadline: nextMonth,
      documentsRequired: JSON.stringify(['pan', 'aadhaar', 'caste_cert']),
      benefits: 'Bank loan from ₹10 Lakh up to ₹1 Crore with composite interest rate discount.',
      officialUrl: 'https://www.standupmitra.in'
    },
    {
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      department: 'Department of Financial Services',
      category: 'Finance',
      description: 'Provides collateral-free loans up to ₹10 Lakhs to non-corporate, non-farm small and micro enterprises categorized into Shishu, Kishore, and Tarun stages.',
      minAge: 18,
      maxAge: 65,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: null,
      targetGender: 'All',
      businessTypes: JSON.stringify(['Manufacturing', 'Services', 'Retail']),
      isBusinessScheme: true,
      deadline: null,
      documentsRequired: JSON.stringify(['pan', 'aadhaar']),
      benefits: 'Collateral-free micro finance up to ₹10 Lakhs with flexible repayment terms.',
      officialUrl: 'https://www.mudra.org.in'
    },
    {
      name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
      department: 'National Health Authority',
      category: 'Health',
      description: 'World largest health assurance scheme providing a health cover of ₹5 Lakhs per family per year for secondary and tertiary care hospitalization to bottom 40% poor and vulnerable population.',
      minAge: 0,
      maxAge: 120,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: 250000,
      targetGender: 'All',
      businessTypes: JSON.stringify(['All']),
      isBusinessScheme: false,
      deadline: null,
      documentsRequired: JSON.stringify(['aadhaar', 'income_cert']),
      benefits: 'Cashless inpatient treatment up to ₹5,00,000 per family per year in empanelled hospitals.',
      officialUrl: 'https://pmjay.gov.in'
    },
    {
      name: 'Digital India Internship Scheme',
      department: 'Ministry of Electronics and Information Technology',
      category: 'Education',
      description: 'Offers Indian students secured positions in technology leadership, emerging digital transformation, AI/ML policies, and e-Governance projects with monthly stipends.',
      minAge: 18,
      maxAge: 26,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: null,
      targetGender: 'All',
      businessTypes: JSON.stringify(['All']),
      isBusinessScheme: false,
      deadline: urgentDate,
      documentsRequired: JSON.stringify(['aadhaar', 'pan']),
      benefits: 'Monthly stipend of ₹20,000 and hands-on experience on national Digital India projects.',
      officialUrl: 'https://www.meity.gov.in/digital-india-internship-scheme'
    },
    {
      name: 'PM Vishwakarma Kaushal Samman',
      department: 'Ministry of Skill Development & MSME',
      category: 'Skills',
      description: 'Holistic support scheme for traditional artisans and craftspeople covering 18 trades, providing skill verification, modern toolkit incentive of ₹15,000, and collateral-free enterprise credit at 5%.',
      minAge: 18,
      maxAge: 65,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: 300000,
      targetGender: 'All',
      businessTypes: JSON.stringify(['Manufacturing', 'Services']),
      isBusinessScheme: true,
      deadline: futureQuarter,
      documentsRequired: JSON.stringify(['aadhaar', 'pan']),
      benefits: '₹15,000 free toolkit e-voucher + up to ₹3,00,000 low interest loan in two tranches.',
      officialUrl: 'https://pmvishwakarma.gov.in'
    },
    {
      name: 'Startup India Seed Fund Scheme (SISFS)',
      department: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
      category: 'Entrepreneurship',
      description: 'Financial assistance to DPIIT-recognized startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
      minAge: 18,
      maxAge: 70,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: null,
      targetGender: 'All',
      businessTypes: JSON.stringify(['Services', 'Manufacturing', 'Retail']),
      isBusinessScheme: true,
      deadline: futureQuarter,
      documentsRequired: JSON.stringify(['pan', 'aadhaar']),
      benefits: 'Up to ₹20 Lakhs as grant for PoC/prototype and up to ₹50 Lakhs via debt or convertible debentures.',
      officialUrl: 'https://seedfund.startupindia.gov.in'
    },
    {
      name: 'PM SVANidhi - Street Vendor AtmaNirbhar Nidhi',
      department: 'Ministry of Housing and Urban Affairs',
      category: 'Finance',
      description: 'Micro-credit scheme providing working capital loans up to ₹50,000 with 7% interest subsidy on timely repayments and digital cashback incentives.',
      minAge: 18,
      maxAge: 70,
      states: JSON.stringify(['All']),
      categories: JSON.stringify(['All']),
      maxIncome: 200000,
      targetGender: 'All',
      businessTypes: JSON.stringify(['Retail', 'Services']),
      isBusinessScheme: false,
      deadline: null,
      documentsRequired: JSON.stringify(['aadhaar', 'voter_id']),
      benefits: 'Collateral-free working capital loan starting at ₹10,000 up to ₹50,000 with 7% interest subsidy.',
      officialUrl: 'https://pmsvanidhi.mohua.gov.in'
    },
    {
      name: 'Gujarat Mukhyamantri Mahila Utkarsh Yojana (MMUY)',
      department: 'Government of Gujarat - Women & Child Development',
      category: 'Women & Child',
      description: 'State-sponsored scheme for women self-help groups (SHGs) and joint liability groups (JLGs) in urban and rural Gujarat providing ₹1 Lakh zero-interest loans for micro-ventures.',
      minAge: 18,
      maxAge: 59,
      states: JSON.stringify(['Gujarat']),
      categories: JSON.stringify(['All']),
      maxIncome: 300000,
      targetGender: 'Female',
      businessTypes: JSON.stringify(['Manufacturing', 'Services', 'Retail']),
      isBusinessScheme: true,
      deadline: nextMonth,
      documentsRequired: JSON.stringify(['aadhaar', 'income_cert']),
      benefits: '₹1,00,000 interest-free loan per women group with state government paying all interest.',
      officialUrl: 'https://wcd.gujarat.gov.in'
    },
    {
      name: 'Maharashtra Savitribai Phule Higher Education Stipend',
      department: 'Government of Maharashtra - Higher & Technical Education',
      category: 'Education',
      description: 'Special scholarship incentive for underprivileged female and backward category students pursuing higher graduation degrees in Maharashtra state universities.',
      minAge: 17,
      maxAge: 28,
      states: JSON.stringify(['Maharashtra']),
      categories: JSON.stringify(['SC', 'ST', 'OBC', 'EWS']),
      maxIncome: 250000,
      targetGender: 'All',
      businessTypes: JSON.stringify(['All']),
      isBusinessScheme: false,
      deadline: nextMonth,
      documentsRequired: JSON.stringify(['aadhaar', 'caste_cert', 'income_cert']),
      benefits: 'Annual scholarship of ₹30,000 and hostel allowance for the duration of degree.',
      officialUrl: 'https://mahadbt.maharashtra.gov.in'
    }
  ];

  const createdSchemes = [];
  for (const s of schemesData) {
    const created = await prisma.scheme.create({ data: s });
    createdSchemes.push(created);
  }

  console.log(`📋 Created ${createdSchemes.length} Realistic Government Schemes.`);

  // 7. Create Sample Bookmarks
  await prisma.bookmark.create({
    data: {
      userId: userAarav.id,
      schemeId: createdSchemes[0].id // AICTE Pragati
    }
  });

  await prisma.bookmark.create({
    data: {
      userId: userPooja.id,
      schemeId: createdSchemes[2].id // PMEGP
    }
  });

  // 8. Create Sample Applications (Approved, Rejected with comment, and Pending)
  const app1 = await prisma.application.create({
    data: {
      userId: userAarav.id,
      schemeId: createdSchemes[6].id, // Digital India Internship
      entity: 'personal',
      status: 'approved',
      snapshotData: JSON.stringify({
        applicant: {
          id: userAarav.id,
          fullName: userAarav.fullName,
          email: userAarav.email,
          mobile: userAarav.mobile,
          state: userAarav.state,
          category: userAarav.category,
          annualIncome: userAarav.annualIncome,
          age: userAarav.age
        },
        bankDetails: {
          accountHolderName: userAarav.accountHolderName,
          accountNumber: userAarav.accountNumber,
          ifscCode: userAarav.ifscCode,
          bankName: userAarav.bankName
        }
      })
    }
  });

  const app2 = await prisma.application.create({
    data: {
      userId: userPooja.id,
      schemeId: createdSchemes[2].id, // PMEGP
      entity: 'business',
      businessCardId: business1.id,
      status: 'pending',
      snapshotData: JSON.stringify({
        applicant: {
          id: userPooja.id,
          fullName: userPooja.fullName,
          email: userPooja.email,
          mobile: userPooja.mobile
        },
        business: {
          id: business1.id,
          name: business1.name,
          type: business1.type,
          gstNumber: business1.gstNumber,
          turnover: business1.turnover
        }
      })
    }
  });

  const app3 = await prisma.application.create({
    data: {
      userId: userRamesh.id,
      schemeId: createdSchemes[1].id, // PM-KISAN
      entity: 'personal',
      status: 'pending',
      snapshotData: JSON.stringify({
        applicant: {
          id: userRamesh.id,
          fullName: userRamesh.fullName,
          email: userRamesh.email,
          mobile: userRamesh.mobile,
          state: userRamesh.state,
          annualIncome: userRamesh.annualIncome
        }
      })
    }
  });

  const app4 = await prisma.application.create({
    data: {
      userId: userPooja.id,
      schemeId: createdSchemes[3].id, // Stand-Up India
      entity: 'business',
      businessCardId: business2.id,
      status: 'rejected',
      adminComment: 'Annual turnover threshold exceeds MSME first-phase ceiling for this specific grant track. Please re-apply under the expansion category.',
      snapshotData: JSON.stringify({
        applicant: {
          id: userPooja.id,
          fullName: userPooja.fullName,
          email: userPooja.email
        },
        business: {
          id: business2.id,
          name: business2.name,
          type: business2.type
        }
      })
    }
  });

  // 9. Create Sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: userAarav.id,
        title: 'Application Approved! 🎉',
        message: 'Congratulations! Your application for "Digital India Internship Scheme" has been approved by the department.',
        type: 'application_approved',
        relatedApplicationId: app1.id,
        isRead: false
      },
      {
        userId: userPooja.id,
        title: 'Application Submitted Successfully',
        message: 'Your application for "PMEGP" has been successfully submitted and is under administrative review.',
        type: 'application_submitted',
        relatedApplicationId: app2.id,
        isRead: true
      },
      {
        userId: userPooja.id,
        title: 'Application Rejected',
        message: 'Your application for "Stand-Up India Scheme for Women and SC/ST Entrepreneurs" was not approved. Reason: Annual turnover threshold exceeds MSME first-phase ceiling.',
        type: 'application_rejected',
        relatedApplicationId: app4.id,
        isRead: false
      },
      {
        userId: userAarav.id,
        title: 'New Scheme Launched: AICTE Pragati Scholarship',
        message: 'A new government scheme "AICTE Pragati Scholarship for Girl Students" under Ministry of Education & AICTE is now available and you are eligible to apply!',
        type: 'scheme_added',
        relatedSchemeId: createdSchemes[0].id,
        isRead: false
      }
    ]
  });

  console.log('✅ Seed completed successfully with all realistic roles, users, businesses, schemes, applications, and notifications.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
