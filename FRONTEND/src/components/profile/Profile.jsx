import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { INDIAN_STATES } from '../../data/states';
import {
  LIFE_STATUSES,
  OCCUPATIONS,
  SECTORS,
  calculateAge,
  validateDob,
  getLifeStatusLabel,
  getOccupationLabel,
  getSectorLabel
} from '../../data/taxonomy';

export const Profile = () => {
  const {
    userProfile,
    updateProfile,
    uploadDocumentMock,
    profileCompletion,
    sendInstitutionEmailOtp,
    verifyInstitutionEmailOtp
  } = useData();
  const { t } = useLang();

  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [name, setName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [dob, setDob] = useState(userProfile.dob || '2001-08-15');
  const [gender, setGender] = useState(userProfile.gender || 'Male');
  const [state, setState] = useState(userProfile.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState(userProfile.district || 'Varanasi');
  const [category, setCategory] = useState(userProfile.category || 'OBC');
  const [income, setIncome] = useState(userProfile.income !== undefined ? userProfile.income : 350000);

  // Life Status & Intelligence State
  const [lifeStatus, setLifeStatus] = useState(userProfile.life_status || 'farmer');
  const [occupation, setOccupation] = useState(userProfile.occupation || 'farmer');
  const [occupationOther, setOccupationOther] = useState(userProfile.occupation_other || '');
  const [sector, setSector] = useState(userProfile.sector || 'agriculture');
  const [sectorOther, setSectorOther] = useState(userProfile.sector_other || '');
  const [employmentType, setEmploymentType] = useState(userProfile.employment_type || 'full_time');
  const [agricultureActivity, setAgricultureActivity] = useState(
    userProfile.agriculture_activity || 'Small & Marginal Crop Cultivation (Wheat, Paddy, Mustard)'
  );
  const [educationLevel, setEducationLevel] = useState(userProfile.education_level || "Graduate / Bachelor's Degree");
  const [institutionName, setInstitutionName] = useState(userProfile.institution_name || 'Banaras Hindu University (BHU)');
  const [institutionType, setInstitutionType] = useState(userProfile.institution_type || 'Central University');
  const [courseProgram, setCourseProgram] = useState(userProfile.course_program || 'B.Sc. Agriculture (Honours)');
  const [businessActivity, setBusinessActivity] = useState(userProfile.business_activity || '');

  // Institutional Email Verification State
  const [instEmailInput, setInstEmailInput] = useState(userProfile.institution_email || '');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');

  // Bank Modal State
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [bankName, setBankName] = useState(userProfile.bankDetails?.bankName || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(userProfile.bankDetails?.accountNumber || 'XXXX-XXXX-9824');
  const [ifsc, setIfsc] = useState(userProfile.bankDetails?.ifsc || 'SBIN0001234');

  // Real-time Age calculation from DOB
  const calculatedAge = calculateAge(dob);
  const dobValidation = validateDob(dob);

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!dobValidation.valid) {
      alert(dobValidation.error);
      return;
    }

    const payload = {
      name,
      email,
      phone,
      dob,
      gender,
      state,
      district,
      category,
      income: Number(income),
      life_status: lifeStatus,
      occupation,
      occupation_other: occupationOther,
      sector,
      sector_other: sectorOther,
      employment_type: employmentType,
      agriculture_activity: agricultureActivity,
      education_level: educationLevel,
      institution_name: institutionName,
      institution_type: institutionType,
      course_program: courseProgram,
      business_activity: businessActivity
    };

    const success = updateProfile(payload);
    if (success) {
      setIsEditing(false);
    }
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

  const handleSendOtp = async () => {
    if (!instEmailInput || !instEmailInput.includes('@')) {
      alert('Please enter a valid institution email address (.edu, .ac.in, etc.)');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    setOtpMessage('');
    const res = await sendInstitutionEmailOtp(instEmailInput);
    setOtpLoading(false);
    if (res.success) {
      setOtpMessage(res.message);
      setOtpModalOpen(true);
    } else {
      setOtpError(res.error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    const res = await verifyInstitutionEmailOtp(instEmailInput, otpCode);
    setOtpLoading(false);
    if (res.success) {
      setOtpModalOpen(false);
      setOtpCode('');
      setOtpMessage('');
    } else {
      setOtpError(res.error);
    }
  };

  const docs = [
    { key: 'aadhaar', label: 'Aadhaar Card', icon: 'badge' },
    { key: 'pan', label: 'PAN Card', icon: 'credit_card' },
    { key: 'income', label: 'Income Certificate', icon: 'receipt_long' },
    { key: 'caste', label: 'Caste Certificate', icon: 'verified_user' },
    { key: 'voterId', label: 'Voter ID', icon: 'how_to_vote' }
  ];

  const currentAge = calculateAge(userProfile.dob) || userProfile.age || 25;

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
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface dark:text-white">
                {userProfile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed text-[11px] font-bold">
                {getLifeStatusLabel(userProfile.life_status)}
              </span>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">
              {t('citizenId')}: <span className="font-mono font-semibold">{userProfile.id}</span>
              {' · '}
              <span className="text-on-surface dark:text-slate-200 font-medium">
                {userProfile.state}, {userProfile.district}
              </span>
            </p>
            <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {t('profileCompletedPercent', { percent: profileCompletion })}
              </span>
              {userProfile.institution_email_verified && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">school</span> Student Verified
                </span>
              )}
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
        {/* Personal & Intelligence Details */}
        <div className="bg-surface-container-lowest dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-variant dark:border-slate-700 pb-3">
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              {t('applicantDetails')}
            </h3>
            <span className="text-[11px] text-on-surface-variant dark:text-slate-400 font-medium">
              Server-Authoritative Profile
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Basic Identity */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('fullName')}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="text"
                    required
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
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface dark:text-slate-300">{t('mobile')}</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      type="tel"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth & Dynamic Age preview */}
                <div className="p-3 bg-surface-container-low dark:bg-slate-900/80 rounded-xl border border-outline-variant/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-on-surface dark:text-slate-300 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">cake</span>
                      Date of Birth (Source of Truth)
                    </label>
                    {dobValidation.valid ? (
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-primary-fixed text-[11px] font-bold">
                        Exact Age: {calculatedAge} Years
                      </span>
                    ) : (
                      <span className="text-[11px] text-error font-semibold">{dobValidation.error}</span>
                    )}
                  </div>
                  <input
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="date"
                    required
                  />
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-400">
                    Age is calculated dynamically on the server from Date of Birth. Life status is never guessed from age.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-on-surface dark:text-slate-300">{t('gender')}</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Transgender</option>
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

                <div className="grid grid-cols-2 gap-3">
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
                    <label className="font-semibold text-on-surface dark:text-slate-300">{t('district', {}, 'District')}</label>
                    <input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface dark:text-slate-300">{t('annualIncome')} (₹)</label>
                  <input
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="px-3 py-2 bg-surface-container-low dark:bg-slate-900 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                    type="number"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Life Status & Contextual Follow-up Section */}
              <div className="pt-3 border-t border-outline-variant/30 space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-on-surface dark:text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
                    Primary Life Status
                  </label>
                  <select
                    value={lifeStatus}
                    onChange={(e) => setLifeStatus(e.target.value)}
                    className="px-3 py-2.5 bg-primary/5 dark:bg-slate-900 rounded-xl text-on-surface dark:text-white border-2 border-primary/30 font-semibold text-xs"
                  >
                    <optgroup label="Education-related">
                      {LIFE_STATUSES.filter((s) => s.category === 'education').map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Employment & Agriculture">
                      {LIFE_STATUSES.filter((s) => ['employment', 'agriculture'].includes(s.category)).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Circumstances">
                      {LIFE_STATUSES.filter((s) => s.category === 'other').map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Conditional Follow-up for School Student */}
                {lifeStatus === 'student_school' && (
                  <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant/30 space-y-2.5">
                    <div className="font-semibold text-primary dark:text-primary-fixed flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">school</span> School Details
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">School / Institution Name</label>
                      <input
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        placeholder="e.g. Kendriya Vidyalaya Varanasi"
                        className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Class / Grade Level</label>
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="px-2 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        >
                          <option value="Primary (Class 1-5)">Primary (Class 1-5)</option>
                          <option value="Upper Primary (Class 6-8)">Upper Primary (Class 6-8)</option>
                          <option value="Secondary (Class 9-10)">Secondary (Class 9-10)</option>
                          <option value="Senior Secondary (Class 11-12)">Senior Secondary (Class 11-12)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Board / Affiliation</label>
                        <input
                          value={institutionType}
                          onChange={(e) => setInstitutionType(e.target.value)}
                          placeholder="e.g. CBSE / State Board"
                          className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Follow-up for College / University Student */}
                {lifeStatus === 'student_college' && (
                  <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant/30 space-y-2.5">
                    <div className="font-semibold text-primary dark:text-primary-fixed flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">account_balance</span> Higher Education & Verification
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">College / University Name</label>
                      <input
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        placeholder="e.g. Banaras Hindu University (BHU)"
                        className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Degree / Degree Level</label>
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="px-2 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        >
                          <option value="Undergraduate / Bachelor's">Undergraduate / Bachelor's</option>
                          <option value="Postgraduate / Master's">Postgraduate / Master's</option>
                          <option value="Doctoral / Ph.D.">Doctoral / Ph.D.</option>
                          <option value="Diploma / Certificate">Diploma / Certificate</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Course / Branch</label>
                        <input
                          value={courseProgram}
                          onChange={(e) => setCourseProgram(e.target.value)}
                          placeholder="e.g. B.Sc. Agriculture"
                          className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        />
                      </div>
                    </div>

                    {/* Student Institution Email Verification Box */}
                    <div className="mt-2 p-2.5 bg-surface dark:bg-slate-800/80 rounded-lg border border-primary/20 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-on-surface dark:text-white flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-blue-500">mark_email_read</span>
                          Institutional Email (Optional Verification)
                        </label>
                        {userProfile.institution_email_verified && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">
                            Verified ✓
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={instEmailInput}
                          onChange={(e) => setInstEmailInput(e.target.value)}
                          placeholder="student@university.ac.in"
                          className="flex-1 px-2.5 py-1.5 bg-surface-container-low dark:bg-slate-900 rounded-md text-on-surface dark:text-white border border-outline-variant/30 text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading}
                          className="px-3 py-1.5 bg-secondary-container dark:bg-slate-700 text-on-secondary-container dark:text-slate-200 font-semibold rounded-md text-xs hover:bg-opacity-80 transition-colors whitespace-nowrap"
                        >
                          {userProfile.institution_email_verified ? 'Re-verify' : 'Verify via OTP'}
                        </button>
                      </div>
                      {otpMessage && <p className="text-[10px] text-primary">{otpMessage}</p>}
                      {otpError && <p className="text-[10px] text-error font-semibold">{otpError}</p>}
                    </div>
                  </div>
                )}

                {/* Conditional Follow-up for Vocational / Skill Student */}
                {lifeStatus === 'student_vocational' && (
                  <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant/30 space-y-2.5">
                    <div className="font-semibold text-primary dark:text-primary-fixed flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">build</span> Vocational / ITI Details
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Training Institute / ITI Center Name</label>
                      <input
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        placeholder="e.g. Government ITI Varanasi"
                        className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Trade / Course Name</label>
                      <input
                        value={courseProgram}
                        onChange={(e) => setCourseProgram(e.target.value)}
                        placeholder="e.g. Electrician / Fitter / Welding / Solar Technician"
                        className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Follow-up for Employed, Self-employed, Farmer */}
                {['employed', 'self_employed', 'farmer'].includes(lifeStatus) && (
                  <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant/30 space-y-2.5">
                    <div className="font-semibold text-primary dark:text-primary-fixed flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">work</span> Occupation & Sector Specifics
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Occupation (Role / Trade)</label>
                        <select
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          className="px-2 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        >
                          {OCCUPATIONS.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Sector (Industry / Domain)</label>
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="px-2 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        >
                          {SECTORS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {lifeStatus === 'farmer' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Agricultural Activity Details</label>
                        <input
                          value={agricultureActivity}
                          onChange={(e) => setAgricultureActivity(e.target.value)}
                          placeholder="e.g. Small & Marginal Landholder, Wheat & Mustard"
                          className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        />
                      </div>
                    )}

                    {lifeStatus === 'employed' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Employment Type</label>
                        <select
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          className="px-2 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        >
                          <option value="full_time">Full-time Regular Salaried</option>
                          <option value="part_time">Part-time / Wage Earner</option>
                          <option value="contract">Contractual / Gig Worker</option>
                          <option value="other">Other Employment</option>
                        </select>
                      </div>
                    )}

                    {lifeStatus === 'self_employed' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Trade / Activity Description</label>
                        <input
                          value={businessActivity}
                          onChange={(e) => setBusinessActivity(e.target.value)}
                          placeholder="e.g. Independent Electrical Repair & Maintenance"
                          className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Conditional Follow-up for Business Owner */}
                {lifeStatus === 'business_owner' && (
                  <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl border border-outline-variant/30 space-y-2.5">
                    <div className="font-semibold text-primary dark:text-primary-fixed flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">storefront</span> Enterprise Profile
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Primary Business Sector</label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="px-2 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      >
                        {SECTORS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Core Business / Startup Activity</label>
                      <input
                        value={businessActivity}
                        onChange={(e) => setBusinessActivity(e.target.value)}
                        placeholder="e.g. Agro-processing & cold chain logistics unit"
                        className="px-3 py-1.5 bg-surface dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-white font-label-bold text-xs shadow-md hover:bg-primary-container transition-colors mt-4"
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
                <span className="text-on-surface-variant dark:text-slate-400">Date of Birth & Age</span>
                <span className="font-semibold text-on-surface dark:text-white">
                  {userProfile.dob || '15 Aug 2001'} ({currentAge} {t('years', {}, 'Years')}) · {userProfile.gender}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400">Primary Life Status</span>
                <span className="font-bold text-primary dark:text-primary-fixed">
                  {getLifeStatusLabel(userProfile.life_status)}
                </span>
              </div>

              {/* Contextual Displays */}
              {['student_school', 'student_college', 'student_vocational'].includes(userProfile.life_status) && (
                <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                  <span className="text-on-surface-variant dark:text-slate-400">Education Institution</span>
                  <span className="font-semibold text-on-surface dark:text-white text-right">
                    {userProfile.institution_name || 'Not Provided'} ({userProfile.education_level || 'Student'})
                  </span>
                </div>
              )}

              {userProfile.occupation && (
                <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                  <span className="text-on-surface-variant dark:text-slate-400">Occupation</span>
                  <span className="font-semibold text-on-surface dark:text-white">
                    {getOccupationLabel(userProfile.occupation)}
                  </span>
                </div>
              )}

              {userProfile.sector && (
                <div className="flex justify-between items-center p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                  <span className="text-on-surface-variant dark:text-slate-400">Industry / Sector</span>
                  <span className="font-semibold text-on-surface dark:text-white">
                    {getSectorLabel(userProfile.sector)}
                  </span>
                </div>
              )}

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
                <span className="font-semibold text-on-surface dark:text-white">₹ {Number(userProfile.income || 0).toLocaleString('en-IN')}</span>
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
                  {userProfile.bankDetails?.bankName}
                </span>
              </div>

              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl">
                <span className="text-on-surface-variant dark:text-slate-400 block text-[10px] uppercase font-bold">
                  {t('accountNumber')}
                </span>
                <span className="font-mono font-semibold text-on-surface dark:text-white">
                  {userProfile.bankDetails?.accountNumber}
                </span>
              </div>

              <div className="p-3 bg-surface-container-low dark:bg-slate-900 rounded-xl col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-on-surface-variant dark:text-slate-400 block text-[10px] uppercase font-bold">
                    {t('ifscCode')}
                  </span>
                  <span className="font-mono font-semibold text-on-surface dark:text-white">
                    {userProfile.bankDetails?.ifsc}
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
                const docState = userProfile.documents?.[doc.key] || { status: 'Missing' };
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

      {/* Student OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full border border-outline-variant/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                Verify Student Email
              </div>
              <button
                onClick={() => setOtpModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant dark:text-slate-300">
              Enter the 6-digit verification code sent to <span className="font-semibold text-on-surface dark:text-white">{instEmailInput}</span> (valid for 5 mins).
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
              <input
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP (e.g. 789456)"
                maxLength="6"
                className="w-full text-center tracking-widest text-base font-mono px-3 py-2 bg-surface-container-low dark:bg-slate-800 rounded-lg text-on-surface dark:text-white border border-outline-variant/40 font-bold"
                required
              />

              {otpError && <p className="text-xs text-error font-semibold">{otpError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-container"
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
