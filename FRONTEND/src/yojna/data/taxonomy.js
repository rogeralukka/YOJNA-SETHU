/**
 * YojanaSetu Taxonomy & Normalization Layer
 * Life Status, Occupations, and Sectors
 */

export const LIFE_STATUSES = [
  // Education-related
  {
    id: 'student_school',
    name: 'Student — School',
    category: 'education',
    description: 'Currently enrolled in primary, secondary, or senior secondary school (Class 1-12).'
  },
  {
    id: 'student_college',
    name: 'Student — College / University',
    category: 'education',
    description: 'Pursuing undergraduate, postgraduate, or doctoral studies.'
  },
  {
    id: 'student_vocational',
    name: 'Student — Vocational / ITI / Skill Training',
    category: 'education',
    description: 'Enrolled in technical/vocational training, ITI, or national skill certification courses.'
  },

  // Employment-related
  {
    id: 'employed',
    name: 'Employed (Salaried / Wage Earner)',
    category: 'employment',
    description: 'Working in organized/unorganized sector under an employer (Full-time, Part-time, Contract).'
  },
  {
    id: 'self_employed',
    name: 'Self-employed / Freelancer',
    category: 'employment',
    description: 'Engaged in an independent profession, trade, service, or skilled craft.'
  },
  {
    id: 'business_owner',
    name: 'Business Owner / Entrepreneur',
    category: 'employment',
    description: 'Operating a registered or unregistered enterprise, MSME, or startup.'
  },
  {
    id: 'farmer',
    name: 'Farmer / Agricultural Worker',
    category: 'agriculture',
    description: 'Engaged in farming, dairy, livestock, fisheries, or allied agricultural activities.'
  },

  // Other Life Situations
  {
    id: 'not_pursuing_education',
    name: 'Not Currently Pursuing Education',
    category: 'other',
    description: 'Out of school/college, exploring opportunities or taking a break.'
  },
  {
    id: 'unemployed',
    name: 'Unemployed / Seeking Work',
    category: 'other',
    description: 'Currently without employment and actively seeking jobs or vocational opportunities.'
  },
  {
    id: 'homemaker',
    name: 'Homemaker / Caregiver',
    category: 'other',
    description: 'Managing household responsibilities or providing family caregiving.'
  },
  {
    id: 'retired',
    name: 'Retired / Senior Citizen',
    category: 'other',
    description: 'Retired from active service/employment or senior citizen.'
  },
  {
    id: 'other',
    name: 'Other',
    category: 'other',
    description: 'Other personal circumstances or life stages.'
  }
];

export const OCCUPATIONS = [
  // Agriculture & Primary Sector
  { id: 'farmer', name: 'Farmer / Cultivator', category: 'Agriculture & Primary' },
  { id: 'agricultural_laborer', name: 'Agricultural Laborer', category: 'Agriculture & Primary' },
  { id: 'fisher', name: 'Fisher / Aquaculture Worker', category: 'Agriculture & Primary' },
  { id: 'dairy_farmer', name: 'Dairy / Livestock Farmer', category: 'Agriculture & Primary' },

  // Artisans, Crafts & Textiles
  { id: 'artisan', name: 'Artisan / Handicraft Maker', category: 'Artisans & Crafts' },
  { id: 'weaver', name: 'Weaver / Handloom Worker', category: 'Artisans & Crafts' },
  { id: 'potter', name: 'Potter / Clay Craftsman', category: 'Artisans & Crafts' },
  { id: 'blacksmith', name: 'Blacksmith / Metal Craftsman', category: 'Artisans & Crafts' },
  { id: 'carpenter', name: 'Carpenter / Woodworker', category: 'Artisans & Crafts' },
  { id: 'tailor', name: 'Tailor / Garment Worker', category: 'Artisans & Crafts' },

  // Construction & Trades
  { id: 'construction_worker', name: 'Construction Worker / Laborer', category: 'Construction & Trades' },
  { id: 'mason', name: 'Mason / Bricklayer', category: 'Construction & Trades' },
  { id: 'electrician', name: 'Electrician', category: 'Construction & Trades' },
  { id: 'plumber', name: 'Plumber', category: 'Construction & Trades' },
  { id: 'painter', name: 'Painter / Decorator', category: 'Construction & Trades' },
  { id: 'mechanic', name: 'Mechanic / Automobile Technician', category: 'Construction & Trades' },

  // Retail, Services & Informal Work
  { id: 'street_vendor', name: 'Street Vendor / Hawker', category: 'Retail & Informal Services' },
  { id: 'small_retailer', name: 'Shopkeeper / Small Retailer', category: 'Retail & Informal Services' },
  { id: 'domestic_worker', name: 'Domestic Worker / Helper', category: 'Retail & Informal Services' },
  { id: 'beauty_wellness_worker', name: 'Beauty & Wellness Professional', category: 'Retail & Informal Services' },
  { id: 'sanitation_worker', name: 'Sanitation / Cleaning Worker', category: 'Retail & Informal Services' },
  { id: 'security_guard', name: 'Security Guard / Watchman', category: 'Retail & Informal Services' },

  // Transport & Logistics
  { id: 'driver', name: 'Driver (Auto / Taxi / Commercial)', category: 'Transport & Logistics' },
  { id: 'delivery_partner', name: 'Delivery Partner / Logistics Worker', category: 'Transport & Logistics' },

  // Professional & Technical
  { id: 'teacher', name: 'Teacher / Educator / Tutor', category: 'Professional & Technical' },
  { id: 'healthcare_worker', name: 'Healthcare / Nursing Worker', category: 'Professional & Technical' },
  { id: 'software_professional', name: 'Software Engineer / IT Professional', category: 'Professional & Technical' },
  { id: 'engineer', name: 'Engineer (Civil / Mech / Elec)', category: 'Professional & Technical' },
  { id: 'accountant', name: 'Accountant / Financial Advisor', category: 'Professional & Technical' },

  // Generic / Custom
  { id: 'other', name: 'Other (Specify in Profile)', category: 'Other' }
];

export const SECTORS = [
  { id: 'agriculture', name: 'Agriculture & Allied Sectors' },
  { id: 'fisheries', name: 'Fisheries & Aquaculture' },
  { id: 'handicrafts', name: 'Handicrafts & Handlooms' },
  { id: 'textiles', name: 'Textiles & Apparel' },
  { id: 'construction', name: 'Construction & Real Estate' },
  { id: 'manufacturing', name: 'Manufacturing & MSME' },
  { id: 'retail', name: 'Retail & Wholesale Trade' },
  { id: 'transport', name: 'Transport & Logistics' },
  { id: 'healthcare', name: 'Healthcare & Pharmaceuticals' },
  { id: 'education', name: 'Education & Skill Development' },
  { id: 'information_technology', name: 'Information Technology & Digital Services' },
  { id: 'financial_services', name: 'Financial Services & Banking' },
  { id: 'tourism_hospitality', name: 'Tourism, Hospitality & Food Services' },
  { id: 'beauty_wellness', name: 'Beauty, Wellness & Personal Care' },
  { id: 'food_processing', name: 'Food Processing & Agribusiness' },
  { id: 'renewable_energy', name: 'Renewable Energy & Sustainability' },
  { id: 'public_services', name: 'Public & Community Services' },
  { id: 'other', name: 'Other Sector' }
];

/**
 * Calculates current exact age in years from complete Date of Birth string (YYYY-MM-DD).
 * Server-authoritative calculation.
 *
 * @param {string} dobString - Date of birth in YYYY-MM-DD format
 * @param {Date} [referenceDate] - Optional reference date for testing (defaults to now)
 * @returns {number|null} - Exact calculated age in years, or null if invalid
 */
export const calculateAge = (dobString, referenceDate = new Date()) => {
  if (!dobString || typeof dobString !== 'string') return null;

  const parts = dobString.split('-');
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed month
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const birthDate = new Date(year, month, day);
  // Verify date validity (e.g. check for invalid dates like Feb 30)
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  // Prevent future dates
  if (birthDate > referenceDate) {
    return null;
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
};

/**
 * Validates Date of Birth format and realistic bounds.
 *
 * @param {string} dobString - Date of birth (YYYY-MM-DD)
 * @returns {{ valid: boolean, error?: string, age?: number }}
 */
export const validateDob = (dobString) => {
  if (!dobString) {
    return { valid: false, error: 'Date of Birth is required.' };
  }

  const age = calculateAge(dobString);
  if (age === null) {
    const today = new Date().toISOString().split('T')[0];
    if (dobString > today) {
      return { valid: false, error: 'Date of Birth cannot be in the future.' };
    }
    return { valid: false, error: 'Please enter a valid Date of Birth (YYYY-MM-DD).' };
  }

  if (age > 120) {
    return { valid: false, error: 'Please enter a realistic Date of Birth.' };
  }

  return { valid: true, age };
};

export const getLifeStatusLabel = (id) => {
  const item = LIFE_STATUSES.find((s) => s.id === id);
  return item ? item.name : id;
};

export const getOccupationLabel = (id) => {
  const item = OCCUPATIONS.find((o) => o.id === id);
  return item ? item.name : id;
};

export const getSectorLabel = (id) => {
  const item = SECTORS.find((s) => s.id === id);
  return item ? item.name : id;
};
