import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-8xl font-bold text-gradient"
      >
        404
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-xl font-semibold text-ink-900 dark:text-white"
      >
        This page didn't make the cut
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 max-w-sm text-sm text-ink-700/60 dark:text-white/50"
      >
        The page you're looking for doesn't exist or has moved.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
