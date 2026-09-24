import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, TrendingUp, Cpu, GitBranch, BarChart3, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const HEADLINE = 'Know who repays before you say yes.';

function AnimatedHeadline() {
  const words = HEADLINE.split(' ');
  return (
    <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-900 dark:text-white sm:text-6xl lg:text-7xl font-display">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`mr-3 inline-block ${
            word === 'repays'
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent'
              : word === 'yes.'
              ? 'text-gradient'
              : ''
          }`}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  // Keep the showcase fully opaque while it is on screen; only fade as the hero leaves the viewport.
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.3]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* Background Animated Gradient Orbs */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute -top-24 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/25 blur-3xl animate-float"
        aria-hidden="true"
      />
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute top-48 left-[-10%] h-96 w-96 rounded-full bg-gradient-to-tr from-violet-600/25 to-pink-500/20 blur-3xl animate-float [animation-delay:2s]"
        aria-hidden="true"
      />
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl animate-float [animation-delay:4s]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {/* Top Feature Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 shadow-glow backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-spin [animation-duration:8s]" />
          <span>Scikit-Learn Machine Learning Pipeline</span>
          <span className="h-1 w-1 rounded-full bg-violet-400"></span>
          <span className="text-violet-900/60 dark:text-violet-200/60">Trained on 255,347 Loans (loan.ipynb)</span>
        </motion.div>

        {/* Animated Headline */}
        <div className="mt-8">
          <AnimatedHeadline />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-700/80 dark:text-white/70"
        >
          Predict loan default risk with institutional precision. Powered by Logistic Regression, Decision Tree
          classifiers, and ensemble benchmarks trained on 255k+ borrower records with sub-millisecond inference.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/prediction"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-accent-gradient px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden="true"
            />
            <span className="relative">Score an Applicant</span>
            <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/summary"
            className="glass group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold text-ink-900 transition-all hover:scale-105 hover:border-violet-500/40 dark:text-white active:scale-95"
          >
            <Database className="h-4 w-4 text-violet-500" />
            <span>Project Summary</span>
          </Link>

          <Link
            to="/model-comparison"
            className="glass group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-semibold text-ink-900 transition-all hover:scale-105 hover:border-indigo-500/40 dark:text-white active:scale-95"
          >
            <BarChart3 className="h-4 w-4 text-indigo-500" />
            <span>Model Accuracy</span>
          </Link>
        </motion.div>

        {/* Quick Highlights Under CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-700/60 dark:text-white/50"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 0.4ms LogReg latency
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GitBranch className="h-4 w-4 text-teal-500" /> Non-linear Decision Trees
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-violet-500" /> 91.4% Random Forest Benchmark
          </span>
        </motion.div>
      </div>

      {/* Colorful High-Tech 3D Image Showcase with Animated Floating Badges */}
      <motion.div
        style={{ opacity }}
        className="relative mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="group relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-white/10 to-white/5 dark:from-white/10 dark:to-navy-900/60 p-2 sm:p-3 shadow-glass-lg backdrop-blur-xl">
          {/* Glowing Top Edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

          {/* Hero Visual Image */}
          <div className="relative overflow-hidden w-full rounded-2xl bg-navy-950 aspect-[16/9] max-h-[520px]">
            <img
              src="/images/loan-risk-hero.jpg"
              alt="LoanLens AI Credit Risk Intelligence Visualization"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Vignette Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/30" />

            {/* Floating Live Badge 1: Decision Tree Rule Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="absolute left-4 top-4 sm:left-8 sm:top-8 rounded-2xl border border-teal-500/40 bg-navy-900/85 p-3.5 sm:p-4 backdrop-blur-xl shadow-glow hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 font-bold">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-400">
                    Decision Tree Split
                  </p>
                  <p className="text-sm font-bold text-white">Accuracy: 85.92% • Recall: 22%</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Live Badge 2: Logistic Regression Speed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 rounded-2xl border border-blue-500/40 bg-navy-900/85 p-3.5 sm:p-4 backdrop-blur-xl shadow-glow hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                    Logistic Regression
                  </p>
                  <p className="text-sm font-bold text-white">88.50% Accuracy • 0.4ms Latency</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Metrics Bar Underneath */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 p-4 sm:p-6 bg-navy-900/60 dark:bg-navy-900/90 rounded-2xl mt-3">
            {[
              { label: 'Logistic Regression', value: '88.50%', highlight: 'text-blue-400', sub: 'Linear Sigmoid' },
              { label: 'Decision Tree', value: '85.92%', highlight: 'text-teal-400', sub: 'Gini Partitioning' },
              { label: 'Random Forest', value: '91.42%', highlight: 'text-purple-400', sub: '100 Trees Ensemble' },
              { label: 'Dataset Records', value: '255,347', highlight: 'text-amber-400', sub: 'Loan_default.csv' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
                className="rounded-xl border border-white/5 bg-white/5 p-3 sm:p-4 text-center sm:text-left"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  {item.label}
                </p>
                <p className={`mt-1 text-xl sm:text-2xl font-bold font-display ${item.highlight}`}>{item.value}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
