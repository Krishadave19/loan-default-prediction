import { motion } from 'framer-motion';

export default function ProcessStep({ index, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass glass-border-gradient flex gap-4 rounded-3xl p-5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent-gradient text-sm font-semibold text-white shadow-glow">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700/65 dark:text-white/55">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
