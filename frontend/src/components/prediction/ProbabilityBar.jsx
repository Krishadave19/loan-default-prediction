import { motion } from 'framer-motion';
import { formatPercent } from '../../utils/formatters';

function colorForProbability(p) {
  if (p <= 0.33) return '#10B981';
  if (p <= 0.66) return '#F59E0B';
  return '#F43F5E';
}

export default function ProbabilityBar({ probability = 0 }) {
  const color = colorForProbability(probability);

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-ink-700/60 dark:text-white/50">
        <span>Default probability</span>
        <span className="font-semibold" style={{ color }}>
          {formatPercent(probability)}
        </span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-ink-900/[0.08] dark:bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${probability * 100}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-ink-700/40 dark:text-white/30">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
}
