import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import MetricCard from '../components/performance/MetricCard';
import ConfusionMatrix from '../components/performance/ConfusionMatrix';
import RocCurve from '../components/performance/RocCurve';
import ModelComparison from '../components/performance/ModelComparison';
import { modelMetrics } from '../data/modelInfo';

const METRICS = [
  { label: 'Accuracy', value: modelMetrics.accuracy, description: 'Overall correct predictions across the holdout set.' },
  { label: 'Precision', value: modelMetrics.precision, description: 'Of predicted defaults, how many actually defaulted.' },
  { label: 'Recall', value: modelMetrics.recall, description: 'Of actual defaults, how many the model caught.' },
  { label: 'F1 score', value: modelMetrics.f1Score, description: 'Harmonic balance of precision and recall.' },
];

export default function Performance() {
  return (
    <DashboardLayout
      badge="Model Validation & Benchmarks"
      title="Model performance"
      subtitle="Validation metrics for the production model, tracked against a held-out test cohort."
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {METRICS.map((metric, i) => (
          <MetricCard key={metric.label} {...metric} index={i} />
        ))}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConfusionMatrix />
        <RocCurve />
      </div>

      <div className="mt-6">
        <ModelComparison />
      </div>
    </DashboardLayout>
  );
}
