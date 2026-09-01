// Toast Notification Utility

export const showToast = (message, type = 'info', duration = 3500) => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✔',
    error: '✖',
    warning: '⚠',
    info: 'ℹ'
  };

  const colorMap = {
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
    info: '#0284c7'
  };

  toast.innerHTML = `
    <span style="color: ${colorMap[type] || '#0284c7'}; font-weight: bold; font-size: 1.1rem;">
      ${iconMap[type] || 'ℹ'}
    </span>
    <span style="flex: 1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, duration);
};
