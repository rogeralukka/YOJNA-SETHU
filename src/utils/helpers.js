export const parseJsonSafe = (value, fallback = []) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

export const stringifyJsonSafe = (value) => {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return '[]';
  }
};

export const isNewScheme = (createdAt, daysThreshold = 14) => {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  const diffTime = Math.abs(new Date() - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold;
};

export const isUrgentDeadline = (deadline, daysThreshold = 7) => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysThreshold;
};
