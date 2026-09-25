import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  WalletCards,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Download,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getRiskLevel } from '../../utils/constants';

export default function HistoryDetailModal({ record, onClose, onDelete }) {
  if (!record) return null;

  const { id, timestamp, applicant = {}, result = {} } = record;
  const probability = result.probability ?? result.default_probability ?? 0;
  const isDefault = (result.default_prediction ?? (probability >= 0.5 ? 1 : 0)) === 1;
  const riskLevel = result.riskLevel || getRiskLevel(probability);
  const contributions = Array.isArray(result.contributions) ? result.contributions : [];

  const handleDownloadSingleJSON = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `${id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink-900/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-ink-900/10 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-navy-950/95 sm:p-8 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-ink-900/10 pb-5 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  {id}
                </span>
                <span className="text-ink-400 dark:text-white/30">•</span>
                <span className="flex items-center gap-1 text-xs text-ink-700/60 dark:text-white/50">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(timestamp || result.scoredAt)}
                </span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-2xl">
                {applicant.fullName || 'Anonymous Applicant'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 text-ink-700 transition-colors hover:bg-ink-900/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-1 py-6 space-y-6">
            {/* Risk Banner */}
            <div className="rounded-2xl border border-ink-900/10 bg-ink-900/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ color: riskLevel.color, backgroundColor: `${riskLevel.color}1A` }}
                    >
                      {riskLevel.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        isDefault
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isDefault ? (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5" /> Flagged for Default Risk
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Low Default Risk / Recommended
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-700/70 dark:text-white/60">
                    Model Estimated Default Probability:
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">
                    {(probability * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-ink-700/50 dark:text-white/40">Threshold: 50.0%</p>
                </div>
              </div>

              {/* Probability meter bar */}
              <div className="mt-4">
                <div className="h-3 w-full overflow-hidden rounded-full bg-ink-900/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.max(probability * 100, 3), 100)}%`,
                      backgroundColor: riskLevel.color,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Grid (Personal, Financial, Credit) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Personal Details */}
              <div className="rounded-2xl border border-ink-900/10 p-4 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-3 text-violet-600 dark:text-violet-400">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Personal</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Age:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.Age} yrs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Education:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.Education}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Employment:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.EmploymentType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Months Employed:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.MonthsEmployed} mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Marital Status:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.MaritalStatus}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-700/60 dark:text-white/50">Dependents:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.HasDependents}</span>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="rounded-2xl border border-ink-900/10 p-4 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-3 text-teal-600 dark:text-teal-400">
                  <WalletCards className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Financials</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Loan Amount:</span>
                    <span className="font-bold text-ink-900 dark:text-white">
                      {formatCurrency(applicant.LoanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Annual Income:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">
                      {formatCurrency(applicant.Income)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Loan Term:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.LoanTerm} mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Interest Rate:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.InterestRate}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Purpose:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.LoanPurpose}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-700/60 dark:text-white/50">Has Mortgage:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.HasMortgage}</span>
                  </div>
                </div>
              </div>

              {/* Credit & Risk Details */}
              <div className="rounded-2xl border border-ink-900/10 p-4 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Credit Profile</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Credit Score:</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">
                      {applicant.CreditScore}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">DTI Ratio:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">
                      {(applicant.DTIRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Credit Lines:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">
                      {applicant.NumCreditLines}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-900/5 dark:border-white/5">
                    <span className="text-ink-700/60 dark:text-white/50">Co-Signer:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">{applicant.HasCoSigner}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-700/60 dark:text-white/50">Loan-to-Income:</span>
                    <span className="font-semibold text-ink-900 dark:text-white">
                      {applicant.Income ? ((applicant.LoanAmount / applicant.Income) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Attributions / SHAP Driver Breakdown */}
            {contributions.length > 0 && (
              <div className="rounded-2xl border border-ink-900/10 p-5 dark:border-white/10 bg-white/40 dark:bg-white/[0.02]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-900 dark:text-white">
                  SHAP Factor Attribution Drivers
                </h4>
                <p className="mt-1 text-xs text-ink-700/60 dark:text-white/50">
                  How individual applicant attributes pushed default risk higher (+) or lower (-).
                </p>

                <div className="mt-4 space-y-2.5">
                  {contributions.map((c) => {
                    const isPositive = c.impact > 0;
                    const width = Math.min(Math.abs(c.impact) * 220, 100);
                    return (
                      <div key={c.feature} className="flex items-center gap-3 text-xs">
                        <span className="w-36 truncate text-ink-700/80 dark:text-white/70 font-medium">
                          {c.feature}
                        </span>
                        <div className="h-2 flex-1 rounded-full bg-ink-900/10 dark:bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isPositive ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(width, 8)}%` }}
                          />
                        </div>
                        <span className="w-20 text-right font-medium">
                          {isPositive ? (
                            <span className="text-rose-500 inline-flex items-center gap-0.5">
                              <TrendingUp className="h-3 w-3" />+{(c.impact * 100).toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-emerald-500 inline-flex items-center gap-0.5">
                              <TrendingDown className="h-3 w-3" />
                              {(c.impact * 100).toFixed(1)}%
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/10 pt-4 dark:border-white/10">
            <button
              onClick={() => {
                onDelete(id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/20 dark:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Record
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSingleJSON}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-3.5 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-900/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              >
                <Download className="h-3.5 w-3.5" />
                Export JSON
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-full bg-accent-gradient px-5 py-2 text-xs font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
