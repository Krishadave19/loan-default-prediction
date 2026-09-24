import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="glass glass-border-gradient rounded-3xl p-6"
    >
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h3 className="mt-4 text-base font-semibold text-ink-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700/65 dark:text-white/55">{description}</p>
    </motion.div>
  );
}
