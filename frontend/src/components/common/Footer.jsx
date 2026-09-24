import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, TrendingUp, GitBranch, Layers } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';

const SOCIALS = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="relative mt-28 border-t border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-950/60 backdrop-blur-xl">
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-sm font-bold text-white shadow-glow">
                N
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink-900 dark:text-white">
                Nimbus
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-700/75 dark:text-white/60">
              An institutional-grade credit risk intelligence engine that replaces black-box scoring
              with transparent, calibrated default probabilities and SHAP explainability.
            </p>

            {/* Model Status Pill */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Model Engine: Operational (184ms avg)</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-white/50 text-ink-700 transition-all hover:-translate-y-1 hover:border-violet-400 hover:text-violet-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-violet-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-900/70 dark:text-white/70">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-ink-700/80 transition-colors hover:text-violet-600 dark:text-white/60 dark:hover:text-violet-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Machine Learning Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-900/70 dark:text-white/70">
              ML Pipeline (loan.ipynb)
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700/80 dark:text-white/60">
              <li className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                <Link to="/summary" className="hover:text-blue-500 transition-colors">
                  Logistic Regression (88.50%)
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <GitBranch className="h-3.5 w-3.5 text-teal-500" />
                <Link to="/summary" className="hover:text-teal-500 transition-colors">
                  Decision Tree (85.92%)
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-purple-500" />
                <Link to="/model-comparison" className="hover:text-purple-500 transition-colors">
                  Random Forest (91.42%)
                </Link>
              </li>
              <li>
                <Link
                  to="/model-comparison"
                  className="inline-block text-xs font-semibold text-violet-500 hover:underline dark:text-violet-300"
                >
                  Model Accuracy & Comparison →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-900/70 dark:text-white/70">
              Company
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-ink-700/80 transition-colors hover:text-violet-600 dark:text-white/60 dark:hover:text-violet-300"
                >
                  About the Project
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-ink-700/80 transition-colors hover:text-violet-600 dark:text-white/60 dark:hover:text-violet-300"
                >
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-ink-700/80 transition-colors hover:text-violet-600 dark:text-white/60 dark:hover:text-violet-300"
                >
                  Methodology & Audit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink-900/10 pt-8 text-xs text-ink-700/60 dark:border-white/10 dark:text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Nimbus Credit Intelligence. Open Research Project.</p>
          <div className="flex items-center gap-4">
            <span>Fair Lending Compliant (ECOA / FCRA)</span>
            <span>•</span>
            <span>Predictions are decision support, not financial advice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
