import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-indigo-900 via-navy-900 to-purple-950 p-8 sm:p-14 text-center shadow-glass-lg border border-violet-500/30">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-white/10 px-3.5 py-1 text-xs font-semibold text-violet-200">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" /> Instant Decision Support
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-display">
            Ready to Score Your First Loan Applicant?
          </h2>

          <p className="mt-4 text-base text-white/75 leading-relaxed">
            Experience sub-200ms probability scoring with complete SHAP factor breakdown. Zero setup required.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/prediction"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-navy-950 shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Prediction Engine</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/performance"
              className="glass rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white/10"
            >
              View Validation Benchmarks
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/60">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted in transit • No private credentials retained</span>
          </div>
        </div>
      </div>
    </section>
  );
}
