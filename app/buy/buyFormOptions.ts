export const TITLES = ["Mr.", "Mrs.", "Miss."] as const;

export const GENDERS = ["Male", "Female"] as const;

export const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"] as const;

export const ID_TYPES = [
  "NIN",
  "International Passport",
  "Driver's License",
  "Voter's Card",
] as const;

export const LAND_PURPOSES = [
  "Residential",
  "Commercial",
  "Agricultural",
  "Investment",
] as const;

export const RELATIONSHIPS = [
  "Spouse",
  "Parent",
  "Sibling",
  "Child",
  "Friend",
  "Other",
] as const;

export const NATIONALITIES = [
  "Nigerian",
  "Ghanaian",
  "American",
  "British",
  "Canadian",
  "Other",
] as const;

export const UNIT_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export const PAYMENT_PACKAGES = [
  "Standard Package",
  "Flexible Package",
  "Premium Package",
] as const;
