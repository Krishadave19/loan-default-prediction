import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

function AnimatedValue({ value, suffix = '', isProbability = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 22 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (!ref.current) return;
      if (isProbability) {
        ref.current.textContent = latest.toFixed(2);
      } else if (value % 1 !== 0) {
        ref.current.textContent = `${latest.toFixed(1)}${suffix}`;
      } else {
        ref.current.textContent = `${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
  }, [spring, suffix, value, isProbability]);

  return <span ref={ref}>0</span>;
}

export default function StatCard({ label, value, delta, trend, suffix = '', isProbability = false }) {
  const isUp = trend === 'up';
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="glass glass-border-gradient rounded-3xl p-5"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-ink-700/50 dark:text-white/40">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold text-ink-900 dark:text-white sm:text-3xl">
          <AnimatedValue value={value} suffix={suffix} isProbability={isProbability} />
        </p>
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
            isUp
              ? 'bg-risk-low/10 text-risk-low'
              : 'bg-risk-high/10 text-risk-high',
          )}
        >
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(delta)}%
        </span>
      </div>
    </motion.div>
  );
}
