import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Landmark,
  GraduationCap,
  Briefcase,
  Sprout,
  Building2,
  ArrowRight
} from "lucide-react";
import { useHousehold } from "../context/HouseholdContext";
import IntentRouterSearch from "../features/intent-router/IntentRouterSearch";

/**
 * HomeDashboard (/home)
 * Features:
 *   • Welcome back, {activeMember.name}!
 *   • ALL SERVICES header
 *   • Reserved empty Intent Router slot (no search bar rendered)
 *   • Exactly 5 domain cards (Yojna, Shiksha, Rozgar, Kisan, Nagar)
 *   • Minimalist SVG line icons with crisp card outlines
 *   • NO Jan Manch card in grid (accessed strictly via sidebar)
 *   • NO floating AI icon
 */
export default function HomeDashboard() {
  const { t } = useTranslation();
  const { activeMember } = useHousehold();

  const domainModules = [
    {
      path: "/yojna-setu",
      title: "YojnaSetu",
      subtitle: t("hub.modules.yojnaSetu.subtitle", "Government Schemes & Welfare"),
      description: t("hub.modules.yojnaSetu.description", "Central and state schemes, eligibility checks, and application tracking."),
      icon: Landmark,
      badge: t("hub.badges.activeModule", "Live"),
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
    },
    {
      path: "/shiksha-setu",
      title: "ShikshaSetu",
      subtitle: t("hub.modules.shikshaSetu.subtitle", "Education & Skilling"),
      description: t("hub.modules.shikshaSetu.description", "Scholarships, skill certifications, and education loan subsidies."),
      icon: GraduationCap,
      badge: t("hub.badges.pipeline", "Coming Soon"),
      badgeColor: "bg-slate-100 text-slate-600 dark:bg-[#16191F] dark:text-[#8A8F98] border-slate-200 dark:border-white/[0.08]"
    },
    {
      path: "/rozgar-setu",
      title: "RozgarSetu",
      subtitle: t("hub.modules.rozgarSetu.subtitle", "Employment & Jobs"),
      description: t("hub.modules.rozgarSetu.description", "Job registration, MGNREGA wages, and apprenticeship programs."),
      icon: Briefcase,
      badge: t("hub.badges.pipeline", "Coming Soon"),
      badgeColor: "bg-slate-100 text-slate-600 dark:bg-[#16191F] dark:text-[#8A8F98] border-slate-200 dark:border-white/[0.08]"
    },
    {
      path: "/kisan-setu",
      title: "KisanSetu",
      subtitle: t("hub.modules.kisanSetu.subtitle", "Agriculture & Mandi"),
      description: t("hub.modules.kisanSetu.description", "PM-KISAN transfers, crop insurance, and mandi rates."),
      icon: Sprout,
      badge: t("hub.badges.pipeline", "Coming Soon"),
      badgeColor: "bg-slate-100 text-slate-600 dark:bg-[#16191F] dark:text-[#8A8F98] border-slate-200 dark:border-white/[0.08]"
    },
    {
      path: "/nagar-setu",
      title: "NagarSetu",
      subtitle: t("hub.modules.nagarSetu.subtitle", "Municipal Services"),
      description: t("hub.modules.nagarSetu.description", "Civil certificates, property tax, and civic grievances."),
      icon: Building2,
      badge: t("hub.badges.pipeline", "Coming Soon"),
      badgeColor: "bg-slate-100 text-slate-600 dark:bg-[#16191F] dark:text-[#8A8F98] border-slate-200 dark:border-white/[0.08]"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-blue-600/30">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold uppercase tracking-wider text-blue-100">
            <span>{t("hub.bannerTag", "Federated Citizen Hub")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("hub.welcomeBack", { name: activeMember?.name || t("nav.citizenFallback", "Citizen"), defaultValue: "Welcome back, Rahul!" })}
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            {t("hub.bannerDesc", "Citizen welfare, DPI services, and verified documents — all in one portal.")}
          </p>
        </div>
      </div>

      {/* Services Section Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              {t("nav.allServices", "All Services")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("hub.allServicesSubtitle", "Select a specialized domain portal to orchestrate citizen services")}
            </p>
          </div>
        </div>

        {/* Interactive Intent Router Search Bar */}
        <div id="intent-router-slot" className="w-full">
          <IntentRouterSearch />
        </div>

        {/* 5 Domain Modules Grid (Equal Heights with gap-6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domainModules.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group h-full flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1115] shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/60 transition-all duration-200 cursor-pointer"
              >
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-[#16191F] border border-blue-100 dark:border-white/[0.08] text-blue-600 dark:text-blue-400">
                      <IconComponent size={22} />
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-[#EDEDED] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>{t("hub.enterGateway", "Enter Gateway")}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
