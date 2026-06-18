import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Recommendation } from '../../lib/recommendationEngine';
import { ActionControls } from './ActionControls';
import { WhySection } from './WhySection';

export function PrimaryCard({ action, onCommitSuccess }: { action: Recommendation, onCommitSuccess?: (action: Recommendation) => void }) {
  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.01, borderColor: '#003527', boxShadow: '0 20px 40px -15px rgba(0, 53, 39, 0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="col-span-12 md:col-span-8 bg-white border border-[#bfc9c3] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#b0f0d6] opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 ${action.categoryBg} rounded-xl font-geist text-xs font-semibold uppercase tracking-wider flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[14px]">{action.categoryIcon}</span>
                {action.categoryLabel}
              </span>
            </div>
            <h2 className="font-geist text-2xl font-medium text-[#141b2b] mb-2">{action.title}</h2>
            <p className="font-inter text-base text-[#404944] max-w-lg">{action.description}</p>
          </div>
          <div className="hidden sm:flex h-12 w-12 bg-[#e1e8fd] rounded-full items-center justify-center text-[#003527] flex-shrink-0 ml-4">
            <span className="material-symbols-outlined text-2xl">{action.bgIcon}</span>
          </div>
        </div>

        {/* Metrics row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
          {([
            { title: 'Est. Reduction', display: action.estReduction, color: '', dot: '', isText: true },
            { title: 'Impact',     display: action.impact.label,     color: action.impact.color,     dot: action.impact.dot,     isText: false },
            { title: 'Cost',       display: action.cost.label,       color: action.cost.color,       dot: action.cost.dot,       isText: false },
            { title: 'Difficulty', display: action.difficulty.label, color: action.difficulty.color, dot: action.difficulty.dot, isText: false },
          ] as const).map((m, i) => (
            <div key={i} className="p-3 bg-[#f9f9ff] rounded-lg border border-[#bfc9c3]/50">
              <span className="block font-geist text-xs font-semibold text-[#404944] uppercase mb-1">{m.title}</span>
              {m.isText ? (
                <span className="font-geist text-xl font-medium text-[#003527]">
                  {action.estReduction.split(' ')[0]}{' '}
                  <span className="text-sm font-normal text-[#404944]">{action.estReduction.split(' ').slice(1).join(' ')}</span>
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 font-geist text-sm font-semibold ${m.color}`}>
                  <div className={`w-2 h-2 rounded-full ${m.dot}`} />
                  {m.display}
                </span>
              )}
            </div>
          ))}
        </div>


        <div className="relative z-10 mt-4 flex justify-end">
          <ActionControls action={action} isPrimary={true} onCommitSuccess={onCommitSuccess} />
        </div>
      </motion.div>

      {/* Insight sidebar card */}
      <motion.div
        whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 40px -15px rgba(0, 53, 39, 0.12)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="col-span-12 md:col-span-4 bg-[#e1e8fd] rounded-xl p-6 flex flex-col relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#b0f0d6] opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <h3 className="font-geist text-sm font-medium text-[#404944] uppercase tracking-wider mb-4 relative z-10">
          Why this matters
        </h3>
        <div className="flex-grow flex flex-col justify-center relative z-10">
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="font-inter text-base text-[#141b2b]">{action.reason.headline.split('~')[0].trim()}</span>
              <span className="font-geist text-sm font-semibold text-[#ba1a1a]">{action.reason.share}</span>
            </div>
            <div
              className="w-full h-3 bg-[#f9f9ff] rounded-full overflow-hidden border border-[#bfc9c3]/20 relative"
              role="meter"
              aria-label="Category impact share"
              aria-valuenow={action.reason.barPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${action.reason.barPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-[#ba1a1a] rounded-full relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                />
              </motion.div>
            </div>
          </div>
          <p className="font-inter text-sm text-[#404944] italic">
            "{action.reason.detail}"
          </p>
        </div>
        <div className="mt-6 p-4 bg-[#f9f9ff] rounded-lg border border-[#bfc9c3]/30 flex gap-3 relative z-10">
          <span className="material-symbols-outlined text-[#003527]" aria-hidden="true">eco</span>
          <span className="font-geist text-sm text-[#141b2b]">{action.reason.tip}</span>
        </div>
      </motion.div>
    </>
  );
}

export function StandardCard({ action, onCommitSuccess }: { action: Recommendation, onCommitSuccess?: (action: Recommendation) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      key={action.id}
      whileHover={{ y: -6, scale: 1.01, borderColor: '#003527', boxShadow: '0 20px 40px -15px rgba(0, 53, 39, 0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="col-span-12 md:col-span-6 bg-white border border-[#bfc9c3] rounded-xl p-6 flex flex-col relative overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-[#003527]" style={{ fontSize: '120px' }}>{action.bgIcon}</span>
      </div>

      <div className="relative z-10 flex justify-between items-start mb-4">
        <span className={`px-2 py-1 ${action.categoryBg} rounded font-geist text-xs font-semibold uppercase tracking-wider flex items-center gap-1`}>
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{action.categoryIcon}</span>
          {action.categoryLabel}
        </span>
        <button type="button" className="text-[#404944] hover:text-[#003527] transition-colors focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 rounded p-1" aria-label={`Bookmark action: ${action.title}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">bookmark_add</span>
        </button>
      </div>

      <h3 className="font-geist text-xl font-medium text-[#141b2b] mb-2 relative z-10">{action.title}</h3>
      <p className="font-inter text-base text-[#404944] mb-6 flex-grow relative z-10">{action.description}</p>

      {/* Metrics row */}
      <div className="flex flex-wrap gap-4 mb-4 relative z-10">
        <div className="flex flex-col">
          <span className="font-geist text-xs font-semibold text-[#404944] uppercase mb-1">Est. Reduction</span>
          <span className="font-geist text-sm font-medium text-[#141b2b]">{action.estReduction}</span>
        </div>
        <div className="w-px h-10 bg-[#bfc9c3] hidden sm:block" />
        <div className="flex flex-col">
          <span className="font-geist text-xs font-semibold text-[#404944] uppercase mb-1">Impact</span>
          <span className={`font-geist text-sm font-semibold ${action.impact.color}`}>{action.impact.label}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-geist text-xs font-semibold text-[#404944] uppercase mb-1">Cost</span>
          <span className={`font-geist text-sm font-semibold ${action.cost.color}`}>{action.cost.label}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-geist text-xs font-semibold text-[#404944] uppercase mb-1">Difficulty</span>
          <span className={`font-geist text-sm font-semibold ${action.difficulty.color}`}>{action.difficulty.label}</span>
        </div>
      </div>

      {/* Why section */}
      <WhySection rec={action} isExpanded={expanded} onToggle={() => setExpanded(v => !v)} />

      <ActionControls action={action} onCommitSuccess={onCommitSuccess} />
    </motion.div>
  );
}
