import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';

export const ApplicationForm = () => {
  const {
    applicationFormSchemes,
    schemes,
    businesses,
    userProfile,
    uploadDocumentMock,
    createApplication,
    navigateTo,
    showToast,
  } = useData();
  const { user } = useAuth();
  const { t } = useLang();

  // Active list of schemes to apply to
  const appliedSchemes = applicationFormSchemes.length > 0 ? applicationFormSchemes : [schemes[0]];

  // Determine if application contains business schemes
  const hasBusinessScheme = appliedSchemes.some((s) => s.isBusinessScheme);

  // Entity selection state for business schemes
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    businesses[0]?.id || ''
  );

  // Scheme specific inputs
  const [landHolding, setLandHolding] = useState('1.5');
  const [loanAmount, setLoanAmount] = useState('50000');
  const [projectSummary, setProjectSummary] = useState('');
  const [uploadedDocName, setUploadedDocName] = useState('Supporting_Documents.pdf');
  const [customUploadedDocs, setCustomUploadedDocs] = useState({});

  // Success state
  const [submittedApp, setSubmittedApp] = useState(null);

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId) || businesses[0];

  // Aggregate all unique required documents across the applied schemes
  const rawRequiredDocs = Array.from(
    new Set(appliedSchemes.flatMap((s) => s.documentsRequired || []))
  );
  const requiredDocs = rawRequiredDocs.length > 0
    ? rawRequiredDocs
    : ['Aadhaar Card', 'Bank Account Details'];

  // Map scheme required document string to user profile document slot
  const getDocMeta = (docName) => {
    const lower = docName.toLowerCase();
    if (lower.includes('income')) {
      return {
        key: 'income',
        label: 'Income Certificate',
        icon: 'payments',
        isProfileDoc: true,
        fileName: 'Income_Certificate_Verified.pdf'
      };
    }
    if (lower.includes('caste')) {
      return {
        key: 'caste',
        label: 'Caste Certificate',
        icon: 'badge',
        isProfileDoc: true,
        fileName: 'Caste_Certificate_Verified.pdf'
      };
    }
    if (lower.includes('aadhaar')) {
      return {
        key: 'aadhaar',
        label: 'Aadhaar Card',
        icon: 'fingerprint',
        isProfileDoc: true,
        fileName: 'Aadhaar_Card_Verified.pdf'
      };
    }
    if (lower.includes('pan')) {
      return {
        key: 'pan',
        label: 'PAN Card',
        icon: 'credit_card',
        isProfileDoc: true,
        fileName: 'PAN_Card.pdf'
      };
    }
    if (lower.includes('voter')) {
      return {
        key: 'voterId',
        label: 'Voter ID',
        icon: 'how_to_vote',
        isProfileDoc: true,
        fileName: 'Voter_ID_Scan.pdf'
      };
    }
    if (lower.includes('bank') || lower.includes('passbook')) {
      return {
        key: 'bank',
        label: 'Bank Account / Passbook',
        icon: 'account_balance',
        isProfileDoc: true,
        fileName: 'Bank_Passbook_Verified.pdf'
      };
    }
    return {
      key: `custom_${docName.replace(/[^a-zA-Z0-9]/g, '_')}`,
      label: docName,
      icon: 'description',
      isProfileDoc: false,
      fileName: `${docName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    };
  };

  const handleUploadDoc = (meta) => {
    if (meta.isProfileDoc && meta.key !== 'bank') {
      uploadDocumentMock(meta.key, meta.fileName, '1.4 MB');
      showToast(`${meta.label} uploaded and auto-attached from profile!`);
    } else {
      setCustomUploadedDocs(prev => ({
        ...prev,
        [meta.key]: {
          status: 'Uploaded',
          name: meta.fileName,
          size: '1.2 MB',
          date: 'Today'
        }
      }));
      showToast(`${meta.label} attached successfully!`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for mandatory missing documents (skip "(if applicable)")
    const missingDocs = requiredDocs.filter(docName => {
      if (docName.toLowerCase().includes('if applicable')) return false;
      const meta = getDocMeta(docName);
      if (meta.key === 'bank') return false; // Handled by bank details
      if (meta.isProfileDoc) {
        return userProfile.documents?.[meta.key]?.status !== 'Uploaded';
      }
      return customUploadedDocs[meta.key]?.status !== 'Uploaded';
    });

    if (missingDocs.length > 0) {
      showToast(`Please upload required document: "${missingDocs[0]}" to proceed`, 'error');
      return;
    }

    const created = createApplication({
      schemeList: appliedSchemes,
      entityType: hasBusinessScheme ? 'business' : 'personal',
      businessId: hasBusinessScheme ? selectedBusinessId : null,
      bankDetails: userProfile.bankDetails,
      additionalInputs: {
        landHolding,
        loanAmount,
        projectSummary,
        customDocs: Object.values(customUploadedDocs)
      }
    });

    setSubmittedApp(created);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)] animate-fade-in-up">
      {/* Modal / Card Container */}
      <div className="relative w-full max-w-4xl bg-surface-container-lowest dark:bg-slate-900 rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 bg-surface-container-low/70 dark:bg-slate-800/70 border-b border-surface-container dark:border-slate-800 flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[11px] font-label-bold uppercase tracking-wider">
                {hasBusinessScheme ? t('businessApplication') : t('personalApplication')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-headline-lg font-bold text-on-surface dark:text-white">
              {t('application')}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 mt-0.5 flex-wrap">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>{t('applyingTo')}</span>
              <strong className="text-on-surface dark:text-white font-label-bold">
                {appliedSchemes.map((s) => s.name).join(', ')}
              </strong>
            </div>
          </div>

          <button
            onClick={() => navigateTo('dashboard')}
            className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Entity Information */}
          {hasBusinessScheme ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-label-bold uppercase tracking-wider text-on-surface dark:text-slate-200">
                  {t('applyingAs')} ({t('businessContext')})
                </label>
                <span className="text-xs text-primary dark:text-primary-fixed font-medium">
                  {t('selectRegisteredEnterprise')}
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="w-full appearance-none bg-surface-container-low dark:bg-slate-800 text-on-surface dark:text-white font-body-md text-sm py-3 px-4 rounded-xl border border-outline-variant/40 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {businesses.map((biz) => (
                    <option key={biz.id} value={biz.id}>
                      {biz.businessName} ({biz.businessType} • GST: {biz.gst || 'N/A'})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-surface-container-low dark:bg-slate-800 rounded-xl border border-outline-variant/30 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">account_circle</span>
                <span className="text-xs sm:text-sm font-semibold text-on-surface dark:text-slate-200">
                  {t('applyingAsIndividual', { name: userProfile.name })}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 text-[11px] font-bold">
                {t('personal')}
              </span>
            </div>
          )}

          {/* Auto-Filled Details Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Details Card */}
            <div className="bg-surface-container-low/60 dark:bg-slate-800/80 p-5 rounded-2xl border border-outline-variant/30 dark:border-slate-700 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                  <h3 className="text-xs font-label-bold uppercase tracking-wider text-on-surface dark:text-white">
                    {t('applicantDetails')}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">check</span> {t('autoFilled')}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                  <span className="text-on-surface-variant dark:text-slate-400">{t('fullName')}</span>
                  <span className="font-semibold text-on-surface dark:text-white">{userProfile.name}</span>
                </div>
                <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                  <span className="text-on-surface-variant dark:text-slate-400">{t('ageGender')}</span>
                  <span className="font-semibold text-on-surface dark:text-white">{userProfile.age} Yrs / {userProfile.gender}</span>
                </div>
                <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                  <span className="text-on-surface-variant dark:text-slate-400">{t('state')}</span>
                  <span className="font-semibold text-on-surface dark:text-white">{userProfile.state}</span>
                </div>
                <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                  <span className="text-on-surface-variant dark:text-slate-400">{t('category')}</span>
                  <span className="font-semibold text-on-surface dark:text-white">{userProfile.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant dark:text-slate-400">{t('annualIncome')}</span>
                  <span className="font-semibold text-on-surface dark:text-white">₹ {userProfile.income.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Business / Bank Details Card */}
            {hasBusinessScheme ? (
              <div className="bg-surface-container-low/60 dark:bg-slate-800/80 p-5 rounded-2xl border border-outline-variant/30 dark:border-slate-700 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">storefront</span>
                    <h3 className="text-xs font-label-bold uppercase tracking-wider text-on-surface dark:text-white">
                      {t('businessDetails')}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">check</span> {t('autoFilled')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('legalName')}</span>
                    <span className="font-semibold text-on-surface dark:text-white truncate max-w-[160px]">{selectedBusiness?.businessName}</span>
                  </div>
                  <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('gstNumber')}</span>
                    <span className="font-mono font-semibold text-on-surface dark:text-white">{selectedBusiness?.gst || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('panNumber')}</span>
                    <span className="font-mono font-semibold text-on-surface dark:text-white">{selectedBusiness?.pan || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('turnoverSector')}</span>
                    <span className="font-semibold text-on-surface dark:text-white">₹ {selectedBusiness?.annualTurnover} ({selectedBusiness?.industryCategory})</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low/60 dark:bg-slate-800/80 p-5 rounded-2xl border border-outline-variant/30 dark:border-slate-700 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
                    <h3 className="text-xs font-label-bold uppercase tracking-wider text-on-surface dark:text-white">
                      {t('bankDetails')}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">check</span> {t('autoFilled')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('bankName')}</span>
                    <span className="font-semibold text-on-surface dark:text-white">{userProfile.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between border-b border-surface-container dark:border-slate-700 pb-1.5">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('accountNumber')}</span>
                    <span className="font-mono font-semibold text-on-surface dark:text-white">{userProfile.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant dark:text-slate-400">{t('ifscCode')}</span>
                    <span className="font-mono font-semibold text-on-surface dark:text-white">{userProfile.bankDetails.ifsc}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Required Verification Documents Section */}
          <div className="bg-surface-container-low/60 dark:bg-slate-800/80 p-5 rounded-2xl border border-outline-variant/30 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary dark:text-tertiary-fixed text-[20px]">
                  folder_open
                </span>
                <h3 className="text-xs font-label-bold uppercase tracking-wider text-on-surface dark:text-white">
                  {t('requiredDocuments')}
                </h3>
              </div>
              <span className="text-[11px] text-on-surface-variant dark:text-slate-400">
                {t('autoFilled')} &amp; verified from profile
              </span>
            </div>

            <div className="space-y-2.5">
              {requiredDocs.map((docName, idx) => {
                const meta = getDocMeta(docName);
                if (meta.key === 'bank') return null; // Already shown in Bank Details card

                const isProfile = meta.isProfileDoc;
                const docState = isProfile
                  ? userProfile.documents?.[meta.key]
                  : customUploadedDocs[meta.key];
                const isUploaded = docState?.status === 'Uploaded';

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isUploaded
                        ? 'bg-surface-container-lowest/90 dark:bg-slate-900 border-outline-variant/30 dark:border-slate-700/80'
                        : 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 dark:border-amber-600/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isUploaded
                            ? 'bg-primary/10 text-primary dark:text-primary-fixed'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {meta.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-on-surface dark:text-white truncate">
                            {docName}
                          </span>
                          {isUploaded && isProfile && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60">
                              <span className="material-symbols-outlined text-[11px]">verified</span>
                              {t('autoAttachedFromProfile')}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-on-surface-variant dark:text-slate-400 block truncate mt-0.5">
                          {isUploaded
                            ? `${docState.name} • ${docState.size || '1.4 MB'}`
                            : t('missingRequired')}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isUploaded ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] dark:bg-emerald-950 text-[#1B5E20] dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          {t('uploaded')}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUploadDoc(meta)}
                          className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg font-label-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                          <span>{t('uploadAndAttach')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheme Specific Inputs */}
          <div className="bg-primary/5 dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/20 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">assignment</span>
              <h3 className="text-xs font-label-bold uppercase tracking-wider text-primary dark:text-primary-fixed">
                {t('schemeRequirements')}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appliedSchemes.some((s) => s.category === 'Agriculture') && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-label-bold text-on-surface dark:text-slate-200">
                    {t('cultivableLandHolding')}
                  </label>
                  <input
                    value={landHolding}
                    onChange={(e) => setLandHolding(e.target.value)}
                    step="0.01"
                    type="number"
                    className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-700 text-on-surface dark:text-white text-sm py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 1.5"
                  />
                </div>
              )}

              {appliedSchemes.some((s) => s.category === 'Finance') && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-label-bold text-on-surface dark:text-slate-200">
                    {t('requiredCreditAmount')}
                  </label>
                  <input
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    type="number"
                    className="w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-700 text-on-surface dark:text-white text-sm py-2.5 px-4 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 50000"
                  />
                </div>
              )}

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-label-bold text-on-surface dark:text-slate-200">
                  {t('uploadDocumentProof')}
                </label>
                <div className="border-2 border-dashed border-outline-variant/50 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-outline-variant text-[28px] mb-1 group-hover:text-primary transition-colors">
                    cloud_upload
                  </span>
                  <span className="text-xs font-medium text-on-surface dark:text-slate-300">
                    {uploadedDocName}
                  </span>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                    {t('clickToReplaceDocs')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-outline-variant/20 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigateTo('dashboard')}
              className="px-6 py-2.5 rounded-xl text-xs font-label-bold text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-slate-800 transition-colors"
            >
              {t('cancel')}
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-xs font-label-bold text-on-primary bg-gradient-to-r from-primary to-[#1E3A5F] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t('submitApplication')}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Submission Success Modal */}
      {submittedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full border border-primary/20 shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] dark:bg-emerald-950/50 text-[#1B5E20] dark:text-emerald-400 flex items-center justify-center shadow-md mb-4 animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-2">
              {t('applicationSubmittedSuccess')}
            </h3>

            <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-300 mb-6">
              {t('appReceivedRefId')}
              <br />
              <span className="font-mono font-bold text-primary dark:text-primary-fixed text-base inline-block mt-1">
                {submittedApp.applicationId}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => navigateTo('my-applications')}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-label-bold text-xs shadow-md hover:bg-primary-container transition-all"
              >
                {t('trackInMyApplications')}
              </button>

              <button
                onClick={() => {
                  setSubmittedApp(null);
                  navigateTo('dashboard');
                }}
                className="flex-1 py-3 rounded-xl bg-surface-container dark:bg-slate-800 text-on-surface dark:text-white font-label-bold text-xs hover:bg-surface-container-high transition-all"
              >
                {t('returnToDashboard')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
