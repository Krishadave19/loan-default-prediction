import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getRiskLevel } from '../../utils/constants';

const ITEMS_PER_PAGE = 10;

export default function HistoryTable({ records = [], onSelectRecord, onDeleteRecord }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecords = records.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="glass glass-border-gradient rounded-3xl overflow-hidden">
      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/10 dark:border-white/10 bg-ink-900/[0.02] dark:bg-white/[0.02] text-xs font-semibold text-ink-700/70 dark:text-white/60 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Applicant / ID</th>
              <th className="px-6 py-4">Loan Request</th>
              <th className="px-6 py-4">Financials & Score</th>
              <th className="px-6 py-4">Default Risk</th>
              <th className="px-6 py-4">Decision Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5 dark:divide-white/5">
            {currentRecords.map((record, index) => {
              const { id, timestamp, applicant = {}, result = {} } = record;
              const prob = result.probability ?? result.default_probability ?? 0;
              const isDefault = (result.default_prediction ?? (prob >= 0.5 ? 1 : 0)) === 1;
              const risk = result.riskLevel || getRiskLevel(prob);

              return (
                <motion.tr
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="group transition-colors hover:bg-ink-900/[0.02] dark:hover:bg-white/[0.02] cursor-pointer"
                  onClick={() => onSelectRecord(record)}
                >
                  {/* Applicant / ID */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-ink-900 dark:text-white">
                      {applicant.fullName || 'Anonymous Applicant'}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-700/50 dark:text-white/40">
                      <span className="font-mono text-[11px] text-violet-600 dark:text-violet-400">
                        {id}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(timestamp || result.scoredAt)}
                      </span>
                    </div>
                  </td>

                  {/* Loan Request */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-ink-900 dark:text-white">
                      {formatCurrency(applicant.LoanAmount)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-700/60 dark:text-white/50">
                      <span className="rounded-md bg-ink-900/5 dark:bg-white/5 px-1.5 py-0.5 font-medium">
                        {applicant.LoanPurpose}
                      </span>
                      <span>{applicant.LoanTerm} mo</span>
                      <span>@ {applicant.InterestRate}%</span>
                    </div>
                  </td>

                  {/* Financials & Credit */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-700/70 dark:text-white/60">Score:</span>
                      <span className="font-bold text-violet-600 dark:text-violet-400">
                        {applicant.CreditScore}
                      </span>
                      <span className="text-ink-400 dark:text-white/30">•</span>
                      <span className="text-xs text-ink-700/70 dark:text-white/60">
                        Inc: {formatCurrency(applicant.Income)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-ink-700/50 dark:text-white/40">
                      DTI: {(applicant.DTIRatio * 100).toFixed(1)}% | {applicant.EmploymentType}
                    </div>
                  </td>

                  {/* Default Risk & Probability */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ color: risk.color, backgroundColor: `${risk.color}18` }}
                      >
                        {risk.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-ink-900 dark:text-white">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-ink-900/10 dark:bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(Math.max(prob * 100, 4), 100)}%`,
                          backgroundColor: risk.color,
                        }}
                      />
                    </div>
                  </td>

                  {/* Decision Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isDefault
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isDefault ? (
                        <>
                          <AlertTriangle className="h-3 w-3" /> Flagged Default
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Low Risk
                        </>
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectRecord(record)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 transition-colors hover:border-violet-500/40 hover:text-violet-600 dark:border-white/10 dark:text-white/70 dark:hover:text-violet-400"
                        title="View Full Audit"
                        aria-label="View Full Audit"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 transition-colors hover:border-rose-500/40 hover:text-rose-600 dark:border-white/10 dark:text-white/70 dark:hover:text-rose-400"
                        title="Delete Record"
                        aria-label="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden divide-y divide-ink-900/10 dark:divide-white/10">
        {currentRecords.map((record) => {
          const { id, timestamp, applicant = {}, result = {} } = record;
          const prob = result.probability ?? result.default_probability ?? 0;
          const isDefault = (result.default_prediction ?? (prob >= 0.5 ? 1 : 0)) === 1;
          const risk = result.riskLevel || getRiskLevel(prob);

          return (
            <div
              key={id}
              onClick={() => onSelectRecord(record)}
              className="p-4 transition-colors active:bg-ink-900/5 dark:active:bg-white/5 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-ink-900 dark:text-white">
                    {applicant.fullName || 'Anonymous Applicant'}
                  </h4>
                  <p className="font-mono text-[11px] text-violet-600 dark:text-violet-400">{id}</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0"
                  style={{ color: risk.color, backgroundColor: `${risk.color}18` }}
                >
                  {risk.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-700/60 dark:text-white/50">Loan: </span>
                  <span className="font-semibold text-ink-900 dark:text-white">
                    {formatCurrency(applicant.LoanAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-ink-700/60 dark:text-white/50">Credit Score: </span>
                  <span className="font-semibold text-ink-900 dark:text-white">
                    {applicant.CreditScore}
                  </span>
                </div>
                <div>
                  <span className="text-ink-700/60 dark:text-white/50">Income: </span>
                  <span className="font-semibold text-ink-900 dark:text-white">
                    {formatCurrency(applicant.Income)}
                  </span>
                </div>
                <div>
                  <span className="text-ink-700/60 dark:text-white/50">Default Prob: </span>
                  <span className="font-bold text-ink-900 dark:text-white">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-ink-900/5 dark:border-white/5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isDefault
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isDefault ? 'Flagged Default' : 'Low Risk'}
                </span>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectRecord(record)}
                    className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button
                    onClick={() => onDeleteRecord(id)}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 ml-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-ink-900/10 dark:border-white/10 px-6 py-4">
          <p className="text-xs text-ink-700/60 dark:text-white/50">
            Showing <span className="font-semibold text-ink-900 dark:text-white">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-ink-900 dark:text-white">
              {Math.min(startIndex + ITEMS_PER_PAGE, records.length)}
            </span>{' '}
            of <span className="font-semibold text-ink-900 dark:text-white">{records.length}</span> predictions
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink-900/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-ink-900 dark:text-white px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink-900/10 text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink-900/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
