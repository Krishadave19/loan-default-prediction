import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Award,
  Zap,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  GitBranch,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { modelComparison, thresholdSimulationData } from '../data/modelInfo';
import { useTheme } from '../context/ThemeContext';

const RADAR_DATA = [
  { metric: 'Accuracy', LogReg: 88.5, DecisionTree: 85.9, RandomForest: 91.4, KNN: 87.8 },
  { metric: 'Default Recall', LogReg: 3.0, DecisionTree: 22.0, RandomForest: 44.0, KNN: 18.0 },
  { metric: 'Precision', LogReg: 60.0, DecisionTree: 32.0, RandomForest: 74.0, KNN: 41.0 },
  { metric: 'ROC-AUC', LogReg: 76.2, DecisionTree: 68.4, RandomForest: 88.9, KNN: 71.8 },
  { metric: 'Inference Speed', LogReg: 98.0, DecisionTree: 92.0, RandomForest: 78.0, KNN: 35.0 },
  { metric: 'Interpretability', LogReg: 90.0, DecisionTree: 95.0, RandomForest: 60.0, KNN: 70.0 },
];

function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-xs shadow-glass border border-white/10 dark:border-white/20">
      <p className="font-bold text-ink-900 dark:text-white mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mt-0.5">
          <span style={{ color: entry.color }} className="font-medium">
            {entry.name}:
          </span>
          <span className="font-bold text-ink-900 dark:text-white">
            {typeof entry.value === 'number' && entry.value <= 1
              ? `${(entry.value * 100).toFixed(1)}%`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ModelComparisonPage() {
  const { theme } = useTheme();
  const [selectedModel, setSelectedModel] = useState(modelComparison[0]);
  const [chartView, setChartView] = useState('accuracy'); // 'accuracy', 'auc', 'radar'
  const [thresholdIndex, setThresholdIndex] = useState(2); // default index 2 is threshold 0.30

  const currentSim = thresholdSimulationData[thresholdIndex];

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(20,23,31,0.08)';
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(20,23,31,0.5)';

  return (
    <DashboardLayout
      badge="Model Validation & Multi-Algorithm Benchmark"
      title="Model Accuracy & Comparative Analysis"
      subtitle="In-depth comparative evaluation of Logistic Regression, Decision Trees, Random Forest, and K-Nearest Neighbors trained on 255,347 loan applications from loan.ipynb."
    >
      {/* Top Benchmark KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass glass-border-gradient rounded-3xl p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Champion Model</span>
            <Award className="h-5 w-5 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold font-display text-ink-900 dark:text-white">Random Forest</p>
          <p className="text-xs text-ink-700/60 dark:text-white/50 mt-1">
            <strong>91.42%</strong> Accuracy • <strong>0.889</strong> ROC-AUC
          </p>
        </div>

        <div className="glass glass-border-gradient rounded-3xl p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Linear Baseline</span>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold font-display text-ink-900 dark:text-white">Logistic Regression</p>
          <p className="text-xs text-ink-700/60 dark:text-white/50 mt-1">
            <strong>88.50%</strong> Accuracy • <strong>0.4ms</strong> Latency
          </p>
        </div>

        <div className="glass glass-border-gradient rounded-3xl p-5 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-500">Most Interpretable</span>
            <GitBranch className="h-5 w-5 text-teal-500" />
          </div>
          <p className="mt-2 text-2xl font-bold font-display text-ink-900 dark:text-white">Decision Tree</p>
          <p className="text-xs text-ink-700/60 dark:text-white/50 mt-1">
            <strong>85.92%</strong> Accuracy • <strong>22%</strong> Default Recall
          </p>
        </div>

        <div className="glass glass-border-gradient rounded-3xl p-5 border-l-4 border-l-pink-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500">Distance Metric</span>
            <Activity className="h-5 w-5 text-pink-500" />
          </div>
          <p className="mt-2 text-2xl font-bold font-display text-ink-900 dark:text-white">KNN (k=5)</p>
          <p className="text-xs text-ink-700/60 dark:text-white/50 mt-1">
            <strong>87.85%</strong> Accuracy • <strong>0.718</strong> ROC-AUC
          </p>
        </div>
      </div>

      {/* Main Charts & Visualizations Container */}
      <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8 mb-10 shadow-glass-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink-900/10 dark:border-white/10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-500">
              <Sparkles className="h-3.5 w-3.5" /> Direct loan.ipynb Output Re-creation
            </span>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-ink-900 dark:text-white font-display">
              Model Performance Comparison Chart
            </h3>
            <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
              Re-creating the exact <code>model_comparison</code> bar plot from Cell 85 with interactive multi-metric switching.
            </p>
          </div>

          <div className="flex items-center rounded-xl bg-ink-900/5 dark:bg-white/5 p-1 border border-ink-900/10 dark:border-white/10 shrink-0">
            <button
              onClick={() => setChartView('accuracy')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                chartView === 'accuracy'
                  ? 'bg-accent-gradient text-white shadow-sm'
                  : 'text-ink-700 dark:text-white/70 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              Accuracy Bar
            </button>
            <button
              onClick={() => setChartView('auc')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                chartView === 'auc'
                  ? 'bg-accent-gradient text-white shadow-sm'
                  : 'text-ink-700 dark:text-white/70 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              Accuracy vs ROC-AUC
            </button>
            <button
              onClick={() => setChartView('radar')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                chartView === 'radar'
                  ? 'bg-accent-gradient text-white shadow-sm'
                  : 'text-ink-700 dark:text-white/70 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              Multi-Metric Radar
            </button>
          </div>
        </div>

        {/* Visual Chart Area */}
        <div className="mt-6 h-80 sm:h-96 w-full">
          {chartView === 'accuracy' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="model"
                  stroke={axisColor}
                  tickLine={false}
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis
                  domain={[0.8, 0.95]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  stroke={axisColor}
                  tickLine={false}
                  fontSize={12}
                />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} />
                <Bar dataKey="accuracy" name="Accuracy" radius={[8, 8, 0, 0]} animationDuration={1000}>
                  {modelComparison.map((entry, idx) => {
                    const colors = ['#3B82F6', '#14B8A6', '#8B5CF6', '#EC4899'];
                    return <Cell key={entry.model} fill={colors[idx % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartView === 'auc' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="model" stroke={axisColor} tickLine={false} fontSize={12} />
                <YAxis
                  domain={[0.6, 1.0]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  stroke={axisColor}
                  tickLine={false}
                  fontSize={12}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend />
                <Bar dataKey="accuracy" name="Accuracy" fill="#6366F1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="auc" name="Area Under ROC (AUC)" fill="#A855F7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartView === 'radar' && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="75%" data={RADAR_DATA}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="metric" stroke={axisColor} fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={axisColor} fontSize={10} />
                <Radar name="Random Forest" dataKey="RandomForest" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                <Radar name="Logistic Regression" dataKey="LogReg" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                <Radar name="Decision Tree" dataKey="DecisionTree" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Complete Comparison Table */}
      <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8 mb-12 shadow-glass">
        <h3 className="text-xl font-bold text-ink-900 dark:text-white font-display mb-1">
          Detailed Performance Metric Matrix
        </h3>
        <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50 mb-6">
          Rigorous evaluation across 51,070 holdout test loan applications partitioned via stratified 80/20 split.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-ink-700/60 dark:text-white/50">
                <th className="pb-3 pr-4">Model Candidate</th>
                <th className="pb-3 px-3 text-center">Accuracy</th>
                <th className="pb-3 px-3 text-center">Default Recall</th>
                <th className="pb-3 px-3 text-center">Precision (Class 1)</th>
                <th className="pb-3 px-3 text-center">ROC-AUC</th>
                <th className="pb-3 px-3 text-center">Weighted F1</th>
                <th className="pb-3 px-3 text-center">Inference Latency</th>
                <th className="pb-3 pl-3 text-right">Banking Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5 dark:divide-white/5">
              {modelComparison.map((m) => (
                <tr
                  key={m.model}
                  onClick={() => setSelectedModel(m)}
                  className={`hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                    selectedModel.model === m.model ? 'bg-violet-500/10 dark:bg-violet-500/15' : ''
                  }`}
                >
                  <td className="py-4 pr-4 font-bold text-ink-900 dark:text-white flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        m.model.includes('Random')
                          ? 'bg-purple-500'
                          : m.model.includes('Logistic')
                          ? 'bg-blue-500'
                          : m.model.includes('Decision')
                          ? 'bg-teal-500'
                          : 'bg-pink-500'
                      }`}
                    />
                    <span>{m.model}</span>
                  </td>
                  <td className="py-4 px-3 text-center font-semibold text-ink-900 dark:text-white">
                    {(m.accuracy * 100).toFixed(2)}%
                  </td>
                  <td className="py-4 px-3 text-center font-semibold">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                        m.recall1 >= 0.4
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : m.recall1 >= 0.2
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {(m.recall1 * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center font-medium text-ink-700 dark:text-white/80">
                    {(m.precision1 * 100).toFixed(0)}%
                  </td>
                  <td className="py-4 px-3 text-center font-medium text-ink-700 dark:text-white/80">
                    {m.auc.toFixed(3)}
                  </td>
                  <td className="py-4 px-3 text-center font-medium text-ink-700 dark:text-white/80">
                    {m.weightedF1.toFixed(2)}
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-xs text-ink-700/70 dark:text-white/60">
                    {m.inferenceLatency}
                  </td>
                  <td className="py-4 pl-3 text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        m.model.includes('Random')
                          ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                          : m.model.includes('Logistic')
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                          : m.model.includes('Decision')
                          ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300'
                          : 'bg-pink-500/20 text-pink-700 dark:text-pink-300'
                      }`}
                    >
                      {m.model.includes('Random')
                        ? 'Production Champion'
                        : m.model.includes('Logistic')
                        ? 'Auditable Baseline'
                        : m.model.includes('Decision')
                        ? 'Rule Extractor'
                        : 'Experimental'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive Card */}
      <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8 mb-12 shadow-glass-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink-900/10 dark:border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Interactive Model Inspector
            </span>
            <h3 className="text-2xl font-bold text-ink-900 dark:text-white font-display">
              {selectedModel.model} Deep-Dive
            </h3>
            <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">{selectedModel.algorithm}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {modelComparison.map((m) => (
              <button
                key={m.model}
                onClick={() => setSelectedModel(m)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedModel.model === m.model
                    ? 'bg-accent-gradient text-white shadow-glow'
                    : 'glass text-ink-700 dark:text-white/70 hover:text-ink-900 dark:hover:text-white'
                }`}
              >
                {m.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Strengths & Weaknesses */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="h-4 w-4" /> Core Strengths
              </span>
              <p className="mt-2 text-xs sm:text-sm text-ink-700/80 dark:text-white/70 leading-relaxed">
                {selectedModel.strengths}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5 uppercase">
                <XCircle className="h-4 w-4" /> Key Limitations
              </span>
              <p className="mt-2 text-xs sm:text-sm text-ink-700/80 dark:text-white/70 leading-relaxed">
                {selectedModel.weaknesses}
              </p>
            </div>
          </div>

          {/* Column 2: Confusion Matrix */}
          <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-500">
              Holdout Confusion Matrix (51,070 Records)
            </span>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-base font-bold text-emerald-500">{selectedModel.matrix[0][0].toLocaleString()}</p>
                <p className="text-[10px] text-ink-700 dark:text-white/70">True Negative (Non-default)</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
                <p className="text-base font-bold text-rose-500">{selectedModel.matrix[0][1].toLocaleString()}</p>
                <p className="text-[10px] text-ink-700 dark:text-white/70">False Positive (False Alarm)</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
                <p className="text-base font-bold text-rose-500">{selectedModel.matrix[1][0].toLocaleString()}</p>
                <p className="text-[10px] text-ink-700 dark:text-white/70">False Negative (Missed Default)</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-base font-bold text-emerald-500">{selectedModel.matrix[1][1].toLocaleString()}</p>
                <p className="text-[10px] text-ink-700 dark:text-white/70">True Positive (Default Caught)</p>
              </div>
            </div>
            <div className="mt-4 text-[11px] text-ink-700/60 dark:text-white/50 leading-relaxed">
              <strong>Macro F1:</strong> {selectedModel.macroF1.toFixed(2)} • <strong>Weighted F1:</strong>{' '}
              {selectedModel.weightedF1.toFixed(2)} • <strong>Training Time:</strong> {selectedModel.trainingTime}
            </div>
          </div>

          {/* Column 3: Pipeline Code & Banking Verdict */}
          <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Pipeline Implementation</span>
              <div className="mt-2 rounded-xl bg-navy-950 p-3 font-mono text-[11px] text-emerald-400 break-all leading-relaxed">
                {selectedModel.pipelineCode}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ink-900/10 dark:border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900 dark:text-white">
                Underwriting Verdict:
              </span>
              <p className="mt-1 text-xs text-ink-700/80 dark:text-white/70 leading-relaxed font-medium">
                "{selectedModel.verdict}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Accuracy Paradox & Interactive Threshold Simulator */}
      <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8 mb-10 shadow-glass-lg border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink-900 dark:text-white font-display">
              The Accuracy Paradox & Dynamic Threshold Simulator
            </h3>
            <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
              Why 88.5% accuracy isn't enough in banking — and how lowering the decision cutoff protects capital.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>The Core Dilemma:</strong> In our dataset, 88.39% of applicants do not default. Standard classification algorithms defaults to a <code>0.50</code> threshold, predicting "No Default" almost universally. While achieving 88.5% accuracy, the bank suffers devastating credit losses by failing to catch 97% of defaulting borrowers.
        </div>

        {/* Interactive Threshold Slider */}
        <div className="mt-8 rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Interactive Threshold</span>
              <p className="text-lg font-bold text-ink-900 dark:text-white">
                Decision Cutoff: <span className="text-violet-500 font-mono">{currentSim.threshold.toFixed(2)}</span>
              </p>
            </div>
            <p className="text-xs text-ink-700/60 dark:text-white/50">
              Drag to observe the shift in Default Recall vs Approval Rate:
            </p>
          </div>

          <input
            type="range"
            min="0"
            max={thresholdSimulationData.length - 1}
            value={thresholdIndex}
            onChange={(e) => setThresholdIndex(Number(e.target.value))}
            className="w-full h-2.5 bg-ink-900/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />

          <div className="flex justify-between text-[11px] font-mono text-ink-700/60 dark:text-white/40 mt-1">
            <span>0.10 (Aggressive Risk Block)</span>
            <span>0.30 (Recommended Bank Calibrated)</span>
            <span>0.60 (Lax / High Loss)</span>
          </div>

          {/* Dynamic Impact Display */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Default Recall
              </span>
              <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-1">
                {(currentSim.defaultRecall * 100).toFixed(0)}%
              </p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50 mt-0.5">Defaulters flagged</p>
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Loan Approval Rate
              </span>
              <p className="text-2xl font-bold font-display text-indigo-600 dark:text-indigo-400 mt-1">
                {(currentSim.approvalRate * 100).toFixed(0)}%
              </p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50 mt-0.5">Applicants approved</p>
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Credit Loss Prevented
              </span>
              <p className="text-2xl font-bold font-display text-violet-600 dark:text-violet-400 mt-1">
                {currentSim.bankLossSaved}%
              </p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50 mt-0.5">Bad debt avoided</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                False Rejections
              </span>
              <p className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400 mt-1">
                {currentSim.falseRejections}%
              </p>
              <p className="text-[11px] text-ink-700/60 dark:text-white/50 mt-0.5">Good borrowers declined</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation CTA footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-ink-900/10 dark:border-white/10 glass p-6">
        <div>
          <h4 className="font-bold text-ink-900 dark:text-white text-base">
            Want to test an individual borrower profile?
          </h4>
          <p className="text-xs text-ink-700/60 dark:text-white/50">
            Use the real-time scoring simulator with continuous risk gauges and SHAP feature attribution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/summary"
            className="rounded-full border border-ink-900/10 dark:border-white/10 glass px-5 py-2.5 text-xs font-bold text-ink-900 dark:text-white hover:border-violet-500/40 transition-colors"
          >
            Review Project Summary
          </Link>
          <Link
            to="/prediction"
            className="rounded-full bg-accent-gradient px-5 py-2.5 text-xs font-bold text-white shadow-glow transition-transform hover:scale-105"
          >
            Score an Applicant →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
