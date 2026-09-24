import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { rocCurve, modelMetrics } from '../../data/modelInfo';
import { useTheme } from '../../context/ThemeContext';

function RocTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { fpr, tpr } = payload[0].payload;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-glass">
      <p className="text-ink-900 dark:text-white">FPR: {fpr}</p>
      <p className="text-violet-500 dark:text-violet-300">TPR: {tpr}</p>
    </div>
  );
}

export default function RocCurve() {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(20,23,31,0.08)';
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(20,23,31,0.45)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass glass-border-gradient flex flex-col rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-white">ROC curve</h3>
          <p className="text-xs text-ink-700/50 dark:text-white/40">True vs. false positive rate</p>
        </div>
        <span className="rounded-full bg-accent-gradient px-3 py-1 text-xs font-semibold text-white shadow-glow">
          AUC {modelMetrics.auc.toFixed(3)}
        </span>
      </div>

      <div className="mt-4 min-h-[16rem] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rocCurve} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="fpr"
              type="number"
              domain={[0, 1]}
              stroke={axisColor}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              domain={[0, 1]}
              stroke={axisColor}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={40}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <Tooltip content={<RocTooltip />} />
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
              stroke={axisColor}
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey="tpr"
              stroke="#A855F7"
              strokeWidth={2.5}
              dot={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
