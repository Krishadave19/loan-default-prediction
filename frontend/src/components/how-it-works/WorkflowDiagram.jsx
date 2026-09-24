import { motion } from 'framer-motion';
import { FileInput, Cog, BrainCircuit, ScanSearch, FileCheck2 } from 'lucide-react';
import { processSteps } from '../../data/modelInfo';

const ICONS = [FileInput, Cog, BrainCircuit, ScanSearch, FileCheck2];

export default function WorkflowDiagram() {
  const nodes = processSteps.map((step, i) => ({ ...step, Icon: ICONS[i] ?? Cog }));

  return (
    <div className="glass glass-border-gradient overflow-x-auto rounded-4xl p-6 sm:p-10">
      <div className="relative flex min-w-[720px] items-start justify-between gap-2">
        <svg className="pointer-events-none absolute left-0 top-8 h-1 w-full" preserveAspectRatio="none">
          <motion.line
            x1="8%"
            x2="92%"
            y1="1"
            y2="1"
            stroke="url(#flowGradient)"
            strokeWidth="2"
            strokeDasharray="0 1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            vectorEffect="non-scaling-stroke"
          />
          <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>

        {nodes.map(({ title, description, Icon }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.22, type: 'spring', stiffness: 260, damping: 18 }}
            className="flex w-36 flex-col items-center text-center"
          >
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-3 text-xs font-semibold text-ink-900 dark:text-white">{title}</p>
            <p className="mt-1 text-[11px] leading-snug text-ink-700/55 dark:text-white/45">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
