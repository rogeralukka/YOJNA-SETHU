import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import Icon from '../../../features/yojna-setu/components/Icon';

export const LoginRegisterModal = () => {
  const { authModal, closeAuthModal, openAuthModal, loginCitizen, registerCitizen } = useAuth();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState(authModal === 'citizen_register' ? 'register' : 'login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Form states - Pre-filled for Reviewers
  const [loginIdentifier, setLoginIdentifier] = useState('rahul@email.com');
  const [loading, setLoading] = useState(false);
  const [loginPassword, setLoginPassword] = useState('password123');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTerms, setRegTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (authModal !== 'citizen_login' && authModal !== 'citizen_register') {
    return null;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setErrorMsg("Please enter your email or mobile number");
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMsg("Please enter your password");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await loginCitizen({ identifier: loginIdentifier, password: loginPassword });
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Invalid credentials. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      setErrorMsg("Please enter your full name");
      return;
    }
    if (!regEmail.trim() || !regMobile.trim()) {
      setErrorMsg("Please provide both email and mobile number");
      return;
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    if (!regTerms) {
      setErrorMsg("Please accept the Terms of Service");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await registerCitizen({
      fullName: regFullName,
      email: regEmail,
      mobile: regMobile,
      password: regPassword,
    });
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-fixed rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary-fixed rounded-full blur-[120px] opacity-20 pointer-events-none" />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[480px] rounded-[24px] bg-surface/90 dark:bg-[#0F1115]/95 backdrop-blur-[24px] shadow-[0_20px_40px_-10px_rgba(26,86,219,0.25)] border border-white/40 dark:border-white/[0.08] overflow-hidden flex flex-col transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
          title="Close Modal"
        >
          <Icon name="close" size={18} />
        </button>

        {/* Header Image Area */}
        <div
          className="h-32 w-full relative overflow-hidden bg-surface-container-highest bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_ktOViT4gjWbc1MaKjcCdunFsNpHiKTpGXnOK7IYltzUts0-lUkPS1hbRqlQLYv_lBqgDxvPx_9c-3lFQHCuBY6vI756qP2wNIW0XmmfpfT8OcCcNPhYl4azpGUTj6zxR--3vsAuLaRZy2hHEIax4XPq1_4XBqfQs9UApbv1VxsTTIh1_4pjHdOYYPx49lqUpWAdsBvL50OGiWZ7klaO1omtozoxIVLhUBJYB34Ax3IabBKvbihpVFQ')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface dark:from-[#0F1115] via-surface/40 dark:via-[#0F1115]/40 to-transparent" />
          <div className="absolute bottom-3 left-6">
            <div className="flex items-center gap-2">
              <span className="text-primary dark:text-primary-fixed flex items-center">
                <Icon name="shield_person" size={28} />
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface dark:text-[#EDEDED] font-bold">
                {t('secureAccess')}
              </h2>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex w-full px-6 pt-3 relative">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-center font-label-bold text-sm transition-colors ${
              activeTab === 'login'
                ? 'text-primary dark:text-primary-fixed'
                : 'text-on-surface-variant dark:text-[#8A8F98] hover:text-on-surface dark:hover:text-[#EDEDED]'
            }`}
          >
            {t('login')}
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-center font-label-bold text-sm transition-colors ${
              activeTab === 'register'
                ? 'text-primary dark:text-primary-fixed'
                : 'text-on-surface-variant dark:text-[#8A8F98] hover:text-on-surface dark:hover:text-[#EDEDED]'
            }`}
          >
            {t('register')}
          </button>

          {/* Sliding Indicator */}
          <div
            className="absolute bottom-0 left-6 h-1 bg-primary dark:bg-primary-fixed rounded-t-full transition-transform duration-300 ease-out"
            style={{
              width: 'calc(50% - 24px)',
              transform: activeTab === 'register' ? 'translateX(calc(100% + 24px))' : 'translateX(0)',
            }}
          />
          <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-outline-variant/30 dark:bg-white/[0.08]" />
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-2.5 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2">
            <Icon name="error" size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="relative overflow-hidden w-full">
          <div
            className="flex w-[200%] transition-transform duration-300 ease-in-out"
            style={{
              transform: activeTab === 'register' ? 'translateX(-50%)' : 'translateX(0)',
            }}
          >
            {/* Login Panel */}
            <div className="w-1/2 p-6 flex flex-col justify-between">
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                    {t('emailOrMobile')}
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-[#8A8F98] group-focus-within:text-primary transition-colors flex items-center">
                      <Icon name="person" size={20} />
                    </span>
                    <input
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-[#16191F] border dark:border-white/[0.08] rounded-xl text-on-surface dark:text-[#EDEDED] font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface dark:focus:bg-[#1D212A] transition-all placeholder:text-outline/50 shadow-inner"
                      placeholder="e.g. rahul@email.com"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                      {t('password')}
                    </label>
                    <span className="font-body-sm text-xs text-primary dark:text-primary-fixed cursor-pointer hover:underline">
                      {t('forgotPassword')}
                    </span>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-[#8A8F98] group-focus-within:text-primary transition-colors flex items-center">
                      <Icon name="lock" size={20} />
                    </span>
                    <input
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-surface-container-low dark:bg-[#16191F] border dark:border-white/[0.08] rounded-xl text-on-surface dark:text-[#EDEDED] font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface dark:focus:bg-[#1D212A] transition-all placeholder:text-outline/50 shadow-inner"
                      placeholder="••••••••"
                      type={showLoginPassword ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-[#8A8F98] hover:text-on-surface p-1 flex items-center"
                    >
                      <Icon name={showLoginPassword ? 'visibility' : 'visibility_off'} size={18} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 bg-gradient-to-r from-primary-container to-[#1E3A5F] text-on-primary font-label-bold text-sm rounded-xl shadow-md hover:shadow-[0_10px_25px_-5px_rgba(26,86,219,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  <span>{t('login')}</span>
                  <Icon name="arrow_forward" size={18} />
                </button>
              </form>

              <div className="mt-4 flex flex-col items-center gap-3 pt-4 border-t border-outline-variant/20 dark:border-white/[0.08]">
                <p className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                  {t('newUserRegister')}{' '}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-primary dark:text-primary-fixed font-label-bold hover:underline"
                  >
                    {t('register')}
                  </button>
                </p>

                {/* Login as Admin Bridge */}
                <button
                  onClick={() => openAuthModal('admin_login')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container dark:bg-[#16191F] border dark:border-white/[0.08] hover:bg-surface-container-high dark:hover:bg-[#1D212A] transition-colors text-xs font-medium text-on-surface-variant dark:text-[#EDEDED] group"
                >
                  <span className="group-hover:text-primary transition-colors flex items-center">
                    <Icon name="admin_panel_settings" size={16} />
                  </span>
                  <span>{t('loginAsAdmin')}</span>
                </button>
              </div>
            </div>

            {/* Register Panel */}
            <div className="w-1/2 p-6 flex flex-col">
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                    {t('fullName')}
                  </label>
                  <input
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low dark:bg-[#16191F] border dark:border-white/[0.08] rounded-xl text-on-surface dark:text-[#EDEDED] font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    placeholder={t('asPerOfficialDocs')}
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                      {t('email')}
                    </label>
                    <input
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-surface-container-low dark:bg-[#16191F] border dark:border-white/[0.08] rounded-xl text-on-surface dark:text-[#EDEDED] font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      placeholder="name@email.com"
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                      {t('mobile')}
                    </label>
                    <input
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="w-full px-3 py-2.5 bg-surface-container-low dark:bg-[#16191F] border dark:border-white/[0.08] rounded-xl text-on-surface dark:text-[#EDEDED] font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      placeholder={t('mobilePlaceholder')}
                      type="tel"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98]">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <input
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-surface-container-low dark:bg-[#16191F] rounded-xl text-on-surface dark:text-[#EDEDED] font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      placeholder={t('min8Chars')}
                      type={showRegPassword ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-[#8A8F98] flex items-center"
                    >
                      <Icon name={showRegPassword ? 'visibility' : 'visibility_off'} size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-1">
                  <input
                    id="modal-terms"
                    type="checkbox"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="modal-terms" className="font-body-sm text-[11px] text-on-surface-variant dark:text-[#8A8F98] leading-tight cursor-pointer">
                    {t('termsAgree')}
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 bg-gradient-to-r from-primary-container to-[#1E3A5F] text-on-primary font-label-bold text-sm rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  <span>{t('createAccount')}</span>
                  <Icon name="person_add" size={18} />
                </button>

                <p className="text-center font-body-sm text-xs text-on-surface-variant dark:text-[#8A8F98] mt-1">
                  {t('alreadyHaveAccount')}{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-primary dark:text-primary-fixed font-label-bold hover:underline"
                  >
                    {t('login')}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
