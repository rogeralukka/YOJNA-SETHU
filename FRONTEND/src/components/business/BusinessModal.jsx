import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';

export const BusinessModal = ({ isOpen, onClose, editingBusiness = null }) => {
  const { addBusiness, updateBusiness } = useData();
  const { t } = useLang();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Private Limited');
  const [industryCategory, setIndustryCategory] = useState('IT & Services');
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [annualTurnover, setAnnualTurnover] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [yearsInOperation, setYearsInOperation] = useState('');
  const [udyamRegNumber, setUdyamRegNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBusiness) {
      setBusinessName(editingBusiness.businessName || '');
      setBusinessType(editingBusiness.businessType || 'Private Limited');
      setIndustryCategory(editingBusiness.industryCategory || 'IT & Services');
      setGst(editingBusiness.gst || '');
      setPan(editingBusiness.pan || '');
      setAddress(editingBusiness.address || '');
      setPhone(editingBusiness.phone || '');
      setEmail(editingBusiness.email || '');
      setAnnualTurnover(editingBusiness.annualTurnover || '');
      setEmployeeCount(editingBusiness.employeeCount || '');
      setYearsInOperation(editingBusiness.yearsInOperation || '');
      setUdyamRegNumber(editingBusiness.udyamRegNumber || '');
    } else {
      setBusinessName('');
      setBusinessType('Private Limited');
      setIndustryCategory('IT & Services');
      setGst('');
      setPan('');
      setAddress('');
      setPhone('+91 ');
      setEmail('');
      setAnnualTurnover('');
      setEmployeeCount('');
      setYearsInOperation('');
      setUdyamRegNumber('');
    }
    setError('');
  }, [editingBusiness, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError("Legal Business Name is required");
      return;
    }
    if (!address.trim() || !phone.trim() || !email.trim()) {
      setError("Address, Phone, and Email are required");
      return;
    }

    const payload = {
      businessName: businessName.trim(),
      businessType,
      industryCategory,
      gst: gst.trim().toUpperCase(),
      pan: pan.trim().toUpperCase(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      annualTurnover: annualTurnover.trim(),
      employeeCount: employeeCount.trim(),
      yearsInOperation: yearsInOperation.trim(),
      udyamRegNumber: udyamRegNumber.trim().toUpperCase()
    };

    if (editingBusiness) {
      updateBusiness(editingBusiness.id, payload);
    } else {
      addBusiness(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative w-full max-w-2xl border border-outline-variant/30 dark:border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 bg-surface-container-low/70 dark:bg-slate-800/70 border-b border-surface-container dark:border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">domain_add</span>
            </div>
            <div>
              <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white">
                {editingBusiness ? t('editBusiness') : t('addNewBusiness')}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400">
                {t('enterAccurateDetailsBiz')}
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

        {/* Error */}
        {error && (
          <div className="mx-8 mt-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Basic Info */}
          <div>
            <span className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-primary-fixed block mb-3">
              {t('basicInformation')}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('businessName')} <span className="text-error">*</span>
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. EcoTech Solutions Pvt Ltd"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('businessType')} <span className="text-error">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">LLP</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('industrySector')} <span className="text-error">*</span>
                </label>
                <select
                  value={industryCategory}
                  onChange={(e) => setIndustryCategory(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="IT & Services">IT & Services</option>
                  <option value="Agriculture">Agriculture & Processing</option>
                  <option value="Retail & Wholesale">Retail & Wholesale</option>
                  <option value="Healthcare">Healthcare & Pharma</option>
                </select>
              </div>
            </div>
          </div>

          {/* Registrations */}
          <div>
            <span className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-primary-fixed block mb-3">
              {t('registrationsIdentifiers')}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('gstNumber')}
                </label>
                <input
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm uppercase font-mono border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="27AAPFT2098A1Z5"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('panNumber')}
                </label>
                <input
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm uppercase font-mono border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="AAPFT2098A"
                  type="text"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('udyamNumber')}
                </label>
                <input
                  value={udyamRegNumber}
                  onChange={(e) => setUdyamRegNumber(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm uppercase font-mono border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="UDYAM-UP-01-0023456"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Contact & Operational Info */}
          <div>
            <span className="font-label-bold text-xs uppercase tracking-wider text-primary dark:text-primary-fixed block mb-3">
              {t('operationalContactDetails')}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('businessAddress')} <span className="text-error">*</span>
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Plot/Shop No, Street, City, State, PIN"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('contactPhone')} <span className="text-error">*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+91 98765 00000"
                  type="tel"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('contactEmail')} <span className="text-error">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="business@email.com"
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('annualTurnover')} (₹)
                </label>
                <input
                  value={annualTurnover}
                  onChange={(e) => setAnnualTurnover(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 2500000"
                  type="number"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-bold text-xs text-on-surface dark:text-slate-200">
                  {t('employeeCount')}
                </label>
                <input
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 rounded-xl text-on-surface dark:text-white font-body-md text-sm border border-outline-variant/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 15"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-container dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-label-bold text-xs text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              {t('saveBusiness')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
