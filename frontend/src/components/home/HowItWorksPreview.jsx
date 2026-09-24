import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '../../data/modelInfo';

export default function HowItWorksPreview() {
  const steps = processSteps.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium text-violet-500 dark:text-violet-300">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 dark:text-white sm:text-4xl">
            From application to answer in five steps
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-700/70 dark:text-white/60">
            Every prediction moves through the same auditable pipeline — so your team always knows
            what the model saw and why it decided what it decided.
          </p>
          <Link
            to="/how-it-works"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-500 hover:gap-2.5 transition-all dark:text-violet-300"
          >
            See the full pipeline
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-400/60 via-violet-400/40 to-transparent" />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex gap-4 pl-0"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-gradient text-sm font-semibold text-white shadow-glow">
                  {i + 1}
                </span>
                <div className="glass flex-1 rounded-2xl px-4 py-3.5">
                  <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-700/60 dark:text-white/50">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
