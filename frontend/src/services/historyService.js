import { api } from './api';

const STORAGE_KEY = 'loanlens_prediction_history';

/**
 * Realistic initial demo records so the user can immediately experience
 * the History view with different risk profiles if desired.
 */
export const SAMPLE_HISTORY_RECORDS = [
  {
    id: 'PRED-K8M2-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    applicant: {
      fullName: 'Sarah Jenkins',
      Age: 42,
      Education: "Master's",
      EmploymentType: 'Full-time',
      MonthsEmployed: 96,
      MaritalStatus: 'Married',
      HasDependents: 'Yes',
      Income: 115000,
      LoanAmount: 35000,
      LoanTerm: 36,
      InterestRate: 8.5,
      LoanPurpose: 'Home',
      HasMortgage: 'Yes',
      CreditScore: 780,
      DTIRatio: 0.22,
      NumCreditLines: 5,
      HasCoSigner: 'Yes',
    },
    result: {
      default_prediction: 0,
      default_probability: 0.084,
      probability: 0.084,
      risk_label: 'Low Risk',
      riskLevel: { label: 'Low Risk', color: '#10B981', threshold: 0.25 },
      contributions: [
        { feature: 'Credit score', impact: -0.118 },
        { feature: 'Debt-to-income ratio', impact: -0.058 },
        { feature: 'Loan-to-income ratio', impact: -0.032 },
        { feature: 'Months employed', impact: -0.024 },
        { feature: 'Employment type', impact: -0.05 },
      ],
      scoredAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
  },
  {
    id: 'PRED-V4X9-204',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    applicant: {
      fullName: 'Marcus Vance',
      Age: 38,
      Education: "Bachelor's",
      EmploymentType: 'Self-employed',
      MonthsEmployed: 42,
      MaritalStatus: 'Divorced',
      HasDependents: 'Yes',
      Income: 58000,
      LoanAmount: 62000,
      LoanTerm: 60,
      InterestRate: 18.4,
      LoanPurpose: 'Business',
      HasMortgage: 'No',
      CreditScore: 540,
      DTIRatio: 0.48,
      NumCreditLines: 7,
      HasCoSigner: 'No',
    },
    result: {
      default_prediction: 1,
      default_probability: 0.725,
      probability: 0.725,
      risk_label: 'High Risk',
      riskLevel: { label: 'High Risk', color: '#F97316', threshold: 0.75 },
      contributions: [
        { feature: 'Credit score', impact: 0.100 },
        { feature: 'Debt-to-income ratio', impact: 0.058 },
        { feature: 'Interest rate', impact: 0.080 },
        { feature: 'Loan-to-income ratio', impact: 0.085 },
        { feature: 'Months employed', impact: 0.015 },
      ],
      scoredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  },
  {
    id: 'PRED-T1L5-309',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    applicant: {
      fullName: 'Elena Rostova',
      Age: 29,
      Education: 'High School',
      EmploymentType: 'Unemployed',
      MonthsEmployed: 8,
      MaritalStatus: 'Single',
      HasDependents: 'No',
      Income: 28000,
      LoanAmount: 45000,
      LoanTerm: 48,
      InterestRate: 22.5,
      LoanPurpose: 'Other',
      HasMortgage: 'No',
      CreditScore: 430,
      DTIRatio: 0.58,
      NumCreditLines: 3,
      HasCoSigner: 'No',
    },
    result: {
      default_prediction: 1,
      default_probability: 0.892,
      probability: 0.892,
      risk_label: 'Very High Risk',
      riskLevel: { label: 'Very High Risk', color: '#F43F5E', threshold: 1.0 },
      contributions: [
        { feature: 'Credit score', impact: 0.200 },
        { feature: 'Debt-to-income ratio', impact: 0.103 },
        { feature: 'Employment type', impact: 0.12 },
        { feature: 'Interest rate', impact: 0.131 },
        { feature: 'Loan-to-income ratio', impact: 0.140 },
      ],
      scoredAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
  },
  {
    id: 'PRED-W9P3-412',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    applicant: {
      fullName: 'David Martinez',
      Age: 46,
      Education: "Bachelor's",
      EmploymentType: 'Full-time',
      MonthsEmployed: 80,
      MaritalStatus: 'Married',
      HasDependents: 'No',
      Income: 74000,
      LoanAmount: 30000,
      LoanTerm: 36,
      InterestRate: 11.2,
      LoanPurpose: 'Auto',
      HasMortgage: 'Yes',
      CreditScore: 660,
      DTIRatio: 0.32,
      NumCreditLines: 4,
      HasCoSigner: 'No',
    },
    result: {
      default_prediction: 0,
      default_probability: 0.345,
      probability: 0.345,
      risk_label: 'Medium Risk',
      riskLevel: { label: 'Medium Risk', color: '#F59E0B', threshold: 0.50 },
      contributions: [
        { feature: 'Credit score', impact: -0.009 },
        { feature: 'Debt-to-income ratio', impact: -0.013 },
        { feature: 'Loan-to-income ratio', impact: -0.015 },
        { feature: 'Months employed', impact: -0.08 },
      ],
      scoredAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    },
  },
];

/**
 * Read local storage
 */
export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading history from localStorage:', err);
    return [];
  }
}

/**
 * Write local storage
 */
export function setLocalHistory(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Error saving history to localStorage:', err);
  }
}

/**
 * Fetch history from backend API, merging with local storage if necessary.
 */
export async function fetchHistory() {
  const local = getLocalHistory();
  try {
    const remote = await api.get('/history');
    if (Array.isArray(remote)) {
      if (remote.length > 0) {
        // Remote records are shared across all users
        const idMap = new Map();
        remote.forEach((r) => {
          if (r && r.id) idMap.set(r.id, r);
        });
        // Merge any unsynced local records
        local.forEach((r) => {
          if (r && r.id && !idMap.has(r.id)) {
            idMap.set(r.id, r);
            // Sync this local record to backend asynchronously
            api.post('/history', r).catch(() => {});
          }
        });
        const merged = Array.from(idMap.values()).sort(
          (a, b) => new Date(b.timestamp || b.result?.scoredAt || 0) - new Date(a.timestamp || a.result?.scoredAt || 0)
        );
        setLocalHistory(merged);
        return merged;
      } else if (local.length > 0) {
        // Push local predictions to backend so all users can see them
        for (const rec of local.slice(0, 10)) {
          api.post('/history', rec).catch(() => {});
        }
        return local;
      }
    }
  } catch (err) {
    console.info('Backend /history not reached, using local history storage:', err?.message);
  }

  return local;
}

/**
 * Save new prediction record to both localStorage and backend
 */
export async function savePredictionRecord(record) {
  const local = getLocalHistory();
  // Filter out duplicate if existing
  const updated = [record, ...local.filter((r) => r.id !== record.id)];
  setLocalHistory(updated);

  // Sync to backend asynchronously
  try {
    await api.post('/history', record);
  } catch (err) {
    // Non-blocking fallback
    console.warn('Could not sync record to backend /history:', err?.message);
  }

  // Notify listeners
  window.dispatchEvent(new CustomEvent('loanlens_history_updated', { detail: { record } }));
  return updated;
}

/**
 * Delete a single record by ID
 */
export async function deleteHistoryRecord(id) {
  const local = getLocalHistory();
  const updated = local.filter((r) => r.id !== id);
  setLocalHistory(updated);

  try {
    await api.delete(`/history/${encodeURIComponent(id)}`);
  } catch (err) {
    console.warn('Backend delete failed:', err?.message);
  }

  window.dispatchEvent(new CustomEvent('loanlens_history_updated'));
  return updated;
}

/**
 * Clear all history
 */
export async function clearHistory() {
  setLocalHistory([]);
  try {
    await api.delete('/history');
  } catch (err) {
    console.warn('Backend clear history failed:', err?.message);
  }
  window.dispatchEvent(new CustomEvent('loanlens_history_updated'));
  return [];
}

/**
 * Export records as CSV
 */
export function exportToCSV(records = []) {
  if (!records.length) return;

  const headers = [
    'ID',
    'Timestamp',
    'Applicant Name',
    'Age',
    'Income',
    'Loan Amount',
    'Term (Months)',
    'Interest Rate (%)',
    'Loan Purpose',
    'Credit Score',
    'DTI Ratio',
    'Employment Type',
    'Education',
    'Marital Status',
    'Has Mortgage',
    'Has Dependents',
    'Has CoSigner',
    'Default Prediction',
    'Default Probability',
    'Risk Level',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => {
    const a = r.applicant || {};
    const res = r.result || {};
    return [
      r.id,
      r.timestamp,
      a.fullName || 'Anonymous',
      a.Age ?? '',
      a.Income ?? '',
      a.LoanAmount ?? '',
      a.LoanTerm ?? '',
      a.InterestRate ?? '',
      a.LoanPurpose ?? '',
      a.CreditScore ?? '',
      a.DTIRatio ?? '',
      a.EmploymentType ?? '',
      a.Education ?? '',
      a.MaritalStatus ?? '',
      a.HasMortgage ?? '',
      a.HasDependents ?? '',
      a.HasCoSigner ?? '',
      res.default_prediction ?? '',
      res.probability ?? res.default_probability ?? '',
      res.risk_label ?? res.riskLevel?.label ?? '',
    ]
      .map(escapeCSV)
      .join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `loanlens_prediction_history_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export records as JSON
 */
export function exportToJSON(records = []) {
  if (!records.length) return;
  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonStr);
  link.setAttribute('download', `loanlens_prediction_history_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
