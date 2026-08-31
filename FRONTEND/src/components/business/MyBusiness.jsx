import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { BusinessModal } from './BusinessModal';

export const MyBusiness = () => {
  const { businesses, deleteBusiness, setActiveContext, navigateTo } = useData();
  const { t } = useLang();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleOpenAdd = () => {
    setEditingBiz(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (biz) => {
    setEditingBiz(biz);
    setModalOpen(true);
  };

  const handleCheckEligibility = (bizId) => {
    setActiveContext(bizId);
    navigateTo('dashboard');
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-margin-desktop py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 w-full mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl text-on-surface dark:text-white font-bold">
            {t('myBusinessesTitle')}
          </h1>
          <p className="font-body-lg text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 max-w-xl">
            {t('myBusinessesDesc')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="group relative px-5 py-2.5 bg-gradient-to-r from-primary to-[#1E3A5F] rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 text-on-primary text-xs sm:text-sm font-label-bold"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{t('addNewBusiness')}</span>
        </button>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent dark:via-slate-800 my-4" />

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-4">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="group relative bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 dark:bg-primary/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              {/* Top Icons & Edit/Delete */}
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-secondary-container dark:bg-slate-700 flex items-center justify-center text-on-secondary-container dark:text-slate-200 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">
                    {biz.industryCategory === 'Agriculture' ? 'agriculture' : 'precision_manufacturing'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(biz)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-700 hover:text-primary transition-colors"
                    title={t('edit')}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(biz.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant dark:text-slate-400 hover:bg-error-container hover:text-error transition-colors"
                    title={t('delete')}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Title & Industry */}
              <div className="relative z-10 mb-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface dark:text-white truncate">
                    {biz.businessName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest dark:bg-slate-700 text-on-surface dark:text-slate-300 font-status-badge text-[10px] font-bold">
                    {biz.businessType}
                  </span>
                </div>
                <p className="font-body-md text-xs font-semibold text-primary dark:text-primary-fixed">
                  {biz.industryCategory}
                </p>
              </div>

              {/* Identifiers Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-surface-container-low dark:bg-slate-700/60 rounded-xl relative z-10 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="font-label-bold text-on-surface-variant dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    {t('gstNumber')}
                  </span>
                  <span className="font-mono font-medium text-on-surface dark:text-slate-200">
                    {biz.gst || t('notAdded')}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-label-bold text-on-surface-variant dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    {t('panNumber')}
                  </span>
                  <span className="font-mono font-medium text-on-surface dark:text-slate-200">
                    {biz.pan || t('notAdded')}
                  </span>
                </div>

                {biz.udyamRegNumber && (
                  <div className="col-span-2 flex flex-col gap-0.5 pt-1 border-t border-outline-variant/20 dark:border-slate-600">
                    <span className="font-label-bold text-on-surface-variant dark:text-slate-400 uppercase text-[10px] tracking-wider">
                      {t('udyamRegNumber')}
                    </span>
                    <span className="font-mono font-medium text-on-surface dark:text-slate-200">
                      {biz.udyamRegNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Check Eligibility CTA */}
            <button
              onClick={() => handleCheckEligibility(biz.id)}
              className="mt-auto w-full py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-700 hover:bg-primary-container hover:text-on-primary-container text-primary dark:text-primary-fixed font-label-bold text-xs flex items-center justify-center gap-2 transition-all relative z-10 group-hover:bg-primary group-hover:text-white"
            >
              <span>{t('checkEligibility')}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        ))}

        {/* Add Another Card */}
        <div
          onClick={handleOpenAdd}
          className="group relative bg-surface/50 dark:bg-slate-800/40 border-2 border-dashed border-outline-variant dark:border-slate-700 rounded-2xl p-6 hover:bg-surface-container-low dark:hover:bg-slate-800 hover:border-primary/50 transition-all flex flex-col items-center justify-center min-h-[280px] cursor-pointer text-center"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center text-on-surface-variant dark:text-slate-400 group-hover:scale-110 group-hover:bg-primary-container group-hover:text-on-primary-container transition-all mb-3">
            <span className="material-symbols-outlined text-[28px]">add_business</span>
          </div>
          <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-1">
            {t('addAnotherBusiness')}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-400 max-w-[220px]">
            {t('addAnotherBusinessDesc')}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full border border-outline-variant/30 shadow-2xl">
            <h3 className="font-headline-md text-base font-bold text-on-surface dark:text-white mb-2">
              {t('confirmDelete')}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant dark:text-slate-400 mb-6">
              {t('deleteBusinessConfirm')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  deleteBusiness(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-error text-white text-xs font-semibold hover:opacity-90"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Add/Edit Modal */}
      <BusinessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingBusiness={editingBiz}
      />
    </div>
  );
};
