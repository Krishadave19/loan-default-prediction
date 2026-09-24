import { motion } from 'framer-motion';
import { formatPercent } from '../../utils/formatters';

export default function MetricCard({ label, value, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="glass glass-border-gradient rounded-3xl p-5"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-ink-700/50 dark:text-white/40">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-gradient">{formatPercent(value, 1)}</p>
      {description && (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-700/55 dark:text-white/45">
          {description}
        </p>
      )}
    </motion.div>
  );
}
