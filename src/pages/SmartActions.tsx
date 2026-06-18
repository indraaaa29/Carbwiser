import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  generateRecommendations,
  type Recommendation,
} from '../lib/recommendationEngine';
import { useProfile } from '../context/ProfileContext';

import { ProfileBanner } from '../components/actions/ProfileBanner';
import { PrimaryCard, StandardCard } from '../components/actions/ActionCards';
import { CommitToast } from '../components/actions/CommitToast';

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
              className="shrink-0 bg-[#003527] text-white font-geist text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#064e3b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
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
                className={`px-4 py-2 font-geist text-sm font-medium rounded-lg flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 ${
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
