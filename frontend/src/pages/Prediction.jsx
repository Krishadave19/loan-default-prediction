import DashboardLayout from '../layouts/DashboardLayout';
import PredictionForm from '../components/prediction/PredictionForm';
import { BarChart3, Check, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

export default function Prediction() {
  return (
    <DashboardLayout
      badge="Live Inference Engine"
      title="Score a new applicant"
      subtitle="Walk through personal, financial, and credit details to generate a calibrated default probability and full SHAP factor attribution."
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr),280px] lg:items-start">
        <PredictionForm />

        <aside className="order-first overflow-hidden rounded-3xl border border-ink-900/10 bg-white/45 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:order-none lg:sticky lg:top-28">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready
            </span>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink-900 dark:text-white">
            A clearer credit decision
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700/65 dark:text-white/55">
            Build a complete applicant profile and get a calibrated risk signal in seconds.
          </p>

          <div className="mt-6 space-y-3 border-t border-ink-900/10 pt-5 dark:border-white/10">
            {[
              ['Calibrated probability', Sparkles],
              ['Transparent factor drivers', ShieldCheck],
              ['Model-ready 16-feature profile', Check],
            ].map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-2.5 text-xs font-medium text-ink-700/75 dark:text-white/65">
                <Icon className="h-4 w-4 shrink-0 text-violet-500" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-ink-900/[0.04] p-3 text-[11px] leading-relaxed text-ink-700/60 dark:bg-white/[0.05] dark:text-white/50">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
            Your inputs stay within this scoring session and are used only to generate the prediction.
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
