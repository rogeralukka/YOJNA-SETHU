import React from "react";
import { useTranslation } from "react-i18next";
import FamilyTree from "./FamilyTree";
import DocumentVault from "./DocumentVault";
import ConsentPinManager from "./ConsentPinManager";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Profile Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
          {t("profile.title")}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t("profile.subtitle")}
        </p>
      </div>

      {/* 1. Family Tree & Relationship Graph */}
      <FamilyTree />

      {/* 2. Document Vault Ledger */}
      <DocumentVault />

      {/* 3. Consent PIN Manager */}
      <ConsentPinManager />
    </div>
  );
}
