import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchX } from 'lucide-react';
import { useSchemeEvaluation } from '../../features/yojna-setu/hooks/useSchemeEvaluation';
import { useData } from '../../yojna/context/DataContext';
import { SchemeHeader } from '../../features/yojna-setu/components/SchemeHeader';
import { FilterBar } from '../../features/yojna-setu/components/FilterBar';
import { SchemeCard } from '../../features/yojna-setu/components/SchemeCard';
import { BatchApplyDock } from '../../features/yojna-setu/components/BatchApplyDock';
import { DeltaResolverDrawer } from '../../features/yojna-setu/components/DeltaResolverDrawer';
import { DocketPreviewModal } from '../../features/yojna-setu/components/DocketPreviewModal';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary';
import { SchemeGridSkeleton } from '../../components/shared/skeletons';

/**
 * YojnaDashboard (/yojna-setu):
 * Central dashboard orchestrating dual-profile scheme evaluation (Personal vs. Enterprise),
 * comprehensive filter matrix & sort, multi-scheme selection, floating batch dock,
 * and single-overlay invariant management.
 */
export function YojnaDashboard() {
  const {
    evaluatedSchemes,
    eligibleReadyCount,
    eligibleBlockedCount,
    totalEligible,
    activeMember,
    activeBusiness,
    isEnterpriseContext
  } = useSchemeEvaluation();

  const { bookmarks = [], toggleBookmark } = useData();

  // Subtle evaluation loading transition on context change
  const [isEvaluating, setIsEvaluating] = useState(false);
  const contextKey = `${isEnterpriseContext ? 'ent' : 'cit'}-${activeMember?.id || 'none'}-${activeBusiness?.id || 'none'}`;
  const prevContextKey = useRef(contextKey);

  useEffect(() => {
    if (prevContextKey.current !== contextKey) {
      prevContextKey.current = contextKey;
      setIsEvaluating(true);
      const timer = setTimeout(() => {
        setIsEvaluating(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [contextKey]);

  // Single-Overlay State: exactly ONE overlay exists in the DOM at any given moment
  const [activeOverlay, setActiveOverlay] = useState({ type: null, schemeId: null });

  // Multi-Scheme Selection State
  const [selectedSchemeIds, setSelectedSchemeIds] = useState([]);

  // Filter Matrix State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchemeType, setSelectedSchemeType] = useState('ALL');
  const [selectedLifeStatus, setSelectedLifeStatus] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedMatch, setSelectedMatch] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('RECOMMENDED');

  // Find active scheme reactively from evaluatedSchemes
  const currentActiveScheme = useMemo(() => {
    if (!activeOverlay.schemeId) return null;
    return evaluatedSchemes.find((s) => s.id === activeOverlay.schemeId) || null;
  }, [activeOverlay.schemeId, evaluatedSchemes]);

  // Selection Handlers
  const handleToggleSelectScheme = (schemeId) => {
    setSelectedSchemeIds((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    );
  };

  const handleClearSelection = () => {
    setSelectedSchemeIds([]);
  };

  // Overlay Handlers
  const handleInspectDelta = (scheme) => {
    setActiveOverlay({ type: 'drawer', schemeId: scheme.id });
  };

  const handleSynthesizeDocket = (scheme) => {
    setActiveOverlay({ type: 'modal', schemeId: scheme.id });
  };

  const handleCloseOverlay = () => {
    setActiveOverlay({ type: null, schemeId: null });
  };

  // Batch Apply Handler
  const handleBatchApply = () => {
    if (selectedSchemeIds.length === 0) return;

    const selectedSchemes = evaluatedSchemes.filter((s) => selectedSchemeIds.includes(s.id));

    // If ANY selected scheme is ELIGIBLE-BLOCKED, open Delta Resolver for the first blocked scheme
    const firstBlocked = selectedSchemes.find((s) => s.state === 'ELIGIBLE-BLOCKED');
    if (firstBlocked) {
      setActiveOverlay({ type: 'drawer', schemeId: firstBlocked.id });
      return;
    }

    // If ALL selected schemes are ELIGIBLE-READY, open Docket synthesis for the first ready scheme
    const firstReady = selectedSchemes.find((s) => s.state === 'ELIGIBLE-READY') || selectedSchemes[0];
    if (firstReady) {
      setActiveOverlay({ type: 'modal', schemeId: firstReady.id });
    }
  };

  // Filter and Sort Matrix Computation
  const filteredSchemes = useMemo(() => {
    let result = evaluatedSchemes.filter((scheme) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = scheme.name.toLowerCase().includes(q);
        const matchSector = (scheme.sector || '').toLowerCase().includes(q);
        const matchDept = (scheme.department || '').toLowerCase().includes(q);
        if (!matchName && !matchSector && !matchDept) return false;
      }

      // 2. Scheme Type Filter
      if (selectedSchemeType !== 'ALL') {
        const level = (scheme.level || 'CENTRAL').toUpperCase();
        if (level !== selectedSchemeType.toUpperCase()) return false;
      }

      // 3. Sector Filter
      if (selectedSector !== 'ALL') {
        const sector = (scheme.sector || '').toLowerCase();
        if (!sector.includes(selectedSector.toLowerCase())) return false;
      }

      // 4. Match Status Filter
      if (selectedMatch === 'HIGH_MATCH') {
        if (scheme.state !== 'ELIGIBLE-READY') return false;
      } else if (selectedMatch === 'CRITERIA_CHECK') {
        if (scheme.state !== 'ELIGIBLE-BLOCKED') return false;
      }

      // 5. Life Status Filter
      if (selectedLifeStatus !== 'ALL') {
        if (scheme.eligibleLifeStatuses && !scheme.eligibleLifeStatuses.includes(selectedLifeStatus)) {
          return false;
        }
      }

      return true;
    });

    // Sort evaluation
    if (selectedSort === 'DEADLINE') {
      result = [...result].sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
    } else if (selectedSort === 'BENEFIT') {
      const extractVal = (str) => {
        const num = String(str || '').replace(/[^\d]/g, '');
        return num ? parseInt(num, 10) : 0;
      };
      result = [...result].sort((a, b) => extractVal(b.benefit) - extractVal(a.benefit));
    } else {
      // RECOMMENDED: ELIGIBLE-READY first, then ELIGIBLE-BLOCKED, then INELIGIBLE
      const order = { 'ELIGIBLE-READY': 1, 'ELIGIBLE-BLOCKED': 2, 'INELIGIBLE': 3 };
      result = [...result].sort((a, b) => (order[a.state] || 4) - (order[b.state] || 4));
    }

    return result;
  }, [
    evaluatedSchemes,
    searchQuery,
    selectedSchemeType,
    selectedSector,
    selectedMatch,
    selectedLifeStatus,
    selectedSort
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
      {/* Dynamic Header Banner */}
      <SchemeHeader
        activeMember={activeMember}
        activeBusiness={activeBusiness}
        isEnterpriseContext={isEnterpriseContext}
        totalEligible={totalEligible}
        eligibleReadyCount={eligibleReadyCount}
        eligibleBlockedCount={eligibleBlockedCount}
      />

      {/* Comprehensive Filter Matrix */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSchemeType={selectedSchemeType}
        onSelectSchemeType={setSelectedSchemeType}
        selectedLifeStatus={selectedLifeStatus}
        onSelectLifeStatus={setSelectedLifeStatus}
        selectedSector={selectedSector}
        onSelectSector={setSelectedSector}
        selectedMatch={selectedMatch}
        onSelectMatch={setSelectedMatch}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      {/* Scheme Cards Grid wrapped in ErrorBoundary with Skeleton loading */}
      <ErrorBoundary moduleName="Scheme Recommendations">
        {isEvaluating ? (
          <SchemeGridSkeleton count={6} />
        ) : filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isSelected={selectedSchemeIds.includes(scheme.id)}
                onToggleSelect={handleToggleSelectScheme}
                isBookmarked={bookmarks.includes(scheme.id)}
                onToggleBookmark={toggleBookmark}
                onInspectDelta={handleInspectDelta}
                onSynthesizeDocket={handleSynthesizeDocket}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] shadow-sm">
            <SearchX className="w-10 h-10 text-neutral-400 dark:text-[#8A8F98] mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-600 dark:text-[#8A8F98]">
              No schemes currently match the selected criteria.
            </p>
          </div>
        )}
      </ErrorBoundary>

      {/* Floating Bottom Batch Apply Dock */}
      {selectedSchemeIds.length > 0 && (
        <BatchApplyDock
          selectedCount={selectedSchemeIds.length}
          onClear={handleClearSelection}
          onBatchApply={handleBatchApply}
        />
      )}

      {/* Single-Overlay Floating Delta Side Card */}
      {activeOverlay.type === 'drawer' && currentActiveScheme && (
        <DeltaResolverDrawer
          isOpen={true}
          scheme={currentActiveScheme}
          onClose={handleCloseOverlay}
          onSynthesizeDocket={handleSynthesizeDocket}
        />
      )}

      {/* Single-Overlay Docket Preview Modal */}
      {activeOverlay.type === 'modal' && currentActiveScheme && (
        <DocketPreviewModal
          isOpen={true}
          scheme={currentActiveScheme}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}

export default YojnaDashboard;
