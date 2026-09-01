import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useData } from '../../context/DataContext';

export const AdminLoginModal = () => {
  const { authModal, closeAuthModal, openAuthModal, loginAdmin } = useAuth();
  const { navigateTo } = useData();
  const { t } = useLang();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="w-full max-w-[420px] bg-surface-container-lowest dark:bg-slate-900 rounded-2xl shadow-2xl border border-white/40 dark:border-slate-800 flex flex-col relative z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 flex items-center justify-center hover:bg-surface-container-high transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Admin Shield Icon */}
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-md mb-5">
            <span className="material-symbols-outlined text-[32px]">shield_person</span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-white font-bold mb-1">
            {t('adminLogin')}
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400 mb-6">
            {t('adminLoginSubtitle')}
          </p>

          {error && (
            <div className="w-full mb-4 p-2.5 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-on-surface dark:text-slate-200 uppercase tracking-wider text-[11px]">
                {t('adminId')}
              </label>
              <div className="relative flex items-center bg-surface-container-low dark:bg-slate-800 rounded-xl transition-colors focus-within:ring-2 focus-within:ring-primary">
                <span className="material-symbols-outlined absolute left-4 text-outline dark:text-slate-400 text-[20px]">
                  person
                </span>
                <input
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full bg-transparent font-body-md text-sm text-on-surface dark:text-white py-3.5 pl-12 pr-4 outline-none placeholder:text-outline-variant"
                  placeholder="e.g. admin_001"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-bold text-on-surface dark:text-slate-200 uppercase tracking-wider text-[11px]">
                {t('password')}
              </label>
              <div className="relative flex items-center bg-surface-container-low dark:bg-slate-800 rounded-xl transition-colors focus-within:ring-2 focus-within:ring-primary">
                <span className="material-symbols-outlined absolute left-4 text-outline dark:text-slate-400 text-[20px]">
                  lock
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent font-body-md text-sm text-on-surface dark:text-white py-3.5 pl-12 pr-12 outline-none placeholder:text-outline-variant"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-outline dark:text-slate-400 hover:text-on-surface p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
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
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to User Login Footer */}
        <div className="bg-surface-container-low dark:bg-slate-800/80 p-4 rounded-b-2xl flex justify-center border-t border-surface-container dark:border-slate-800">
          <button
            onClick={() => openAuthModal('citizen_login')}
            className="font-body-sm text-xs font-semibold text-secondary dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-1.5 group"
          >
            <span className="material-symbols-outlined text-[16px] transform group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>{t('backToUserLogin')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
