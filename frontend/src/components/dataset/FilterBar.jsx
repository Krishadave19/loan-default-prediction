import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'repaid', label: 'Repaid' },
  { key: 'defaulted', label: 'Defaulted' },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex gap-1.5 rounded-full border border-ink-900/10 bg-white/50 p-1 dark:border-white/10 dark:bg-white/5">
      {FILTERS.map((filter) => {
        const isActive = active === filter.key;
        return (
          <button
            key={filter.key}
            onClick={() => onChange(filter.key)}
            className="relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-accent-gradient shadow-glow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={cn(
                'relative z-10',
                isActive ? 'text-white' : 'text-ink-700/60 dark:text-white/50',
              )}
            >
              {filter.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
