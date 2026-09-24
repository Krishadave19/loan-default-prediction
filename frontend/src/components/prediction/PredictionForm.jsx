import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Wand2, AlertCircle } from 'lucide-react';
import PersonalInfo from './PersonalInfo';
import FinancialInfo from './FinancialInfo';
import CreditInfo from './CreditInfo';
import PredictionResult from './PredictionResult';
import { usePrediction } from '../../hooks/usePrediction';
import { validatePersonalInfo, validateFinancialInfo, validateCreditInfo } from '../../utils/validation';
import { cn } from '../../utils/cn';

const STEPS = [
  { key: 'personal', label: '1. Personal Profile', Component: PersonalInfo, validate: validatePersonalInfo },
  { key: 'financial', label: '2. Financial Details', Component: FinancialInfo, validate: validateFinancialInfo },
  { key: 'credit', label: '3. Credit & Risk', Component: CreditInfo, validate: validateCreditInfo },
];

const BENCHMARK_APPLICANT = {
  fullName: 'Jordan Blake',
  Age: 45,
  Education: "Bachelor's",
  EmploymentType: 'Full-time',
  MonthsEmployed: 80,
  MaritalStatus: 'Divorced',
  HasDependents: 'Yes',
  Income: 85994,
  LoanAmount: 50587,
  LoanTerm: 36,
  InterestRate: 15.23,
  LoanPurpose: 'Other',
  HasMortgage: 'Yes',
  CreditScore: 520,
  DTIRatio: 0.44,
  NumCreditLines: 4,
  HasCoSigner: 'Yes',
};

export default function PredictionForm() {
  const { formData, updateForm, result, isLoading, error, submitPrediction, reset } = usePrediction();
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState({});

  if (result) {
    return (
      <PredictionResult
        result={result}
        onReset={() => {
          reset();
          setStepIndex(0);
          setErrors({});
        }}
      />
    );
  }

  const { Component, validate } = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleNext = async () => {
    const stepErrors = validate(formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (isLastStep) {
      await submitPrediction(formData);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const handleFillSample = () => {
    updateForm(BENCHMARK_APPLICANT);
    setErrors({});
  };

  return (
    <div className="glass glass-border-gradient rounded-4xl p-6 sm:p-8">
      {/* Header bar with Sample Data filler */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-900/10 dark:border-white/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
            Machine Learning Inference
          </span>
          <p className="text-xs text-ink-700/60 dark:text-white/50">
            All 16 features align directly with the trained model schema in <code>constants.py</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleFillSample}
          className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-500/20 dark:text-violet-300 transition-colors self-start sm:self-auto"
        >
          <Wand2 className="h-3.5 w-3.5" />
          Fill Sample Applicant
        </button>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-3">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex flex-1 items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  i < stepIndex && 'bg-accent-gradient text-white',
                  i === stepIndex && 'bg-accent-gradient text-white shadow-glow',
                  i > stepIndex && 'bg-ink-900/[0.08] text-ink-700/50 dark:bg-white/[0.08] dark:text-white/40',
                )}
              >
                {i + 1}
              </div>
              <span className="hidden text-[11px] text-ink-700/60 dark:text-white/45 sm:block">
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 bg-ink-900/[0.08] dark:bg-white/[0.08]">
                <motion.div
                  className="h-full bg-accent-gradient"
                  initial={{ width: '0%' }}
                  animate={{ width: i < stepIndex ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Prediction Failed</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <Component key={stepIndex} data={formData} errors={errors} onChange={updateForm} />
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={stepIndex === 0}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
            stepIndex === 0
              ? 'cursor-not-allowed text-ink-700/30 dark:text-white/20'
              : 'text-ink-700 hover:text-violet-500 dark:text-white/70',
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scoring via Backend…
            </>
          ) : isLastStep ? (
            <>
              <Sparkles className="h-4 w-4" />
              Run Model Prediction
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
