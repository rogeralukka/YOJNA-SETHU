// Canonical language switcher component for NagrikPath. After Phase 6, this is the sole surviving language interface.
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Search, Check, X } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', shortLabel: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', shortLabel: 'हि' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', shortLabel: 'తె' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', shortLabel: 'த' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', shortLabel: 'ಕ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', shortLabel: 'മല' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', shortLabel: 'म' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', shortLabel: 'ગુ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', shortLabel: 'বাং' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', shortLabel: 'ଓ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', shortLabel: 'ਪੰ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', shortLabel: 'অ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', shortLabel: 'ار' },
];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const itemRefs = useRef([]);

  // Resolve current active language with safe fallback to 'en'
  const currentLangCode = (i18n.language || 'en').split('-')[0].toLowerCase();
  const activeLang =
    SUPPORTED_LANGUAGES.find((item) => item.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  // Filter languages based on user search query
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.nativeName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.shortLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Click outside and global Escape listeners
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleGlobalKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleGlobalKeyDown);
      // Auto-focus search input when opened
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }
  }, [isOpen]);

  // Reset search and focused index when opening / closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setFocusedIndex(-1);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Scroll active item into view when focused via keyboard
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  const handleSelectLanguage = (code) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem('nagrikpath_language', code);
      localStorage.setItem('nagrikpath_lang', code);
    } catch (e) {
      console.warn('Could not persist language choice', e);
    }
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredLanguages.length > 0) {
        setFocusedIndex(0);
        itemRefs.current[0]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && filteredLanguages[focusedIndex]) {
        handleSelectLanguage(filteredLanguages[focusedIndex].code);
      } else if (filteredLanguages.length > 0) {
        handleSelectLanguage(filteredLanguages[0].code);
      }
    }
  };

  const handleItemKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % filteredLanguages.length;
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        setFocusedIndex(-1);
        searchInputRef.current?.focus();
      } else {
        const prevIndex = index - 1;
        setFocusedIndex(prevIndex);
        itemRefs.current[prevIndex]?.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (filteredLanguages[index]) {
        handleSelectLanguage(filteredLanguages[index].code);
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Dropdown Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="nagrikpath-language-menu"
        id="nagrikpath-language-switcher-trigger"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1115] text-slate-700 dark:text-[#EDEDED] hover:bg-slate-50 dark:hover:bg-[#16191F] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs transition-colors cursor-pointer select-none"
        title={`${t("common.language", "Language")}: ${activeLang.nativeName} (${activeLang.name})`}
      >
        <Globe size={15} className="text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
        <span className="font-semibold text-xs tracking-wider uppercase font-mono">
          {activeLang.shortLabel}
        </span>
        <ChevronDown
          size={13}
          className={`text-slate-400 dark:text-[#8A8F98] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div
          id="nagrikpath-language-menu"
          role="menu"
          aria-labelledby="nagrikpath-language-switcher-trigger"
          aria-orientation="vertical"
          className="absolute end-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0F1115] shadow-xl border border-slate-200 dark:border-white/[0.08] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-start"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-white/[0.08]">
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute start-3 text-slate-400 dark:text-[#8A8F98] pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('common.search', 'Search')}
                aria-label={t('common.search', 'Search')}
                className="w-full ps-9 pe-8 py-1.5 bg-slate-50 dark:bg-[#16191F] rounded-xl text-xs text-slate-900 dark:text-[#EDEDED] placeholder:text-slate-400 dark:placeholder:text-[#8A8F98] focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 dark:border-white/10 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute end-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-[#EDEDED] rounded cursor-pointer"
                  aria-label={t('common.clearSearch', 'Clear search')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* 13-Language Scrollable List */}
          <div
            className="max-h-64 overflow-y-auto p-2 space-y-1 [scrollbar-width:thin]"
            role="none"
          >
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-[#8A8F98]">
                {t('common.noLanguageFound', 'No language found')}
              </div>
            ) : (
              filteredLanguages.map((item, index) => {
                const isSelected = item.code === activeLang.code;
                const isFocused = index === focusedIndex;
                return (
                  <button
                    key={item.code}
                    ref={(el) => (itemRefs.current[index] = el)}
                    type="button"
                    role="menuitem"
                    tabIndex={isFocused ? 0 : -1}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => handleSelectLanguage(item.code)}
                    onKeyDown={(e) => handleItemKeyDown(e, index)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-start transition-colors cursor-pointer group outline-none ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60'
                        : isFocused
                        ? 'bg-slate-100 dark:bg-[#1D212A] text-slate-900 dark:text-[#EDEDED] border border-transparent'
                        : 'hover:bg-slate-100 dark:hover:bg-[#16191F] text-slate-700 dark:text-[#EDEDED] border border-transparent'
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-[#EDEDED] leading-tight">
                        {item.nativeName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-[#8A8F98] font-normal">
                        {item.name}
                      </span>
                    </div>

                    {isSelected && (
                      <Check
                        size={16}
                        className="text-blue-600 dark:text-blue-400 shrink-0 ms-2"
                        aria-hidden="true"
                      />
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
}
