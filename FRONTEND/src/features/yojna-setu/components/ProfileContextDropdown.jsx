import React, { useState, useRef, useEffect } from 'react';
import { useHousehold } from '../../../context/HouseholdContext';
import { useData } from '../../../yojna/context/DataContext';
import {
  User,
  Building2,
  ChevronDown,
  Plus,
  Check,
  Briefcase,
  Users
} from 'lucide-react';

/**
 * ProfileContextDropdown:
 * Dual Profile Context Switcher allowing seamless switching between
 * Citizen/Household members and Registered Enterprise/Business profiles.
 */
export function ProfileContextDropdown() {
  const { household, activeMemberId, activeMember, switchMember } = useHousehold();
  const { businesses, activeContext, setActiveContext, navigateTo } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const members = household?.members || [];
  const isPersonal = !activeContext || activeContext === 'personal';
  const activeBusiness = businesses?.find((b) => b.id === activeContext);

  // Determine current active trigger label and icon
  const activeLabel = isPersonal
    ? `Personal: ${activeMember?.name || 'Citizen'}`
    : `Business: ${activeBusiness?.businessName || 'Enterprise'}`;

  const handleSelectMember = (memberId) => {
    switchMember(memberId);
    setActiveContext('personal');
    setIsOpen(false);
  };

  const handleSelectBusiness = (bizId) => {
    setActiveContext(bizId);
    setIsOpen(false);
  };

  const handleAddBusiness = () => {
    setIsOpen(false);
    navigateTo('my-business');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-[#EDEDED] shadow-xs cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
          isPersonal
            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
        }`}>
          {isPersonal ? <User className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
        </div>

        <span className="truncate max-w-[170px] sm:max-w-[210px] text-left">
          {activeLabel}
        </span>

        <ChevronDown className={`w-4 h-4 text-neutral-400 dark:text-[#8A8F98] transition-transform duration-200 shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu Modal / Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar p-2 space-y-3">
            {/* Section 1: Household Members */}
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-[#8A8F98] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Household Profiles ({members.length})</span>
              </div>

              <div className="space-y-1 mt-1">
                {members.map((member) => {
                  const isSelected = isPersonal && activeMemberId === member.memberId;
                  return (
                    <button
                      key={member.memberId}
                      type="button"
                      onClick={() => handleSelectMember(member.memberId)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/20'
                          : 'hover:bg-neutral-100 dark:hover:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-[#16191F] border border-neutral-200 dark:border-white/[0.08] flex items-center justify-center text-neutral-600 dark:text-[#8A8F98] shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate leading-snug">
                            {member.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 dark:text-[#8A8F98] truncate">
                            {member.relationship === 'HEAD' ? 'Head of Household' : member.relationship} · {member.age} Yrs
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Enterprise Profiles */}
            <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06]">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-[#8A8F98] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Enterprise Profiles ({businesses?.length || 0})</span>
              </div>

              <div className="space-y-1 mt-1">
                {(businesses || []).map((biz) => {
                  const isSelected = !isPersonal && activeContext === biz.id;
                  return (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => handleSelectBusiness(biz.id)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold border border-purple-500/20'
                          : 'hover:bg-neutral-100 dark:hover:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate leading-snug">
                            {biz.businessName}
                          </div>
                          <div className="text-[10px] text-neutral-500 dark:text-[#8A8F98] truncate">
                            {biz.businessType} · {biz.industryCategory}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Add Business Action */}
          <div className="p-2 border-t border-neutral-100 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-[#16191F]/30">
            <button
              type="button"
              onClick={handleAddBusiness}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Business Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileContextDropdown;
