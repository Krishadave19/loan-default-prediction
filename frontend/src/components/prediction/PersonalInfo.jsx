import { motion } from 'framer-motion';
import FormField, { baseInputClasses } from './FormField';
import {
  EDUCATION_OPTIONS,
  EMPLOYMENT_TYPES,
  MARITAL_STATUSES,
  YES_NO_OPTIONS,
} from '../../utils/constants';

export default function PersonalInfo({ data, errors = {}, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <FormField label="Full name (optional)" error={errors.fullName}>
        <input
          className={baseInputClasses(errors.fullName)}
          placeholder="Jordan Blake"
          value={data.fullName || ''}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </FormField>

      <FormField label="Age (years)" error={errors.Age || errors.age}>
        <input
          type="number"
          min={18}
          max={100}
          className={baseInputClasses(errors.Age || errors.age)}
          placeholder="45"
          value={data.Age ?? data.age ?? ''}
          onChange={(e) => onChange({ Age: e.target.value, age: e.target.value })}
        />
      </FormField>

      <FormField label="Education level" error={errors.Education || errors.education}>
        <select
          className={baseInputClasses(errors.Education || errors.education)}
          value={data.Education ?? data.education ?? ''}
          onChange={(e) => onChange({ Education: e.target.value, education: e.target.value })}
        >
          <option value="" disabled>
            Select education
          </option>
          {EDUCATION_OPTIONS.map((edu) => (
            <option key={edu} value={edu}>
              {edu}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Employment type" error={errors.EmploymentType || errors.employmentType}>
        <select
          className={baseInputClasses(errors.EmploymentType || errors.employmentType)}
          value={data.EmploymentType ?? data.employmentType ?? ''}
          onChange={(e) => onChange({ EmploymentType: e.target.value, employmentType: e.target.value })}
        >
          <option value="" disabled>
            Select employment type
          </option>
          {EMPLOYMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Months at current job" error={errors.MonthsEmployed || errors.monthsEmployed}>
        <input
          type="number"
          min={0}
          max={600}
          className={baseInputClasses(errors.MonthsEmployed || errors.monthsEmployed)}
          placeholder="80 (e.g. 6.6 years)"
          value={data.MonthsEmployed ?? data.monthsEmployed ?? ''}
          onChange={(e) => onChange({ MonthsEmployed: e.target.value, monthsEmployed: e.target.value })}
        />
      </FormField>

      <FormField label="Marital status" error={errors.MaritalStatus || errors.maritalStatus}>
        <select
          className={baseInputClasses(errors.MaritalStatus || errors.maritalStatus)}
          value={data.MaritalStatus ?? data.maritalStatus ?? ''}
          onChange={(e) => onChange({ MaritalStatus: e.target.value, maritalStatus: e.target.value })}
        >
          <option value="" disabled>
            Select marital status
          </option>
          {MARITAL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Has dependents" error={errors.HasDependents || errors.hasDependents}>
        <select
          className={baseInputClasses(errors.HasDependents || errors.hasDependents)}
          value={data.HasDependents ?? data.hasDependents ?? ''}
          onChange={(e) => onChange({ HasDependents: e.target.value, hasDependents: e.target.value })}
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
