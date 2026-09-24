import { ShieldCheck, Gauge, Sparkles, LineChart, Lock, Layers } from 'lucide-react';

export const features = [
  {
    icon: Gauge,
    title: 'Real-time risk scoring',
    description: 'Every application is scored in under 200ms using a gradient-boosted ensemble trained on a decade of repayment behavior.',
  },
  {
    icon: ShieldCheck,
    title: 'Explainable by design',
    description: 'Each prediction ships with the feature contributions behind it, so underwriters see the "why," not just the number.',
  },
  {
    icon: LineChart,
    title: 'Continuously validated',
    description: 'Live accuracy, precision, and drift metrics are tracked against holdout cohorts and surfaced on the performance page.',
  },
  {
    icon: Layers,
    title: 'Portfolio-aware',
    description: 'Risk bands are calibrated against your active loan book, not a generic public dataset.',
  },
  {
    icon: Lock,
    title: 'Privacy-conscious',
    description: 'Applicant data is scored in-memory and never persisted beyond the audit trail your compliance team requires.',
  },
  {
    icon: Sparkles,
    title: 'Built for underwriters',
    description: 'A refined interface that turns a dense model into a decision you can make in seconds, not spreadsheets.',
  },
];
