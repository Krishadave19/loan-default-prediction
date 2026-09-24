import { motion } from 'framer-motion';
import { ArrowRight, Database, BarChart3, TrendingUp, GitBranch, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectHighlightsBanner() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
          <Sparkles className="h-3.5 w-3.5" /> Project Blueprint
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-4xl font-display">
          Deep Dive: Machine Learning Pipeline & Model Comparison
        </h2>
        <p className="mt-3 text-base text-ink-700/70 dark:text-white/60">
          Explore the exact data pipeline, exploratory findings, and comparative benchmark models developed in <code className="text-violet-500 font-mono">loan.ipynb</code>.
        </p>
      </div>

      {/* 2 Featured Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Project Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-white/50 to-white/20 dark:from-navy-900/60 dark:to-navy-950/60 p-8 shadow-glass transition-all hover:border-violet-500/50 hover:shadow-glow"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
              <Database className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
              255,347 Loans Analyzed
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold text-ink-900 dark:text-white font-display">
            End-to-End Project Summary
          </h3>
          <p className="mt-2 text-sm text-ink-700/75 dark:text-white/65 leading-relaxed">
            Detailed walkthrough of the full pipeline in <code className="font-mono text-xs">loan.ipynb</code>: exploratory data analysis, dealing with the 88.4% vs 11.6% class imbalance, StandardScaler + OneHotEncoder ColumnTransformer, and stratified 80/20 splitting.
          </p>

          <div className="mt-6 space-y-2 text-xs text-ink-700/80 dark:text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Zero missing values & zero duplicates verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Full Scikit-Learn ColumnTransformer pipeline code</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Interactive copyable Python code snippets</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-900/10 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-700/60 dark:text-white/50">
              EDA • Transformers • Code
            </span>
            <Link
              to="/summary"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform"
            >
              Read Project Summary <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Model Accuracy & Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-white/50 to-white/20 dark:from-navy-900/60 dark:to-navy-950/60 p-8 shadow-glass transition-all hover:border-indigo-500/50 hover:shadow-glow"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <BarChart3 className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
              4 Candidate Models
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold text-ink-900 dark:text-white font-display">
            Model Accuracy & Comparison
          </h3>
          <p className="mt-2 text-sm text-ink-700/75 dark:text-white/65 leading-relaxed">
            Side-by-side evaluation of Logistic Regression (88.50%), Decision Tree (85.92%), Random Forest (91.42%), and KNN (87.85%). Features the Accuracy Paradox analysis and dynamic threshold calibration simulator.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="font-bold text-blue-600 dark:text-blue-400">Logistic Reg</p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50">88.50% Acc • 0.4ms</p>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <p className="font-bold text-teal-600 dark:text-teal-400">Decision Tree</p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50">85.92% Acc • 22% Recall</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="font-bold text-purple-600 dark:text-purple-400">Random Forest</p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50">91.42% Acc • 0.889 AUC</p>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <p className="font-bold text-pink-600 dark:text-pink-400">KNN (k=5)</p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50">87.85% Acc • Non-param</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-ink-900/10 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-700/60 dark:text-white/50">
              Charts • Radar • Thresholds
            </span>
            <Link
              to="/model-comparison"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
            >
              Compare All Models <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
