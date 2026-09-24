import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NAV_LINKS } from '../../utils/constants';
import { cn } from '../../utils/cn';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-ink-900/10 bg-white/60 text-ink-900 transition-colors hover:border-violet-400/50 dark:border-white/10 dark:bg-white/5 dark:text-white"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 theme-fade',
        scrolled
          ? 'border-b border-ink-900/5 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-navy-950/70'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-sm font-bold text-white shadow-glow">
            N
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-white">
            LoanLens
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-full px-2.5 py-1.5 xl:px-3.5 xl:py-2 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'text-ink-900 dark:text-white font-semibold'
                    : 'text-ink-700/70 hover:text-ink-900 dark:text-white/60 dark:hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-accent-gradient"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/prediction"
            className="group hidden items-center gap-1.5 rounded-full bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Run a prediction
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 text-ink-900 dark:border-white/10 dark:text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-ink-900/5 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-navy-950/95 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-accent-gradient text-white'
                        : 'text-ink-700 dark:text-white/70',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
