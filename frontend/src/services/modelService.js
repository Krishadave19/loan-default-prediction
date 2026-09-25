import { api } from './api';
import {
  modelMetrics as defaultModelMetrics,
  modelComparison as defaultModelComparison,
  confusionMatrix as defaultConfusionMatrix,
  rocCurve as defaultRocCurve,
  datasetOverview as defaultDatasetOverview,
} from '../data/modelInfo';

let _cachedModelData = null;
let _cachedOverview = null;

export async function fetchModelInfo() {
  if (_cachedModelData) return _cachedModelData;
  try {
    const data = await api.get('/model-info');
    if (data && data.metrics) {
      const m = data.metrics.champion_metrics || {};
      const res = {
        model_name: data.model_name || 'Random Forest',
        features: data.features || [],
        modelMetrics: {
          accuracy: m.accuracy ?? 0.885,
          precision: m.precision ?? 0.854,
          recall: m.recall ?? 0.885,
          f1Score: m.f1Score ?? m.f1_weighted ?? 0.837,
          auc: m.auc ?? 0.762,
          f1_weighted: m.f1_weighted ?? 0.837,
          f1_macro: m.f1_macro ?? 0.501,
          class0_f1: m.f1_0 ?? 0.939,
          class1_f1: m.f1_1 ?? 0.063,
        },
        modelComparison: Array.isArray(data.metrics.results) && data.metrics.results.length > 0
          ? data.metrics.results
          : defaultModelComparison,
        confusionMatrix: data.metrics.confusion_matrix || defaultConfusionMatrix,
        rocCurve: data.metrics.roc_curve || defaultRocCurve,
      };
      _cachedModelData = res;
      return res;
    }
  } catch (err) {
    console.info('Backend /model-info not reached, using local verified dataset metrics:', err.message);
  }

  return {
    model_name: 'Random Forest',
    modelMetrics: defaultModelMetrics,
    modelComparison: defaultModelComparison,
    confusionMatrix: defaultConfusionMatrix,
    rocCurve: defaultRocCurve,
  };
}

export async function fetchDatasetOverview() {
  if (_cachedOverview) return _cachedOverview;
  try {
    const data = await api.get('/dataset/overview');
    if (data && data.totalRows) {
      _cachedOverview = data;
      return data;
    }
  } catch (err) {
    console.info('Backend /dataset/overview not reached, using local overview:', err.message);
  }
  return defaultDatasetOverview;
}
