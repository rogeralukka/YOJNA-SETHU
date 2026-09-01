import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { INDIAN_STATES } from '../../data/states';
import { LIFE_STATUSES, OCCUPATIONS, SECTORS } from '../../data/taxonomy';

export const AddEditSchemeModal = ({ isOpen, onClose, editingScheme = null }) => {
  const { addScheme, updateScheme } = useData();
  const { t } = useLang();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Ministry of Agriculture & Farmers Welfare');
  const [category, setCategory] = useState('Agriculture');
  const [governmentLevel, setGovernmentLevel] = useState('central'); // 'central' or 'state'
  const [applicableStates, setApplicableStates] = useState(['ALL']);
  const [stateSearch, setStateSearch] = useState('');
  const [description, setDescription] = useState('');
  const [benefit, setBenefit] = useState('');
  const [benefitDetail, setBenefitDetail] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(70);
  const [maxIncome, setMaxIncome] = useState(500000);
  const [deadline, setDeadline] = useState('');
  const [isBusinessScheme, setIsBusinessScheme] = useState(false);

  // Life Status, Occupation & Sector Eligibility Intelligence State
  const [allLifeStatuses, setAllLifeStatuses] = useState(true);
  const [eligibleLifeStatuses, setEligibleLifeStatuses] = useState([]);

  const [allOccupations, setAllOccupations] = useState(true);
  const [eligibleOccupations, setEligibleOccupations] = useState([]);
  const [eligibleOccupationRequirement, setEligibleOccupationRequirement] = useState('none'); // 'required', 'optional', 'none'
  const [occupationSearch, setOccupationSearch] = useState('');

  const [allSectors, setAllSectors] = useState(true);
  const [eligibleSectors, setEligibleSectors] = useState([]);
  const [eligibleSectorRequirement, setEligibleSectorRequirement] = useState('none'); // 'required', 'optional', 'none'

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingScheme) {
      setName(editingScheme.name || '');
      setDepartment(editingScheme.department || 'Ministry of Agriculture & Farmers Welfare');
      setCategory(editingScheme.category || 'Agriculture');
      setGovernmentLevel(editingScheme.governmentLevel || 'central');
      setApplicableStates(
        editingScheme.governmentLevel === 'state'
          ? (editingScheme.applicableStates && editingScheme.applicableStates.length > 0
              ? editingScheme.applicableStates.filter(s => s !== 'ALL' && s !== 'All States')
              : ['Uttar Pradesh'])
          : ['ALL']
      );
      setDescription(editingScheme.description || '');
      setBenefit(editingScheme.benefit || '');
      setBenefitDetail(editingScheme.benefitDetail || '');
      setMinAge(editingScheme.minAge !== undefined ? editingScheme.minAge : 18);
      setMaxAge(editingScheme.maxAge !== undefined ? editingScheme.maxAge : 70);
      setMaxIncome(editingScheme.maxIncome !== undefined ? editingScheme.maxIncome : 500000);
      setDeadline(editingScheme.deadline || '');
      setIsBusinessScheme(Boolean(editingScheme.isBusinessScheme));

      // Life Status eligibility
      if (editingScheme.eligibleLifeStatuses && !editingScheme.eligibleLifeStatuses.includes('ALL') && editingScheme.eligibleLifeStatuses.length > 0) {
        setAllLifeStatuses(false);
        setEligibleLifeStatuses(editingScheme.eligibleLifeStatuses);
      } else {
        setAllLifeStatuses(true);
        setEligibleLifeStatuses([]);
      }

      // Occupation eligibility
      if (editingScheme.eligibleOccupations && !editingScheme.eligibleOccupations.includes('ALL') && editingScheme.eligibleOccupations.length > 0) {
        setAllOccupations(false);
        setEligibleOccupations(editingScheme.eligibleOccupations);
        setEligibleOccupationRequirement(editingScheme.eligibleOccupationRequirement || 'required');
      } else {
        setAllOccupations(true);
        setEligibleOccupations([]);
        setEligibleOccupationRequirement('none');
      }

      // Sector eligibility
      if (editingScheme.eligibleSectors && !editingScheme.eligibleSectors.includes('ALL') && editingScheme.eligibleSectors.length > 0) {
        setAllSectors(false);
        setEligibleSectors(editingScheme.eligibleSectors);
        setEligibleSectorRequirement(editingScheme.eligibleSectorRequirement || 'required');
      } else {
        setAllSectors(true);
        setEligibleSectors([]);
        setEligibleSectorRequirement('none');
      }
    } else {
      setName('');
      setDepartment('Ministry of Agriculture & Farmers Welfare');
      setCategory('Agriculture');
      setGovernmentLevel('central');
      setApplicableStates(['ALL']);
      setDescription('');
      setBenefit('Direct Benefit Support');
      setBenefitDetail('Government Subsidy');
      setMinAge(18);
      setMaxAge(70);
      setMaxIncome(500000);
      setDeadline('');
      setIsBusinessScheme(false);
      setAllLifeStatuses(true);
      setEligibleLifeStatuses([]);
      setAllOccupations(true);
      setEligibleOccupations([]);
      setEligibleOccupationRequirement('none');
      setAllSectors(true);
      setEligibleSectors([]);
      setEligibleSectorRequirement('none');
    }
    setStateSearch('');
    setOccupationSearch('');
    setError('');
  }, [editingScheme, isOpen]);

  if (!isOpen) return null;

  const handleToggleState = (st) => {
    setApplicableStates(prev => {
      const cleanPrev = prev.filter(s => s !== 'ALL' && s !== 'All States');
      if (cleanPrev.includes(st)) {
        return cleanPrev.filter(s => s !== st);
      } else {
        return [...cleanPrev, st];
      }
    });
  };

  const handleRemoveState = (st) => {
    setApplicableStates(prev => prev.filter(s => s !== st));
  };

  const handleSelectAllStates = () => {
    setApplicableStates([...INDIAN_STATES]);
  };

  const handleClearAllStates = () => {
    setApplicableStates([]);
  };

  const handleGovLevelChange = (level) => {
    setGovernmentLevel(level);
    if (level === 'central') {
      setApplicableStates(['ALL']);
    } else {
      if (applicableStates.includes('ALL') || applicableStates.length === 0) {
        setApplicableStates(['Uttar Pradesh']);
      }
    }
  };

  const handleToggleLifeStatus = (id) => {
    setEligibleLifeStatuses(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleOccupation = (id) => {
    setEligibleOccupations(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSector = (id) => {
    setEligibleSectors(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Scheme Name and Description are required");
      return;
    }

    const cleanStates = applicableStates.filter(s => s !== 'ALL' && s !== 'All States');
    if (governmentLevel === 'state' && cleanStates.length === 0) {
      setError("Please select at least one applicable state for a State Government scheme");
      return;
    }

    if (!allLifeStatuses && eligibleLifeStatuses.length === 0) {
      setError("Please select at least one specific Life Status, or choose 'All Life Statuses'");
      return;
    }

    if (!allOccupations && eligibleOccupations.length === 0) {
      setError("Please select at least one specific Occupation, or choose 'All Occupations'");
      return;
    }

    if (!allSectors && eligibleSectors.length === 0) {
      setError("Please select at least one specific Sector, or choose 'All Sectors'");
      return;
    }

    const payload = {
      name: name.trim(),
      department,
      category,
      governmentLevel,
      applicableStates: governmentLevel === 'central' ? ['ALL'] : cleanStates,
      description: description.trim(),
      benefit: benefit.trim() || "Financial Grant",
      benefitDetail: benefitDetail.trim() || "Direct Transfer",
      minAge: Number(minAge),
      maxAge: Number(maxAge),
      maxIncome: Number(maxIncome),
      deadline: deadline || "",
      deadlineText: deadline ? `Closes ${deadline}` : "Always Open",
      isBusinessScheme,
      eligibleLifeStatuses: allLifeStatuses ? ['ALL'] : eligibleLifeStatuses,
      eligibleOccupations: allOccupations ? ['ALL'] : eligibleOccupations,
      eligibleOccupationRequirement: allOccupations ? 'none' : eligibleOccupationRequirement,
      eligibleSectors: allSectors ? ['ALL'] : eligibleSectors,
      eligibleSectorRequirement: allSectors ? 'none' : eligibleSectorRequirement,
      targetBusinessTypes: isBusinessScheme ? ["Proprietorship", "Partnership", "Private Limited"] : [],
      targetIndustries: isBusinessScheme ? [category] : []
    };

    if (editingScheme) {
      updateScheme(editingScheme.id, payload);
    } else {
      addScheme(payload);
    }
    onClose();
  };

  const cleanSelectedStates = applicableStates.filter(s => s !== 'ALL' && s !== 'All States');
  const filteredStatesList = INDIAN_STATES.filter(st =>
    st.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredOccupationsList = OCCUPATIONS.filter(o =>
    o.name.toLowerCase().includes(occupationSearch.toLowerCase()) || o.category.toLowerCase().includes(occupationSearch.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-outline-variant/30 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-fade-in-up">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 bg-surface-container-low/70 dark:bg-slate-800/70 border-b border-surface-container dark:border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {editingScheme ? t('editScheme') : t('addNewScheme')}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400">
                {t('configureEligibilitySubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-8 mt-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs">
          {/* Basic Info */}
          <div>
            <span className="font-label-bold uppercase tracking-wider text-primary dark:text-primary-fixed block mb-3">
              {t('basicInformation')}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('schemeNameLabel')} <span className="text-error">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Pradhan Mantri Mudra Yojana"
                  type="text"
                />
              </div>

              {/* Government Level */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('governmentLevel', {}, 'Government Level')} <span className="text-error">*</span>
                </label>
                <select
                  value={governmentLevel}
                  onChange={(e) => handleGovLevelChange(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value="central">{t('centralGov', {}, 'Central Government')}</option>
                  <option value="state">{t('stateGov', {}, 'State Government')}</option>
                </select>
              </div>

              {/* Ministry / Department */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('ministryDepartment')} <span className="text-error">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Ministry of Agriculture & Farmers Welfare">Ministry of Agriculture & Farmers Welfare</option>
                  <option value="Ministry of Finance">Ministry of Finance</option>
                  <option value="Ministry of MSME">Ministry of MSME</option>
                  <option value="Ministry of Housing and Urban Affairs">Ministry of Housing & Urban Affairs</option>
                  <option value="National Health Authority">National Health Authority</option>
                  <option value="Ministry of Social Justice & Empowerment">Ministry of Social Justice & Empowerment</option>
                  <option value="State Department of Industries">State Department of Industries</option>
                  <option value="State Department of Agriculture">State Department of Agriculture</option>
                  <option value="State Skill Development Mission">State Skill Development Mission</option>
                  <option value="Women & Child Development Department">Women & Child Development Department</option>
                </select>
              </div>

              {/* Conditional Geographic Scope UI */}
              <div className="md:col-span-2">
                {governmentLevel === 'central' ? (
                  <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">public</span>
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface dark:text-slate-100 text-xs">
                        {t('allIndia', {}, 'All India')} — {t('centralGov', {}, 'Central Government')}
                      </p>
                      <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                        Central Government schemes apply nationwide across all States and Union Territories. No state selection is required.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 p-4 bg-surface-container-low dark:bg-slate-800/80 rounded-2xl border border-outline-variant/30">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
                        <label className="font-semibold text-on-surface dark:text-slate-200">
                          {t('applicableStates', {}, 'Applicable States')} <span className="text-error">*</span>
                        </label>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                          {cleanSelectedStates.length} selected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllStates}
                          className="text-[11px] text-primary dark:text-primary-fixed hover:underline font-semibold"
                        >
                          Select All
                        </button>
                        <span className="text-outline-variant">•</span>
                        <button
                          type="button"
                          onClick={handleClearAllStates}
                          className="text-[11px] text-error hover:underline font-semibold"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {cleanSelectedStates.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-surface-container-lowest dark:bg-slate-900/60 rounded-xl border border-outline-variant/20 max-h-24 overflow-y-auto">
                        {cleanSelectedStates.map((st) => (
                          <span
                            key={st}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:text-primary-fixed border border-primary/20 text-[11px] font-semibold"
                          >
                            <span>{st}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveState(st)}
                              className="w-3.5 h-3.5 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors"
                              title={`Remove ${st}`}
                            >
                              <span className="material-symbols-outlined text-[12px]">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                          search
                        </span>
                        <input
                          type="text"
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          placeholder="Search state or union territory..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/40 text-on-surface dark:text-white outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="max-h-36 overflow-y-auto p-2 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/20 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {filteredStatesList.map((st) => {
                          const isChecked = cleanSelectedStates.includes(st);
                          return (
                            <button
                              type="button"
                              key={st}
                              onClick={() => handleToggleState(st)}
                              className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-colors flex items-center justify-between gap-1 border ${
                                isChecked
                                  ? 'bg-primary/10 border-primary text-primary dark:text-primary-fixed font-bold'
                                  : 'border-outline-variant/20 hover:bg-surface-container-low dark:hover:bg-slate-800 text-on-surface dark:text-slate-300'
                              }`}
                            >
                              <span className="truncate">{st}</span>
                              {isChecked && (
                                <span className="material-symbols-outlined text-[14px]">check</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('category')} <span className="text-error">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Agriculture">{t('category_Agriculture')}</option>
                  <option value="Finance">{t('category_Finance')}</option>
                  <option value="Healthcare">{t('category_Healthcare')}</option>
                  <option value="Housing">{t('category_Housing')}</option>
                  <option value="Education">{t('category_Education')}</option>
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('description')} <span className="text-error">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder={t('descriptionPlaceholder')}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('benefitHeadline')}
                </label>
                <input
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('benefitDetail')}
                </label>
                <input
                  value={benefitDetail}
                  onChange={(e) => setBenefitDetail(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Life Status, Occupation & Sector Intelligence Controls */}
          <div className="p-4 bg-surface-container-low dark:bg-slate-800/80 rounded-2xl border border-outline-variant/30 space-y-4">
            <span className="font-label-bold uppercase tracking-wider text-primary dark:text-primary-fixed block">
              Occupation, Sector & Life Status Eligibility
            </span>

            {/* 1. Life Status Eligibility */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  Target Life Status
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={allLifeStatuses}
                      onChange={() => {
                        setAllLifeStatuses(true);
                        setEligibleLifeStatuses([]);
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-on-surface dark:text-slate-300">Open to All</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={!allLifeStatuses}
                      onChange={() => setAllLifeStatuses(false)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-on-surface dark:text-slate-300">Specific Statuses</span>
                  </label>
                </div>
              </div>

              {!allLifeStatuses && (
                <div className="p-3 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/20 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {LIFE_STATUSES.map((ls) => {
                    const isSelected = eligibleLifeStatuses.includes(ls.id);
                    return (
                      <button
                        type="button"
                        key={ls.id}
                        onClick={() => handleToggleLifeStatus(ls.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary dark:text-primary-fixed font-bold'
                            : 'border-outline-variant/30 hover:bg-surface-container text-on-surface-variant dark:text-slate-400'
                        }`}
                      >
                        {ls.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Occupation Eligibility */}
            <div className="space-y-2 pt-3 border-t border-outline-variant/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  Target Occupations
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={allOccupations}
                      onChange={() => {
                        setAllOccupations(true);
                        setEligibleOccupations([]);
                        setEligibleOccupationRequirement('none');
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-on-surface dark:text-slate-300">Open to All</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={!allOccupations}
                      onChange={() => {
                        setAllOccupations(false);
                        setEligibleOccupationRequirement('required');
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-on-surface dark:text-slate-300">Specific Occupations</span>
                  </label>
                </div>
              </div>

              {!allOccupations && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={occupationSearch}
                      onChange={(e) => setOccupationSearch(e.target.value)}
                      placeholder="Search occupations (e.g. Farmer, Artisan, Electrician)..."
                      className="w-full px-3 py-1.5 text-xs bg-surface-container-lowest dark:bg-slate-900 rounded-lg border border-outline-variant/40 text-on-surface dark:text-white"
                    />
                    <select
                      value={eligibleOccupationRequirement}
                      onChange={(e) => setEligibleOccupationRequirement(e.target.value)}
                      className="px-2 py-1.5 bg-surface-container-lowest dark:bg-slate-900 rounded-lg border border-outline-variant/40 text-on-surface dark:text-white text-xs whitespace-nowrap"
                    >
                      <option value="required">Mandatory Requirement</option>
                      <option value="optional">Optional / Higher Priority</option>
                    </select>
                  </div>

                  <div className="p-3 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/20 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {filteredOccupationsList.map((o) => {
                      const isSelected = eligibleOccupations.includes(o.id);
                      return (
                        <button
                          type="button"
                          key={o.id}
                          onClick={() => handleToggleOccupation(o.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                            isSelected
                              ? 'bg-primary/10 border-primary text-primary dark:text-primary-fixed font-bold'
                              : 'border-outline-variant/30 hover:bg-surface-container text-on-surface-variant dark:text-slate-400'
                          }`}
                        >
                          {o.name} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Sector Eligibility */}
            <div className="space-y-2 pt-3 border-t border-outline-variant/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  Target Industry Sectors
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={allSectors}
                      onChange={() => {
                        setAllSectors(true);
                        setEligibleSectors([]);
                        setEligibleSectorRequirement('none');
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-on-surface dark:text-slate-300">Open to All</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={!allSectors}
                      onChange={() => {
                        setAllSectors(false);
                        setEligibleSectorRequirement('required');
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-on-surface dark:text-slate-300">Specific Sectors</span>
                  </label>
                </div>
              </div>

              {!allSectors && (
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <select
                      value={eligibleSectorRequirement}
                      onChange={(e) => setEligibleSectorRequirement(e.target.value)}
                      className="px-2 py-1.5 bg-surface-container-lowest dark:bg-slate-900 rounded-lg border border-outline-variant/40 text-on-surface dark:text-white text-xs"
                    >
                      <option value="required">Mandatory Requirement</option>
                      <option value="optional">Optional / Higher Priority</option>
                    </select>
                  </div>

                  <div className="p-3 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/20 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {SECTORS.map((s) => {
                      const isSelected = eligibleSectors.includes(s.id);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleToggleSector(s.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                            isSelected
                              ? 'bg-primary/10 border-primary text-primary dark:text-primary-fixed font-bold'
                              : 'border-outline-variant/30 hover:bg-surface-container text-on-surface-variant dark:text-slate-400'
                          }`}
                        >
                          {s.name} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Demographic & Financial Constraints */}
          <div>
            <span className="font-label-bold uppercase tracking-wider text-primary dark:text-primary-fixed block mb-3">
              {t('eligibilityOperations')}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('ageRange')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="number"
                  />
                  <span>-</span>
                  <input
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="number"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('maxAnnualIncome')} (₹)
                </label>
                <input
                  value={maxIncome}
                  onChange={(e) => setMaxIncome(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  type="number"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('applicationDeadline')}
                </label>
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  type="date"
                />
              </div>

              <div className="md:col-span-3 flex items-center gap-2 pt-2">
                <input
                  id="business-scheme-toggle"
                  type="checkbox"
                  checked={isBusinessScheme}
                  onChange={(e) => setIsBusinessScheme(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="business-scheme-toggle" className="font-semibold text-on-surface dark:text-white cursor-pointer">
                  {t('isBusinessSchemeToggleLabel')}
                </label>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-container dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-md hover:scale-105 transition-all"
            >
              {t('saveScheme')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
