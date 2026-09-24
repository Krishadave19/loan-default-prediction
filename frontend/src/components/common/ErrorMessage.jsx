import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-risk-high/10 text-risk-high">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-ink-900 dark:text-white">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-violet-400/50 hover:text-violet-500 dark:border-white/10 dark:text-white/70"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
