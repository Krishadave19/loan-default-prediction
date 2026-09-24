import { motion } from 'framer-motion';

export default function PageHeader({ eyebrow, title, description, align = 'center' }) {
  const isCenter = align === 'center';
  return (
    <div className={`mx-auto max-w-2xl px-4 pt-32 pb-4 ${isCenter ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-violet-500 dark:text-violet-300"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 dark:text-white sm:text-4xl"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-4 text-base leading-relaxed text-ink-700/70 dark:text-white/60"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
