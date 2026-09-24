import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const COLUMNS = [
  { key: 'id', label: 'Loan ID' },
  { key: 'creditScore', label: 'Credit score' },
  { key: 'annualIncome', label: 'Annual income' },
  { key: 'loanAmount', label: 'Loan amount' },
  { key: 'term', label: 'Term (mo)' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'defaulted', label: 'Outcome' },
];

export default function DatasetTable({ rows = [] }) {
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="glass glass-border-gradient overflow-hidden rounded-3xl">
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white/85 backdrop-blur-xl dark:bg-navy-900/90">
            <tr>
              {COLUMNS.map((col) => {
                const isActive = sortKey === col.key;
                return (
                  <th key={col.key} className="border-b border-ink-900/[0.08] px-4 py-3 text-left dark:border-white/[0.08]">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-ink-700/55 transition-colors hover:text-violet-500 dark:text-white/45"
                    >
                      {col.label}
                      {isActive ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {sortedRows.map((row) => (
                <motion.tr
                  key={row.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="group border-b border-ink-900/5 transition-colors hover:bg-violet-500/[0.04] dark:border-white/5 dark:hover:bg-violet-400/[0.06]"
                >
                  <td className="px-4 py-3 font-medium text-ink-900 dark:text-white">{row.id}</td>
                  <td className="px-4 py-3 text-ink-700/75 dark:text-white/60">{row.creditScore}</td>
                  <td className="px-4 py-3 text-ink-700/75 dark:text-white/60">
                    {formatCurrency(row.annualIncome)}
                  </td>
                  <td className="px-4 py-3 text-ink-700/75 dark:text-white/60">
                    {formatCurrency(row.loanAmount)}
                  </td>
                  <td className="px-4 py-3 text-ink-700/75 dark:text-white/60">{row.term}</td>
                  <td className="px-4 py-3 text-ink-700/75 dark:text-white/60">{row.purpose}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        row.defaulted
                          ? 'bg-risk-high/10 text-risk-high'
                          : 'bg-risk-low/10 text-risk-low',
                      )}
                    >
                      {row.defaulted ? 'Defaulted' : 'Repaid'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {sortedRows.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-ink-700/50 dark:text-white/40">
            No records match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
