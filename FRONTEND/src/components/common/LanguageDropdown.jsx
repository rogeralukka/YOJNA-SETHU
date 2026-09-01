import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLang, LANGUAGES } from '../../context/LangContext';

export const LanguageDropdown = ({ className = '', isLanding = false }) => {
  const { lang, setLang, currentLanguageMeta, isLoadingLang, t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus search input when opened
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Reset search query when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter languages based on search query (by native script or English name)
  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return LANGUAGES;
    return LANGUAGES.filter(
      (item) =>
        item.nativeName.toLowerCase().includes(query) ||
        item.englishName.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-label-bold focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          isLanding
            ? 'bg-surface-container-low/80 dark:bg-slate-800/80 hover:bg-surface-container-high dark:hover:bg-slate-700 text-on-surface dark:text-slate-200 backdrop-blur-md border border-outline-variant/30 dark:border-white/10 shadow-sm'
            : 'bg-surface-container-low dark:bg-slate-800 text-on-surface-variant dark:text-slate-200 hover:bg-surface-container-high dark:hover:bg-slate-700'
        }`}
        title={`Language: ${currentLanguageMeta.nativeName} (${currentLanguageMeta.englishName})`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isLoadingLang ? 'sync' : 'language'}
        </span>
        <span className="max-w-[80px] sm:max-w-[110px] truncate font-medium">
          {isLoadingLang ? '...' : currentLanguageMeta.nativeName}
        </span>
        <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-fade-in-up origin-top-right bg-surface-container-lowest dark:bg-slate-900 text-on-surface dark:text-slate-100 border-outline-variant/30 dark:border-slate-800 backdrop-blur-2xl"
        >
          {/* Header & Search */}
          <div className="p-3 border-b border-outline-variant/20 dark:border-slate-800">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500 text-[18px]">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchLanguage') || 'Search language...'}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-xs text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline/60 dark:placeholder:text-slate-500 border border-outline-variant/30 dark:border-slate-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-[14px]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto p-1.5 divide-y divide-outline-variant/5 dark:divide-slate-800/40">
            {filteredLanguages.length === 0 ? (
              <div className="py-4 text-center text-xs text-on-surface-variant/70 dark:text-slate-400">
                No language found
              </div>
            ) : (
              filteredLanguages.map((item) => {
                const isSelected = item.code === lang;
                return (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`w-full px-3 py-2 text-left rounded-xl flex items-center justify-between transition-colors text-xs group ${
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary-fixed/15 text-primary dark:text-primary-fixed font-bold'
                        : 'hover:bg-surface-container-low dark:hover:bg-slate-800/80 text-on-surface dark:text-slate-200'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm leading-tight text-on-surface dark:text-white">
                        {item.nativeName}
                      </span>
                      <span className="text-[11px] text-on-surface-variant dark:text-slate-400 font-normal">
                        {item.englishName}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="material-symbols-outlined text-[18px] text-primary dark:text-primary-fixed">
                        check
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
