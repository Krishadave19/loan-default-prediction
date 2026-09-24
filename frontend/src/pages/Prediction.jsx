import DashboardLayout from '../layouts/DashboardLayout';
import PredictionForm from '../components/prediction/PredictionForm';

export default function Prediction() {
  return (
    <DashboardLayout
      badge="Live Inference Engine"
      title="Score a new applicant"
      subtitle="Walk through personal, financial, and credit details to generate a calibrated default probability and full SHAP factor attribution."
    >
      <div className="mx-auto max-w-3xl">
        <PredictionForm />
      </div>
    </DashboardLayout>
  );
}
