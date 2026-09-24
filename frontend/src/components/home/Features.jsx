import { motion } from 'framer-motion';
import { features } from '../../data/features';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium text-violet-500 dark:text-violet-300">Why underwriters switch</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 dark:text-white sm:text-4xl">
          A model you can defend in a credit committee
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="glass glass-border-gradient group rounded-3xl p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-base font-semibold text-ink-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-700/70 dark:text-white/55">
              {description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
