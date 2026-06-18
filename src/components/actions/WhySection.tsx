import { motion, AnimatePresence } from 'framer-motion';
import type { Recommendation } from '../../lib/recommendationEngine';

export function WhySection({ rec, isExpanded, onToggle }: {
  rec: Recommendation;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const contentId = `why-content-${rec.id}`;
  return (
    <div className="relative z-10 mt-4 border-t border-[#bfc9c3]/40 pt-4">
      <button
        onClick={onToggle}
        type="button"
        className="flex items-center gap-2 text-[#003527] hover:text-[#064e3b] transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 rounded px-1"
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="material-symbols-outlined text-[18px] text-[#2b6954]" aria-hidden="true">psychology</span>
        <span className="font-geist text-sm font-semibold text-[#003527]">Why this recommendation?</span>
        <span className={`material-symbols-outlined text-[18px] ml-auto transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
          expand_more
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            key="why"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              {/* Headline + bar */}
              <div className="bg-[#f4f6f3] rounded-xl p-4 border border-[#bfc9c3]/40">
                <p className="font-geist text-sm font-semibold text-[#141b2b] mb-2">
                  {rec.reason.headline}
                </p>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-inter text-xs text-[#404944]">Category share</span>
                  <span className="font-geist text-xs font-bold text-[#ba1a1a]">{rec.reason.share}</span>
                </div>
                <div
                  className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#bfc9c3]/30"
                  role="meter"
                  aria-label="Category impact share"
                  aria-valuenow={rec.reason.barPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    className="h-full bg-[#ba1a1a] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${rec.reason.barPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
              </div>

              {/* Detail text */}
              <p className="font-inter text-sm text-[#404944] leading-relaxed italic">
                "{rec.reason.detail}"
              </p>

              {/* Tip callout */}
              <div className="flex gap-3 bg-[#e1e8fd] rounded-xl p-3 border border-[#bfc9c3]/30">
                <span className="material-symbols-outlined text-[#003527] text-[20px] flex-shrink-0 mt-0.5" aria-hidden="true">eco</span>
                <span className="font-inter text-xs text-[#141b2b] leading-relaxed">{rec.reason.tip}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
