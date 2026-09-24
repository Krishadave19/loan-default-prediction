import { motion } from 'framer-motion';
import { ShieldCheck, Gauge, Radar } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import WorkflowDiagram from '../components/how-it-works/WorkflowDiagram';
import MLProcess from '../components/how-it-works/MLProcess';
import FeatureCard from '../components/how-it-works/FeatureCard';

const PRINCIPLES = [
  {
    icon: Gauge,
    title: 'Calibrated, not just accurate',
    description: 'A predicted 20% default rate means roughly 1 in 5 similar applicants actually default — verified against real outcomes.',
  },
  {
    icon: ShieldCheck,
    title: 'Explainable at the applicant level',
    description: 'Every score ships with the ranked factors that produced it, so a decision can be defended in a credit committee.',
  },
  {
    icon: Radar,
    title: 'Watched continuously',
    description: 'Prediction drift and outcome mismatches are tracked monthly and trigger a retraining review automatically.',
  },
];

export default function HowItWorks() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="How it works"
        title="A transparent path from application to decision"
        description="LoanLens doesn't just return a number — it shows the reasoning, the data, and the checks behind every prediction."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <WorkflowDiagram />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative flex justify-center">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass glass-border-gradient flex h-64 w-64 items-center justify-center rounded-4xl text-center sm:h-72 sm:w-72"
            >
              <div>
                <p className="font-display text-5xl font-bold text-gradient">40+</p>
                <p className="mt-2 text-sm text-ink-700/60 dark:text-white/50">
                  engineered signals feed every prediction
                </p>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {PRINCIPLES.map((p) => (
              <FeatureCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="text-sm font-medium text-violet-500 dark:text-violet-300">The pipeline in detail</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">
            Every stage, explained
          </h2>
        </div>
        <MLProcess />
      </section>
    </div>
  );
}
