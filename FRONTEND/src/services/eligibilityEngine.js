/**
 * YojanaSetu Server-Authoritative Scheme Eligibility Engine
 * Multi-dimensional rule-based evaluation with explainable reasoning
 */

import { calculateAge, getLifeStatusLabel, getOccupationLabel, getSectorLabel } from '../data/taxonomy.js';

/**
 * Evaluates a scheme against a user profile.
 *
 * @param {Object} scheme - Scheme data model with eligibility configuration
 * @param {Object} userProfile - User profile data model
 * @returns {Object} Evaluation result with explainable reasoning
 */
export const evaluateSchemeEligibility = (scheme, userProfile = {}) => {
  if (!scheme) {
    return {
      status: 'NOT_ELIGIBLE',
      matchScore: 0,
      isEligible: false,
      summary: 'Scheme data is unavailable.',
      criteriaResults: [],
      missingFields: []
    };
  }

  const criteriaResults = [];
  const missingFields = [];
  let isDisqualified = false;
  let hasMissingRequiredInfo = false;
  let matchPoints = 0;
  let maxPossiblePoints = 0;

  // =========================================================================
  // 1. DATE OF BIRTH & AGE EVALUATION (Server-authoritative calculation)
  // =========================================================================
  const calculatedAge = calculateAge(userProfile.dob);
  const minAge = scheme.minAge !== undefined ? Number(scheme.minAge) : 0;
  const maxAge = scheme.maxAge !== undefined ? Number(scheme.maxAge) : 120;

  if (minAge > 0 || maxAge < 120) {
    maxPossiblePoints += 25;
    if (!userProfile.dob || calculatedAge === null) {
      hasMissingRequiredInfo = true;
      missingFields.push('dob');
      criteriaResults.push({
        id: 'age',
        label: 'Age Requirement',
        satisfied: false,
        isMissing: true,
        message: `Scheme requires age between ${minAge} and ${maxAge} years. Please provide your Date of Birth.`,
        requiredValue: `${minAge} – ${maxAge} Years`,
        userValue: 'Date of Birth Not Provided'
      });
    } else if (calculatedAge < minAge) {
      isDisqualified = true;
      criteriaResults.push({
        id: 'age',
        label: 'Age Requirement',
        satisfied: false,
        isMissing: false,
        message: `Minimum age required is ${minAge} years. Current calculated age from DOB is ${calculatedAge} years.`,
        requiredValue: `Min ${minAge} Years`,
        userValue: `${calculatedAge} Years`
      });
    } else if (calculatedAge > maxAge) {
      isDisqualified = true;
      criteriaResults.push({
        id: 'age',
        label: 'Age Requirement',
        satisfied: false,
        isMissing: false,
        message: `Maximum age limit is ${maxAge} years. Current calculated age from DOB is ${calculatedAge} years.`,
        requiredValue: `Max ${maxAge} Years`,
        userValue: `${calculatedAge} Years`
      });
    } else {
      matchPoints += 25;
      criteriaResults.push({
        id: 'age',
        label: 'Age Requirement',
        satisfied: true,
        isMissing: false,
        message: `Age criteria satisfied (${calculatedAge} years, required: ${minAge}–${maxAge} years).`,
        requiredValue: `${minAge} – ${maxAge} Years`,
        userValue: `${calculatedAge} Years`
      });
    }
  }

  // =========================================================================
  // 2. GOVERNMENT LEVEL & STATE JURISDICTION EVALUATION
  // =========================================================================
  const isStateScheme = scheme.governmentLevel === 'state';
  const applicableStates = Array.isArray(scheme.applicableStates) ? scheme.applicableStates : ['ALL'];
  maxPossiblePoints += 30;

  if (!isStateScheme || applicableStates.includes('ALL') || applicableStates.includes('All States')) {
    matchPoints += 30;
    criteriaResults.push({
      id: 'jurisdiction',
      label: 'Geographic Jurisdiction',
      satisfied: true,
      isMissing: false,
      message: 'Central Government Scheme — Open to eligible citizens across all States & UTs.',
      requiredValue: 'All India',
      userValue: userProfile.state || 'All India'
    });
  } else {
    if (!userProfile.state) {
      hasMissingRequiredInfo = true;
      missingFields.push('state');
      criteriaResults.push({
        id: 'jurisdiction',
        label: 'State Jurisdiction',
        satisfied: false,
        isMissing: true,
        message: `State Scheme applicable in: ${applicableStates.join(', ')}. Please provide your State of residence.`,
        requiredValue: applicableStates.join(', '),
        userValue: 'Not Provided'
      });
    } else if (applicableStates.includes(userProfile.state)) {
      matchPoints += 30;
      criteriaResults.push({
        id: 'jurisdiction',
        label: 'State Jurisdiction',
        satisfied: true,
        isMissing: false,
        message: `State match confirmed (${userProfile.state}).`,
        requiredValue: applicableStates.join(', '),
        userValue: userProfile.state
      });
    } else {
      isDisqualified = true;
      criteriaResults.push({
        id: 'jurisdiction',
        label: 'State Jurisdiction',
        satisfied: false,
        isMissing: false,
        message: `Scheme is only open to residents of ${applicableStates.join(', ')}. Your registered state is ${userProfile.state}.`,
        requiredValue: applicableStates.join(', '),
        userValue: userProfile.state
      });
    }
  }

  // =========================================================================
  // 3. LIFE STATUS EVALUATION
  // =========================================================================
  const eligibleLifeStatuses = Array.isArray(scheme.eligibleLifeStatuses) && scheme.eligibleLifeStatuses.length > 0
    ? scheme.eligibleLifeStatuses
    : ['ALL'];

  if (!eligibleLifeStatuses.includes('ALL')) {
    maxPossiblePoints += 20;
    if (!userProfile.life_status) {
      hasMissingRequiredInfo = true;
      missingFields.push('life_status');
      criteriaResults.push({
        id: 'life_status',
        label: 'Life Status',
        satisfied: false,
        isMissing: true,
        message: `Scheme targets: ${eligibleLifeStatuses.map(getLifeStatusLabel).join(', ')}. Please select your Life Status.`,
        requiredValue: eligibleLifeStatuses.map(getLifeStatusLabel).join(', '),
        userValue: 'Not Selected'
      });
    } else if (eligibleLifeStatuses.includes(userProfile.life_status)) {
      matchPoints += 20;
      criteriaResults.push({
        id: 'life_status',
        label: 'Life Status',
        satisfied: true,
        isMissing: false,
        message: `Life status matches: ${getLifeStatusLabel(userProfile.life_status)}.`,
        requiredValue: eligibleLifeStatuses.map(getLifeStatusLabel).join(', '),
        userValue: getLifeStatusLabel(userProfile.life_status)
      });
    } else {
      isDisqualified = true;
      criteriaResults.push({
        id: 'life_status',
        label: 'Life Status',
        satisfied: false,
        isMissing: false,
        message: `Scheme is designed for ${eligibleLifeStatuses.map(getLifeStatusLabel).join(', ')}. Your profile indicates ${getLifeStatusLabel(userProfile.life_status)}.`,
        requiredValue: eligibleLifeStatuses.map(getLifeStatusLabel).join(', '),
        userValue: getLifeStatusLabel(userProfile.life_status)
      });
    }
  }

  // =========================================================================
  // 4. OCCUPATION EVALUATION
  // =========================================================================
  const eligibleOccupations = Array.isArray(scheme.eligibleOccupations) && scheme.eligibleOccupations.length > 0
    ? scheme.eligibleOccupations
    : ['ALL'];
  const occRequirement = scheme.eligibleOccupationRequirement || (eligibleOccupations.includes('ALL') ? 'none' : 'required');

  if (occRequirement !== 'none' && !eligibleOccupations.includes('ALL')) {
    maxPossiblePoints += 15;
    if (!userProfile.occupation) {
      if (occRequirement === 'required') {
        hasMissingRequiredInfo = true;
        missingFields.push('occupation');
        criteriaResults.push({
          id: 'occupation',
          label: 'Occupation Eligibility',
          satisfied: false,
          isMissing: true,
          message: `Mandatory occupation match required: ${eligibleOccupations.map(getOccupationLabel).join(', ')}. Please specify your occupation.`,
          requiredValue: eligibleOccupations.map(getOccupationLabel).join(', '),
          userValue: 'Not Provided'
        });
      } else {
        // Optional occupation
        criteriaResults.push({
          id: 'occupation',
          label: 'Occupation Preference',
          satisfied: false,
          isMissing: false,
          message: `Priority given to: ${eligibleOccupations.map(getOccupationLabel).join(', ')}. (Optional for this scheme).`,
          requiredValue: eligibleOccupations.map(getOccupationLabel).join(', '),
          userValue: 'General'
        });
      }
    } else if (eligibleOccupations.includes(userProfile.occupation)) {
      matchPoints += 15;
      criteriaResults.push({
        id: 'occupation',
        label: 'Occupation Eligibility',
        satisfied: true,
        isMissing: false,
        message: `Direct occupation match: ${getOccupationLabel(userProfile.occupation)}.`,
        requiredValue: eligibleOccupations.map(getOccupationLabel).join(', '),
        userValue: getOccupationLabel(userProfile.occupation)
      });
    } else {
      if (occRequirement === 'required') {
        isDisqualified = true;
        criteriaResults.push({
          id: 'occupation',
          label: 'Occupation Eligibility',
          satisfied: false,
          isMissing: false,
          message: `Scheme restricted to specific occupations: ${eligibleOccupations.map(getOccupationLabel).join(', ')}.`,
          requiredValue: eligibleOccupations.map(getOccupationLabel).join(', '),
          userValue: getOccupationLabel(userProfile.occupation)
        });
      } else {
        criteriaResults.push({
          id: 'occupation',
          label: 'Occupation Preference',
          satisfied: false,
          isMissing: false,
          message: `Your occupation (${getOccupationLabel(userProfile.occupation)}) does not receive specialized priority, but is not disqualified.`,
          requiredValue: eligibleOccupations.map(getOccupationLabel).join(', '),
          userValue: getOccupationLabel(userProfile.occupation)
        });
      }
    }
  }

  // =========================================================================
  // 5. SECTOR EVALUATION
  // =========================================================================
  const eligibleSectors = Array.isArray(scheme.eligibleSectors) && scheme.eligibleSectors.length > 0
    ? scheme.eligibleSectors
    : ['ALL'];
  const sectorRequirement = scheme.eligibleSectorRequirement || (eligibleSectors.includes('ALL') ? 'none' : 'required');

  if (sectorRequirement !== 'none' && !eligibleSectors.includes('ALL')) {
    maxPossiblePoints += 15;
    if (!userProfile.sector) {
      if (sectorRequirement === 'required') {
        hasMissingRequiredInfo = true;
        missingFields.push('sector');
        criteriaResults.push({
          id: 'sector',
          label: 'Sector Eligibility',
          satisfied: false,
          isMissing: true,
          message: `Mandatory sector match required: ${eligibleSectors.map(getSectorLabel).join(', ')}. Please specify your industry/sector.`,
          requiredValue: eligibleSectors.map(getSectorLabel).join(', '),
          userValue: 'Not Provided'
        });
      } else {
        criteriaResults.push({
          id: 'sector',
          label: 'Sector Preference',
          satisfied: false,
          isMissing: false,
          message: `Priority given to: ${eligibleSectors.map(getSectorLabel).join(', ')}. (Optional for this scheme).`,
          requiredValue: eligibleSectors.map(getSectorLabel).join(', '),
          userValue: 'General'
        });
      }
    } else if (eligibleSectors.includes(userProfile.sector)) {
      matchPoints += 15;
      criteriaResults.push({
        id: 'sector',
        label: 'Sector Eligibility',
        satisfied: true,
        isMissing: false,
        message: `Direct sector match: ${getSectorLabel(userProfile.sector)}.`,
        requiredValue: eligibleSectors.map(getSectorLabel).join(', '),
        userValue: getSectorLabel(userProfile.sector)
      });
    } else {
      if (sectorRequirement === 'required') {
        isDisqualified = true;
        criteriaResults.push({
          id: 'sector',
          label: 'Sector Eligibility',
          satisfied: false,
          isMissing: false,
          message: `Scheme restricted to specific sectors: ${eligibleSectors.map(getSectorLabel).join(', ')}.`,
          requiredValue: eligibleSectors.map(getSectorLabel).join(', '),
          userValue: getSectorLabel(userProfile.sector)
        });
      } else {
        criteriaResults.push({
          id: 'sector',
          label: 'Sector Preference',
          satisfied: false,
          isMissing: false,
          message: `Your sector (${getSectorLabel(userProfile.sector)}) does not receive specialized priority, but is not disqualified.`,
          requiredValue: eligibleSectors.map(getSectorLabel).join(', '),
          userValue: getSectorLabel(userProfile.sector)
        });
      }
    }
  }

  // =========================================================================
  // 6. INCOME EVALUATION
  // =========================================================================
  const maxIncome = scheme.maxIncome ? Number(scheme.maxIncome) : null;
  if (maxIncome !== null && maxIncome > 0) {
    maxPossiblePoints += 15;
    if (userProfile.income === undefined || userProfile.income === null || isNaN(userProfile.income)) {
      hasMissingRequiredInfo = true;
      missingFields.push('income');
      criteriaResults.push({
        id: 'income',
        label: 'Income Ceiling',
        satisfied: false,
        isMissing: true,
        message: `Annual household income ceiling is ₹${maxIncome.toLocaleString('en-IN')}. Please provide your annual income.`,
        requiredValue: `≤ ₹${maxIncome.toLocaleString('en-IN')}`,
        userValue: 'Not Provided'
      });
    } else if (Number(userProfile.income) <= maxIncome) {
      matchPoints += 15;
      criteriaResults.push({
        id: 'income',
        label: 'Income Ceiling',
        satisfied: true,
        isMissing: false,
        message: `Income criteria met (₹${Number(userProfile.income).toLocaleString('en-IN')} ≤ ₹${maxIncome.toLocaleString('en-IN')}).`,
        requiredValue: `≤ ₹${maxIncome.toLocaleString('en-IN')}`,
        userValue: `₹${Number(userProfile.income).toLocaleString('en-IN')}`
      });
    } else {
      isDisqualified = true;
      criteriaResults.push({
        id: 'income',
        label: 'Income Ceiling',
        satisfied: false,
        isMissing: false,
        message: `Annual income (₹${Number(userProfile.income).toLocaleString('en-IN')}) exceeds scheme limit of ₹${maxIncome.toLocaleString('en-IN')}.`,
        requiredValue: `≤ ₹${maxIncome.toLocaleString('en-IN')}`,
        userValue: `₹${Number(userProfile.income).toLocaleString('en-IN')}`
      });
    }
  }

  // =========================================================================
  // 7. COMPUTE FINAL CLASSIFICATION & RECOMMENDATION RELEVANCE SCORE
  // =========================================================================
  const calculatedMatchScore = maxPossiblePoints > 0
    ? Math.round((matchPoints / maxPossiblePoints) * 100)
    : 70;

  if (isDisqualified) {
    return {
      status: 'NOT_ELIGIBLE',
      matchScore: 0,
      isEligible: false,
      summary: 'You do not meet one or more mandatory eligibility requirements for this scheme.',
      criteriaResults,
      missingFields
    };
  }

  if (hasMissingRequiredInfo) {
    return {
      status: 'NEEDS_INFO',
      matchScore: calculatedMatchScore,
      isEligible: null, // Indeterminate until information provided
      summary: `This scheme may be suitable for you, but requires additional profile information (${missingFields.join(', ')}).`,
      criteriaResults,
      missingFields
    };
  }

  // High Match vs Potential Match
  const hasSpecificMatch = criteriaResults.some(
    (c) =>
      c.satisfied &&
      ['occupation', 'sector', 'life_status'].includes(c.id) &&
      c.message.includes('Direct')
  );

  const finalStatus = hasSpecificMatch || calculatedMatchScore >= 80 ? 'HIGH_MATCH' : 'POTENTIAL_MATCH';

  return {
    status: finalStatus,
    matchScore: calculatedMatchScore,
    isEligible: true,
    summary:
      finalStatus === 'HIGH_MATCH'
        ? 'High match — Your profile aligns directly with the target beneficiaries of this scheme.'
        : 'Eligible — You satisfy the foundational eligibility requirements for this scheme.',
    criteriaResults,
    missingFields: []
  };
};

/**
 * Evaluates and ranks a list of schemes based on personalized relevance for a user.
 *
 * @param {Array} schemes - Array of schemes
 * @param {Object} userProfile - User profile
 * @returns {Array} Schemes enriched with evaluation results and sorted by relevance
 */
export const rankSchemesForUser = (schemes, userProfile = {}) => {
  if (!Array.isArray(schemes)) return [];

  const evaluated = schemes.map((scheme) => {
    const evaluation = evaluateSchemeEligibility(scheme, userProfile);

    // Specificity Bonus: Schemes specifically tailored to user's Life Status, Occupation, Sector, or State rank higher than generic blanket schemes
    let specificityBonus = 0;

    if (userProfile.life_status && scheme.eligibleLifeStatuses && !scheme.eligibleLifeStatuses.includes('ALL') && scheme.eligibleLifeStatuses.includes(userProfile.life_status)) {
      specificityBonus += 80;
    }

    if (userProfile.occupation && scheme.eligibleOccupations && !scheme.eligibleOccupations.includes('ALL') && scheme.eligibleOccupations.includes(userProfile.occupation)) {
      specificityBonus += 80;
    }

    if (userProfile.sector && scheme.eligibleSectors && !scheme.eligibleSectors.includes('ALL') && scheme.eligibleSectors.includes(userProfile.sector)) {
      specificityBonus += 40;
    }

    if (userProfile.state && scheme.governmentLevel === 'state' && scheme.applicableStates?.includes(userProfile.state)) {
      specificityBonus += 40;
    }

    return {
      ...scheme,
      evaluation,
      rankingScore: (evaluation.status === 'HIGH_MATCH' ? 400 : evaluation.status === 'POTENTIAL_MATCH' ? 300 : evaluation.status === 'NEEDS_INFO' ? 200 : 0) + evaluation.matchScore + specificityBonus
    };
  });

  return evaluated.sort((a, b) => {
    return b.rankingScore - a.rankingScore;
  });
};
