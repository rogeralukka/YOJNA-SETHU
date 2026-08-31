import React from 'react';
import { useLang } from '../../context/LangContext';

export const MultiSelectBar = ({ selectedCount, onApplySelected, onClearSelection }) => {
  const { t } = useLang();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-40 animate-fade-in-up">
      <div className="max-w-xl mx-auto bg-surface-container-lowest/95 dark:bg-slate-800/95 backdrop-blur-xl border border-primary/20 dark:border-slate-700 rounded-2xl p-3 flex items-center justify-between shadow-2xl">
        <div className="px-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center font-bold text-sm">
            {selectedCount}
          </div>
          <span className="font-body-md text-sm text-on-surface dark:text-white">
            {t('schemesSelected', { count: selectedCount })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearSelection}
            className="px-3 py-2 text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white transition-colors"
          >
            {t('clear')}
          </button>

          <button
            onClick={onApplySelected}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{t('applyToSelected')}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
