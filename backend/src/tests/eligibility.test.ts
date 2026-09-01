import { EligibilityService } from '../services/EligibilityService';

describe('EligibilityService Unit Tests', () => {
  const sampleUser = {
    age: 30,
    state: 'Maharashtra',
    category: 'OBC',
    annualIncome: 250000,
  };

  const sampleRules = {
    minAge: 18,
    maxAge: 50,
    maxIncome: 500000,
    allowedCategories: ['OBC', 'SC', 'ST'],
    allowedStates: ['Maharashtra', 'Gujarat'],
  };

  it('should pass eligibility when user meets all demographic criteria', () => {
    const result = EligibilityService.evaluate(sampleUser as any, sampleRules, ['Aadhaar']);
    expect(result.eligible).toBe(true);
    expect(result.missingRequirements.length).toBe(0);
  });

  it('should fail eligibility if user income exceeds maximum threshold', () => {
    const highIncomeUser = { ...sampleUser, annualIncome: 800000 };
    const result = EligibilityService.evaluate(highIncomeUser as any, sampleRules, ['Aadhaar']);
    expect(result.eligible).toBe(false);
    expect(result.reasons[0]).toContain('Annual income must be less than or equal to');
  });

  it('should fail eligibility if user state is not in allowed list', () => {
    const otherStateUser = { ...sampleUser, state: 'Tamil Nadu' };
    const result = EligibilityService.evaluate(otherStateUser as any, sampleRules, ['Aadhaar']);
    expect(result.eligible).toBe(false);
    expect(result.reasons[0]).toContain('Scheme valid only in states');
  });

  it('should fail eligibility for business scheme if business card is missing', () => {
    const result = EligibilityService.evaluate(sampleUser as any, sampleRules, ['Aadhaar'], true, null);
    expect(result.eligible).toBe(false);
    expect(result.missingRequirements).toContain('Active business card required for business scheme');
  });

  it('should evaluate business criteria correctly when business card is supplied', () => {
    const businessCard = {
      yearsInOperation: 3,
      annualTurnover: 1500000,
    };
    const businessRules = {
      ...sampleRules,
      minYearsInOperation: 2,
      maxAnnualTurnover: 5000000,
    };
    const result = EligibilityService.evaluate(sampleUser as any, businessRules, ['GST'], true, businessCard as any);
    expect(result.eligible).toBe(true);
  });
});
