export const initialUser = {
  id: "USR-294-XZY",
  name: "Rahul Sharma",
  email: "rahul@email.com",
  phone: "+91 98765 43210",
  age: 25,
  gender: "Male",
  state: "Uttar Pradesh",
  district: "Varanasi",
  category: "OBC",
  income: 350000,
  occupation: "Self Employed / Agriculture",
  avatarUrl: "/assets/rahul_sharma.jpg",
  documents: {
    aadhaar: { status: "Uploaded", name: "Aadhaar_Card_Verified.pdf", size: "1.8 MB", date: "15 Jan 2026" },
    pan: { status: "Uploaded", name: "PAN_Card.pdf", size: "1.2 MB", date: "15 Jan 2026" },
    income: { status: "Missing", name: null, size: null, date: null },
    caste: { status: "Missing", name: null, size: null, date: null },
    voterId: { status: "Uploaded", name: "Voter_ID_Scan.pdf", size: "2.1 MB", date: "20 Jan 2026" },
  },
  bankDetails: {
    accountHolder: "Rahul Sharma",
    bankName: "State Bank of India",
    accountNumber: "XXXX-XXXX-9824",
    fullAccountNumber: "38924019284",
    ifsc: "SBIN0001234",
    branch: "Varanasi Main Branch",
    verified: true
  }
};
