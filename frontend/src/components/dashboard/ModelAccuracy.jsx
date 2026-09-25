import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { modelMetrics as defaultMetrics } from '../../data/modelInfo';
import { fetchModelInfo } from '../../services/modelService';
import { formatPercent } from '../../utils/formatters';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ModelAccuracy() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [modelName, setModelName] = useState('Random Forest');

  useEffect(() => {
    fetchModelInfo().then((res) => {
      if (res && res.modelMetrics) {
        setMetrics(res.modelMetrics);
        if (res.model_name) setModelName(res.model_name);
      }
    });
  }, []);

  const accuracy = metrics.accuracy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="glass glass-border-gradient flex flex-col items-center rounded-3xl p-6 text-center"
    >
      <h3 className="self-start text-sm font-semibold text-ink-900 dark:text-white">Model accuracy</h3>
      <p className="self-start text-xs text-ink-700/50 dark:text-white/40">{modelName} · production</p>

      <div className="relative mt-4 h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-ink-900/[0.08] dark:stroke-white/[0.08]" />
          <motion.circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="url(#accuracyGradient)"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            whileInView={{ strokeDashoffset: CIRCUMFERENCE * (1 - accuracy) }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-ink-900 dark:text-white">
            {formatPercent(accuracy, 1)}
          </span>
          <span className="text-[11px] text-ink-700/50 dark:text-white/40">accuracy</span>
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-3 text-left">
        <div>
          <p className="text-[11px] text-ink-700/50 dark:text-white/40">Precision</p>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">
            {formatPercent(metrics.precision, 1)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-700/50 dark:text-white/40">Recall</p>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">
            {formatPercent(metrics.recall, 1)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-700/50 dark:text-white/40">F1 score</p>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">
            {formatPercent(metrics.f1Score, 1)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-700/50 dark:text-white/40">AUC</p>
          <p className="text-sm font-semibold text-ink-900 dark:text-white">
            {formatPercent(metrics.auc, 1)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
