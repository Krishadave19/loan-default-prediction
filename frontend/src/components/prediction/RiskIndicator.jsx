import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { getRiskLevel } from '../../utils/constants';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RiskIndicator({ probability = 0 }) {
  const risk = getRiskLevel(probability);
  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, (p) => CIRCUMFERENCE * (1 - p));
  const color = useTransform(
    progress,
    [0, 0.33, 0.66, 1],
    ['#10B981', '#10B981', '#F59E0B', '#F43F5E'],
  );

  useEffect(() => {
    const controls = animate(progress, probability, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [probability, progress]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            strokeWidth="12"
            className="stroke-ink-900/[0.08] dark:stroke-white/[0.08]"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            style={{ stroke: color, strokeDasharray: CIRCUMFERENCE, strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={risk.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-semibold text-ink-900 dark:text-white"
          >
            {Math.round(probability * 100)}%
          </motion.span>
          <span className="mt-1 text-[11px] uppercase tracking-wider text-ink-700/50 dark:text-white/40">
            default risk
          </span>
        </div>
        <motion.span
          className="absolute inset-6 rounded-full"
          style={{ boxShadow: `0 0 0 0 ${risk.color}` }}
          animate={{ boxShadow: [`0 0 0 0 ${risk.color}55`, `0 0 0 16px ${risk.color}00`] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      </div>
      <motion.span
        key={risk.label}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-full px-3.5 py-1 text-sm font-semibold"
        style={{ color: risk.color, backgroundColor: `${risk.color}1A` }}
      >
        {risk.label}
      </motion.span>
    </div>
  );
}
