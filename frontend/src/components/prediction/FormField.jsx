import { cn } from '../../utils/cn';

export default function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-700/85 dark:text-white/75">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-risk-high">{error}</p>}
    </label>
  );
}

export function baseInputClasses(hasError) {
  return cn(
    'min-h-11 w-full rounded-xl border bg-white/70 px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-700/45 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:bg-navy-900/80 dark:text-white dark:placeholder:text-white/35',
    hasError ? 'border-risk-high/60' : 'border-ink-900/10 dark:border-white/10',
  );
}
