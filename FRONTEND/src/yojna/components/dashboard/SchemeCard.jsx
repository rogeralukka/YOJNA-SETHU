import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { getOccupationLabel, getSectorLabel, getLifeStatusLabel } from '../../data/taxonomy';
import Icon from '../../../features/yojna-setu/components/Icon';

export const SchemeCard = ({ scheme, isSelected, onToggleSelect }) => {
  const { isBookmarked, toggleBookmark, navigateTo, evaluateScheme } = useData();
  const { t } = useLang();

  const bookmarked = isBookmarked(scheme.id);
  const evaluation = evaluateScheme(scheme);

  const getStatusBadge = () => {
    switch (evaluation.status) {
      case 'HIGH_MATCH':
        return (
          <span
            className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1"
            title={evaluation.summary}
          >
            <Icon name="verified" size={12} /> High Match
          </span>
        );
      case 'POTENTIAL_MATCH':
        return (
          <span
            className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-[10px] font-bold flex items-center gap-1"
            title={evaluation.summary}
          >
            <Icon name="check_circle" size={12} /> Eligible
          </span>
        );
      case 'NEEDS_INFO':
        return (
          <span
            className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1"
            title={evaluation.summary}
          >
            <Icon name="help" size={12} /> Needs Info
          </span>
        );
      case 'NOT_ELIGIBLE':
      default:
        return (
          <span
            className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 dark:text-[#8A8F98] border border-slate-500/20 text-[10px] font-medium flex items-center gap-1"
            title={evaluation.summary}
          >
            <Icon name="info" size={12} /> Criteria Check
          </span>
        );
    }
  };

  return (
    <div
      className={`scheme-card bg-surface-container-lowest dark:bg-[#0F1115] rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/[0.08] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between ${
        isSelected ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10' : ''
      }`}
    >
      <div>
        {/* Top Header Row with Checkbox, Badge & Star */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Multi-select Checkbox */}
            <label className="relative flex items-center justify-center w-6 h-6 rounded border-2 border-outline-variant dark:border-white/20 bg-surface-container-low dark:bg-[#16191F] cursor-pointer transition-colors hover:border-primary">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(scheme.id)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                aria-label={`Select ${scheme.name}`}
              />
              {isSelected && (
                <span className="text-primary dark:text-primary-fixed pointer-events-none font-bold flex items-center">
                  <Icon name="check" size={18} />
                </span>
              )}
            </label>

            {/* Government Level Badge */}
            {scheme.governmentLevel === 'state' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-secondary-container/60 dark:bg-[#16191F] text-on-secondary-container dark:text-[#EDEDED] border border-outline-variant/30 dark:border-white/[0.08]">
                {scheme.applicableStates && scheme.applicableStates.length === 1
                  ? scheme.applicableStates[0]
                  : `STATE · ${scheme.applicableStates?.length || 1} STATES`}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-fixed/40 dark:bg-primary/20 text-on-primary-fixed-variant dark:text-primary-fixed border border-primary/20">
                {t('centralGovBadge', {}, 'CENTRAL')}
              </span>
            )}

            {/* Server Evaluation Match Status */}
            {getStatusBadge()}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(scheme.id);
            }}
            className={`p-1 transition-transform hover:scale-110 flex items-center ${
              bookmarked
                ? 'text-tertiary dark:text-tertiary-fixed'
                : 'text-outline-variant dark:text-[#8A8F98]/70 hover:text-tertiary'
            }`}
            title={bookmarked ? t('removeBookmark') : t('saveBookmark')}
            aria-label="Bookmark"
          >
            <Icon
              name={bookmarked ? "star" : "star_outline"}
              size={22}
            />
          </button>
        </div>

        {/* Scheme Title & Ministry */}
        <h3 className="font-headline-md text-base sm:text-lg text-on-surface dark:text-[#EDEDED] font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {t('scheme_' + scheme.id, {}, scheme.name)}
        </h3>
        <p className="font-body-sm text-xs text-primary dark:text-primary-fixed font-medium mb-3">
          {t('dept_' + scheme.id, {}, scheme.department)}
        </p>

        {/* Intelligence Targeting Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {scheme.eligibleOccupations && !scheme.eligibleOccupations.includes('ALL') && (
            <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] border border-transparent dark:border-white/[0.06] text-[10px] font-semibold flex items-center gap-1">
              <Icon name="work" size={12} />
              {scheme.eligibleOccupations.slice(0, 2).map(getOccupationLabel).join(', ')}
              {scheme.eligibleOccupations.length > 2 && ` +${scheme.eligibleOccupations.length - 2}`}
            </span>
          )}
          {scheme.eligibleSectors && !scheme.eligibleSectors.includes('ALL') && (
            <span className="px-2 py-0.5 rounded bg-surface-container-high dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] border border-transparent dark:border-white/[0.06] text-[10px] font-semibold flex items-center gap-1">
              <Icon name="domain" size={12} />
              {scheme.eligibleSectors.slice(0, 2).map(getSectorLabel).join(', ')}
              {scheme.eligibleSectors.length > 2 && ` +${scheme.eligibleSectors.length - 2}`}
            </span>
          )}
        </div>

        {/* Benefits Container */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-surface-container-low dark:bg-[#16191F] border border-transparent dark:border-white/[0.06] rounded-xl">
          <span className="text-outline dark:text-[#8A8F98] flex items-center">
            <Icon name={scheme.category === 'Agriculture' ? 'payments' : scheme.category === 'Healthcare' ? 'health_and_safety' : 'account_balance'} size={22} />
          </span>
          <div>
            <p className="font-label-bold text-sm text-on-surface dark:text-[#EDEDED] font-bold">
              {t('benefit_' + scheme.id, {}, scheme.benefit)}
            </p>
            <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-[#8A8F98]">
              {t('benefitDetail_' + scheme.id, {}, scheme.benefitDetail)}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer with Deadline and View Details Action */}
      <div className="flex items-center justify-between border-t border-surface-container-highest dark:border-white/[0.08] pt-4 mt-auto">
        <div className={`flex items-center gap-1.5 ${scheme.isUrgent ? 'text-error font-semibold' : 'text-on-surface-variant dark:text-[#8A8F98]'}`}>
          <Icon name={scheme.isUrgent ? 'schedule' : 'event'} size={16} />
          <span className="font-label-bold text-xs">
            {t('deadline_' + scheme.id, {}, scheme.deadlineText || t('alwaysOpen'))}
          </span>
        </div>

        <button
          onClick={() => navigateTo('scheme-detail', scheme.id)}
          className="font-label-bold text-xs text-primary dark:text-primary-fixed hover:underline decoration-2 underline-offset-4 flex items-center gap-1 transition-colors"
        >
          <span>{t('viewDetails')}</span>
          <Icon name="arrow_forward" size={14} />
        </button>
      </div>
    </div>
  );
};
