import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { modelComparison } from '../../data/modelInfo';
import { useTheme } from '../../context/ThemeContext';

function ComparisonTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-glass">
      <p className="font-semibold text-ink-900 dark:text-white">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="mt-0.5">
          {entry.name}: {(entry.value * 100).toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export default function ModelComparison() {
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(20,23,31,0.08)';
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(20,23,31,0.45)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass glass-border-gradient rounded-3xl p-6"
    >
      <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Model comparison</h3>
      <p className="text-xs text-ink-700/50 dark:text-white/40">Accuracy and AUC across candidate models</p>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={modelComparison} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="model"
              stroke={axisColor}
              tickLine={false}
              axisLine={false}
              fontSize={11}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={56}
            />
            <YAxis
              domain={[0, 1]}
              stroke={axisColor}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={40}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(168,85,247,0.06)' }} />
            <Bar dataKey="accuracy" name="Accuracy" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {modelComparison.map((entry) => (
                <Cell
                  key={entry.model}
                  fill={entry.model.includes('Random Forest') ? '#6366F1' : '#6366F180'}
                />
              ))}
            </Bar>
            <Bar dataKey="auc" name="AUC" radius={[8, 8, 0, 0]} animationDuration={1000} animationBegin={150}>
              {modelComparison.map((entry) => (
                <Cell
                  key={entry.model}
                  fill={entry.model.includes('Random Forest') ? '#A855F7' : '#A855F780'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-ink-900/10 dark:border-white/10 flex items-center justify-between text-xs">
        <span className="text-ink-700/60 dark:text-white/50">Trained on 255,347 records</span>
        <Link
          to="/model-comparison"
          className="font-bold text-violet-500 hover:text-violet-600 dark:text-violet-300 transition-colors"
        >
          Detailed Comparison & Thresholds →
        </Link>
      </div>
    </motion.div>
  );
}
