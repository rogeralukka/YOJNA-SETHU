import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useData } from '../../context/DataContext';
import Icon from '../../../features/yojna-setu/components/Icon';

export const AdminLoginModal = () => {
  const { authModal, closeAuthModal, openAuthModal, loginAdmin } = useAuth();
  const { navigateTo } = useData();
  const { t } = useLang();

  // Form states - Pre-filled for Reviewers
  const [adminId, setAdminId] = useState('admin@gov.in');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authModal !== 'admin_login') {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      setError("Please enter both Admin ID and Password");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await loginAdmin({ adminId, password });
      setLoading(false);
      if (res && res.success) {
        navigateTo('admin-overview');
      } else {
        setError(res?.error || "Invalid Admin ID or Password");
      }
    } catch (err) {
      setLoading(false);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in-up">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Admin Card */}
      <div className="w-full max-w-[420px] bg-surface-container-lowest dark:bg-[#0F1115] rounded-2xl shadow-2xl border border-white/40 dark:border-white/[0.08] flex flex-col relative z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container dark:bg-[#16191F] text-on-surface-variant dark:text-[#8A8F98] hover:dark:text-[#EDEDED] flex items-center justify-center hover:bg-surface-container-high transition-colors"
          title="Close"
        >
          <Icon name="close" size={18} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Admin Shield Icon */}
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-md mb-5">
            <Icon name="shield_person" size={32} />
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-[#EDEDED] font-bold mb-1">
            {t('adminLogin')}
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant dark:text-[#8A8F98] mb-6">
            {t('adminLoginSubtitle')}
          </p>

          {error && (
            <div className="w-full mb-4 p-2.5 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2">
              <Icon name="error" size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-on-surface dark:text-[#EDEDED] uppercase tracking-wider text-[11px]">
                {t('adminId')}
              </label>
              <div className="relative flex items-center bg-surface-container-low dark:bg-[#16191F] rounded-xl border border-transparent dark:border-white/[0.08] transition-colors focus-within:ring-2 focus-within:ring-primary">
                <span className="absolute left-4 text-outline dark:text-[#8A8F98] flex items-center">
                  <Icon name="person" size={20} />
                </span>
                <input
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full bg-transparent font-body-md text-sm text-on-surface dark:text-[#EDEDED] py-3.5 pl-12 pr-4 outline-none placeholder:text-outline-variant dark:placeholder:text-[#8A8F98]/50"
                  placeholder="e.g. admin_001"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-on-surface dark:text-[#EDEDED] uppercase tracking-wider text-[11px]">
                {t('password')}
              </label>
              <div className="relative flex items-center bg-surface-container-low dark:bg-[#16191F] rounded-xl border border-transparent dark:border-white/[0.08] transition-colors focus-within:ring-2 focus-within:ring-primary">
                <span className="absolute left-4 text-outline dark:text-[#8A8F98] flex items-center">
                  <Icon name="lock" size={20} />
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent font-body-md text-sm text-on-surface dark:text-[#EDEDED] py-3.5 pl-12 pr-12 outline-none placeholder:text-outline-variant dark:placeholder:text-[#8A8F98]/50"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-outline dark:text-[#8A8F98] hover:text-on-surface dark:hover:text-[#EDEDED] p-1 flex items-center"
                >
                  <Icon name={showPassword ? 'visibility' : 'visibility_off'} size={18} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{t('authenticating')}</span>
              ) : (
                <>
                  <span>{t('login')}</span>
                  <Icon name="arrow_forward" size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to User Login Footer */}
        <div className="bg-surface-container-low dark:bg-[#16191F] p-4 rounded-b-2xl flex justify-center border-t border-surface-container dark:border-white/[0.08]">
          <button
            onClick={() => openAuthModal('citizen_login')}
            className="font-body-sm text-xs font-semibold text-secondary dark:text-[#8A8F98] hover:text-primary dark:hover:text-[#EDEDED] transition-colors flex items-center gap-1.5 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform flex items-center">
              <Icon name="arrow_back" size={16} />
            </span>
            <span>{t('backToUserLogin')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
