import { motion } from 'framer-motion';
import { Percent, Award, Briefcase, DollarSign, ShieldAlert, CheckCircle2 } from 'lucide-react';

const FACTORS = [
  {
    icon: Percent,
    title: 'Debt-to-Income (DTI) Ratio',
    weight: '32% Relative Weight',
    badge: 'Critical Predictor',
    badgeColor: 'border-rose-500/30 text-rose-500 bg-rose-500/10',
    description: 'Measures what percentage of monthly gross income is committed to servicing recurring debts (rent, credit cards, existing loans).',
    benchmark: '< 35% Ideal • > 45% High Risk',
    metricExample: 'A borrower earning $6,000/mo with $3,000 debt obligations has a 50% DTI, leaving insufficient margin for unexpected expenses.',
  },
  {
    icon: Award,
    title: 'Credit Score & Delinquency History',
    weight: '28% Relative Weight',
    badge: 'Repayment Track Record',
    badgeColor: 'border-violet-500/30 text-violet-500 bg-violet-500/10',
    description: 'Reflects historical reliability in honoring credit terms. Recent 30/60/90-day delinquencies drastically accelerate default probabilities.',
    benchmark: '720+ Prime • < 620 Subprime',
    metricExample: 'A single 90-day delinquency within 12 months increases default likelihood by over 3.2x across personal loans.',
  },
  {
    icon: DollarSign,
    title: 'Loan-to-Income (LTI) Burden',
    weight: '22% Relative Weight',
    badge: 'Leverage Cushion',
    badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
    description: 'Compares total requested principal to annual earning power to prevent over-extension and payment shock.',
    benchmark: '< 20% Safe • > 40% Elevated',
    metricExample: 'Requesting $30,000 on a $45,000 income (66% LTI) creates disproportionate debt burden compared to household cash flow.',
  },
  {
    icon: Briefcase,
    title: 'Employment Tenure & Income Stability',
    weight: '18% Relative Weight',
    badge: 'Cash Flow Continuity',
    badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
    description: 'Tenure at current employer and verifiable salary stability determine whether the borrower can weather economic shocks.',
    benchmark: '2+ Years Stable • < 6 Mos Vulnerable',
    metricExample: 'Borrowers with 3+ continuous years in stable salaried roles exhibit 41% lower default frequency than transient earners.',
  },
];

export default function CoreRiskFactors() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
          <ShieldAlert className="h-3.5 w-3.5" /> Feature Significance
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl font-display">
          The 4 Core Pillars of Default Risk
        </h2>
        <p className="mt-4 text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
          How our gradient boosted machine learning model weighs key applicant variables to calculate risk accurately.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FACTORS.map((factor, i) => {
          const Icon = factor.icon;
          return (
            <motion.div
              key={factor.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass glass-border-gradient flex flex-col justify-between rounded-3xl p-6 shadow-glass-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${factor.badgeColor}`}>
                    {factor.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-ink-900 dark:text-white">
                  {factor.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
                  {factor.weight}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-ink-700/75 dark:text-white/65">
                  {factor.description}
                </p>
              </div>

              <div className="mt-6 border-t border-ink-900/10 dark:border-white/10 pt-4">
                <div className="flex items-center justify-between text-[11px] font-semibold text-ink-900 dark:text-white">
                  <span>Standard Benchmark</span>
                  <span className="text-violet-500 font-mono">{factor.benchmark}</span>
                </div>
                <p className="mt-2 text-[11px] text-ink-700/60 dark:text-white/50 leading-normal italic">
                  "{factor.metricExample}"
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
