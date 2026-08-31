import { parseJsonSafe } from '../utils/helpers.js';

/**
 * Check if a personal user profile is eligible for a scheme
 * @param {Object} user - User profile object
 * @param {Object} scheme - Scheme object
 * @returns {Object} { isEligible: boolean, reasons: string[], matchedCriteria: string[] }
 */
export const evaluatePersonalEligibility = (user, scheme) => {
  const reasons = [];
  const matchedCriteria = [];

  // Business schemes are not personal
  if (scheme.isBusinessScheme) {
    return {
      isEligible: false,
      reasons: ['This is a business-only scheme. Apply using a registered business profile.'],
      matchedCriteria
    };
  }

  // If user profile is not completed at all
  if (!user) {
    return {
      isEligible: false,
      reasons: ['Please log in and complete your profile to check eligibility.'],
      matchedCriteria
    };
  }

  const states = parseJsonSafe(scheme.states, ['All']);
  const categories = parseJsonSafe(scheme.categories, ['All']);

  // 1. Age check
  const minAge = scheme.minAge ?? 0;
  const maxAge = scheme.maxAge ?? 120;
  if (user.age !== null && user.age !== undefined) {
    if (user.age >= minAge && user.age <= maxAge) {
      matchedCriteria.push(`Age ${user.age} falls within eligible range (${minAge}-${maxAge} years)`);
    } else {
      reasons.push(`Age must be between ${minAge} and ${maxAge} years (Your age: ${user.age})`);
    }
  } else if (minAge > 0 || maxAge < 100) {
    reasons.push(`Age criteria not verifiable. Please update age in profile (Required: ${minAge}-${maxAge} years)`);
  }

  // 2. State check
  if (states.includes('All')) {
    matchedCriteria.push('Open to all Indian States & UTs');
  } else if (user.state && states.some(s => s.toLowerCase() === user.state.toLowerCase())) {
    matchedCriteria.push(`Applicable in your state (${user.state})`);
  } else if (user.state) {
    reasons.push(`Scheme restricted to: ${states.join(', ')} (Your state: ${user.state})`);
  } else {
    reasons.push(`State not specified in profile. Scheme restricted to: ${states.join(', ')}`);
  }

  // 3. Social Category check (General, OBC, SC, ST, EWS)
  if (categories.includes('All')) {
    matchedCriteria.push('Open to all social categories');
  } else if (user.category && categories.some(c => c.toLowerCase() === user.category.toLowerCase())) {
    matchedCriteria.push(`Eligible for your social category (${user.category})`);
  } else if (user.category) {
    reasons.push(`Applicable only for categories: ${categories.join(', ')} (Your category: ${user.category})`);
  } else {
    reasons.push(`Category not set in profile. Eligible categories: ${categories.join(', ')}`);
  }

  // 4. Income check
  if (scheme.maxIncome && scheme.maxIncome > 0) {
    if (user.annualIncome !== null && user.annualIncome !== undefined) {
      if (user.annualIncome <= scheme.maxIncome) {
        matchedCriteria.push(`Annual income ₹${user.annualIncome.toLocaleString('en-IN')} is within ceiling limit of ₹${scheme.maxIncome.toLocaleString('en-IN')}`);
      } else {
        reasons.push(`Annual income exceeds ceiling of ₹${scheme.maxIncome.toLocaleString('en-IN')} (Your income: ₹${user.annualIncome.toLocaleString('en-IN')})`);
      }
    } else {
      reasons.push(`Annual income ceiling is ₹${scheme.maxIncome.toLocaleString('en-IN')}. Please update income in profile.`);
    }
  } else {
    matchedCriteria.push('No annual income ceiling');
  }

  // 5. Gender check
  const targetGender = scheme.targetGender || 'All';
  if (targetGender === 'All') {
    matchedCriteria.push('Open to all genders');
  } else if (user.gender && user.gender.toLowerCase() === targetGender.toLowerCase()) {
    matchedCriteria.push(`Targeted scheme for ${targetGender}`);
  } else if (user.gender) {
    reasons.push(`Scheme is exclusively for ${targetGender} applicants`);
  }

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    reasons,
    matchedCriteria
  };
};

/**
 * Check if a business card is eligible for a scheme
 * @param {Object} business - Business card object
 * @param {Object} scheme - Scheme object
 * @returns {Object} { isEligible: boolean, reasons: string[], matchedCriteria: string[] }
 */
export const evaluateBusinessEligibility = (business, scheme) => {
  const reasons = [];
  const matchedCriteria = [];

  if (!scheme.isBusinessScheme) {
    return {
      isEligible: false,
      reasons: ['This is an individual/personal citizen scheme, not a business scheme.'],
      matchedCriteria
    };
  }

  if (!business) {
    return {
      isEligible: false,
      reasons: ['No business selected.'],
      matchedCriteria
    };
  }

  const businessTypes = parseJsonSafe(scheme.businessTypes, ['All']);

  // 1. Business Type check
  if (businessTypes.includes('All')) {
    matchedCriteria.push('Open to all business enterprise types');
  } else if (business.type && businessTypes.some(t => t.toLowerCase() === business.type.toLowerCase())) {
    matchedCriteria.push(`Eligible for business enterprise type: ${business.type}`);
  } else if (business.type) {
    reasons.push(`Applicable only for business types: ${businessTypes.join(', ')} (Your type: ${business.type})`);
  } else {
    reasons.push(`Business type not specified. Applicable for: ${businessTypes.join(', ')}`);
  }

  // 2. Active status check
  if (scheme.isActive) {
    matchedCriteria.push('Scheme is currently accepting applications');
  } else {
    reasons.push('Scheme applications are currently closed');
  }

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    reasons,
    matchedCriteria
  };
};
