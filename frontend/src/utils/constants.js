export const RISK_LEVELS = {
  LOW: { label: 'Low Risk', color: '#10B981', threshold: 0.25 },
  MEDIUM: { label: 'Medium Risk', color: '#F59E0B', threshold: 0.50 },
  HIGH: { label: 'High Risk', color: '#F97316', threshold: 0.75 },
  VERY_HIGH: { label: 'Very High Risk', color: '#F43F5E', threshold: 1.0 },
};

export function getRiskLevel(probability) {
  if (probability < RISK_LEVELS.LOW.threshold) return RISK_LEVELS.LOW;
  if (probability < RISK_LEVELS.MEDIUM.threshold) return RISK_LEVELS.MEDIUM;
  if (probability < RISK_LEVELS.HIGH.threshold) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.VERY_HIGH;
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/summary', label: 'Project Summary' },
  { to: '/model-comparison', label: 'Model Comparison' },
  { to: '/prediction', label: 'Predict' },
  { to: '/performance', label: 'Performance' },
  { to: '/dataset', label: 'Dataset' },
  { to: '/how-it-works', label: 'How it works' },
];

// Constants matching loan_default_backend/app/constants.py exactly
export const EDUCATION_OPTIONS = [
  "Bachelor's",
  "Master's",
  "High School",
  "PhD",
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Unemployed',
  'Self-employed',
  'Part-time',
];

export const MARITAL_STATUSES = [
  'Divorced',
  'Married',
  'Single',
];

export const LOAN_PURPOSES = [
  'Other',
  'Auto',
  'Business',
  'Home',
  'Education',
];

export const YES_NO_OPTIONS = ['Yes', 'No'];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
