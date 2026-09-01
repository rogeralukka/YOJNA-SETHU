import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { INDIAN_STATES } from '../../data/states';

export const Profile = () => {
  const { userProfile, updateProfile, uploadDocumentMock, profileCompletion } = useData();
  const { t } = useLang();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [age, setAge] = useState(userProfile.age);
  const [state, setState] = useState(userProfile.state);
  const [category, setCategory] = useState(userProfile.category);
  const [income, setIncome] = useState(userProfile.income);

  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankName, setBankName] = useState(userProfile.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(userProfile.bankDetails.accountNumber);
  const [ifsc, setIfsc] = useState(userProfile.bankDetails.ifsc);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      age: Number(age),
      state,
      category,
      income: Number(income)
    });
    setIsEditing(false);
  };

  const handleSaveBank = (e) => {
    e.preventDefault();
    updateProfile({
      bankDetails: {
        ...userProfile.bankDetails,
        bankName,
        accountNumber,
        ifsc
      }
    });
    setBankModalOpen(false);
  };

  const docs = [
    { key: 'aadhaar', label: 'Aadhaar Card', icon: 'badge' },
    { key: 'pan', label: 'PAN Card', icon: 'credit_card' },
    { key: 'income', label: 'Income Certificate', icon: 'receipt_long' },
    { key: 'caste', label: 'Caste Certificate', icon: 'verified_user' },
    { key: 'voterId', label: 'Voter ID', icon: 'how_to_vote' },
  ];

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-margin-desktop py-8 pb-24 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-surface-container dark:border-slate-700 shadow-md"
              style={{ backgroundImage: `url('${userProfile.avatarUrl}')` }}
            />
            <div
              onClick={() => uploadDocumentMock('aadhaar', 'New_Profile_Photo.jpg', '850 KB')}
              className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full border-2 border-surface dark:border-slate-800 flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform"
              title="Update photo"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            </div>
          </div>

          <div>
            <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface dark:text-white">
              {userProfile.name}
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">
              {t('citizenId')}: <span className="font-mono font-semibold">{userProfile.id}</span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[11px] font-bold">
                {t('profileCompletedPercent', { percent: profileCompletion })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-xl bg-secondary-container dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 font-label-bold text-xs hover:bg-opacity-80 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isEditing ? 'close' : 'edit'}
          </span>
          <span>{isEditing ? t('cancelEdit') : t('editProfile')}</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-variant dark:border-slate-700 pb-3">
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              {t('applicantDetails')}
            </h3>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-300">{t('fullName')}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('email')}</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('mobile')}</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="tel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('age')}</label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="number"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('state')}</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('category')}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-300">{t('annualIncome')} (₹)</label>
                <input
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  type="number"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-white font-label-bold text-xs shadow-md hover:bg-primary-container transition-colors"
              >
                {t('saveChanges')}
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">{t('email')}</span>
                <span className="font-semibold text-on-surface dark:text-white">{userProfile.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">{t('mobile')}</span>
                <span className="font-semibold text-on-surface dark:text-white">{userProfile.phone}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">{t('ageGender')}</span>
                <span className="font-semibold text-on-surface dark:text-white">
                  {userProfile.age} {t('years', {}, 'Years')} • {t('gender_' + userProfile.gender.toLowerCase(), {}, userProfile.gender)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">{t('state')}</span>
                <span className="font-semibold text-on-surface dark:text-white">{userProfile.state}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">{t('category')}</span>
                <span className="font-semibold text-on-surface dark:text-white">{userProfile.category}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">{t('annualIncome')}</span>
                <span className="font-semibold text-on-surface dark:text-white">₹ {userProfile.income.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bank & Documents Details */}
        <div className="space-y-6">
          {/* Bank Details */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-variant dark:border-slate-700 pb-3">
              <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
                {t('bankDetails')}
              </h3>
              <button
                onClick={() => setBankModalOpen(true)}
                className="text-xs font-semibold text-primary dark:text-primary-fixed hover:underline"
              >
                {t('edit')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400 block text-[10px] uppercase font-bold">
                  {t('bankName')}
                </span>
                <span className="font-semibold text-on-surface dark:text-white">
                  {userProfile.bankDetails.bankName}
                </span>
              </div>

              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400 block text-[10px] uppercase font-bold">
                  {t('accountNumber')}
                </span>
                <span className="font-mono font-semibold text-on-surface dark:text-white">
                  {userProfile.bankDetails.accountNumber}
                </span>
              </div>

              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-on-surface-variant dark:text-slate-400 block text-[10px] uppercase font-bold">
                    {t('ifscCode')}
                  </span>
                  <span className="font-mono font-semibold text-on-surface dark:text-white">
                    {userProfile.bankDetails.ifsc}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-[10px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span> {t('linkedVerified')}
                </span>
              </div>
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-variant dark:border-slate-700 pb-3">
              <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[20px]">folder_open</span>
                {t('verificationDocuments')}
              </h3>
            </div>

            <div className="space-y-2.5">
              {docs.map((doc) => {
                const docState = userProfile.documents[doc.key] || { status: 'Missing' };
                const isUploaded = docState.status === 'Uploaded';

                return (
                  <div
                    key={doc.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low dark:bg-slate-900 border border-outline-variant/20 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-outline dark:text-slate-400 text-[20px]">
                        {doc.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-on-surface dark:text-white block truncate">
                          {doc.label}
                        </span>
                        <span className="text-[11px] text-on-surface-variant dark:text-slate-400">
                          {isUploaded ? docState.name : t('notUploadedRequired')}
                        </span>
                      </div>
                    </div>

                    <div>
                      {isUploaded ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] dark:bg-emerald-950 text-[#1B5E20] dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check</span> {t('uploaded')}
                        </span>
                      ) : (
                        <button
                          onClick={() => uploadDocumentMock(doc.key, `${doc.label}_Verified.pdf`, '1.4 MB')}
                          className="px-3 py-1 bg-primary text-white rounded-lg font-label-bold text-[11px] hover:bg-primary-container transition-colors"
                        >
                          {t('uploadProof')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Bank Modal */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full border border-outline-variant/30 shadow-2xl">
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-4">
              {t('updateBankDetails')}
            </h3>
            <form onSubmit={handleSaveBank} className="space-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-300">{t('bankName')}</label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-300">{t('accountNumber')}</label>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface dark:text-slate-300">{t('ifscCode')}</label>
                <input
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40 uppercase"
                  type="text"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBankModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container"
                >
                  {t('saveBankDetails')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
