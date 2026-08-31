import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const AddEditSchemeModal = ({ isOpen, onClose, editingScheme = null }) => {
  const { addScheme, updateScheme } = useData();
  const { t } = useLang();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Ministry of Agriculture & Farmers Welfare');
  const [category, setCategory] = useState('Agriculture');
  const [description, setDescription] = useState('');
  const [benefit, setBenefit] = useState('');
  const [benefitDetail, setBenefitDetail] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(70);
  const [maxIncome, setMaxIncome] = useState(500000);
  const [deadline, setDeadline] = useState('');
  const [isBusinessScheme, setIsBusinessScheme] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingScheme) {
      setName(editingScheme.name || '');
      setDepartment(editingScheme.department || 'Ministry of Agriculture & Farmers Welfare');
      setCategory(editingScheme.category || 'Agriculture');
      setDescription(editingScheme.description || '');
      setBenefit(editingScheme.benefit || '');
      setBenefitDetail(editingScheme.benefitDetail || '');
      setMinAge(editingScheme.minAge || 18);
      setMaxAge(editingScheme.maxAge || 70);
      setMaxIncome(editingScheme.maxIncome || 500000);
      setDeadline(editingScheme.deadline || '');
      setIsBusinessScheme(Boolean(editingScheme.isBusinessScheme));
    } else {
      setName('');
      setDepartment('Ministry of Agriculture & Farmers Welfare');
      setCategory('Agriculture');
      setDescription('');
      setBenefit('Direct Benefit Support');
      setBenefitDetail('Government Subsidy');
      setMinAge(18);
      setMaxAge(70);
      setMaxIncome(500000);
      setDeadline('');
      setIsBusinessScheme(false);
    }
    setError('');
  }, [editingScheme, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Scheme Name and Description are required");
      return;
    }

    const payload = {
      name: name.trim(),
      department,
      category,
      description: description.trim(),
      benefit: benefit.trim() || "Financial Grant",
      benefitDetail: benefitDetail.trim() || "Direct Transfer",
      minAge: Number(minAge),
      maxAge: Number(maxAge),
      maxIncome: Number(maxIncome),
      deadline: deadline || "",
      deadlineText: deadline ? `Closes ${deadline}` : "Always Open",
      isBusinessScheme,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in-up">
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-outline-variant/30 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-200">
                  {t('ministryDepartment')} <span className="text-error">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="px-3.5 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white text-xs border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Ministry of Agriculture & Farmers Welfare">Ministry of Agriculture</option>
                  <option value="Ministry of Finance">Ministry of Finance</option>
                  <option value="Ministry of MSME">Ministry of MSME</option>
                  <option value="Ministry of Housing and Urban Affairs">Ministry of Housing & Urban Affairs</option>
                  <option value="National Health Authority">National Health Authority</option>
                  <option value="Ministry of Social Justice & Empowerment">Ministry of Social Justice</option>
                </select>
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

          {/* Eligibility & Constraints */}
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
    </div>
  );
};
