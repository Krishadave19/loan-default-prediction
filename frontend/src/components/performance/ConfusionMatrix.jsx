import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { confusionMatrix } from '../../data/modelInfo';

export default function ConfusionMatrix() {
  const { labels, matrix } = confusionMatrix;
  const total = matrix.flat().reduce((a, b) => a + b, 0);
  const max = Math.max(...matrix.flat());
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="glass glass-border-gradient rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Confusion Matrix (Holdout Set)</h3>
          <p className="text-xs text-ink-700/50 dark:text-white/40">Evaluated across 51,070 test records</p>
        </div>
        <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-300">
          51,070 cases
        </span>
      </div>

      <div className="mt-6 grid grid-cols-[auto,1fr,1fr] gap-2">
        <div />
        {labels.map((label) => (
          <p key={label} className="text-center text-[11px] font-bold text-ink-700/70 dark:text-white/60">
            Pred: {label}
          </p>
        ))}

        {matrix.map((row, r) => (
          <Fragment key={`row-${r}`}>
            <p
              className="flex items-center justify-end pr-2 text-[11px] font-bold text-ink-700/70 dark:text-white/60"
            >
              Act: {labels[r]}
            </p>
            {row.map((value, c) => {
              const intensity = value / max;
              const isCorrect = r === c;
              const key = `${r}-${c}`;
              return (
                <div key={key} className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (r * 2 + c) * 0.08 }}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex aspect-[4/3] cursor-default items-center justify-center rounded-2xl text-base sm:text-lg font-bold"
                    style={{
                      backgroundColor: isCorrect
                        ? `rgba(16,185,129,${0.15 + intensity * 0.5})`
                        : `rgba(244,63,94,${0.1 + intensity * 0.5})`,
                      color: isCorrect ? '#10B981' : '#F43F5E',
                    }}
                  >
                    {value.toLocaleString()}
                  </motion.div>
                  <AnimatePresence>
                    {hovered === key && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="glass absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium shadow-glass"
                      >
                        {((value / total) * 100).toFixed(1)}% ({value.toLocaleString()} cases)
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}
