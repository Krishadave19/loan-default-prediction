import { motion } from 'framer-motion';
import { Target, Users, Rocket } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const VALUES = [
  {
    icon: Target,
    title: 'Precision over guesswork',
    description: 'We believe credit decisions deserve calibrated probabilities, not gut feel or blunt score bands.',
  },
  {
    icon: Users,
    title: 'Built with underwriters',
    description: 'Every screen was shaped by feedback from the credit teams who use it every day.',
  },
  {
    icon: Rocket,
    title: 'Shipped, not just researched',
    description: 'LoanLens is a production system serving live scoring traffic, not a notebook demo.',
  },
];

export default function About() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="About LoanLens"
        title="We think credit risk deserves better tools"
        description="LoanLens started as an internal scoring tool for a mid-size lender frustrated with opaque, one-size-fits-all risk models. It's now the layer between raw applicant data and a decision your team can stand behind."
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass glass-border-gradient rounded-3xl p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-gradient text-white shadow-glow">
                <value.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink-900 dark:text-white">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700/65 dark:text-white/55">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
