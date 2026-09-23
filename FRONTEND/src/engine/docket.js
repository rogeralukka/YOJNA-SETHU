/**
 * NagrikPath Digital India 2.0 Reference Architecture
 * Citizen Service Docket Generator (JSON-LD)
 * PURE JAVASCRIPT - Zero React/DOM dependencies
 */

/**
 * Builds an immutable, verifiable JSON-LD citizen service docket.
 *
 * @param {Object} activeMember - The active citizen member
 * @param {Object} scheme - The target scheme specification
 * @param {Array} [fulfilledDocs=[]] - Verified fulfilled documents
 * @param {Array} [missingDocs=[]] - Missing required documents
 * @param {Array} [expiredDocs=[]] - Expired documents requiring re-issuance
 * @returns {Object} JSON-LD docket representation
 */
export function buildDocket(
  activeMember,
  scheme,
  fulfilledDocs = [],
  missingDocs = [],
  expiredDocs = []
) {
  // CRITICAL STATUS LOGIC:
  // Return status: "READY" ONLY IF missingDocs.length === 0 AND expiredDocs.length === 0.
  // Otherwise return "BLOCKED".
  const hasMissing = Array.isArray(missingDocs) && missingDocs.length > 0;
  const hasExpired = Array.isArray(expiredDocs) && expiredDocs.length > 0;
  const isReady = !hasMissing && !hasExpired;
  const status = isReady ? "READY" : "BLOCKED";

  return {
    "@context": "https://schema.org/DigitalDocument/CitizenServiceDocket/v1",
    type: "CitizenServiceDocket",
    scheme: {
      id: scheme?.id || "",
      name: scheme?.name || "",
      level: scheme?.level || ""
    },
    citizen: {
      memberId: activeMember?.memberId || "",
      name: activeMember?.name || "",
      maskedAadhaar: activeMember?.maskedAadhaar || "",
      category: activeMember?.category || ""
    },
    fulfilledDocuments: fulfilledDocs,
    missingDocuments: missingDocs,
    expiredDocuments: expiredDocs,
    generatedAt: new Date().toISOString(),
    status
  };
}

export default buildDocket;
