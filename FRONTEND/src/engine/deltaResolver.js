/**
 * NagrikPath Digital India 2.0 Reference Architecture
 * Delta Resolver Engine
 * PURE JAVASCRIPT - Zero React/DOM dependencies
 */

/**
 * Calculates months elapsed between issuance date and now.
 * @param {Date} issuedDate 
 * @param {Date} [now]
 * @returns {number}
 */
function getMonthsElapsed(issuedDate, now = new Date()) {
  if (!issuedDate || isNaN(issuedDate.getTime())) return 0;
  return (
    (now.getFullYear() - issuedDate.getFullYear()) * 12 +
    (now.getMonth() - issuedDate.getMonth()) +
    (now.getDate() - issuedDate.getDate()) / 30.4375
  );
}

/**
 * Formats an ISO date into DD-MM-YYYY format
 * @param {string} dateStr 
 * @returns {string}
 */
export function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Evaluates document ledger differences between citizen and scheme requirements.
 * Implements federated DPI inheritance and dual expiry evaluation.
 *
 * @param {Object} activeMember - Active citizen profile
 * @param {Object} headOfHousehold - Primary head of household profile
 * @param {Object} scheme - Scheme specification from schemaRegistry
 * @returns {{
 *   fulfilledDocs: Array,
 *   missingDocs: Array,
 *   expiredDocs: Array,
 *   status: "BLOCKED" | "READY"
 * }}
 */
export function computeDelta(activeMember, headOfHousehold, scheme) {
  const fulfilledDocs = [];
  const missingDocs = [];
  const expiredDocs = [];

  const requiredDocs = scheme?.requiredDocs || [];
  const now = new Date();

  for (const reqDoc of requiredDocs) {
    let matchedDoc = null;
    let ownerMemberId = null;
    let inheritedFromHead = false;

    // 1. Evaluate the active member's own document ledger first
    const memberDoc = activeMember?.documents?.find((d) => d.docTag === reqDoc.docTag);
    if (memberDoc) {
      matchedDoc = memberDoc;
      ownerMemberId = activeMember.memberId;
      inheritedFromHead = false;
    } else if (reqDoc.inheritFromHead && headOfHousehold) {
      // 2. For inheritFromHead: true docs not held by active member, evaluate Head of Household
      const headDoc = headOfHousehold?.documents?.find((d) => d.docTag === reqDoc.docTag);
      if (headDoc) {
        matchedDoc = headDoc;
        ownerMemberId = headOfHousehold.memberId;
        inheritedFromHead = true;
      }
    }

    // If document is not found anywhere
    if (!matchedDoc) {
      missingDocs.push({
        docTag: reqDoc.docTag,
        label: reqDoc.label,
        reason: "NOT_UPLOADED"
      });
      continue;
    }

    // 3. DUAL EXPIRY EVALUATION:
    // A document is expired if EITHER:
    //  (a) new Date(expiresOn) < new Date(), OR
    //  (b) months elapsed since issuedOn > the required doc's maxAgeMonths
    // Also respects explicit isExpired flag or EXPIRED status
    const issuedDate = new Date(matchedDoc.issuedOn || matchedDoc.issuanceTimestamp);
    const monthsElapsed = getMonthsElapsed(issuedDate, now);
    const maxAge = reqDoc.maxAgeMonths || scheme?.maxAgeMonths;

    const isPastExplicitExpiry = matchedDoc.expiresOn ? new Date(matchedDoc.expiresOn) < now : false;
    const isExceededMaxAge = maxAge !== undefined && monthsElapsed > maxAge;
    const isExplicitlyExpired = matchedDoc.isExpired === true || matchedDoc.status === "EXPIRED";

    const isExpired = isPastExplicitExpiry || isExceededMaxAge || isExplicitlyExpired;

    if (isExpired) {
      const formattedDate = formatDateDDMMYYYY(matchedDoc.expiresOn || matchedDoc.issuedOn);
      expiredDocs.push({
        docTag: reqDoc.docTag,
        label: reqDoc.label,
        reason: "EXPIRED",
        ownerMemberId,
        canFetchLatest: true,
        inheritedFromHead,
        expiresOn: matchedDoc.expiresOn || null,
        formattedExpiry: formattedDate,
        displayMessage: inheritedFromHead
          ? `Inherited from Head of Household — EXPIRED (${formattedDate})`
          : `Document EXPIRED (${formattedDate})`
      });
    } else {
      fulfilledDocs.push({
        docTag: reqDoc.docTag,
        label: reqDoc.label,
        uri: matchedDoc.uri,
        issuer: matchedDoc.issuer,
        issuedOn: matchedDoc.issuedOn || matchedDoc.issuanceTimestamp,
        expiresOn: matchedDoc.expiresOn || null,
        ownerMemberId,
        inheritedFromHead
      });
    }
  }

  // STATUS RULE: "READY" ONLY if both missingDocs and expiredDocs are empty. Otherwise "BLOCKED".
  const isReady = missingDocs.length === 0 && expiredDocs.length === 0;
  const status = isReady ? "READY" : "BLOCKED";

  return {
    fulfilledDocs,
    missingDocs,
    expiredDocs,
    status
  };
}

export default computeDelta;
