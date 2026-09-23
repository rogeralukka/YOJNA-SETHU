/**
 * Pure synchronous client-side deterministic hashing utility.
 * Digital India 2.0 Reference Architecture - Client-Side Security.
 * Zero Node.js 'crypto' imports - runs 100% synchronously in any browser.
 */

/**
 * Generic synchronous deterministic 32-bit FNV-1a hash algorithm.
 * 
 * @param {string | null | undefined} str - String payload to hash
 * @returns {string | null} 8-character hex hash digest or null
 */
export function hashString(str) {
  if (str === null || str === undefined || typeof str !== "string") {
    return null;
  }

  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Deterministically hashes a 4-digit PIN string with fixed salt continuity.
 * Strict null guard: returns null if pin is null, undefined, not a string, or invalid.
 *
 * @param {string | null | undefined} pin - 4-digit numeric PIN
 * @returns {string | null} Hex hash digest or null
 */
export function hashPin(pin) {
  if (pin === null || pin === undefined || typeof pin !== "string") {
    return null;
  }

  const cleanPin = pin.trim();
  if (!/^\d{4}$/.test(cleanPin)) {
    return null;
  }

  return hashString(`np_salt_v2_${cleanPin}`);
}

/**
 * Verifies an entered PIN against a stored hash.
 *
 * @param {string} enteredPin - Plaintext PIN entered by citizen
 * @param {string} storedHash - Stored hex hash
 * @returns {boolean} True if matching, false otherwise
 */
export function verifyPinHash(enteredPin, storedHash) {
  if (!enteredPin || !storedHash) {
    return false;
  }

  const computed = hashPin(enteredPin);
  return computed !== null && computed === storedHash;
}

export default {
  hashString,
  hashPin,
  verifyPinHash
};
