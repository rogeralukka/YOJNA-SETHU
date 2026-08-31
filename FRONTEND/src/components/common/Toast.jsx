import React from 'react';
import { useData } from '../../context/DataContext';

export const Toast = () => {
  const { toast } = useData();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-primary text-on-primary shadow-[0_10px_25px_-5px_rgba(26,86,219,0.4)]',
    error: 'bg-error text-on-error shadow-[0_10px_25px_-5px_rgba(186,26,26,0.4)]',
    info: 'bg-secondary-container text-on-secondary-container shadow-md border border-outline-variant/30',
  };

  const iconNames = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] animate-fade-in-up">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl ${bgStyles[toast.type] || bgStyles.success} font-body-md text-sm font-medium backdrop-blur-md`}>
        <span className="material-symbols-outlined text-[20px]">
          {iconNames[toast.type] || 'notifications'}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
