import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateRecommendations,
  type Recommendation,
  type UserProfile,
} from '../lib/recommendationEngine';
import { useProfile } from '../context/ProfileContext';
import { useActions } from '../context/ActionContext';

type FilterCategory = 'all' | 'mobility' | 'energy' | 'waste';
type SortOrder = 'impact' | 'cost' | 'difficulty';

// ─── Sort helpers ─────────────────────────────────────────────────────────────
const impactOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
const difficultyOrder: Record<string, number> = { Easy: 3, Moderate: 2, Hard: 1 };
const costOrder: Record<string, number> = { 'Saves Money': 3, 'Low Cost': 2, Medium: 1, High: 0 };

function sortRecs(recs: Recommendation[], order: SortOrder): Recommendation[] {
  const sorted = [...recs].sort((a, b) => {
    if (order === 'impact') return (impactOrder[b.impact.label] ?? 0) - (impactOrder[a.impact.label] ?? 0);
    if (order === 'difficulty') return (difficultyOrder[b.difficulty.label] ?? 0) - (difficultyOrder[a.difficulty.label] ?? 0);
    if (order === 'cost') return (costOrder[b.cost.label] ?? 0) - (costOrder[a.cost.label] ?? 0);
    return 0;
  });
  return sorted;
}

// ─── Profile summary chip ─────────────────────────────────────────────────────
const TRANSPORT_LABELS: Record<string, string> = {
  car: 'Car driver', ev: 'EV driver', bus: 'Bus user',
  metro: 'Rail commuter', bike: 'Cyclist', walk: 'Walker',
};
const DIET_LABELS: Record<string, string> = {
  omnivore: 'Omnivore', flexitarian: 'Flexitarian',
  vegetarian: 'Vegetarian', vegan: 'Vegan',
};
const ENERGY_LABELS: Record<string, string> = {
  grid: 'Grid electricity', renewable: 'Renewable energy',
  gas: 'Natural gas', mixed: 'Mixed energy',
};

function ProfileBanner({ profile, hasProfile }: { profile: UserProfile; hasProfile: boolean }) {
  if (!hasProfile) return null;
  const chips = [
    { icon: 'directions_car', label: TRANSPORT_LABELS[profile.transportMode] ?? profile.transportMode },
    { icon: 'bolt', label: ENERGY_LABELS[profile.energySource] ?? profile.energySource },
    { icon: 'restaurant', label: DIET_LABELS[profile.dietType] ?? profile.dietType },
    { icon: 'home', label: `${profile.householdSize} ${profile.householdSize === '1' ? 'person' : 'people'}` },
  ];
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="font-geist text-xs font-semibold text-[#404944] uppercase tracking-wider mr-1">
        Personalised for:
      </span>
      {chips.map(c => (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e1e8fd] rounded-full font-inter text-xs text-[#003527]">
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{c.icon}</span>
          {c.label}
        </span>
      ))}
      <Link
        to="/assessment"
        className="ml-auto font-geist text-xs text-[#2b6954] hover:text-[#003527] underline underline-offset-2 transition-colors"
      >
        Update profile
      </Link>
    </div>
  );
}

// ─── "Why this recommendation?" expandable section ───────────────────────────
function WhySection({ rec, isExpanded, onToggle }: {
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
        className="flex items-center gap-2 text-[#003527] hover:text-[#064e3b] transition-colors w-full text-left"
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

// ─── Action Controls ────────────────────────────────────────────────────────────
function ActionControls({ action, isPrimary = false, onCommitSuccess }: { action: Recommendation, isPrimary?: boolean, onCommitSuccess?: (action: Recommendation) => void }) {
  const { actions, commitAction, removeAction, markActionCompleted } = useActions();
  
  const committedState = actions.find(a => a.id === action.id);
  
  const handleCommit = () => {
    commitAction({
      id: action.id,
      title: action.title,
      category: action.category,
      estimatedReduction: action.estReductionKg,
      difficulty: action.difficulty.label.toLowerCase() as 'easy' | 'moderate' | 'hard'
    });
    if (onCommitSuccess) onCommitSuccess(action);
  };

  if (!committedState) {
    return (
      <button 
        type="button" 
        onClick={handleCommit}
        className={`w-full py-2 bg-[#003527] text-white rounded-lg font-geist text-sm font-medium hover:bg-[#064e3b] transition-colors mt-4 relative z-10 ${isPrimary ? 'sm:w-auto px-6' : ''}`}
      >
        Commit Action
      </button>
    );
  }
  
  if (committedState.status === 'completed') {
    return (
      <div className={`w-full py-2 bg-[#b0f0d6] text-[#003527] rounded-lg font-geist text-sm font-bold text-center mt-4 border border-[#95d3ba] flex items-center justify-center gap-2 relative z-10 ${isPrimary ? 'sm:w-auto px-6' : ''}`}>
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
        Completed
      </div>
    );
  }
  
  return (
    <div className={`flex gap-2 mt-4 relative z-10 ${isPrimary ? 'sm:w-auto' : ''}`}>
      <button 
        type="button" 
        onClick={() => markActionCompleted(action.id)}
        className="flex-1 py-2 px-4 bg-[#003527] text-white border border-[#003527] rounded-lg font-geist text-sm font-medium hover:bg-[#064e3b] transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">check</span> Complete
      </button>
      <button 
        type="button" 
        onClick={() => removeAction(action.id)}
        className="flex-1 py-2 px-4 bg-[#f9f9ff] text-[#ba1a1a] border border-[#ba1a1a]/30 rounded-lg font-geist text-sm font-medium hover:bg-[#ba1a1a]/10 transition-colors flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">close</span> Remove
      </button>
    </div>
  );
}

// ─── Primary action card ──────────────────────────────────────────────────────
function PrimaryCard({ action, onCommitSuccess }: { action: Recommendation, onCommitSuccess?: (action: Recommendation) => void }) {
  const [expanded, setExpanded] = useState(true);

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

        {/* Why section */}
        <WhySection rec={action} isExpanded={expanded} onToggle={() => setExpanded(v => !v)} />

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

// ─── Standard action card ─────────────────────────────────────────────────────
function StandardCard({ action, onCommitSuccess }: { action: Recommendation, onCommitSuccess?: (action: Recommendation) => void }) {
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
        <button type="button" className="text-[#404944] hover:text-[#003527] transition-colors" aria-label="Bookmark action">
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

// ─── Toast Component ──────────────────────────────────────────────────────────
function CommitToast({ action, onClose }: { action: Recommendation, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50 w-auto md:w-[400px] bg-white border-l-8 border-[#2b6954] rounded-xl shadow-2xl overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#b0f0d6] flex items-center justify-center text-[#003527] shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">check</span>
          </div>
          <div>
            <h4 className="font-geist text-xs font-bold text-[#2b6954] uppercase tracking-wider mb-1 flex items-center gap-1">
              Action Added
            </h4>
            <p className="font-geist text-lg font-medium text-[#141b2b] leading-tight mb-2">{action.title}</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 ${action.categoryBg} rounded text-xs font-semibold flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[12px]" aria-hidden="true">{action.categoryIcon}</span>
                {action.categoryLabel}
              </span>
              <span className="font-inter text-xs font-medium text-[#2b6954] bg-[#b0f0d6]/30 px-2 py-0.5 rounded">
                -{action.estReduction}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-3 border-t border-[#bfc9c3]/30 pt-4">
          <Link 
            to="/roadmap" 
            className="flex-1 bg-[#003527] text-white text-center py-2.5 rounded-lg font-geist text-sm font-semibold hover:bg-[#064e3b] transition-colors"
          >
            View Roadmap
          </Link>
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 bg-white text-[#003527] border border-[#bfc9c3] text-center py-2.5 rounded-lg font-geist text-sm font-semibold hover:bg-[#f9f9ff] transition-colors"
          >
            Continue Exploring
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const SmartActions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [sortOrder, setSortOrder]       = useState<SortOrder>('impact');
  const [toastAction, setToastAction]   = useState<Recommendation | null>(null);
  const { profile, hasProfile } = useProfile();
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);


  const filtered = activeFilter === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === activeFilter);

  const sorted = sortRecs(filtered, sortOrder);

  // Always keep the engine's top recommendation as primary in the "all" view;
  // in filtered views the first in sorted order is primary.
  const primaryAction   = sorted.find(r => r.isPrimary) ?? sorted[0] ?? null;
  const standardActions = sorted.filter(r => r !== primaryAction);

  const filters: { value: FilterCategory; label: string; icon: string }[] = [
    { value: 'all',      label: 'All Categories', icon: 'apps' },
    { value: 'mobility', label: 'Getting Around',  icon: 'directions_car' },
    { value: 'energy',   label: 'Home Energy',     icon: 'energy_savings_leaf' },
    { value: 'waste',    label: 'Food & Diet',     icon: 'restaurant' },
  ];

  return (
    <div className="bg-[#f4f6f3] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <main id="main-content" className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        {/* Header */}
        <header className="mb-8 md:mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1e8fd] rounded-full mb-4">
            <span className="material-symbols-outlined text-[#003527] text-sm">eco</span>
            <span className="font-geist text-xs font-semibold text-[#003527] uppercase tracking-wider">
              {hasProfile ? 'Personalised for You' : 'Sustainability Guide'}
            </span>
          </div>
          <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#141b2b] mb-4 leading-tight">
            Recommended Actions
          </h1>
          <p className="font-inter text-lg text-[#404944] leading-7">
            {hasProfile
              ? 'Based on your lifestyle assessment, here are the highest-impact changes you can make — ranked and explained for your specific situation.'
              : 'Practical steps to reduce your personal carbon footprint. Complete the lifestyle assessment for fully personalised recommendations.'}
          </p>
        </header>

        {/* Profile banner */}
        {profile && <ProfileBanner profile={profile} hasProfile={hasProfile} />}

        {/* No profile CTA */}
        {!hasProfile && (
          <div className="mb-8 bg-[#e1e8fd] border border-[#bfc9c3] rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#003527] text-2xl" aria-hidden="true">person_pin</span>
              <div>
                <p className="font-geist text-sm font-semibold text-[#141b2b]">No lifestyle profile found</p>
                <p className="font-inter text-xs text-[#404944] mt-0.5">
                  Complete the 5-minute assessment to get recommendations tailored to your transport, energy, and food habits.
                </p>
              </div>
            </div>
            <Link
              to="/assessment"
              className="shrink-0 bg-[#003527] text-white font-geist text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#064e3b] transition-colors"
            >
              Take Assessment
            </Link>
          </div>
        )}

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#bfc9c3] pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                type="button"
                aria-pressed={activeFilter === f.value}
                className={`px-4 py-2 font-geist text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                  activeFilter === f.value
                    ? 'bg-[#003527] text-white'
                    : 'bg-[#f9f9ff] text-[#141b2b] border border-[#bfc9c3] hover:bg-[#e9edff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[#404944]">
            <span className="font-geist text-sm">Sort by:</span>
            <select
              className="bg-[#f9f9ff] border border-[#bfc9c3] rounded-md font-geist text-sm text-[#141b2b] py-1 pl-2 pr-8 focus:ring-[#003527] focus:border-[#003527]"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOrder)}
              aria-label="Sort actions"
            >
              <option value="impact">Highest Impact</option>
              <option value="cost">Lowest Cost</option>
              <option value="difficulty">Easiest First</option>
            </select>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 relative z-10">
          {primaryAction && <PrimaryCard action={primaryAction} onCommitSuccess={setToastAction} />}
          {standardActions.map(action => (
            <StandardCard key={action.id} action={action} onCommitSuccess={setToastAction} />
          ))}
        </div>

        {/* Toast Portal/Overlay */}
        <AnimatePresence>
          {toastAction && (
            <CommitToast action={toastAction} onClose={() => setToastAction(null)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SmartActions;
