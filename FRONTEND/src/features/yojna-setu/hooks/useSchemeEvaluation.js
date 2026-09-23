import { useMemo } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import { useData } from '../../../yojna/context/DataContext';
import schemesSeed from '../../../data/seed/schemes.json';
import { initialSchemes } from '../../../yojna/data/initialSchemes';
import { checkEligibility } from '../../../engine/eligibility';
import { computeDelta } from '../../../engine/deltaResolver';

/**
 * useSchemeEvaluation:
 * Dual-Profile Evaluation Hook.
 * Consumes HouseholdContext & DataContext to evaluate schemes dynamically
 * for both Personal Citizen profiles (via deterministic engine checkEligibility + computeDelta)
 * and Enterprise/Business profiles (evaluating business attributes, GST, Udyam, turnover).
 */
export function useSchemeEvaluation() {
  const { household, activeMemberId, activeMember, headOfHousehold } = useHousehold();
  const { businesses, activeContext } = useData();

  const isPersonal = !activeContext || activeContext === 'personal';
  const activeBusiness = useMemo(() => {
    if (isPersonal) return null;
    return businesses?.find((b) => b.id === activeContext) || null;
  }, [isPersonal, activeContext, businesses]);

  const evaluatedSchemes = useMemo(() => {
    if (isPersonal) {
      // 1. INDIVIDUAL CITIZEN CONTEXT
      if (!activeMember || !headOfHousehold) {
        return [];
      }

      const schemesList = Object.values(schemesSeed);

      return schemesList.map((scheme) => {
        // Evaluate Eligibility Criteria via deterministic engine
        const eligibilityResult = checkEligibility(activeMember, headOfHousehold, scheme);

        if (!eligibilityResult.eligible) {
          const failureReason =
            eligibilityResult.reasons?.find(
              (r) =>
                r.toLowerCase().includes('not met') ||
                r.toLowerCase().includes('exceeded') ||
                r.toLowerCase().includes('restricted')
            ) ||
            eligibilityResult.reasons?.[0] ||
            'Eligibility criteria not satisfied.';

          return {
            ...scheme,
            state: 'INELIGIBLE',
            eligibilityResult,
            ineligibleReason: failureReason,
            delta: null
          };
        }

        // Criteria Passed -> Compute Document Delta
        const delta = computeDelta(activeMember, headOfHousehold, scheme);
        const isReady = delta.status === 'READY' || (delta.missingDocs.length === 0 && delta.expiredDocs.length === 0);

        return {
          ...scheme,
          state: isReady ? 'ELIGIBLE-READY' : 'ELIGIBLE-BLOCKED',
          eligibilityResult,
          delta
        };
      });
    } else {
      // 2. ENTERPRISE / BUSINESS CONTEXT
      if (!activeBusiness) return [];

      // Filter enterprise schemes from initialSchemes
      const enterpriseSchemes = initialSchemes.filter((s) => s.isBusinessScheme);

      return enterpriseSchemes.map((scheme) => {
        const hasGst = Boolean(activeBusiness.gst);
        const hasPan = Boolean(activeBusiness.pan);
        const hasUdyam = Boolean(activeBusiness.udyamRegNumber);

        // Build enterprise document delta
        const fulfilledDocs = [];
        const missingDocs = [];
        const expiredDocs = [];

        if (hasPan) {
          fulfilledDocs.push({
            docTag: 'DOC_BIZ_PAN',
            label: 'Company / Firm PAN Card',
            issuer: 'Income Tax Department',
            uri: `digilocker://in.gov.incometax/pan/${activeBusiness.pan}`
          });
        } else {
          missingDocs.push({
            docTag: 'DOC_BIZ_PAN',
            label: 'Company / Firm PAN Card'
          });
        }

        if (hasGst) {
          fulfilledDocs.push({
            docTag: 'DOC_GST_CERT',
            label: 'GST Registration Certificate (GSTIN)',
            issuer: 'Goods & Services Tax Network',
            uri: `digilocker://gov.gst/cert/${activeBusiness.gst}`
          });
        } else {
          missingDocs.push({
            docTag: 'DOC_GST_CERT',
            label: 'GST Registration Certificate'
          });
        }

        if (hasUdyam) {
          fulfilledDocs.push({
            docTag: 'DOC_UDYAM_CERT',
            label: 'Udyam MSME Registration Certificate',
            issuer: 'Ministry of MSME',
            uri: `digilocker://gov.msme/udyam/${activeBusiness.udyamRegNumber}`
          });
        } else {
          missingDocs.push({
            docTag: 'DOC_UDYAM_CERT',
            label: 'Udyam Registration Certificate'
          });
        }

        // Sector matching
        const schemeSectors = scheme.eligibleSectors || ['ALL'];
        const matchesSector = schemeSectors.includes('ALL') || schemeSectors.some((sec) =>
          activeBusiness.industryCategory.toLowerCase().includes(sec.toLowerCase())
        );

        // State matching for state schemes
        const matchesState = scheme.governmentLevel === 'central' || (scheme.applicableStates || ['ALL']).includes('ALL') ||
          (activeBusiness.address && activeBusiness.address.includes('Uttar Pradesh'));

        const isEligible = matchesSector && matchesState;
        if (!isEligible) {
          return {
            id: scheme.id,
            name: scheme.name,
            level: scheme.governmentLevel === 'central' ? 'CENTRAL' : 'STATE',
            sector: scheme.category || 'Manufacturing & MSME',
            department: scheme.department,
            benefit: scheme.benefit,
            benefitSummary: scheme.benefitDetail || scheme.benefit,
            deadline: scheme.deadlineText || 'Always Open',
            state: 'INELIGIBLE',
            ineligibleReason: `Industry sector (${activeBusiness.industryCategory}) does not match scheme scope.`,
            delta: null
          };
        }

        const isReady = missingDocs.length === 0 && expiredDocs.length === 0;

        return {
          id: scheme.id,
          name: scheme.name,
          level: scheme.governmentLevel === 'central' ? 'CENTRAL' : 'STATE',
          sector: scheme.category || 'Manufacturing & MSME',
          department: scheme.department,
          benefit: scheme.benefit,
          benefitSummary: scheme.benefitDetail || scheme.benefit,
          deadline: scheme.deadlineText || 'Always Open',
          state: isReady ? 'ELIGIBLE-READY' : 'ELIGIBLE-BLOCKED',
          delta: {
            status: isReady ? 'READY' : 'BLOCKED',
            fulfilledDocs,
            missingDocs,
            expiredDocs
          }
        };
      });
    }
  }, [isPersonal, household, activeMemberId, activeMember, headOfHousehold, activeBusiness]);

  // Compute dynamic counts
  const eligibleReadyCount = useMemo(
    () => evaluatedSchemes.filter((s) => s.state === 'ELIGIBLE-READY').length,
    [evaluatedSchemes]
  );

  const eligibleBlockedCount = useMemo(
    () => evaluatedSchemes.filter((s) => s.state === 'ELIGIBLE-BLOCKED').length,
    [evaluatedSchemes]
  );

  const ineligibleCount = useMemo(
    () => evaluatedSchemes.filter((s) => s.state === 'INELIGIBLE').length,
    [evaluatedSchemes]
  );

  const totalEligible = eligibleReadyCount + eligibleBlockedCount;

  return {
    evaluatedSchemes,
    eligibleReadyCount,
    eligibleBlockedCount,
    ineligibleCount,
    totalEligible,
    activeMember,
    headOfHousehold,
    activeBusiness,
    isEnterpriseContext: !isPersonal
  };
}

export default useSchemeEvaluation;
