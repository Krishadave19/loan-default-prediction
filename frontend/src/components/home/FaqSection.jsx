import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'How does default probability differ from a standard credit score?',
    answer:
      'A credit score (like FICO) is a generic three-digit index measuring historical credit behavior across all debt types. In contrast, Nimbus predicts the exact mathematical probability (e.g. 14.2%) that a specific applicant will default on this specific loan term and amount, calibrated against recent macroeconomic conditions.',
  },
  {
    question: 'How accurate is the Nimbus machine learning model?',
    answer:
      'The production model achieves an 88.5% cross-validated ROC-AUC and 89.2% accuracy on our held-out test cohort of over 96,000 scored loans. Most importantly, the model is probability-calibrated using isotonic regression — meaning out of 100 applicants predicted at 20% risk, exactly 20 historically defaulted.',
  },
  {
    question: 'What factors contribute most to a high default risk prediction?',
    answer:
      'While the model evaluates 40+ dynamic features, the strongest statistical predictors are Debt-to-Income (DTI) ratio exceeding 45%, revolving credit line utilization above 75%, multiple recent 30+ day delinquencies, and a Loan-to-Income ratio over 35%.',
  },
  {
    question: 'Are the SHAP explainability outputs compliant with ECOA and FCRA regulations?',
    answer:
      'Yes. The Equal Credit Opportunity Act (ECOA) and Fair Credit Reporting Act (FCRA) mandate that adverse lending decisions must be accompanied by key principal reason codes. Nimbus computes exact TreeSHAP values for each inference, identifying the top factors that negatively influenced the score for automated adverse action notice generation.',
  },
  {
    question: 'Can underwriters override an automated prediction?',
    answer:
      'Absolutely. Nimbus operates as an underwriter decision support intelligence layer, not an autonomous gatekeeper. Underwriters can review the SHAP attribution chart, inspect raw financial documents, and approve conditional exceptions in accordance with internal bank credit policy.',
  },
  {
    question: 'How does Nimbus prevent algorithmic bias and demographic drift?',
    answer:
      'The model excludes protected demographic attributes (race, gender, marital status, zip code proxies). Furthermore, automated weekly bias audits monitor disparate impact ratios, while continuous population stability index (PSI) tracking alerts the team if applicant distributions shift.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
          <HelpCircle className="h-3.5 w-3.5" /> Common Inquiries
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl font-display">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-base text-ink-700/75 dark:text-white/65 leading-relaxed">
          Clear answers about default modeling, algorithmic fairness, and underwriter workflows.
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="glass glass-border-gradient overflow-hidden rounded-2xl transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/40 dark:hover:bg-white/5"
              >
                <span className="text-base font-bold text-ink-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-violet-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="border-t border-ink-900/5 dark:border-white/5 p-6 pt-3 text-sm text-ink-700/80 dark:text-white/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
