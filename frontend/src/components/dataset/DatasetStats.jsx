import { motion } from 'framer-motion';
import { formatNumber, formatCurrency, formatPercent } from '../../utils/formatters';
import { SkeletonBlock } from '../common/Loading';

export default function DatasetStats({ stats, isLoading }) {
  const items = stats
    ? [
        { label: 'Total records', value: formatNumber(stats.totalRecords) },
        { label: 'Default rate', value: formatPercent(stats.defaultRate) },
        { label: 'Avg. credit score', value: formatNumber(stats.avgCreditScore) },
        { label: 'Avg. loan amount', value: formatCurrency(stats.avgLoanAmount) },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-24 rounded-3xl" />)}

      {!isLoading &&
        items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass glass-border-gradient rounded-3xl p-4"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-700/50 dark:text-white/40">
              {item.label}
            </p>
            <p className="mt-1.5 text-xl font-semibold text-ink-900 dark:text-white">{item.value}</p>
          </motion.div>
        ))}
    </div>
  );
}
