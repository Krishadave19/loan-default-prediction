import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { monthlyPredictionTrend } from '../../data/statistics';
import { useTheme } from '../../context/ThemeContext';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-glass">
      <p className="font-semibold text-ink-900 dark:text-white">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="mt-0.5">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function PredictionChart() {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(20,23,31,0.08)';
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(20,23,31,0.45)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="glass glass-border-gradient rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Approvals vs. defaults</h3>
          <p className="text-xs text-ink-700/50 dark:text-white/40">Last 8 months</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-700/60 dark:text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Approved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-risk-high" /> Defaulted
          </span>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyPredictionTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" stroke={axisColor} tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke={axisColor} tickLine={false} axisLine={false} fontSize={12} width={36} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="approved"
              name="Approved"
              stroke="#6366F1"
              strokeWidth={2.5}
              fill="url(#approvedGradient)"
              animationDuration={1400}
            />
            <Area
              type="monotone"
              dataKey="defaulted"
              name="Defaulted"
              stroke="#F43F5E"
              strokeWidth={2.5}
              fill="url(#defaultGradient)"
              animationDuration={1400}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
