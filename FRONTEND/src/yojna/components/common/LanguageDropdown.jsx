import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLang, LANGUAGES } from '../../context/LangContext';
import Icon from '../../../features/yojna-setu/components/Icon';

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
            ? 'bg-surface-container-low/80 dark:bg-[#16191F]/80 hover:bg-surface-container-high dark:hover:bg-[#1D212A] text-on-surface dark:text-[#EDEDED] backdrop-blur-md border border-outline-variant/30 dark:border-white/[0.08] shadow-sm'
            : 'bg-surface-container-low dark:bg-[#16191F] text-on-surface-variant dark:text-[#EDEDED] border dark:border-white/[0.08] hover:bg-surface-container-high dark:hover:bg-[#1D212A]'
        }`}
        title={`Language: ${currentLanguageMeta.nativeName} (${currentLanguageMeta.englishName})`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Icon name={isLoadingLang ? 'progress_activity' : 'language'} size={18} />
        <span className="max-w-[80px] sm:max-w-[110px] truncate font-medium">
          {isLoadingLang ? '...' : currentLanguageMeta.nativeName}
        </span>
        <Icon name="expand_more" size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-fade-in-up origin-top-right bg-surface-container-lowest dark:bg-[#0F1115] text-on-surface dark:text-[#EDEDED] border-outline-variant/30 dark:border-white/[0.08] backdrop-blur-2xl"
        >
          {/* Header & Search */}
          <div className="p-3 border-b border-outline-variant/20 dark:border-white/[0.08]">
            <div className="relative">
              <Icon name="search" size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline dark:text-[#8A8F98]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchLanguage') || 'Search language...'}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low dark:bg-[#16191F] rounded-xl text-xs text-on-surface dark:text-[#EDEDED] focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline/60 dark:placeholder:text-[#8A8F98]/50 border border-outline-variant/30 dark:border-white/[0.08]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-[14px]"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto p-1.5 divide-y divide-outline-variant/5 dark:divide-white/[0.05]">
            {filteredLanguages.length === 0 ? (
              <div className="py-4 text-center text-xs text-on-surface-variant/70 dark:text-[#8A8F98]">
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
                        : 'hover:bg-surface-container-low dark:hover:bg-[#16191F] text-on-surface dark:text-[#EDEDED]'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm leading-tight text-on-surface dark:text-[#EDEDED]">
                        {item.nativeName}
                      </span>
                      <span className="text-[11px] text-on-surface-variant dark:text-[#8A8F98] font-normal">
                        {item.englishName}
                      </span>
                    </div>

                    {isSelected && (
                      <Icon name="check" size={18} className="text-primary dark:text-primary-fixed" />
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

export default LanguageDropdown;
