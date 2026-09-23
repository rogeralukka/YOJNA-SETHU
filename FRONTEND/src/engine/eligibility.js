/**
 * NagrikPath Digital India 2.0 Reference Architecture
 * Scheme Eligibility Engine
 * PURE JAVASCRIPT - Zero React/DOM dependencies
 */

/**
 * Evaluates whether an active household member qualifies for a scheme.
 *
 * @param {Object} activeMember - The citizen member being evaluated
 * @param {Object} headOfHousehold - The primary head of household
 * @param {Object} scheme - Scheme definition including eligibility criteria
 * @returns {{ eligible: boolean, reasons: string[] }}
 */
export function checkEligibility(activeMember, headOfHousehold, scheme) {
  if (!scheme || !scheme.eligibility) {
    return {
      eligible: true,
      reasons: ["No explicit eligibility restrictions specified for this scheme."]
    };
  }

  const { eligibility } = scheme;
  const reasons = [];
  let isEligible = true;

  // 1. Age Evaluation
  if (eligibility.minAge !== undefined && activeMember?.age !== undefined) {
    if (activeMember.age < eligibility.minAge) {
      isEligible = false;
      reasons.push(
        `Age requirement not met: Citizen is ${activeMember.age} years old, but minimum required age is ${eligibility.minAge} years.`
      );
    } else {
      reasons.push(
        `Age criterion met: Citizen age ${activeMember.age} satisfies minimum age threshold of ${eligibility.minAge} years.`
      );
    }
  }

  if (eligibility.maxAge !== undefined && activeMember?.age !== undefined) {
    if (activeMember.age > eligibility.maxAge) {
      isEligible = false;
      reasons.push(
        `Age requirement not met: Citizen is ${activeMember.age} years old, which exceeds the maximum limit of ${eligibility.maxAge} years.`
      );
    }
  }

  // 2. Social Category Evaluation
  if (Array.isArray(eligibility.category) && eligibility.category.length > 0) {
    const memberCategory = (activeMember?.category || headOfHousehold?.category || "").toUpperCase();
    const allowedCategories = eligibility.category.map((c) => c.toUpperCase());

    if (allowedCategories.includes("ALL") || allowedCategories.includes(memberCategory)) {
      reasons.push(
        `Category criterion met: Citizen belongs to '${memberCategory || "General"}', which is eligible under [${eligibility.category.join(", ")}].`
      );
    } else {
      isEligible = false;
      reasons.push(
        `Category requirement not met: Citizen category '${memberCategory}' is not eligible (Required: ${eligibility.category.join(", ")}).`
      );
    }
  }

  // 3. Income Evaluation (Household or individual)
  if (eligibility.maxIncome !== undefined) {
    // For students or dependents with 0 income, evaluate household/head income
    const effectiveIncome =
      activeMember?.annualIncome && activeMember.annualIncome > 0
        ? activeMember.annualIncome
        : headOfHousehold?.annualIncome ?? 0;

    if (effectiveIncome > eligibility.maxIncome) {
      isEligible = false;
      reasons.push(
        `Income ceiling exceeded: Household annual income ₹${effectiveIncome.toLocaleString("en-IN")} exceeds the maximum threshold of ₹${eligibility.maxIncome.toLocaleString("en-IN")}.`
      );
    } else {
      reasons.push(
        `Income criterion met: Household annual income ₹${effectiveIncome.toLocaleString("en-IN")} is within the limit of ₹${eligibility.maxIncome.toLocaleString("en-IN")}.`
      );
    }
  }

  // 4. Gender Evaluation
  if (eligibility.gender && eligibility.gender.toUpperCase() !== "ALL") {
    const requiredGender = eligibility.gender.toUpperCase();
    const memberGender = (activeMember?.gender || "").toUpperCase();

    if (memberGender !== requiredGender) {
      isEligible = false;
      reasons.push(
        `Gender requirement not met: Scheme is restricted to ${eligibility.gender}, but citizen gender is ${activeMember?.gender || "unspecified"}.`
      );
    } else {
      reasons.push(`Gender criterion met: Citizen identifies as ${activeMember.gender}.`);
    }
  }

  return {
    eligible: isEligible,
    reasons
  };
}

export default checkEligibility;
