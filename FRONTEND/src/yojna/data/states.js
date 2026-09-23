// Standard Indian States & Union Territories
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const isSchemeGeographicallyEligible = (scheme, userState) => {
  if (!scheme) return false;
  // Central schemes apply across all of India
  if (scheme.governmentLevel === 'central' || !scheme.governmentLevel) return true;
  if (!scheme.applicableStates || scheme.applicableStates.length === 0) return true;
  if (scheme.applicableStates.includes('ALL') || scheme.applicableStates.includes('All States')) return true;
  
  // State schemes must include user's state
  if (!userState) return true;
  return scheme.applicableStates.some(
    st => st.toLowerCase().trim() === userState.toLowerCase().trim()
  );
};
