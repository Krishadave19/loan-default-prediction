import { api } from './api';
import { getRiskLevel } from '../utils/constants';

/**
 * Normalizes form state to match the exact schema expected by FastAPI
 * in loan_default_backend/app/schemas.py (LoanApplication).
 */
export function normalizeLoanPayload(data = {}) {
  const rawDti = Number(data.DTIRatio ?? data.debtToIncome ?? data.dtiRatio ?? 0.44);
  // Scale down if user inputted as percentage (e.g. 44 -> 0.44)
  const dti = rawDti > 1 ? Number((rawDti / 100).toFixed(4)) : rawDti;

  const rawMonths = Number(
    data.MonthsEmployed ?? data.monthsEmployed ?? (data.yearsEmployed ? Number(data.yearsEmployed) * 12 : 80)
  );

  return {
    Age: parseInt(data.Age ?? data.age ?? 45, 10),
    Income: parseFloat(data.Income ?? data.annualIncome ?? data.income ?? 85994),
    LoanAmount: parseFloat(data.LoanAmount ?? data.loanAmount ?? 50587),
    CreditScore: parseInt(data.CreditScore ?? data.creditScore ?? 520, 10),
    MonthsEmployed: parseInt(rawMonths || 80, 10),
    NumCreditLines: parseInt(data.NumCreditLines ?? data.numCreditLines ?? data.openCreditLines ?? 4, 10),
    InterestRate: parseFloat(data.InterestRate ?? data.interestRate ?? 15.23),
    LoanTerm: parseInt(data.LoanTerm ?? data.loanTerm ?? data.loanTermMonths ?? 36, 10),
    DTIRatio: dti,
    Education: data.Education || data.education || "Bachelor's",
    EmploymentType: data.EmploymentType || data.employmentType || "Full-time",
    MaritalStatus: data.MaritalStatus || data.maritalStatus || "Divorced",
    HasMortgage: data.HasMortgage || data.hasMortgage || "Yes",
    HasDependents: data.HasDependents || data.hasDependents || "Yes",
    LoanPurpose: data.LoanPurpose || data.loanPurpose || "Other",
    HasCoSigner: data.HasCoSigner || data.hasCoSigner || "Yes",
  };
}

function localMockScore(payload) {
  const norm = normalizeLoanPayload(payload);
  const income = norm.Income;
  const loanAmount = norm.LoanAmount;
  const creditScore = norm.CreditScore;
  const dti = norm.DTIRatio;

  const loanToIncome = loanAmount / Math.max(income, 1);
  let probability =
    0.45 * (1 - (creditScore - 300) / 550) +
    0.3 * Math.min(loanToIncome, 1) +
    0.25 * Math.min(dti, 1);

  probability = Math.min(Math.max(probability, 0.02), 0.96);
  const prob = Number(probability.toFixed(4));
  const risk = getRiskLevel(prob);

  const contributions = [
    { feature: 'Credit score', impact: Number((-(creditScore - 650) / 1100).toFixed(3)) },
    { feature: 'Debt-to-income ratio', impact: Number(((dti - 0.35) * 0.45).toFixed(3)) },
    { feature: 'Interest rate', impact: Number(((norm.InterestRate - 12) / 80).toFixed(3)) },
    { feature: 'Loan-to-income ratio', impact: Number(((loanToIncome - 0.5) * 0.15).toFixed(3)) },
    { feature: 'Months employed', impact: Number((-(norm.MonthsEmployed - 48) / 400).toFixed(3)) },
    { feature: 'Employment type', impact: norm.EmploymentType === 'Unemployed' ? 0.12 : -0.05 },
  ];

  return {
    default_prediction: prob >= 0.5 ? 1 : 0,
    default_probability: prob,
    probability: prob,
    risk_label: risk.label,
    riskLevel: risk,
    contributions,
    scoredAt: new Date().toISOString(),
  };
}

export async function runPrediction(payload) {
  const normalized = normalizeLoanPayload(payload);

  // If user explicitly asks for mock via env, use local
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return localMockScore(normalized);
  }

  try {
    const res = await api.post('/predict', normalized);
    const prob = res.probability ?? res.default_probability ?? 0.05;
    const riskLevelObj = res.riskLevel || getRiskLevel(prob);

    return {
      default_prediction: res.default_prediction ?? (prob >= 0.5 ? 1 : 0),
      default_probability: prob,
      probability: prob,
      risk_label: res.risk_label || riskLevelObj.label,
      riskLevel: riskLevelObj,
      contributions: Array.isArray(res.contributions) && res.contributions.length > 0
        ? res.contributions
        : localMockScore(normalized).contributions,
      scoredAt: res.scoredAt || new Date().toISOString(),
    };
  } catch (err) {
    // If backend is not running or failed, provide fallback with helpful console info
    console.warn('Backend /predict failed or unreachable, falling back to local score:', err.message);
    const fallback = localMockScore(normalized);
    return fallback;
  }
}
