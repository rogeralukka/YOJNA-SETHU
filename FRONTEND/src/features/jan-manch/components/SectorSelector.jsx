import React from "react";
import {
  Sprout,
  Droplets,
  HeartPulse,
  Building2,
  Zap,
  Home,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { useTranslation } from "react-i18next";

const SECTORS = [
  { id: "agriculture", key: "agriculture", label: "Agriculture", icon: Sprout },
  { id: "jaljeevan", key: "jalJeevan", label: "Jal Jeevan", icon: Droplets },
  { id: "health", key: "health", label: "Health", icon: HeartPulse },
  { id: "infrastructure", key: "infrastructure", label: "Infrastructure", icon: Building2 },
  { id: "clean-energy", key: "cleanEnergy", label: "Clean Energy", icon: Zap },
  { id: "housing", key: "housing", label: "Housing", icon: Home },
  { id: "livelihoods", key: "livelihoods", label: "Livelihoods", icon: Briefcase },
  { id: "education", key: "education", label: "Education", icon: GraduationCap }
];

/**
 * SectorSelector:
 * 8-sector horizontal selector with high-contrast Obsidian dark styling and smooth state switching.
 */
export default function SectorSelector({ activeSector, onSelectSector }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 border-b border-slate-200 dark:border-white/[0.08] overflow-x-auto pb-1 scrollbar-none">
      {SECTORS.map((sector) => {
        const Icon = sector.icon;
        const isActive =
          activeSector.toLowerCase() === sector.id.toLowerCase() ||
          activeSector.toLowerCase() === sector.label.toLowerCase();

        return (
          <button
            key={sector.id}
            type="button"
            onClick={() => onSelectSector(sector.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all duration-150 border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-[#0F1115] shadow-xs"
                : "border-transparent text-slate-500 dark:text-[#8A8F98] hover:text-slate-900 dark:hover:text-[#EDEDED] hover:bg-slate-100/70 dark:hover:bg-white/5"
            }`}
          >
            <Icon
              size={14}
              className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-[#8A8F98]"}
            />
            <span>{t(`janManch.sectors.${sector.key}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
