import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { riskDistribution } from '../../data/statistics';

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-glass">
      <p className="font-semibold text-ink-900 dark:text-white">{entry.name}</p>
      <p style={{ color: entry.payload.color }}>{entry.value}% of portfolio</p>
    </div>
  );
}

export default function RiskChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass glass-border-gradient rounded-3xl p-5 sm:p-6"
    >
      <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Portfolio risk mix</h3>
      <p className="text-xs text-ink-700/50 dark:text-white/40">Current active loan book</p>

      <div className="relative mt-2 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              animationDuration={1200}
              startAngle={90}
              endAngle={-270}
            >
              {riskDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-semibold text-ink-900 dark:text-white">62%</p>
          <p className="text-[11px] text-ink-700/50 dark:text-white/40">Low risk</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-xs">
        {riskDistribution.map((entry) => (
          <span key={entry.name} className="flex items-center gap-1.5 text-ink-700/70 dark:text-white/55">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
