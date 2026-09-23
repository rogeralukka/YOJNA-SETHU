import React from 'react';
import { useLang } from '../../context/LangContext';
import Icon from '../../../features/yojna-setu/components/Icon';

export const MultiSelectBar = ({ selectedCount, onApplySelected, onClearSelection }) => {
  const { t } = useLang();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-40 animate-fade-in-up">
      <div className="max-w-xl mx-auto bg-surface-container-lowest/95 dark:bg-[#0F1115]/95 backdrop-blur-xl border border-primary/20 dark:border-white/[0.08] rounded-2xl p-3 flex items-center justify-between shadow-2xl">
        <div className="px-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center font-bold text-sm">
            {selectedCount}
          </div>
          <span className="font-body-md text-sm text-on-surface dark:text-[#EDEDED]">
            {t('schemesSelected', { count: selectedCount })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearSelection}
            className="px-3 py-2 text-xs font-semibold text-on-surface-variant dark:text-[#8A8F98] hover:text-on-surface dark:hover:text-[#EDEDED] transition-colors"
          >
            {t('clear')}
          </button>

          <button
            onClick={onApplySelected}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{t('applyToSelected')}</span>
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
