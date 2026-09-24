import { motion } from 'framer-motion';
import FormField, { baseInputClasses } from './FormField';
import { YES_NO_OPTIONS } from '../../utils/constants';

export default function CreditInfo({ data, errors = {}, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <FormField label="Credit bureau score (FICO)" error={errors.CreditScore || errors.creditScore}>
        <input
          type="number"
          min={300}
          max={850}
          className={baseInputClasses(errors.CreditScore || errors.creditScore)}
          placeholder="520"
          value={data.CreditScore ?? data.creditScore ?? ''}
          onChange={(e) => onChange({ CreditScore: e.target.value, creditScore: e.target.value })}
        />
      </FormField>

      <FormField
        label="Debt-to-income (DTI) ratio (e.g. 0.44 or 44%)"
        error={errors.DTIRatio || errors.debtToIncome || errors.dtiRatio}
      >
        <input
          type="number"
          step="0.01"
          min={0}
          max={100}
          className={baseInputClasses(errors.DTIRatio || errors.debtToIncome || errors.dtiRatio)}
          placeholder="0.44"
          value={data.DTIRatio ?? data.debtToIncome ?? data.dtiRatio ?? ''}
          onChange={(e) =>
            onChange({ DTIRatio: e.target.value, debtToIncome: e.target.value, dtiRatio: e.target.value })
          }
        />
      </FormField>

      <FormField
        label="Active credit lines"
        error={errors.NumCreditLines || errors.numCreditLines || errors.openCreditLines}
      >
        <input
          type="number"
          min={0}
          max={50}
          className={baseInputClasses(errors.NumCreditLines || errors.numCreditLines || errors.openCreditLines)}
          placeholder="4"
          value={data.NumCreditLines ?? data.numCreditLines ?? data.openCreditLines ?? ''}
          onChange={(e) =>
            onChange({
              NumCreditLines: e.target.value,
              numCreditLines: e.target.value,
              openCreditLines: e.target.value,
            })
          }
        />
      </FormField>

      <FormField label="Has loan co-signer" error={errors.HasCoSigner || errors.hasCoSigner}>
        <select
          className={baseInputClasses(errors.HasCoSigner || errors.hasCoSigner)}
          value={data.HasCoSigner ?? data.hasCoSigner ?? ''}
          onChange={(e) => onChange({ HasCoSigner: e.target.value, hasCoSigner: e.target.value })}
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
