import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../layouts/DashboardLayout';
import MetricCard from '../components/performance/MetricCard';
import ConfusionMatrix from '../components/performance/ConfusionMatrix';
import RocCurve from '../components/performance/RocCurve';
import ModelComparison from '../components/performance/ModelComparison';
import { modelMetrics as defaultModelMetrics } from '../data/modelInfo';
import { fetchModelInfo } from '../services/modelService';

export default function Performance() {
  const [metrics, setMetrics] = useState(defaultModelMetrics);
  const [modelName, setModelName] = useState('Random Forest');

  useEffect(() => {
    fetchModelInfo().then((res) => {
      if (res && res.modelMetrics) {
        setMetrics(res.modelMetrics);
        if (res.model_name) setModelName(res.model_name);
      }
    });
  }, []);

  const metricCards = [
    { label: 'Accuracy', value: metrics.accuracy, description: 'Overall correct predictions across the holdout set.' },
    { label: 'Precision', value: metrics.precision, description: 'Weighted precision across both classes as per python classification report.' },
    { label: 'Recall', value: metrics.recall, description: 'Weighted recall across both classes as per holdout evaluation.' },
    { label: 'F1 score', value: metrics.f1Score, description: 'Weighted harmonic mean of precision and recall (84% as per python file).' },
  ];

  return (
    <DashboardLayout
      badge="Model Validation & Benchmarks"
      title="Model performance"
      subtitle={`Validation metrics for the production model (${modelName}), tracked against a held-out test cohort.`}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metricCards.map((metric, i) => (
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

