import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search by ID or purpose…' }) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/35" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink-900/10 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-700/35 focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25"
      />
    </div>
  );
}
