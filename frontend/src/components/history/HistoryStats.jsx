import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Database, Percent } from 'lucide-react';

export default function HistoryStats({ records = [] }) {
  const total = records.length;

  const highRiskCount = records.filter(
    (r) =>
      r.result?.default_prediction === 1 ||
      (r.result?.probability ?? r.result?.default_probability ?? 0) >= 0.5
  ).length;

  const lowRiskCount = total - highRiskCount;

  const avgProbability =
    total > 0
      ? (
          (records.reduce(
            (acc, r) => acc + (r.result?.probability ?? r.result?.default_probability ?? 0),
            0
          ) /
            total) *
          100
        ).toFixed(1)
      : '0.0';

  const highRiskPct = total > 0 ? ((highRiskCount / total) * 100).toFixed(0) : '0';
  const lowRiskPct = total > 0 ? ((lowRiskCount / total) * 100).toFixed(0) : '0';

  const stats = [
    {
      label: 'Total Stored Predictions',
      value: total.toLocaleString(),
      subtext: 'Evaluated applicant profiles',
      icon: Database,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      label: 'Flagged for Default',
      value: highRiskCount.toLocaleString(),
      subtext: `${highRiskPct}% of evaluated applicants`,
      icon: ShieldAlert,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'Low / Moderate Risk',
      value: lowRiskCount.toLocaleString(),
      subtext: `${lowRiskPct}% viable approvals`,
      icon: ShieldCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Avg Default Probability',
      value: `${avgProbability}%`,
      subtext: 'Portfolio cross-sectional risk',
      icon: Percent,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="glass glass-border-gradient rounded-3xl p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-700/60 dark:text-white/50">
              {stat.label}
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-ink-900 dark:text-white">
            {stat.value}
          </p>
          <p className="mt-1 text-[11px] text-ink-700/50 dark:text-white/40">{stat.subtext}</p>
        </motion.div>
      ))}
    </div>
  );
}
