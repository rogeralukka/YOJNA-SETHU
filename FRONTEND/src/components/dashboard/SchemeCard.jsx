import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const SchemeCard = ({ scheme, isSelected, onToggleSelect }) => {
  const { isBookmarked, toggleBookmark, navigateTo } = useData();
  const { t } = useLang();

  const bookmarked = isBookmarked(scheme.id);

  return (
    <div
      className={`scheme-card bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between ${
        isSelected ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10' : ''
      }`}
    >
      <div>
        {/* Top Header Row with Checkbox, Badge & Star */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {/* Multi-select Checkbox */}
            <label className="relative flex items-center justify-center w-6 h-6 rounded border-2 border-outline-variant dark:border-slate-600 bg-surface-container-low dark:bg-slate-700 cursor-pointer transition-colors hover:border-primary">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(scheme.id)}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                aria-label={`Select ${scheme.name}`}
              />
              {isSelected && (
                <span className="material-symbols-outlined text-[18px] text-primary dark:text-primary-fixed pointer-events-none font-bold">
                  check
                </span>
              )}
            </label>

            {/* NEW / Category Tag */}
            {scheme.isNew ? (
              <span className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container rounded-md font-status-badge text-[11px] font-bold uppercase tracking-wider">
                {t('newBadge')}
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-surface-container-high dark:bg-slate-700 text-on-surface-variant dark:text-slate-300 rounded-md font-status-badge text-[11px] font-semibold uppercase tracking-wider">
                {t('category_' + scheme.category.replace(/ /g, '_')) || scheme.category}
              </span>
            )}

            {/* Government Level Badge */}
            {scheme.governmentLevel === 'state' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-secondary-container/60 dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 border border-outline-variant/30">
                {scheme.applicableStates && scheme.applicableStates.length === 1
                  ? scheme.applicableStates[0]
                  : `STATE · ${scheme.applicableStates?.length || 1} STATES`}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-fixed/40 dark:bg-primary/20 text-on-primary-fixed-variant dark:text-primary-fixed border border-primary/20">
                {t('centralGovBadge', {}, 'CENTRAL')}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(scheme.id);
            }}
            className={`p-1 transition-transform hover:scale-110 ${
              bookmarked
                ? 'text-tertiary dark:text-tertiary-fixed'
                : 'text-outline-variant dark:text-slate-500 hover:text-tertiary'
            }`}
            title={bookmarked ? t('removeBookmark') : t('saveBookmark')}
            aria-label="Bookmark"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        </div>

        {/* Scheme Title & Ministry */}
        <h3 className="font-headline-md text-lg text-on-surface dark:text-white font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {t('scheme_' + scheme.id, {}, scheme.name)}
        </h3>
        <p className="font-body-sm text-xs text-primary dark:text-primary-fixed font-medium mb-4">
          {t('dept_' + scheme.id, {}, scheme.department)}
        </p>

        {/* Benefits Container */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-surface-container-low dark:bg-slate-700/60 rounded-xl">
          <span className="material-symbols-outlined text-outline dark:text-slate-400 text-[22px]">
            {scheme.category === 'Agriculture' ? 'payments' : scheme.category === 'Healthcare' ? 'health_and_safety' : 'account_balance'}
          </span>
          <div>
            <p className="font-label-bold text-sm text-on-surface dark:text-white font-bold">
              {t('benefit_' + scheme.id, {}, scheme.benefit)}
            </p>
            <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-slate-400">
              {t('benefitDetail_' + scheme.id, {}, scheme.benefitDetail)}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer with Deadline and View Details Action */}
      <div className="flex items-center justify-between border-t border-surface-container-highest dark:border-slate-700/70 pt-4 mt-auto">
        <div className={`flex items-center gap-1.5 ${scheme.isUrgent ? 'text-error font-semibold' : 'text-on-surface-variant dark:text-slate-400'}`}>
          <span className="material-symbols-outlined text-[16px]">
            {scheme.isUrgent ? 'schedule' : 'event'}
          </span>
          <span className="font-label-bold text-xs">
            {t('deadline_' + scheme.id, {}, scheme.deadlineText || t('alwaysOpen'))}
          </span>
        </div>

        <button
          onClick={() => navigateTo('scheme-detail', scheme.id)}
          className="font-label-bold text-xs text-primary dark:text-primary-fixed hover:underline decoration-2 underline-offset-4 flex items-center gap-1 transition-colors"
        >
          <span>{t('viewDetails')}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
