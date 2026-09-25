import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingDown,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRight,
  BookmarkCheck,
} from 'lucide-react';
import RiskIndicator from './RiskIndicator';
import ProbabilityBar from './ProbabilityBar';
import { getRiskLevel } from '../../utils/constants';
import { usePredictionContext } from '../../context/PredictionContext';

export default function PredictionResult({ result, onReset }) {
  const { latestRecord } = usePredictionContext();
  if (!result) return null;

  const probability = result.probability ?? result.default_probability ?? 0.05;
  const isDefault = (result.default_prediction ?? (probability >= 0.5 ? 1 : 0)) === 1;
  const riskLevel = result.riskLevel || getRiskLevel(probability);
  const contributions = Array.isArray(result.contributions) ? result.contributions : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass glass-border-gradient rounded-3xl p-4 sm:rounded-4xl sm:p-8"
    >
      {/* Saved to History Notice Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-xs text-violet-700 dark:text-violet-300">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="h-4 w-4 shrink-0 text-violet-500" />
          <span>
            Prediction saved to <strong>History</strong>
            {latestRecord?.id && (
              <span className="ml-1.5 font-mono text-[11px] opacity-80">({latestRecord.id})</span>
            )}
          </span>
        </div>
        <Link
          to="/history"
          className="inline-flex items-center gap-1 font-semibold hover:underline text-violet-600 dark:text-violet-300"
        >
          View all history <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto,1fr] lg:items-center">
        <RiskIndicator probability={probability} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ color: riskLevel.color, backgroundColor: `${riskLevel.color}1A` }}
            >
              {riskLevel.label}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                isDefault
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isDefault ? (
                <>
                  <AlertTriangle className="h-3 w-3" /> Flagged for Default Risk
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" /> Low Default Risk / Recommended
                </>
              )}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-semibold text-ink-900 dark:text-white">
            This applicant has a {(probability * 100).toFixed(1)}% estimated chance of default
          </h3>
          <p className="mt-1.5 text-sm text-ink-700/60 dark:text-white/50">
            Scored with the trained Random Forest classifier using 16 behavioral and financial indicators.
          </p>

          <div className="mt-5">
            <ProbabilityBar probability={probability} />
          </div>
        </div>
      </div>

      {contributions.length > 0 && (
        <div className="mt-8 border-t border-ink-900/[0.08] pt-6 dark:border-white/[0.08]">
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white">
            Key Feature Attributions (What drove this score)
          </h4>
          <div className="mt-4 space-y-3">
            {contributions
              .slice()
              .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
              .map((c, i) => {
                const isPositive = c.impact > 0;
                const width = Math.min(Math.abs(c.impact) * 220, 100);
                return (
                  <motion.div
                    key={c.feature}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1.5"
                  >
                    <span className="min-w-0 flex-1 text-xs text-ink-700/70 dark:text-white/55 sm:w-44 sm:flex-none">
                      {c.feature}
                    </span>
                    <div className="order-3 h-2 w-full overflow-hidden rounded-full bg-ink-900/[0.08] dark:bg-white/[0.08] sm:order-none sm:flex-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(width, 6)}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                        className={isPositive ? 'h-full rounded-full bg-rose-500' : 'h-full rounded-full bg-emerald-500'}
                      />
                    </div>
                    <span className="flex w-auto shrink-0 items-center justify-end gap-1 text-xs font-medium sm:w-20">
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      <span className={isPositive ? 'text-rose-500' : 'text-emerald-500'}>
                        {isPositive ? '+' : ''}
                        {(c.impact * 100).toFixed(1)}%
                      </span>
                    </span>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/10 pt-5 dark:border-white/10">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-2.5 text-xs font-semibold text-ink-700 transition-colors hover:border-violet-400/50 hover:text-violet-500 dark:border-white/10 dark:text-white/70"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Score another applicant
        </button>

        <Link
          to="/history"
          className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-2.5 text-xs font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          <History className="h-3.5 w-3.5" />
          View History Page
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
