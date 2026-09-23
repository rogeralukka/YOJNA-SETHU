import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLang } from '../../context/LangContext';
import { BusinessModal } from './BusinessModal';
import {
  Factory,
  Tractor,
  Building2,
  Pencil,
  Trash2,
  ArrowRight,
  Plus,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

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

  const handleDelete = (id) => {
    deleteBusiness(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen px-4 sm:px-8 lg:px-12 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 w-full mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-900 dark:text-[#EDEDED] font-bold">
            {t('myBusinessesTitle') || 'My Registered Businesses'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#8A8F98] max-w-xl">
            {t('myBusinessesDesc') || 'Manage registered enterprise entities, view MSME certifications, and unlock government capital subsidies.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewBusiness') || 'Register New Business'}</span>
        </button>
      </div>

      <div className="w-full h-px bg-neutral-200 dark:bg-white/[0.08] mb-6" />

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {businesses.map((biz) => {
          const isAgri = (biz.industryCategory || '').toLowerCase().includes('agri') || (biz.industryCategory || '').toLowerCase().includes('farm');

          return (
            <div
              key={biz.id}
              className="group relative bg-white dark:bg-[#0F1115] rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-white/[0.08] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full overflow-hidden"
            >
              <div>
                {/* Top Corner Icon & Action Buttons */}
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-[#16191F] border border-blue-500/20 dark:border-white/[0.08] flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                    {isAgri ? (
                      <Tractor className="w-6 h-6" />
                    ) : (
                      <Factory className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(biz)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      title="Edit business"
                      aria-label="Edit business"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(biz.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 dark:text-[#8A8F98] hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete business"
                      aria-label="Delete business"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Industry Badges */}
                <div className="relative z-10 mb-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-[#EDEDED] truncate">
                      {biz.businessName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#16191F] text-neutral-700 dark:text-[#EDEDED] border border-neutral-200 dark:border-white/[0.08] text-[10px] font-bold uppercase tracking-wider">
                      {biz.businessType}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {biz.industryCategory}
                  </p>
                </div>

                {/* Identifiers Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-neutral-50 dark:bg-[#16191F] border border-neutral-200/70 dark:border-white/[0.08] rounded-xl relative z-10 text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-500 dark:text-[#8A8F98] uppercase tracking-wider">
                      GSTIN
                    </span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-[#EDEDED] truncate">
                      {biz.gst || 'Not Added'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-500 dark:text-[#8A8F98] uppercase tracking-wider">
                      PAN
                    </span>
                    <span className="font-mono font-medium text-neutral-800 dark:text-[#EDEDED] truncate">
                      {biz.pan || 'Not Added'}
                    </span>
                  </div>

                  {biz.udyamRegNumber && (
                    <div className="col-span-2 flex flex-col gap-0.5 pt-1.5 border-t border-neutral-200/60 dark:border-white/[0.06]">
                      <span className="text-[10px] font-bold text-neutral-500 dark:text-[#8A8F98] uppercase tracking-wider">
                        Udyam Registration
                      </span>
                      <span className="font-mono font-medium text-neutral-800 dark:text-[#EDEDED] truncate">
                        {biz.udyamRegNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Check Eligibility CTA */}
              <button
                onClick={() => handleCheckEligibility(biz.id)}
                className="mt-auto w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-blue-600 hover:text-white dark:bg-[#16191F] dark:hover:bg-blue-600 border border-neutral-200 dark:border-white/[0.08] text-neutral-800 dark:text-[#EDEDED] font-semibold text-xs flex items-center justify-center gap-2 transition-all relative z-10 cursor-pointer"
              >
                <span>Check Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Add Another Business Card (Dashed Well) */}
        <button
          onClick={handleOpenAdd}
          className="group border-2 border-dashed border-neutral-300 dark:border-white/[0.12] hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px] bg-neutral-50/50 hover:bg-blue-50/20 dark:bg-[#0F1115]/50 dark:hover:bg-blue-950/10 transition-all cursor-pointer text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-[#16191F] group-hover:bg-blue-600 group-hover:text-white text-neutral-500 dark:text-[#8A8F98] flex items-center justify-center mb-3 transition-colors shadow-xs">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-neutral-800 dark:text-[#EDEDED] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            + Add Another Business
          </h3>
          <p className="text-xs text-neutral-500 dark:text-[#8A8F98] max-w-xs mt-1">
            Register another enterprise, proprietorship, or MSME entity to explore commercial credit and state capital subsidies.
          </p>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0F1115] border border-neutral-200 dark:border-white/[0.08] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-[#EDEDED]">
                Delete Business Profile?
              </h3>
            </div>
            <p className="text-xs text-neutral-600 dark:text-[#8A8F98]">
              Are you sure you want to remove this enterprise profile? This will remove its linked evaluation state from your local session.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-700 dark:text-[#8A8F98] hover:bg-neutral-100 dark:hover:bg-[#16191F] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Business Modal */}
      {modalOpen && (
        <BusinessModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          business={editingBiz}
        />
      )}
    </div>
  );
};

export default MyBusiness;
