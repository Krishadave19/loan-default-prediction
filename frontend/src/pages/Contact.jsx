import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const DETAILS = [
  { icon: Mail, label: 'hello@nimbuscredit.io' },
  { icon: Phone, label: '+1 (555) 019-2044' },
  { icon: MapPin, label: 'Austin, Texas' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Get in touch"
        title="Let's talk about your loan book"
        description="Tell us about your portfolio and we'll walk you through how Nimbus calibrates to it."
      />

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr,1.3fr] lg:px-8">
        <div className="space-y-4">
          {DETAILS.map((detail) => (
            <div key={detail.label} className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient text-white">
                <detail.icon className="h-4 w-4" />
              </span>
              <span className="text-sm text-ink-700/80 dark:text-white/65">{detail.label}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass glass-border-gradient rounded-4xl p-6 sm:p-8"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-risk-low" />
              <h3 className="mt-4 text-lg font-semibold text-ink-900 dark:text-white">Message sent</h3>
              <p className="mt-1.5 text-sm text-ink-700/60 dark:text-white/50">
                Someone from our team will reply within one business day.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-ink-700/70 dark:text-white/55">Name</span>
                  <input
                    required
                    className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white/60 px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="Alex Rivera"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-ink-700/70 dark:text-white/55">Email</span>
                  <input
                    required
                    type="email"
                    className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white/60 px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="alex@company.com"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-ink-700/70 dark:text-white/55">Message</span>
                <textarea
                  required
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white/60 px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Tell us about your loan book…"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" />
                Send message
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}
