export function required(value) {
  if (value === undefined || value === null || value === '') return 'This field is required';
  return null;
}

export function isPositiveNumber(value) {
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return 'Enter a positive number';
  return null;
}

export function isInRange(value, min, max) {
  if (value === undefined || value === null || value === '') return 'This field is required';
  const num = Number(value);
  if (Number.isNaN(num) || num < min || num > max) return `Enter a value between ${min} and ${max}`;
  return null;
}

export function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return 'Enter a valid email address';
  return null;
}

export function validatePersonalInfo(data) {
  const errors = {};
  const ageErr = isInRange(data.Age ?? data.age, 18, 100);
  if (ageErr) errors.Age = ageErr;

  const eduErr = required(data.Education ?? data.education);
  if (eduErr) errors.Education = eduErr;

  const empErr = required(data.EmploymentType ?? data.employmentType);
  if (empErr) errors.EmploymentType = empErr;

  const monthsErr = isInRange(data.MonthsEmployed ?? data.monthsEmployed, 0, 600);
  if (monthsErr) errors.MonthsEmployed = monthsErr;

  const maritalErr = required(data.MaritalStatus ?? data.maritalStatus);
  if (maritalErr) errors.MaritalStatus = maritalErr;

  const depErr = required(data.HasDependents ?? data.hasDependents);
  if (depErr) errors.HasDependents = depErr;

  return errors;
}

export function validateFinancialInfo(data) {
  const errors = {};
  const incomeErr = isPositiveNumber(data.Income ?? data.annualIncome ?? data.income);
  if (incomeErr) errors.Income = incomeErr;

  const amountErr = isPositiveNumber(data.LoanAmount ?? data.loanAmount);
  if (amountErr) errors.LoanAmount = amountErr;

  const termErr = isInRange(data.LoanTerm ?? data.loanTerm ?? data.loanTermMonths, 1, 360);
  if (termErr) errors.LoanTerm = termErr;

  const rateErr = isInRange(data.InterestRate ?? data.interestRate, 0.1, 50);
  if (rateErr) errors.InterestRate = rateErr;

  const purposeErr = required(data.LoanPurpose ?? data.loanPurpose);
  if (purposeErr) errors.LoanPurpose = purposeErr;

  const mortErr = required(data.HasMortgage ?? data.hasMortgage);
  if (mortErr) errors.HasMortgage = mortErr;

  return errors;
}

export function validateCreditInfo(data) {
  const errors = {};
  const scoreErr = isInRange(data.CreditScore ?? data.creditScore, 300, 850);
  if (scoreErr) errors.CreditScore = scoreErr;

  const dtiErr = isInRange(data.DTIRatio ?? data.debtToIncome ?? data.dtiRatio, 0, 100);
  if (dtiErr) errors.DTIRatio = dtiErr;

  const linesErr = isInRange(data.NumCreditLines ?? data.numCreditLines ?? data.openCreditLines, 0, 50);
  if (linesErr) errors.NumCreditLines = linesErr;

  const cosignErr = required(data.HasCoSigner ?? data.hasCoSigner);
  if (cosignErr) errors.HasCoSigner = cosignErr;

  return errors;
}
