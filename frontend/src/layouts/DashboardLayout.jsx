import { motion } from 'framer-motion';

export default function DashboardLayout({ title, subtitle, badge, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-left"
        >
          {badge && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
              {badge}
            </span>
          )}
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-4xl font-display">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2.5 max-w-3xl text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
