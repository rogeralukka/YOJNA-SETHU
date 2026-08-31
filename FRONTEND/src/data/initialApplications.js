export const initialApplications = [
  {
    applicationId: "APP-9824",
    userId: "USR-294-XZY",
    userName: "Rahul Sharma",
    userEmail: "rahul@email.com",
    userPhone: "+91 98765 43210",
    userState: "Uttar Pradesh",
    userCategory: "OBC",
    userIncome: "₹ 3,50,000",
    schemeIds: ["pmay-urban"],
    schemeName: "Pradhan Mantri Awas Yojana (PMAY)",
    schemeCategory: "Housing",
    entityType: "personal", // 'personal' or 'business'
    entityName: "You",
    businessId: null,
    status: "Approved", // 'Pending', 'In Review', 'Approved', 'Rejected'
    reviewLater: false,
    appliedAt: "2023-10-12",
    updatedAt: "2023-10-22",
    approvedAt: "2023-10-22",
    rejectedAt: null,
    adminComment: null,
    timeline: [
      { title: "Application Submitted", date: "12 Oct 2023", completed: true },
      { title: "Document Verification", date: "18 Oct 2023", completed: true, desc: "All submitted documents verified by municipal authority." },
      { title: "Application Approved", date: "22 Oct 2023", completed: true, desc: "Your application has been approved. The subsidy amount will be disbursed shortly." }
    ],
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "XXXX-XXXX-9824",
      ifsc: "SBIN0001234",
      verified: true
    },
    documents: [
      { name: "Identity_Proof.pdf", size: "1.8 MB", date: "12 Oct 2023" },
      { name: "Income_Certificate.pdf", size: "1.1 MB", date: "12 Oct 2023" },
      { name: "Affidavit_PMAY.pdf", size: "2.4 MB", date: "12 Oct 2023" }
    ]
  },
  {
    applicationId: "APP-9021",
    userId: "USR-294-XZY",
    userName: "Rahul Sharma",
    userEmail: "rahul@email.com",
    userPhone: "+91 98765 43210",
    userState: "Uttar Pradesh",
    userCategory: "OBC",
    userIncome: "₹ 3,50,000",
    schemeIds: ["pm-kisan"],
    schemeName: "PM-KISAN Samman Nidhi",
    schemeCategory: "Agriculture",
    entityType: "personal",
    entityName: "You",
    businessId: null,
    status: "Pending",
    reviewLater: false,
    appliedAt: "2023-10-24",
    updatedAt: "2023-10-24",
    approvedAt: null,
    rejectedAt: null,
    adminComment: null,
    timeline: [
      { title: "Application Submitted", date: "24 Oct 2023", completed: true, desc: "Application received and assigned to review team." },
      { title: "Under Review", date: "24 Oct 2023", completed: true, desc: "Initial verification in progress." },
      { title: "Decision", date: "Pending", completed: false }
    ],
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "XXXX-XXXX-9824",
      ifsc: "SBIN0001234",
      verified: true
    },
    documents: [
      { name: "Aadhaar_Card_Verified.pdf", size: "1.8 MB", date: "24 Oct 2023" },
      { name: "Land_Records_Khatauni.pdf", size: "3.2 MB", date: "24 Oct 2023" }
    ]
  },
  {
    applicationId: "APP-8842",
    userId: "USR-294-XZY",
    userName: "Rahul Sharma",
    userEmail: "rahul@email.com",
    userPhone: "+91 98765 43210",
    userState: "Uttar Pradesh",
    userCategory: "OBC",
    userIncome: "₹ 3,50,000",
    schemeIds: ["mudra-shishu"],
    schemeName: "MUDRA Shishu Loan",
    schemeCategory: "Finance",
    entityType: "business",
    entityName: "EcoTech Solutions",
    businessId: "biz-101",
    businessDetails: {
      businessName: "EcoTech Solutions",
      businessType: "Private Limited",
      gst: "27AAPFT2098A1Z5",
      pan: "AAPFT2098A",
      turnover: "₹ 25 Lakh",
      industry: "IT & Services"
    },
    status: "In Review",
    reviewLater: true,
    appliedAt: "2023-11-28",
    updatedAt: "2023-11-29",
    approvedAt: null,
    rejectedAt: null,
    adminComment: null,
    timeline: [
      { title: "Application Submitted", date: "28 Nov 2023", completed: true },
      { title: "Under Review", date: "29 Nov 2023", completed: true, desc: "Business credentials and MSME classification being verified." }
    ],
    bankDetails: {
      bankName: "HDFC Bank Ltd",
      accountNumber: "XXXX-XXXX-4592",
      ifsc: "HDFC0000128",
      verified: true
    },
    documents: [
      { name: "Business_License_GST.pdf", size: "1.4 MB", date: "28 Nov 2023" },
      { name: "Udyam_Registration.pdf", size: "950 KB", date: "28 Nov 2023" },
      { name: "Bank_Statement_6M.pdf", size: "4.1 MB", date: "28 Nov 2023" }
    ]
  },
  {
    applicationId: "APP-7721",
    userId: "USR-294-XZY",
    userName: "Rahul Sharma",
    userEmail: "rahul@email.com",
    userPhone: "+91 98765 43210",
    userState: "Uttar Pradesh",
    userCategory: "OBC",
    userIncome: "₹ 3,50,000",
    schemeIds: ["ayushman-pmjay"],
    schemeName: "Ayushman Bharat PM-JAY",
    schemeCategory: "Healthcare",
    entityType: "personal",
    entityName: "You",
    businessId: null,
    status: "Rejected",
    reviewLater: false,
    appliedAt: "2023-12-05",
    updatedAt: "2023-12-08",
    approvedAt: null,
    rejectedAt: "2023-12-08",
    adminComment: "Income certificate provided is older than 6 months. Please re-apply with valid documents.",
    timeline: [
      { title: "Application Submitted", date: "05 Dec 2023", completed: true },
      { title: "Document Verification", date: "07 Dec 2023", completed: true },
      { title: "Application Rejected", date: "08 Dec 2023", completed: true, desc: "Income certificate provided is older than 6 months. Please re-apply with valid documents." }
    ],
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "XXXX-XXXX-9824",
      ifsc: "SBIN0001234",
      verified: true
    },
    documents: [
      { name: "Aadhaar_Card.pdf", size: "1.8 MB", date: "05 Dec 2023" },
      { name: "Expired_Income_Certificate.pdf", size: "1.2 MB", date: "05 Dec 2023" }
    ]
  }
];
