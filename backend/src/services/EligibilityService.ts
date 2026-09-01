import { User, BusinessCard } from '@prisma/client';

export interface SchemeRules {
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  allowedCategories?: string[];
  allowedStates?: string[];
  minYearsInOperation?: number;
  maxAnnualTurnover?: number;
  [key: string]: any;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  missingRequirements: string[];
  requiredDocuments: string[];
}

export class EligibilityService {
  static evaluate(
    user: Partial<User>,
    rulesJson: any,
    documentsRequiredJson: any,
    isBusinessScheme: boolean = false,
    businessCard?: Partial<BusinessCard> | null
  ): EligibilityResult {
    const rules: SchemeRules = rulesJson || {};
    const requiredDocuments: string[] = Array.isArray(documentsRequiredJson)
      ? documentsRequiredJson
      : [];

    const reasons: string[] = [];
    const missingRequirements: string[] = [];
    let eligible = true;

    // Check completeness of user profile
    if (user.age === undefined || user.age === null) {
      missingRequirements.push('User age missing in profile');
      eligible = false;
    }
    if (!user.state) {
      missingRequirements.push('User state missing in profile');
      eligible = false;
    }
    if (!user.category) {
      missingRequirements.push('User category missing in profile');
      eligible = false;
    }
    if (user.annualIncome === undefined || user.annualIncome === null) {
      missingRequirements.push('User annual income missing in profile');
      eligible = false;
    }

    if (isBusinessScheme) {
      if (!businessCard) {
        missingRequirements.push('Active business card required for business scheme');
        eligible = false;
      }
    }

    if (!eligible) {
      return {
        eligible: false,
        reasons: ['Incomplete user profile or missing business card'],
        missingRequirements,
        requiredDocuments,
      };
    }

    // Evaluate Age
    if (rules.minAge !== undefined && (user.age as number) < rules.minAge) {
      eligible = false;
      reasons.push(`Minimum age requirement is ${rules.minAge} years (User age: ${user.age})`);
    }
    if (rules.maxAge !== undefined && (user.age as number) > rules.maxAge) {
      eligible = false;
      reasons.push(`Maximum age limit is ${rules.maxAge} years (User age: ${user.age})`);
    }

    // Evaluate Income
    if (rules.maxIncome !== undefined && (user.annualIncome as number) > rules.maxIncome) {
      eligible = false;
      reasons.push(
        `Annual income must be less than or equal to ₹${rules.maxIncome.toLocaleString()} (User income: ₹${user.annualIncome?.toLocaleString()})`
      );
    }

    // Evaluate Category
    if (rules.allowedCategories && Array.isArray(rules.allowedCategories) && rules.allowedCategories.length > 0) {
      if (!rules.allowedCategories.includes('ALL') && !rules.allowedCategories.includes(user.category as string)) {
        eligible = false;
        reasons.push(
          `Scheme restricted to categories: ${rules.allowedCategories.join(', ')} (User category: ${user.category})`
        );
      }
    }

    // Evaluate State
    if (rules.allowedStates && Array.isArray(rules.allowedStates) && rules.allowedStates.length > 0) {
      if (!rules.allowedStates.includes('ALL') && !rules.allowedStates.includes(user.state as string)) {
        eligible = false;
        reasons.push(
          `Scheme valid only in states: ${rules.allowedStates.join(', ')} (User state: ${user.state})`
        );
      }
    }

    // Evaluate Business Scheme Rules
    if (isBusinessScheme && businessCard) {
      if (rules.minYearsInOperation !== undefined && businessCard.yearsInOperation! < rules.minYearsInOperation) {
        eligible = false;
        reasons.push(
          `Business must be in operation for at least ${rules.minYearsInOperation} years (Current: ${businessCard.yearsInOperation})`
        );
      }

      if (rules.maxAnnualTurnover !== undefined && businessCard.annualTurnover! > rules.maxAnnualTurnover) {
        eligible = false;
        reasons.push(
          `Business annual turnover must be under ₹${rules.maxAnnualTurnover.toLocaleString()} (Current: ₹${businessCard.annualTurnover?.toLocaleString()})`
        );
      }
    }

    if (eligible && reasons.length === 0) {
      reasons.push('Meets all demographic and eligibility criteria for this scheme');
    }

    return {
      eligible,
      reasons,
      missingRequirements,
      requiredDocuments,
    };
  }
}
