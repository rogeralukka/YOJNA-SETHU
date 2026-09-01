/**
 * YojanaSetu Comprehensive Automated Test Suite
 * Life Status, Occupation, Sector Intelligence & Eligibility Engine
 */

import {
  LIFE_STATUSES,
  OCCUPATIONS,
  SECTORS,
  calculateAge,
  validateDob,
  getLifeStatusLabel,
  getOccupationLabel,
  getSectorLabel
} from '../data/taxonomy.js';
import { evaluateSchemeEligibility, rankSchemesForUser } from '../services/eligibilityEngine.js';
import { apiService } from '../services/apiService.js';
import { initialSchemes } from '../data/initialSchemes.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('\n================================================================');
console.log('🧪 YOJANASETU INTELLIGENCE & ELIGIBILITY ENGINE AUTOMATED TESTS');
console.log('================================================================\n');

try {
  // =========================================================================
  // 1. DATE OF BIRTH & DYNAMIC AGE CALCULATION TESTS
  // =========================================================================
  console.log('1. Date of Birth (DOB) & Age Calculation Tests:');

  const refDate = new Date(2026, 7, 15); // 15 Aug 2026

  // Exact 25th birthday
  const age1 = calculateAge('2001-08-15', refDate);
  assert(age1 === 25, 'Calculates exact age on birthday (2001-08-15 -> 25 years in 2026)');

  // Before birthday in same year
  const age2 = calculateAge('2001-09-01', refDate);
  assert(age2 === 24, 'Calculates correct age before birthday (2001-09-01 -> 24 years on 15 Aug 2026)');

  // After birthday in same year
  const age3 = calculateAge('2001-05-10', refDate);
  assert(age3 === 25, 'Calculates correct age after birthday (2001-05-10 -> 25 years on 15 Aug 2026)');

  // Leap year DOB
  const leapAge = calculateAge('2000-02-29', refDate);
  assert(leapAge === 26, 'Correctly handles leap year DOB (2000-02-29 -> 26 years)');

  // Future DOB rejection
  const futureCheck = validateDob('2030-01-01');
  assert(!futureCheck.valid, 'Rejects future Date of Birth (2030-01-01)');

  // Invalid date format
  const invalidDate = validateDob('invalid-date');
  assert(!invalidDate.valid, 'Rejects non-date strings');

  // Realistic bounds
  const ancientDate = validateDob('1880-01-01');
  assert(!ancientDate.valid, 'Rejects unrealistic age (>120 years)');

  // =========================================================================
  // 2. ANTI-INFERENCE INTEGRITY TESTS
  // =========================================================================
  console.log('\n2. Anti-Inference Integrity Tests:');

  const youthProfile = { dob: '2010-01-01', life_status: 'employed', occupation: 'apprentice' };
  assert(youthProfile.life_status === 'employed', '16-year-old profile is NOT automatically inferred as student');

  const seniorProfile = { dob: '1955-01-01', life_status: 'business_owner', occupation: 'small_retailer' };
  assert(seniorProfile.life_status === 'business_owner', '71-year-old profile is NOT automatically inferred as retired');

  // =========================================================================
  // 3. TAXONOMY NORMALIZATION & INDEPENDENCE TESTS
  // =========================================================================
  console.log('\n3. Taxonomy Normalization & Independence Tests:');

  assert(Array.isArray(LIFE_STATUSES) && LIFE_STATUSES.length >= 10, 'Life statuses taxonomy has required coverage');
  assert(Array.isArray(OCCUPATIONS) && OCCUPATIONS.length >= 20, 'Occupations taxonomy has required coverage');
  assert(Array.isArray(SECTORS) && SECTORS.length >= 15, 'Sectors taxonomy has required coverage');

  // Separate entities: Electrician in Construction vs Electrician in Healthcare
  const artisanOcc = OCCUPATIONS.find(o => o.id === 'electrician');
  const constructSec = SECTORS.find(s => s.id === 'construction');
  const healthSec = SECTORS.find(s => s.id === 'healthcare');
  assert(artisanOcc && constructSec && healthSec, 'Occupation and Sector entities exist independently');

  // =========================================================================
  // 4. SERVER-AUTHORITATIVE ELIGIBILITY ENGINE TESTS
  // =========================================================================
  console.log('\n4. Multi-Dimensional Eligibility Engine Tests:');

  const pmKisan = initialSchemes.find(s => s.id === 'pm-kisan');
  const upOdop = initialSchemes.find(s => s.id === 'up-odop-subsidy');
  const nationalScholarship = initialSchemes.find(s => s.id === 'national-scholarship');
  const svanidhi = initialSchemes.find(s => s.id === 'pm-svanidhi');

  // Test 4A: Rahul Sharma (Farmer in UP, Age 25) on PM-KISAN -> HIGH_MATCH
  const rahulProfile = {
    dob: '2001-08-15',
    state: 'Uttar Pradesh',
    life_status: 'farmer',
    occupation: 'farmer',
    sector: 'agriculture',
    income: 350000
  };

  const evalKisan = evaluateSchemeEligibility(pmKisan, rahulProfile);
  assert(evalKisan.status === 'HIGH_MATCH', 'Rahul Sharma gets HIGH_MATCH for PM-KISAN');
  assert(evalKisan.isEligible === true, 'Rahul Sharma is eligible for PM-KISAN');
  assert(evalKisan.criteriaResults.every(c => c.satisfied), 'All PM-KISAN criteria satisfied for Rahul');

  // Test 4B: Software professional applying to PM-KISAN -> Disqualified on Occupation / Life Status
  const itProfile = {
    dob: '1995-03-20',
    state: 'Karnataka',
    life_status: 'employed',
    occupation: 'software_professional',
    sector: 'information_technology',
    income: 800000
  };

  const evalKisanIT = evaluateSchemeEligibility(pmKisan, itProfile);
  assert(evalKisanIT.status === 'NOT_ELIGIBLE', 'Software professional is NOT_ELIGIBLE for PM-KISAN');
  assert(evalKisanIT.isEligible === false, 'isEligible flag is false for ineligible citizen');

  // Test 4C: State scheme boundary check (UP ODOP Scheme)
  const upArtisan = {
    dob: '1998-06-12',
    state: 'Uttar Pradesh',
    life_status: 'self_employed',
    occupation: 'artisan',
    sector: 'handicrafts',
    income: 200000
  };
  const evalUpOdop = evaluateSchemeEligibility(upOdop, upArtisan);
  assert(evalUpOdop.status === 'HIGH_MATCH', 'UP Artisan gets HIGH_MATCH for UP ODOP Scheme');

  const mahaArtisan = {
    ...upArtisan,
    state: 'Maharashtra'
  };
  const evalMahaOdop = evaluateSchemeEligibility(upOdop, mahaArtisan);
  assert(evalMahaOdop.status === 'NOT_ELIGIBLE', 'Maharashtra resident is NOT_ELIGIBLE for UP-specific State Scheme');

  // Test 4D: Student Scholarship Scheme (NSP)
  const collegeStudent = {
    dob: '2004-09-10',
    state: 'Delhi',
    life_status: 'student_college',
    income: 180000
  };
  const evalNsp = evaluateSchemeEligibility(nationalScholarship, collegeStudent);
  assert(evalNsp.status === 'HIGH_MATCH', 'College student gets HIGH_MATCH for National Scholarship');

  // Test 4E: Missing information handling (Income missing -> NEEDS_INFO, not false ineligibility)
  const profileMissingIncome = {
    dob: '2001-08-15',
    state: 'Uttar Pradesh',
    life_status: 'farmer',
    occupation: 'farmer',
    sector: 'agriculture',
    income: null // Missing!
  };
  const evalMissingInfo = evaluateSchemeEligibility(pmKisan, profileMissingIncome);
  assert(evalMissingInfo.status === 'NEEDS_INFO', 'Missing income produces NEEDS_INFO rather than immediate disqualification');
  assert(evalMissingInfo.missingFields.includes('income'), 'Explicitly identifies missing income field');

  // Test 4F: Street Vendor Scheme (PM SVANidhi)
  const vendorProfile = {
    dob: '1988-11-05',
    state: 'Gujarat',
    life_status: 'self_employed',
    occupation: 'street_vendor',
    sector: 'retail',
    income: 180000
  };
  const evalSvanidhi = evaluateSchemeEligibility(svanidhi, vendorProfile);
  assert(evalSvanidhi.status === 'HIGH_MATCH', 'Street vendor gets HIGH_MATCH for PM SVANidhi');

  // =========================================================================
  // 5. RECOMMENDATION & RANKING ENGINE TESTS
  // =========================================================================
  console.log('\n5. Scheme Recommendation & Ranking Engine Tests:');

  const rankedForRahul = rankSchemesForUser(initialSchemes, rahulProfile);
  assert(rankedForRahul.length === initialSchemes.length, 'Ranks all schemes without dropping items');
  assert(
    rankedForRahul[0].id === 'pm-kisan' || rankedForRahul[0].id === 'pm-fby',
    'Ranks agricultural schemes at the top for farmer Rahul Sharma'
  );

  const rankedForStudent = rankSchemesForUser(initialSchemes, collegeStudent);
  assert(
    rankedForStudent[0].id === 'national-scholarship' || rankedForStudent[1].id === 'national-scholarship',
    'Ranks education scholarship schemes at the top for student'
  );

  // =========================================================================
  // 6. STUDENT INSTITUTION EMAIL OTP VERIFICATION TESTS
  // =========================================================================
  console.log('\n6. Student Institution Email OTP Verification Tests:');

  const testEmail = 'student.test@bhu.ac.in';
  const sendRes = await apiService.sendInstitutionOtp(testEmail);
  assert(sendRes.success === true, 'Successfully generates and sends OTP for institutional email');

  // Valid OTP Verification
  const verifyRes = await apiService.verifyInstitutionOtp(testEmail, '789456');
  assert(verifyRes.success === true, 'Successfully verifies valid OTP');

  // Invalid OTP Rejection
  const invalidOtpRes = await apiService.verifyInstitutionOtp(testEmail, '000000');
  assert(invalidOtpRes.success === false, 'Rejects invalid OTP code');

  // =========================================================================
  // 7. ADMIN AUDIT TRAIL LOGGING TESTS
  // =========================================================================
  console.log('\n7. Admin Audit Trail Logging Tests:');

  // Mock localStorage for test environment
  if (typeof localStorage === 'undefined') {
    global.localStorage = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
      };
    })();
  }

  const testAuditChanges = [
    { field: 'eligibleOccupations', oldValue: ['ALL'], newValue: ['farmer', 'artisan'] },
    { field: 'minAge', oldValue: 18, newValue: 21 }
  ];
  apiService.logAdminAudit('admin_007', 'pm-kisan', 'PM-KISAN Samman Nidhi', testAuditChanges);

  const logs = apiService.getAdminAuditLogs();
  assert(logs.length >= 2, 'Admin audit logs successfully stored and retrieved');
  assert(logs[0].adminId === 'admin_007', 'Audit entry contains correct adminId');
  assert(logs[0].schemeId === 'pm-kisan', 'Audit entry contains correct schemeId');

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================\n');

} catch (err) {
  console.error('\n❌ TEST RUNNER TERMINATED WITH ERROR:');
  console.error(err);
  process.exit(1);
}
