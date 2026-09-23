import React from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import {
  Bookmark,
  Star,
  ArrowRight,
  Info,
  Compass,
  CreditCard
} from 'lucide-react';

export const Bookmarks = () => {
  const { schemes, bookmarks, toggleBookmark, navigateTo } = useData();
  const { t } = useLang();

  const bookmarkedSchemes = schemes.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-12 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900 dark:text-[#EDEDED] font-bold mb-1">
          {t('bookmarks') || 'Bookmarked Schemes'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8A8F98]">
          {t('bookmarksSubtitle') || 'Quick-access registry of pinned welfare entitlements, scholarships, and enterprise grants.'}
        </p>
      </div>

      {bookmarkedSchemes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[420px] text-center p-8 bg-white dark:bg-[#0F1115] rounded-3xl border border-neutral-200 dark:border-white/[0.08] shadow-sm">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-[#16191F] rounded-2xl flex items-center justify-center mb-4 text-amber-500 shadow-xs">
            <Bookmark className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-bold text-neutral-900 dark:text-[#EDEDED] mb-1">
            {t('noBookmarksYet') || 'No Bookmarks Saved'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8A8F98] mb-6 max-w-md">
            {t('noBookmarksDesc') || 'Star any scheme card across the discovery catalog to save it to your bookmarks for fast access.'}
          </p>

          <button
            onClick={() => navigateTo('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>{t('browseSchemes') || 'Browse Schemes'}</span>
          </button>
        </div>
      ) : (
        /* Bookmarked Schemes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white dark:bg-[#0F1115] rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-white/[0.08] hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4 relative z-10 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-[#16191F] text-neutral-600 dark:text-[#8A8F98] border border-neutral-200 dark:border-white/[0.08]">
                      {scheme.governmentLevel === 'state' ? 'STATE' : 'CENTRAL'}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                      {scheme.category || 'General'}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(scheme.id)}
                    className="p-1 rounded-lg text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                    title={t('removeBookmark') || 'Remove bookmark'}
                    aria-label={t('removeBookmark') || 'Remove bookmark'}
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {scheme.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#8A8F98] mb-4 line-clamp-2">
                  {scheme.overview || scheme.description}
                </p>

                {/* Benefit Box */}
                {scheme.benefit && (
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#16191F] border border-neutral-200/70 dark:border-white/[0.06] mb-4 flex items-start gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-[#8A8F98] block">
                        Benefit Entitlement
                      </span>
                      <span className="text-xs font-semibold text-neutral-800 dark:text-[#EDEDED]">
                        {scheme.benefit}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex gap-2">
                <button
                  onClick={() => navigateTo('application-form', [scheme])}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('scheme-detail', scheme.id)}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-[#16191F] hover:bg-neutral-200 dark:hover:bg-[#1D212A] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] transition-colors cursor-pointer"
                  title="View Scheme Details"
                  aria-label="View Scheme Details"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
