import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const COMPARISON_ROWS = [
  {
    dimension: 'Turnaround Latency',
    traditional: '3 to 5 business days of manual document gathering and review.',
    loanLens: 'Sub-200ms real-time API inference and automated probability scoring.',
  },
  {
    dimension: 'Data Dimensions Evaluated',
    traditional: 'Limited to static FICO score and a single debt-to-income metric.',
    loanLens: '40+ cross-signal features including cash flow velocity and leverage cushions.',
  },
  {
    dimension: 'Explainability & Compliance',
    traditional: 'Vague, subjective rejection reasons with zero quantified weights.',
    loanLens: 'Granular mathematical SHAP values showing exact factor impact per applicant.',
  },
  {
    dimension: 'Predictive Accuracy',
    traditional: 'High false-positive rate (~68% precision) rejecting creditworthy borrowers.',
    loanLens: '88.5% cross-validated ROC-AUC with calibrated risk distribution.',
  },
  {
    dimension: 'Fair Lending & Bias Safeguards',
    traditional: 'Prone to unconscious cognitive human underwriter biases.',
    loanLens: 'Continuous demographic parity monitoring and ECOA fairness audits.',
  },
];

export default function ComparisonSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
          <Zap className="h-3.5 w-3.5" /> Performance Superiority
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl font-display">
          Traditional Underwriting vs. LoanLens AI
        </h2>
        <p className="mt-4 text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
          See why modern financial institutions are replacing legacy spreadsheets with machine learning.
        </p>
      </div>

      <div className="mt-14 overflow-hidden rounded-4xl border border-ink-900/10 dark:border-white/10 glass glass-border-gradient shadow-glass-lg">
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/60 p-5 text-sm font-bold">
          <div className="md:col-span-4 text-ink-900 dark:text-white uppercase tracking-wider text-xs">
            Evaluation Dimension
          </div>
          <div className="md:col-span-4 text-rose-500 flex items-center gap-2 mt-2 md:mt-0">
            <XCircle className="h-4 w-4" /> Traditional Manual Scoring
          </div>
          <div className="md:col-span-4 text-emerald-500 flex items-center gap-2 mt-2 md:mt-0">
            <CheckCircle2 className="h-4 w-4" /> LoanLens Credit Intelligence
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-ink-900/5 dark:divide-white/5">
          {COMPARISON_ROWS.map((row, i) => (
            <motion.div
              key={row.dimension}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-12 p-5 text-sm hover:bg-white/40 dark:hover:bg-white/5 transition-colors gap-3 md:gap-0"
            >
              <div className="md:col-span-4 font-bold text-ink-900 dark:text-white flex items-center">
                {row.dimension}
              </div>
              <div className="md:col-span-4 text-ink-700/70 dark:text-white/60 pr-4 flex items-start gap-2">
                <span className="text-rose-500 font-bold hidden md:inline">✕</span>
                <span>{row.traditional}</span>
              </div>
              <div className="md:col-span-4 text-ink-900/90 dark:text-white/90 font-medium pl-0 md:pl-2 flex items-start gap-2">
                <span className="text-emerald-500 font-bold hidden md:inline">✓</span>
                <span>{row.loanLens}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-teal-600/10 p-6 border-t border-ink-900/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-violet-500" />
            <p className="text-xs sm:text-sm font-semibold text-ink-900 dark:text-white">
              Institutional accuracy tested across a 480,000+ loan benchmark dataset.
            </p>
          </div>
          <Link
            to="/performance"
            className="rounded-full bg-accent-gradient px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform hover:scale-105 shrink-0"
          >
            Inspect Performance Metrics →
          </Link>
        </div>
      </div>
    </section>
  );
}
