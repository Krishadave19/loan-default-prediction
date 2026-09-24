import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle, CheckCircle, ShieldAlert, DollarSign, Wallet, Percent, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EXPLANATION_TOPICS = [
  {
    id: 'what-is-default',
    title: 'What is a Loan Default?',
    subtitle: 'The fundamental definition',
    icon: AlertCircle,
    color: 'from-amber-500 to-rose-500',
    summary: 'A loan default occurs when a borrower fails to make scheduled debt payments for 90 to 120 consecutive days, violating the legal terms of the credit agreement.',
    details: [
      {
        heading: 'Delinquency vs. Default',
        body: 'A missed payment at 30 days is classified as delinquent. If unresolved after 90–120 days, the lender declares a formal default, charging off the account and initiating recovery or legal action.',
      },
      {
        heading: 'Impact on Borrowers',
        body: 'Default drastically cuts credit scores by 100–200 points, triggers collection efforts, and restricts access to mortgages, vehicle financing, and fair interest rates for up to 7 years.',
      },
      {
        heading: 'Impact on Lenders & Banks',
        body: 'Defaults result in direct capital write-offs, increased loan-loss provision reserves, and reduced portfolio return on assets (ROA).',
      },
    ],
  },
  {
    id: 'why-defaults-happen',
    title: 'Why Do Defaults Occur?',
    subtitle: 'Underlying financial root causes',
    icon: DollarSign,
    color: 'from-violet-500 to-indigo-600',
    summary: 'Borrowers rarely default deliberately. Over 85% of defaults stem from structural cash-flow imbalances, high leverage, and unexpected life shocks.',
    details: [
      {
        heading: '1. Excessive Debt-to-Income (DTI)',
        body: 'When fixed debt payments exceed 40–50% of monthly income, even a minor cost fluctuation leaves zero discretionary buffer for emergencies.',
      },
      {
        heading: '2. Payment Shock & Rate Spikes',
        body: 'Variable-rate loans or balloon installments can cause monthly liabilities to surge beyond what the borrower initially budgeted.',
      },
      {
        heading: '3. Income & Employment Volatility',
        body: 'Unexpected job loss, reduction in hours, or freelance revenue dips immediately jeopardize unsecured debt payments.',
      },
    ],
  },
  {
    id: 'traditional-vs-ai',
    title: 'Why Traditional Scoring Fails',
    subtitle: 'Legacy FICO vs. Machine Learning',
    icon: ShieldAlert,
    color: 'from-blue-500 to-cyan-500',
    summary: 'Traditional credit scores rely on backward-looking bureau snapshots, frequently rejecting creditworthy borrowers while missing modern default precursors.',
    details: [
      {
        heading: 'The Lagging Indicator Problem',
        body: 'A credit bureau score reflects where a borrower was 6 months ago. Machine learning analyzes dynamic velocity, transaction ratios, and real-time cash flow.',
      },
      {
        heading: 'Thin-File Penalties',
        body: 'Young professionals, immigrants, and unbanked entrepreneurs are wrongly penalized for lacking multi-year credit lines despite stable income.',
      },
      {
        heading: 'Multidimensional Risk Detection',
        body: 'Machine learning evaluates nonlinear interactions between income stability, revolving utilization, and debt coverage that human underwriters miss.',
      },
    ],
  },
];

export default function WhatIsDefaultExplainer() {
  const [activeTab, setActiveTab] = useState(EXPLANATION_TOPICS[0].id);
  const current = EXPLANATION_TOPICS.find((t) => t.id === activeTab) || EXPLANATION_TOPICS[0];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <HelpCircle className="h-3.5 w-3.5" /> Credit Risk Fundamentals
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl font-display">
          Everything You Need to Know About Loan Default
        </h2>
        <p className="mt-4 text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
          Before evaluating an AI prediction model, it is vital to understand what defaults are,
          why they happen, and why automated machine learning creates safer lending decisions.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {EXPLANATION_TOPICS.map((topic) => {
          const isActive = activeTab === topic.id;
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTab(topic.id)}
              className={`group flex items-center gap-3 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-accent-gradient text-white shadow-glow scale-105'
                  : 'glass text-ink-700/80 dark:text-white/70 hover:border-violet-500/40 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-violet-500'}`} />
              <span>{topic.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Card */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="glass glass-border-gradient rounded-4xl p-6 sm:p-10 shadow-glass-lg"
          >
            {/* Summary Banner */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink-900/10 dark:border-white/10 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-500 dark:text-violet-400">
                  {current.subtitle}
                </p>
                <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
                  {current.title}
                </h3>
              </div>
              <Link
                to="/prediction"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-300 hover:underline"
              >
                <span>Simulate on Real Applicant</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-6 text-lg font-medium text-ink-900/90 dark:text-white/90 leading-relaxed bg-violet-500/5 dark:bg-white/5 p-4 rounded-2xl border border-violet-500/10">
              {current.summary}
            </p>

            {/* 3 Detail Columns */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {current.details.map((detail, index) => (
                <div
                  key={detail.heading}
                  className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-violet-500/30"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-gradient text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <h4 className="text-base font-bold text-ink-900 dark:text-white">
                      {detail.heading}
                    </h4>
                  </div>
                  <p className="mt-3 text-sm text-ink-700/75 dark:text-white/65 leading-relaxed">
                    {detail.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
