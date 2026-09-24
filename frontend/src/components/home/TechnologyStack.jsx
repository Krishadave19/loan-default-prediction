import { motion } from 'framer-motion';

const STACK = [
  'XGBoost',
  'scikit-learn',
  'FastAPI',
  'PostgreSQL',
  'SHAP',
  'React',
  'Docker',
  'Redis',
];

export default function TechnologyStack() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-ink-700/40 dark:text-white/35">
        Built on a modern, auditable stack
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {STACK.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="glass rounded-full px-4 py-2 text-sm font-medium text-ink-700 dark:text-white/70"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
