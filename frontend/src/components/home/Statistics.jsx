import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { heroStatistics } from '../../data/statistics';

function CountUp({ value, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 20 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (!ref.current) return;
      const isDecimal = value % 1 !== 0;
      ref.current.textContent = `${isDecimal ? latest.toFixed(1) : Math.round(latest).toLocaleString()}${suffix}`;
    });
    return unsubscribe;
  }, [spring, suffix, value]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function Statistics() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass glass-border-gradient grid grid-cols-2 gap-8 rounded-4xl px-6 py-10 sm:grid-cols-4 sm:px-10">
        {heroStatistics.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <p className="text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1.5 text-xs font-medium text-ink-700/60 dark:text-white/50">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
