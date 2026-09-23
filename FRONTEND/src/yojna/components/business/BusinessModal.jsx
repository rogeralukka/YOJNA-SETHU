import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { Building2, X, AlertCircle } from 'lucide-react';

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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#0F1115] rounded-3xl overflow-hidden shadow-2xl relative w-full max-w-2xl border border-neutral-200 dark:border-white/[0.08] flex flex-col max-h-[88vh] my-auto animate-fade-in-up">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 bg-neutral-50/70 dark:bg-[#16191F] border-b border-neutral-200 dark:border-white/[0.08] flex items-center justify-between sticky top-0 z-20 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED]">
                {editingBusiness ? t('editBusiness') || 'Edit Business Profile' : t('addNewBusiness') || 'Register New Business'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#8A8F98]">
                {t('enterAccurateDetailsBiz') || 'Enter accurate MSME and tax identifiers for credit matching.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#1D212A] hover:text-neutral-900 dark:hover:text-[#EDEDED] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Basic Info */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-3">
              Basic Business Information
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Legal Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. EcoTech Solutions Pvt Ltd"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Business Constitution Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Private Limited">Private Limited</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="One Person Company">One Person Company</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Industry Sector <span className="text-rose-500">*</span>
                </label>
                <select
                  value={industryCategory}
                  onChange={(e) => setIndustryCategory(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="IT & Services">IT & Services</option>
                  <option value="Agriculture">Agriculture & Agro-Processing</option>
                  <option value="Manufacturing">Manufacturing & Engineering</option>
                  <option value="Retail & Trade">Retail & Trade</option>
                  <option value="Healthcare">Healthcare & Pharmaceuticals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tax & Identifiers */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-3">
              Tax & MSME Identifiers
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  GSTIN
                </label>
                <input
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. 27AAPFT2098A1Z5"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Company PAN
                </label>
                <input
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. AAPFT2098A"
                  type="text"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Udyam MSME Registration Number
                </label>
                <input
                  value={udyamRegNumber}
                  onChange={(e) => setUdyamRegNumber(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. UDYAM-UP-01-0023456"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-3">
              Registered Office & Contact
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Registered Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Registered commercial address"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Official Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 00000"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@company.in"
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Annual Turnover (INR)
                </label>
                <input
                  value={annualTurnover}
                  onChange={(e) => setAnnualTurnover(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. 2500000"
                  type="number"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-[#EDEDED]">
                  Employee Count
                </label>
                <input
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="px-4 py-2 bg-neutral-50 dark:bg-[#16191F] rounded-xl text-neutral-900 dark:text-[#EDEDED] text-xs sm:text-sm border border-neutral-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="e.g. 15"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-neutral-700 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Business Profile
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default BusinessModal;
