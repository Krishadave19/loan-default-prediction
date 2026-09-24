import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const STAGES = [
  {
    title: 'Data collection & cleaning',
    detail:
      'Historical loan records are pulled from the servicing warehouse, deduplicated, and checked for label leakage before anything touches the model.',
  },
  {
    title: 'Feature engineering',
    detail:
      'Raw fields become model-ready signals: loan-to-income ratio, credit utilization, delinquency recency, and employment stability scores.',
  },
  {
    title: 'Training & tuning',
    detail:
      'A gradient-boosted ensemble is trained with stratified cross-validation and hyperparameter search against a holdout cohort.',
  },
  {
    title: 'Calibration',
    detail:
      'Raw scores are calibrated with isotonic regression so a "20% probability" actually defaults roughly 20% of the time.',
  },
  {
    title: 'Monitoring & retraining',
    detail:
      'Live predictions are compared against outcomes monthly; drift beyond threshold triggers an automatic retraining job.',
  },
];

export default function MLProcess() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {STAGES.map((stage, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={stage.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass overflow-hidden rounded-2xl"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-ink-900 dark:text-white">{stage.title}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="h-4 w-4 text-ink-700/50 dark:text-white/45" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-ink-700/65 dark:text-white/55">
                    {stage.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
