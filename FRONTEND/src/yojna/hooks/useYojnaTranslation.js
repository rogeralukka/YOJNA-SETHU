import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * useYojnaTranslation:
 * Bridges legacy yojna component t(key, replacements, fallback) signatures
 * with the global react-i18next localization system scoped to `yojnaSetu.*`.
 */
export function useYojnaTranslation() {
  const { t: rawT, i18n } = useI18nTranslation();

  const t = (key, replacements = {}, fallback = null) => {
    if (!key) return fallback || '';
    const opts = typeof replacements === 'object' && replacements !== null ? { ...replacements } : {};
    if (fallback !== null && fallback !== undefined) {
      opts.defaultValue = fallback;
    }

    // 1. Direct translation check (e.g. if key is already nested like 'yojnaSetu.schemeDetail.missingProfileFields' or 'common.close')
    if (typeof key === 'string' && key.includes('.')) {
      const direct = rawT(key, opts);
      if (direct !== key) return direct;
    }

    // 2. Scoped to yojnaSetu.<key>
    const yojnaKey = `yojnaSetu.${key}`;
    const scoped = rawT(yojnaKey, opts);
    if (scoped !== yojnaKey) {
      return scoped;
    }

    // 3. Fallback or raw key
    if (fallback !== null && fallback !== undefined && fallback !== '') {
      return fallback;
    }

    // 4. Suppress raw dynamic internal prefixes if no translation exists
    if (
      typeof key === 'string' &&
      (
        key.startsWith('notifTitle_') ||
        key.startsWith('notifMsg_') ||
        key.startsWith('dept_') ||
        key.startsWith('benefit_') ||
        key.startsWith('benefitDetail_') ||
        key.startsWith('deadline_') ||
        key.startsWith('desc_') ||
        key.startsWith('overview_') ||
        key.startsWith('elig_') ||
        key.startsWith('doc_') ||
        key.startsWith('rejection_') ||
        key.startsWith('timeline_') ||
        key.startsWith('timelineDesc_')
      )
    ) {
      return fallback || '';
    }

    return rawT(key, opts);
  };

  return { t, i18n };
}

export const useTranslation = useYojnaTranslation;
export default useYojnaTranslation;
