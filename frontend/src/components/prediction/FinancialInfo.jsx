import { motion } from 'framer-motion';
import FormField, { baseInputClasses } from './FormField';
import { LOAN_PURPOSES, YES_NO_OPTIONS } from '../../utils/constants';

export default function FinancialInfo({ data, errors = {}, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <FormField label="Annual income ($)" error={errors.Income || errors.annualIncome}>
        <input
          type="number"
          min={0}
          className={baseInputClasses(errors.Income || errors.annualIncome)}
          placeholder="85994"
          value={data.Income ?? data.annualIncome ?? ''}
          onChange={(e) => onChange({ Income: e.target.value, annualIncome: e.target.value })}
        />
      </FormField>

      <FormField label="Requested loan amount ($)" error={errors.LoanAmount || errors.loanAmount}>
        <input
          type="number"
          min={0}
          className={baseInputClasses(errors.LoanAmount || errors.loanAmount)}
          placeholder="50587"
          value={data.LoanAmount ?? data.loanAmount ?? ''}
          onChange={(e) => onChange({ LoanAmount: e.target.value, loanAmount: e.target.value })}
        />
      </FormField>

      <FormField label="Loan term (months)" error={errors.LoanTerm || errors.loanTermMonths}>
        <input
          type="number"
          min={1}
          max={360}
          className={baseInputClasses(errors.LoanTerm || errors.loanTermMonths)}
          placeholder="36"
          value={data.LoanTerm ?? data.loanTermMonths ?? ''}
          onChange={(e) => onChange({ LoanTerm: e.target.value, loanTermMonths: e.target.value })}
        />
      </FormField>

      <FormField label="Interest rate (%)" error={errors.InterestRate || errors.interestRate}>
        <input
          type="number"
          step="0.01"
          min={0.1}
          max={50}
          className={baseInputClasses(errors.InterestRate || errors.interestRate)}
          placeholder="15.23"
          value={data.InterestRate ?? data.interestRate ?? ''}
          onChange={(e) => onChange({ InterestRate: e.target.value, interestRate: e.target.value })}
        />
      </FormField>

      <FormField label="Loan purpose" error={errors.LoanPurpose || errors.loanPurpose}>
        <select
          className={baseInputClasses(errors.LoanPurpose || errors.loanPurpose)}
          value={data.LoanPurpose ?? data.loanPurpose ?? ''}
          onChange={(e) => onChange({ LoanPurpose: e.target.value, loanPurpose: e.target.value })}
        >
          <option value="" disabled>
            Select purpose
          </option>
          {LOAN_PURPOSES.map((purpose) => (
            <option key={purpose} value={purpose}>
              {purpose}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Has existing mortgage" error={errors.HasMortgage || errors.hasMortgage}>
        <select
          className={baseInputClasses(errors.HasMortgage || errors.hasMortgage)}
          value={data.HasMortgage ?? data.hasMortgage ?? ''}
          onChange={(e) => onChange({ HasMortgage: e.target.value, hasMortgage: e.target.value })}
        >
          <option value="" disabled>
            Select option
          </option>
          {YES_NO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </FormField>
    </motion.div>
  );
}
