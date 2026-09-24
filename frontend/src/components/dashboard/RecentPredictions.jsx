import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { recentPredictions } from '../../data/statistics';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getRiskLevel } from '../../utils/constants';
import { cn } from '../../utils/cn';

const AUTOPLAY_MS = 3200;

export default function RecentPredictions() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;
    autoplayRef.current = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(autoplayRef.current);
  }, [emblaApi, isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="glass glass-border-gradient rounded-3xl p-5 sm:p-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-white">Recent predictions</h3>
          <p className="text-xs text-ink-700/50 dark:text-white/40">Live from the scoring queue</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/10 text-ink-700 transition-colors hover:border-violet-400/50 hover:text-violet-500 dark:border-white/10 dark:text-white/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/10 text-ink-700 transition-colors hover:border-violet-400/50 hover:text-violet-500 dark:border-white/10 dark:text-white/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {recentPredictions.map((prediction) => {
            const risk = getRiskLevel(prediction.probability);
            return (
              <motion.div
                key={prediction.id}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="min-w-[220px] flex-[0_0_70%] rounded-2xl border border-ink-900/[0.08] bg-white/50 p-4 dark:border-white/[0.08] dark:bg-white/[0.03] sm:flex-[0_0_45%] lg:flex-[0_0_31%]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gradient text-white">
                    <User className="h-4 w-4" />
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: risk.color, backgroundColor: `${risk.color}1A` }}
                  >
                    {risk.label}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-900 dark:text-white">
                  {prediction.name}
                </p>
                <p className="text-xs text-ink-700/50 dark:text-white/40">{prediction.id}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-ink-700/70 dark:text-white/55">
                    {formatCurrency(prediction.amount)}
                  </span>
                  <span className="text-ink-700/50 dark:text-white/40">
                    {formatDate(prediction.date)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {recentPredictions.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === selectedIndex ? 'w-5 bg-accent-gradient' : 'w-1.5 bg-ink-900/15 dark:bg-white/15',
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}
