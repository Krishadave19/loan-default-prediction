import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, TrendingDown, TrendingUp, Sliders, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InteractiveRiskSimulator() {
  const [loanAmount, setLoanAmount] = useState(15000);
  const [annualIncome, setAnnualIncome] = useState(65000);
  const [creditScore, setCreditScore] = useState(720);
  const [dtiRatio, setDtiRatio] = useState(25);

  // Compute calibrated simulated default probability
  const { probability, riskTier, factorImpacts } = useMemo(() => {
    // Baseline risk
    let logit = -1.2;

    // Credit score impact: 700 is neutral. 850 is -1.5, 300 is +2.5
    const creditDelta = (700 - creditScore) / 100;
    logit += creditDelta * 0.8;

    // DTI impact: 30% is neutral.
    const dtiDelta = (dtiRatio - 30) / 15;
    logit += dtiDelta * 0.7;

    // Loan to Income ratio impact:
    const lti = (loanAmount / Math.max(annualIncome, 10000));
    const ltiDelta = (lti - 0.25) * 1.5;
    logit += ltiDelta;

    // Sigmoid probability
    let prob = 1 / (1 + Math.exp(-logit));
    // Clamp between 0.02 and 0.96
    prob = Math.min(Math.max(prob, 0.02), 0.96);

    const probPercent = Math.round(prob * 1000) / 10;

    let tier = {
      label: 'Low Risk',
      color: 'text-emerald-500 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      badge: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      gaugeStroke: '#10B981',
      verdict: 'Preferred Approval: Highly qualified applicant with minimal repayment risk.',
    };

    if (probPercent > 33 && probPercent <= 66) {
      tier = {
        label: 'Moderate Risk',
        color: 'text-amber-500 dark:text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        badge: 'border-amber-500/30 text-amber-600 dark:text-amber-400',
        gaugeStroke: '#F59E0B',
        verdict: 'Conditional Review: Recommend debt verification or slight rate adjustment.',
      };
    } else if (probPercent > 66) {
      tier = {
        label: 'Elevated Risk',
        color: 'text-rose-500 dark:text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30',
        badge: 'border-rose-500/30 text-rose-600 dark:text-rose-400',
        gaugeStroke: '#F43F5E',
        verdict: 'High Default Likelihood: Exceeds standard institutional underwriting threshold.',
      };
    }

    const impacts = [
      {
        name: 'Credit Bureau Score',
        value: `${creditScore}`,
        impact: creditScore >= 700 ? 'Lowers Risk' : 'Raises Risk',
        isPositive: creditScore >= 700,
        pct: Math.abs(Math.round(((creditScore - 700) / 700) * 40)),
      },
      {
        name: 'Debt-to-Income (DTI)',
        value: `${dtiRatio}%`,
        impact: dtiRatio <= 30 ? 'Lowers Risk' : 'Raises Risk',
        isPositive: dtiRatio <= 30,
        pct: Math.abs(Math.round(((30 - dtiRatio) / 30) * 35)),
      },
      {
        name: 'Loan-to-Income Ratio',
        value: `${(lti * 100).toFixed(1)}%`,
        impact: lti <= 0.25 ? 'Lowers Risk' : 'Raises Risk',
        isPositive: lti <= 0.25,
        pct: Math.abs(Math.round(((0.25 - lti) / 0.25) * 30)),
      },
    ];

    return { probability: probPercent, riskTier: tier, factorImpacts: impacts };
  }, [loanAmount, annualIncome, creditScore, dtiRatio]);

  // Circumference for circular gauge
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
          <Calculator className="h-3.5 w-3.5" /> Interactive Sandbox
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl font-display">
          Live Loan Risk Simulator
        </h2>
        <p className="mt-4 text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
          Adjust the sliders below to see how our AI model recalibrates default probability in real time.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
        {/* Sliders Input Panel (7 cols) */}
        <div className="glass glass-border-gradient rounded-4xl p-6 sm:p-10 shadow-glass-lg lg:col-span-7">
          <div className="flex items-center justify-between border-b border-ink-900/10 dark:border-white/10 pb-5">
            <div className="flex items-center gap-2.5">
              <Sliders className="h-5 w-5 text-violet-500" />
              <h3 className="text-lg font-bold text-ink-900 dark:text-white">Applicant Parameters</h3>
            </div>
            <span className="text-xs text-ink-700/60 dark:text-white/50">Drag sliders to test</span>
          </div>

          <div className="mt-8 space-y-6">
            {/* Slider 1: Loan Amount */}
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-ink-900 dark:text-white">Requested Loan Amount</span>
                <span className="text-violet-600 dark:text-violet-300 font-mono text-base">
                  ${loanAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="mt-3 w-full h-2 rounded-lg bg-ink-900/10 dark:bg-white/10 accent-violet-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-700/50 dark:text-white/40">
                <span>$1,000</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>

            {/* Slider 2: Annual Income */}
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-ink-900 dark:text-white">Annual Gross Income</span>
                <span className="text-violet-600 dark:text-violet-300 font-mono text-base">
                  ${annualIncome.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="200000"
                step="2500"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="mt-3 w-full h-2 rounded-lg bg-ink-900/10 dark:bg-white/10 accent-violet-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-700/50 dark:text-white/40">
                <span>$15,000</span>
                <span>$100,000</span>
                <span>$200,000</span>
              </div>
            </div>

            {/* Slider 3: Credit Bureau Score */}
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-ink-900 dark:text-white">Credit Score (FICO)</span>
                <span className="text-violet-600 dark:text-violet-300 font-mono text-base">
                  {creditScore}
                </span>
              </div>
              <input
                type="range"
                min="350"
                max="850"
                step="5"
                value={creditScore}
                onChange={(e) => setCreditScore(Number(e.target.value))}
                className="mt-3 w-full h-2 rounded-lg bg-ink-900/10 dark:bg-white/10 accent-violet-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-700/50 dark:text-white/40">
                <span>350 (Subprime)</span>
                <span>650 (Near-Prime)</span>
                <span>850 (Exceptional)</span>
              </div>
            </div>

            {/* Slider 4: Debt to Income */}
            <div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-ink-900 dark:text-white">Debt-to-Income (DTI)</span>
                <span className="text-violet-600 dark:text-violet-300 font-mono text-base">
                  {dtiRatio}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="65"
                step="1"
                value={dtiRatio}
                onChange={(e) => setDtiRatio(Number(e.target.value))}
                className="mt-3 w-full h-2 rounded-lg bg-ink-900/10 dark:bg-white/10 accent-violet-500 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink-700/50 dark:text-white/40">
                <span>5% (Very Low)</span>
                <span>35% (Manageable)</span>
                <span>65% (Overburdened)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Risk Meter & SHAP Insights Panel (5 cols) */}
        <div className="glass glass-border-gradient rounded-4xl p-6 sm:p-10 shadow-glass-lg lg:col-span-5 flex flex-col justify-between">
          <div className="text-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${riskTier.badge}`}
            >
              {probability <= 33 ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {riskTier.label}
            </span>

            {/* Circular Gauge */}
            <div className="relative mx-auto mt-6 flex h-44 w-44 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-ink-900/10 dark:text-white/10 fill-none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={riskTier.gaugeStroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="fill-none transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold font-display ${riskTier.color}`}>
                  {probability}%
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-700/60 dark:text-white/50">
                  Default Risk
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-ink-700/80 dark:text-white/70 leading-relaxed px-2">
              {riskTier.verdict}
            </p>
          </div>

          {/* Factor Impact Mini Breakdown */}
          <div className="mt-6 border-t border-ink-900/10 dark:border-white/10 pt-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-900/70 dark:text-white/60">
              Key Driver Attribution (SHAP)
            </p>
            {factorImpacts.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-xs">
                <span className="text-ink-700/80 dark:text-white/70 font-medium">{f.name}</span>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="text-ink-900 dark:text-white">{f.value}</span>
                  <span className={`flex items-center gap-0.5 ${f.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {f.isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {f.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/prediction"
            className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-accent-gradient py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            <span>Score Full 15-Feature Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
