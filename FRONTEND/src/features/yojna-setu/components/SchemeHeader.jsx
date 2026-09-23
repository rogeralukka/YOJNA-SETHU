import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

/**
 * SchemeHeader:
 * Dynamic hero banner rendering tailored greeting, metadata chips, and recommendation engine statistics
 * for either Individual Citizen profiles or Enterprise/Business profiles.
 */
export function SchemeHeader({
  activeMember,
  activeBusiness,
  isEnterpriseContext,
  totalEligible,
  eligibleReadyCount,
  eligibleBlockedCount
}) {
  const navigate = useNavigate();

  if (isEnterpriseContext && activeBusiness) {
    const bizName = activeBusiness.businessName || 'EcoTech Solutions';
    const bizType = activeBusiness.businessType || 'Private Limited';
    const sector = activeBusiness.industryCategory || 'IT & Services';
    const hasGst = Boolean(activeBusiness.gst);
    const hasUdyam = Boolean(activeBusiness.udyamRegNumber);
    const stateName = activeBusiness.address?.includes('Uttar Pradesh') ? 'Uttar Pradesh' : 'National';

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-6">
        {/* Left Column: Enterprise Greeting & Context Chips */}
        <div className="lg:col-span-2 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#EDEDED]">
            Hello, {bizName}! You are eligible for {totalEligible} schemes.
          </h1>

          <p className="text-sm text-neutral-600 dark:text-[#8A8F98]">
            Enterprise subsidies, capital support, and industry-specific grants discovered for your business.
          </p>

          {/* Context Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-purple-500" />
              <span>{bizType}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              <span>{sector}</span>
            </div>

            {hasGst && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>GST Registered</span>
              </div>
            )}

            {hasUdyam && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Udyam Verified</span>
              </div>
            )}

            <button
              onClick={() => navigate('/yojna-setu')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
            >
              <span>+ Manage Business</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Recommendation Engine Card */}
        <div className="lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#EDEDED]">
                Recommendation Engine
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04]">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-[#8A8F98] block">
                High Matches
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {eligibleReadyCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04]">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-[#8A8F98] block">
                Available in {stateName}
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                {totalEligible}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Individual Citizen View
  const citizenName = activeMember?.name || 'Citizen';
  const category = activeMember?.category || 'OBC';
  const occupation = activeMember?.occupation || 'Student';
  const stateName = activeMember?.state || 'Telangana';
  const age = activeMember?.age ?? 19;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-6">
      {/* Left Column: Citizen Greeting & Profile Chips */}
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-[#EDEDED]">
          Hello, {citizenName}! You are eligible for {totalEligible} schemes.
        </h1>

        <p className="text-sm text-neutral-600 dark:text-[#8A8F98]">
          Personal citizen subsidies, welfare programs, and direct benefit schemes tailored to your profile.
        </p>

        {/* Profile Context Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span>Category: <strong className="font-semibold">{category}</strong></span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-purple-500" />
            <span>{occupation}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{stateName}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Age: <strong className="font-semibold">{age}</strong></span>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
          >
            <span>+ Update Profile</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right Column: Recommendation Engine Card */}
      <div className="lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-[#EDEDED]">
              Recommendation Engine
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04]">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-[#8A8F98] block">
              High Matches
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              {eligibleReadyCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-100 dark:border-white/[0.04]">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-[#8A8F98] block">
              Available in {stateName}
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
              {totalEligible}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemeHeader;
