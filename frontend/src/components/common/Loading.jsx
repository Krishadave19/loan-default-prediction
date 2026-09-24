import { motion } from 'framer-motion';

export function Spinner({ className = '' }) {
  return (
    <div className={`relative h-10 w-10 ${className}`}>
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#6366F1', borderRightColor: '#A855F7' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <span className="absolute inset-2 rounded-full bg-accent-gradient opacity-20" />
    </div>
  );
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`shimmer-bg animate-shimmer rounded-2xl ${className}`} />;
}

export default function Loading({ label = 'Loading', fullscreen = false }) {
  return (
    <div
      className={
        fullscreen
          ? 'flex min-h-[60vh] flex-col items-center justify-center gap-4'
          : 'flex flex-col items-center justify-center gap-3 py-12'
      }
    >
      <Spinner />
      <p className="text-sm font-medium text-ink-700/60 dark:text-white/50">{label}…</p>
    </div>
  );
}
