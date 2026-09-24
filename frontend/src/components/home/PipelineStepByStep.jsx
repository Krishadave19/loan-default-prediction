import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileInput, Layers, Cpu, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Applicant Data Ingestion',
    icon: FileInput,
    badge: 'Input Phase',
    color: 'from-blue-500 to-indigo-500',
    description: 'The applicant submits financial identity variables including requested loan amount, annual income, credit bureau score, employment duration, and existing debt obligations.',
    highlights: [
      'Standardized schema validation in 10ms',
      'Automatic categorical encoding & scaling',
      'Zero storage of unencrypted PII credentials',
    ],
    technicalDetail: 'Validates bounded limits (e.g. credit score 300–850, positive income) and formats the raw vector for feature synthesis.',
  },
  {
    step: 2,
    title: 'Cross-Signal Feature Engineering',
    icon: Layers,
    badge: 'Feature Synthesis',
    color: 'from-indigo-500 to-violet-500',
    description: 'Raw numbers alone do not tell the full story. The engine computes derived ratios that capture actual financial pressure and repayment capability.',
    highlights: [
      'Debt-to-Income (DTI) = Monthly Obligations / Monthly Gross Income',
      'Loan-to-Income (LTI) = Total Principal / Annual Income',
      'Payment Shock & Free Cash Flow cushion metrics',
    ],
    technicalDetail: 'Over 40 interaction features are dynamically engineered, exposing non-linear risk signals invisible to traditional single-metric credit scoring.',
  },
  {
    step: 3,
    title: 'Gradient Boosted Ensemble Modeling',
    icon: Cpu,
    badge: 'Inference Engine',
    color: 'from-violet-500 to-purple-600',
    description: 'The engineered feature vector is evaluated through optimized gradient-boosted decision trees trained on over 480,000 historical loan outcomes.',
    highlights: [
      'Sub-200 millisecond inference latency',
      'Isotonic probability calibration (real % matches real default rate)',
      'Cross-validated ROC-AUC of 0.892',
    ],
    technicalDetail: 'Tree ensembles capture deep decision splits across multi-dimensional feature interactions, preventing overfitting through regularization.',
  },
  {
    step: 4,
    title: 'Explainable AI with SHAP Values',
    icon: Sparkles,
    badge: 'Transparency',
    color: 'from-purple-500 to-pink-500',
    description: 'Black-box decisions are unacceptable in banking. Nimbus calculates exact Shapley Additive Explanations (SHAP) for every individual applicant.',
    highlights: [
      'Know the exact top 5 factors increasing or lowering risk',
      'Full compliance with Equal Credit Opportunity Act (ECOA)',
      'Human-readable explanation cards generated automatically',
    ],
    technicalDetail: 'TreeSHAP assigns mathematical dollar/probability credit to each feature, eliminating opaque rejections and facilitating adverse action notices.',
  },
  {
    step: 5,
    title: 'Underwriting Recommendation',
    icon: Award,
    badge: 'Decision Support',
    color: 'from-emerald-500 to-teal-500',
    description: 'The calibrated default probability is mapped into institutional risk tiers with actionable recommendations and risk-adjusted pricing guidance.',
    highlights: [
      'Low Risk (<33%): Fast-track approval with prime interest rate',
      'Moderate Risk (33–66%): Conditional approval / manual underwriting check',
      'High Risk (>66%): Decline or require co-signer / collateral',
    ],
    technicalDetail: 'Produces an auditable decision snapshot ready for loan officers, risk managers, and compliance audits.',
  },
];

export default function PipelineStepByStep() {
  const [selectedStep, setSelectedStep] = useState(0);
  const active = PIPELINE_STEPS[selectedStep];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
          <Layers className="h-3.5 w-3.5" /> End-to-End Pipeline
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl font-display">
          How Nimbus Evaluates Loan Risk in 5 Steps
        </h2>
        <p className="mt-4 text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
          From raw applicant submission to auditable, calibrated underwriter decision in less than 200 milliseconds.
        </p>
      </div>

      {/* Colorful 3D Isometric Pipeline Image Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-white/10 to-white/5 dark:from-white/10 dark:to-navy-900/60 p-2 sm:p-3 shadow-glass-lg backdrop-blur-xl"
      >
        <div className="relative overflow-hidden w-full rounded-2xl bg-navy-950 aspect-[16/9] max-h-[480px]">
          <img
            src="/images/pipeline-decision-flow.jpg"
            alt="AI Credit Evaluation Pipeline Diagram"
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/20" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 rounded-2xl border border-white/10 bg-navy-900/80 p-3 sm:p-4 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Auditable Architecture
            </p>
            <p className="text-sm font-bold text-white">
              Data Ingestion → Feature Engineering → Gradient Boosting → SHAP Reasoning → Decision
            </p>
          </div>
        </div>
      </motion.div>

      {/* Step Buttons Tracker */}
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {PIPELINE_STEPS.map((s, idx) => {
          const isSelected = selectedStep === idx;
          const Icon = s.icon;
          return (
            <button
              key={s.step}
              onClick={() => setSelectedStep(idx)}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${
                isSelected
                  ? 'bg-accent-gradient text-white shadow-glow scale-105'
                  : 'glass text-ink-700/80 dark:text-white/70 hover:border-violet-500/40 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-violet-500/10 text-violet-600 dark:text-violet-300'
                }`}
              >
                0{s.step}
              </span>
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold line-clamp-1">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Step Content Card */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="glass glass-border-gradient rounded-3xl p-6 sm:p-10 shadow-glass-lg"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink-900/10 dark:border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gradient text-lg font-bold text-white shadow-glow">
                  {active.step}
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
                    Step {active.step} • {active.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
                    {active.title}
                  </h3>
                </div>
              </div>
              <Link
                to="/prediction"
                className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-2.5 text-xs font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                <span>Run Interactive Test</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="mt-6 text-base text-ink-700/80 dark:text-white/80 leading-relaxed font-medium">
              {active.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Highlights */}
              <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                  Key Capabilities
                </h4>
                <ul className="mt-4 space-y-3">
                  {active.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700/80 dark:text-white/70">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Detail */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Under the Hood
                </h4>
                <p className="mt-3 text-sm text-ink-700/75 dark:text-white/65 leading-relaxed">
                  {active.technicalDetail}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-700/60 dark:text-white/50">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Production Model v2.4 • Audited for Fair Lending
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
