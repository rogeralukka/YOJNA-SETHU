import React, { createContext, useContext, useState, useEffect } from "react";
import userProfileData from "../data/mock/userProfile.json";
import { hashPin, verifyPinHash } from "../lib/utils/hash";

const STORAGE_KEY = "nagrikpath_household";

export const HouseholdContext = createContext(null);

export function HouseholdProvider({ children }) {
  const [household, setHousehold] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.members)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read household from localStorage, falling back to seed", e);
    }
    return JSON.parse(JSON.stringify(userProfileData));
  });

  const [activeMemberId, setActiveMemberId] = useState(() => {
    const priya = household?.members?.find((m) => m.name.includes("Priya"));
    return priya ? priya.memberId : "mem_priya_03";
  });

  // Sync to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(household));
    } catch (e) {
      console.error("Failed to sync household to localStorage", e);
    }
  }, [household]);

  const activeMember =
    household?.members?.find((m) => m.memberId === activeMemberId) ||
    household?.members?.[0];

  const headOfHousehold =
    household?.members?.find(
      (m) => m.memberId === household.headMemberId || m.relation === "Head"
    ) || household?.members?.[0];

  const setActiveMember = (memberId) => {
    setActiveMemberId(memberId);
  };

  const addDocument = (memberId, docMetadata) => {
    setHousehold((prev) => {
      const updatedMembers = prev.members.map((m) => {
        if (m.memberId === memberId) {
          return {
            ...m,
            documents: [...(m.documents || []), docMetadata]
          };
        }
        return m;
      });
      return { ...prev, members: updatedMembers };
    });
  };

  const updateDocument = (memberId, docTag, updatesObject) => {
    setHousehold((prev) => {
      const updatedMembers = prev.members.map((m) => {
        if (m.memberId === memberId) {
          const updatedDocs = (m.documents || []).map((d) => {
            if (d.docTag === docTag) {
              return { ...d, ...updatesObject };
            }
            return d;
          });
          return { ...m, documents: updatedDocs };
        }
        return m;
      });
      return { ...prev, members: updatedMembers };
    });
  };

  const verifyPin = (memberId, pin) => {
    const member = household?.members?.find((m) => m.memberId === memberId);
    if (!member || !member.consents?.pin) return false;
    return verifyPinHash(pin, member.consents.pin);
  };

  const setPin = (memberId, pin) => {
    const pinHash = hashPin(pin);
    setHousehold((prev) => {
      const updatedMembers = prev.members.map((m) => {
        if (m.memberId === memberId) {
          return {
            ...m,
            consents: {
              pin: pinHash,
              setAt: pinHash ? new Date().toISOString() : null
            }
          };
        }
        return m;
      });
      return { ...prev, members: updatedMembers };
    });
  };

  const switchMemberWithPin = (targetMemberId, pin) => {
    const member = household?.members?.find((m) => m.memberId === targetMemberId);
    if (!member) return false;
    if (!member.consents?.pin) {
      if (pin) {
        setPin(targetMemberId, pin);
      }
      setActiveMemberId(targetMemberId);
      return true;
    }
    if (verifyPinHash(pin, member.consents.pin)) {
      setActiveMemberId(targetMemberId);
      return true;
    }
    return false;
  };

  const simulateIssuancePull = (memberId, docTag) => {
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);

    const nowIso = now.toISOString();
    const oneYearIso = oneYearLater.toISOString();

    updateDocument(memberId, docTag, {
      issuedOn: nowIso,
      issuanceTimestamp: nowIso,
      expiresOn: oneYearIso,
      isExpired: false,
      status: "VERIFIED"
    });
  };

  const resetToFactorySeed = () => {
    // 1. Delete localStorage key
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear localStorage", e);
    }

    // 2. Re-import userProfile fresh
    const fresh = JSON.parse(JSON.stringify(userProfileData));

    // 3. Restore baseline: Ramesh's income cert = expired (expiresOn "2024-03-31T00:00:00.000Z")
    const ramesh = fresh.members.find(
      (m) => m.memberId === fresh.headMemberId || m.name.includes("Ramesh")
    );
    if (ramesh) {
      const incomeDoc = ramesh.documents.find((d) => d.docTag === "DOC_INCOME_CERT");
      if (incomeDoc) {
        incomeDoc.expiresOn = "2024-03-31T00:00:00.000Z";
        incomeDoc.isExpired = true;
        incomeDoc.status = "EXPIRED";
      }
    }

    setHousehold(fresh);

    // 4. Set activeMemberId explicitly to Priya's ID
    const priya = fresh.members.find((m) => m.name.includes("Priya"));
    setActiveMemberId(priya ? priya.memberId : "mem_priya_03");
  };

  const applyScenario = (preset) => {
    // 1. Start fresh from factory seed
    const fresh = JSON.parse(JSON.stringify(userProfileData));

    if (preset === 1 || preset === "factory") {
      // Preset 1: Factory State (Ramesh Income Expired, Priya Active)
      const ramesh = fresh.members.find(
        (m) => m.memberId === fresh.headMemberId || m.name.includes("Ramesh")
      );
      if (ramesh) {
        const incomeDoc = ramesh.documents.find((d) => d.docTag === "DOC_INCOME_CERT");
        if (incomeDoc) {
          incomeDoc.expiresOn = "2024-03-31T00:00:00.000Z";
          incomeDoc.isExpired = true;
          incomeDoc.status = "EXPIRED";
        }
      }
      const priya = fresh.members.find((m) => m.name.includes("Priya"));
      setHousehold(fresh);
      setActiveMemberId(priya ? priya.memberId : "mem_priya_03");
      return;
    }

    if (preset === 2 || preset === "post_dpi") {
      // Preset 2: Post-DPI Resolution (Ramesh Income Valid Future Dates 2026-01-15 to 2027-01-15, Priya Active)
      const ramesh = fresh.members.find(
        (m) => m.memberId === fresh.headMemberId || m.name.includes("Ramesh")
      );
      if (ramesh) {
        const incomeDoc = ramesh.documents.find((d) => d.docTag === "DOC_INCOME_CERT");
        if (incomeDoc) {
          incomeDoc.issuedOn = "2026-01-15T00:00:00.000Z";
          incomeDoc.issuanceTimestamp = "2026-01-15T00:00:00.000Z";
          incomeDoc.expiresOn = "2027-01-15T00:00:00.000Z";
          incomeDoc.isExpired = false;
          incomeDoc.status = "VERIFIED";
        }
      }
      const priya = fresh.members.find((m) => m.name.includes("Priya"));
      setHousehold(fresh);
      setActiveMemberId(priya ? priya.memberId : "mem_priya_03");
      return;
    }

    if (preset === 3 || preset === "full_verified") {
      // Preset 3: Full Household 100% Verified (All credentials valid across all members)
      fresh.members.forEach((m) => {
        if (Array.isArray(m.documents)) {
          m.documents.forEach((d) => {
            d.issuedOn = "2026-01-15T00:00:00.000Z";
            d.issuanceTimestamp = "2026-01-15T00:00:00.000Z";
            d.expiresOn = "2027-01-15T00:00:00.000Z";
            d.isExpired = false;
            d.status = "VERIFIED";
          });
        }
      });
      const priya = fresh.members.find((m) => m.name.includes("Priya"));
      setHousehold(fresh);
      setActiveMemberId(priya ? priya.memberId : "mem_priya_03");
      return;
    }
  };

  return (
    <HouseholdContext.Provider
      value={{
        household,
        activeMemberId,
        activeMember,
        headOfHousehold,
        setActiveMember,
        addDocument,
        updateDocument,
        verifyPin,
        setPin,
        switchMemberWithPin,
        simulateIssuancePull,
        resetToFactorySeed,
        applyScenario
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
}

export default HouseholdContext;
