import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

type FilterCategory = 'all' | 'mobility' | 'energy' | 'waste';
type SortOrder = 'impact' | 'cost' | 'difficulty';

interface ActionCardData {
  id: string;
  title: string;
  description: string;
  category: FilterCategory;
  categoryLabel: string;
  categoryIcon: string;
  categoryBg: string;
  estReduction: string;
  impact: { label: string; color: string; dot: string };
  cost: { label: string; color: string; dot: string };
  difficulty: { label: string; color: string; dot: string };
  bgIcon: string;
  isPrimary?: boolean;
  insight?: { fleet: string; note: string };
  icon?: string;
}

const actions: ActionCardData[] = [
  {
    id: '1',
    title: 'Transition Corporate Fleet to EVs',
    description: 'Phase out internal combustion vehicles for regional logistics. Available local subsidies offset initial capital expenditure by 30%.',
    category: 'mobility',
    categoryLabel: 'Top Recommendation',
    categoryIcon: 'eco',
    categoryBg: 'bg-[#064e3b] text-[#80bea6]',
    estReduction: '1.2k kg CO₂/mo',
    impact: { label: 'High', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    cost: { label: 'Medium', color: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
    difficulty: { label: 'Moderate', color: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
    bgIcon: 'electric_car',
    isPrimary: true,
    insight: { fleet: '45% of total', note: 'Local grid utilizes 60% clean energy, amplifying the environmental benefit of this shift.' },
    icon: 'electric_car',
  },
  {
    id: '2',
    title: 'Implement Hybrid Work Days',
    description: 'Mandate 2 remote days per week for non-essential physical staff to reduce commuter emissions.',
    category: 'mobility',
    categoryLabel: 'Mobility',
    categoryIcon: 'commute',
    categoryBg: 'bg-[#d4e3ff] text-[#003c70]',
    estReduction: '450 kg CO₂/mo',
    impact: { label: 'High', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    cost: { label: 'None/Savings', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    difficulty: { label: 'Easy', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    bgIcon: 'directions_walk',
  },
  {
    id: '3',
    title: 'HVAC System Optimization',
    description: 'Install smart sensors and adjust setpoints by 2°C in common areas during non-peak hours.',
    category: 'energy',
    categoryLabel: 'Energy',
    categoryIcon: 'thermostat',
    categoryBg: 'bg-[#dce2f7] text-[#404944]',
    estReduction: '280 kg CO₂/mo',
    impact: { label: 'Medium', color: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
    cost: { label: 'Low', color: 'text-[#92400e]', dot: 'bg-[#f59e0b]' },
    difficulty: { label: 'Easy', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    bgIcon: 'nest_eco_leaf',
  },
  {
    id: '4',
    title: 'Composting Program Launch',
    description: 'Introduce organic waste diversion in all cafeterias and kitchen areas across facilities.',
    category: 'waste',
    categoryLabel: 'Waste',
    categoryIcon: 'compost',
    categoryBg: 'bg-[#d9e6dd] text-[#131e19]',
    estReduction: '120 kg CO₂/mo',
    impact: { label: 'Low', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    cost: { label: 'Low', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    difficulty: { label: 'Easy', color: 'text-[#047857]', dot: 'bg-[#10b981]' },
    bgIcon: 'recycling',
  },
];

const SmartActions: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('impact');

  const filtered = activeFilter === 'all' ? actions : actions.filter((a) => a.category === activeFilter);
  const primaryAction = filtered.find((a) => a.isPrimary);
  const standardActions = filtered.filter((a) => !a.isPrimary);

  const filters: { value: FilterCategory; label: string; icon: string }[] = [
    { value: 'all', label: 'All Categories', icon: 'apps' },
    { value: 'mobility', label: 'Mobility', icon: 'directions_car' },
    { value: 'energy', label: 'Energy', icon: 'energy_savings_leaf' },
    { value: 'waste', label: 'Waste', icon: 'compost' },
  ];

  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <Navbar />

      <main className="flex-grow w-full px-4 md:px-10 max-w-[1440px] mx-auto py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1e8fd] rounded-full mb-4">
            <span className="material-symbols-outlined text-[#003527] text-sm">eco</span>
            <span className="font-geist text-xs font-semibold text-[#003527] uppercase tracking-wider">Sustainability Guide</span>
          </div>
          <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#141b2b] mb-4 leading-tight">Recommended Actions</h1>
          <p className="font-inter text-lg text-[#404944] leading-7">
            We've mapped your operational footprint. Here are pathways to reduce your environmental impact, designed to align with your strategic goals.
          </p>
        </header>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#bfc9c3] pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-4 py-2 font-geist text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                  activeFilter === f.value
                    ? 'bg-[#003527] text-white'
                    : 'bg-[#f9f9ff] text-[#141b2b] border border-[#bfc9c3] hover:bg-[#e9edff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[#404944]">
            <span className="font-geist text-sm">Sort by:</span>
            <select
              className="bg-[#f9f9ff] border border-[#bfc9c3] rounded-md font-geist text-sm text-[#141b2b] py-1 pl-2 pr-8 focus:ring-[#003527] focus:border-[#003527]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              aria-label="Sort actions"
            >
              <option value="impact">Highest Impact</option>
              <option value="cost">Lowest Cost</option>
              <option value="difficulty">Easiest Difficulty</option>
            </select>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Primary Action (full width on mobile, 8 cols desktop) */}
          {primaryAction && (
            <>
              <motion.div
                whileHover={{ y: -6, scale: 1.01, borderColor: "#003527", boxShadow: "0 20px 40px -15px rgba(0, 53, 39, 0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="col-span-12 md:col-span-8 bg-white border border-[#bfc9c3] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#b0f0d6] opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 ${primaryAction.categoryBg} rounded-xl font-geist text-xs font-semibold uppercase tracking-wider flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-[14px]">{primaryAction.categoryIcon}</span>
                        {primaryAction.categoryLabel}
                      </span>
                    </div>
                    <h2 className="font-geist text-2xl font-medium text-[#141b2b] mb-2">{primaryAction.title}</h2>
                    <p className="font-inter text-base text-[#404944] max-w-lg">{primaryAction.description}</p>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 bg-[#e1e8fd] rounded-full items-center justify-center text-[#003527] flex-shrink-0 ml-4">
                    <span className="material-symbols-outlined text-2xl">{primaryAction.bgIcon}</span>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto">
                  {([
                    { title: 'Est. Reduction', display: primaryAction.estReduction, color: '', dot: '', isText: true },
                    { title: 'Impact', display: primaryAction.impact.label, color: primaryAction.impact.color, dot: primaryAction.impact.dot, isText: false },
                    { title: 'Cost', display: primaryAction.cost.label, color: primaryAction.cost.color, dot: primaryAction.cost.dot, isText: false },
                    { title: 'Difficulty', display: primaryAction.difficulty.label, color: primaryAction.difficulty.color, dot: primaryAction.difficulty.dot, isText: false },
                  ] as const).map((m, i) => (
                    <div key={i} className="p-3 bg-[#f9f9ff] rounded-lg border border-[#bfc9c3]/50">
                      <span className="block font-geist text-xs font-semibold text-[#404944] uppercase mb-1">{m.title}</span>
                      {m.isText ? (
                        <span className="font-geist text-xl font-medium text-[#003527]">
                          {primaryAction.estReduction.split(' ')[0]} <span className="text-sm font-normal text-[#404944]">{primaryAction.estReduction.split(' ').slice(1).join(' ')}</span>
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

                <div className="relative z-10 mt-6 pt-4 border-t border-[#bfc9c3]/30 flex justify-end">
                  <button className="bg-[#003527] text-white font-geist text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#064e3b] transition-colors flex items-center gap-2">
                    View Implementation Plan <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </motion.div>

              {/* Insight Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 40px -15px rgba(0, 53, 39, 0.12)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="col-span-12 md:col-span-4 bg-[#e1e8fd] rounded-xl p-6 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#b0f0d6] opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <h3 className="font-geist text-sm font-medium text-[#404944] uppercase tracking-wider mb-4 relative z-10">Why this matters now</h3>
                <div className="flex-grow flex flex-col justify-center relative z-10">
                  <div className="mb-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-inter text-base text-[#141b2b]">Current Fleet Emissions</span>
                      <span className="font-geist text-sm font-semibold text-[#ba1a1a]">{primaryAction.insight?.fleet}</span>
                    </div>
                    <div className="w-full h-3 bg-[#f9f9ff] rounded-full overflow-hidden border border-[#bfc9c3]/20 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-[#ba1a1a] rounded-full relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                  <p className="font-inter text-sm text-[#404944] italic">
                    "{primaryAction.insight?.note}"
                  </p>
                </div>
                <div className="mt-6 p-4 bg-[#f9f9ff] rounded-lg border border-[#bfc9c3]/30 flex gap-3 relative z-10">
                  <span className="material-symbols-outlined text-[#003527]">park</span>
                  <span className="font-geist text-sm text-[#141b2b]">Local grid utilizes 60% clean energy, amplifying the environmental benefit of this shift.</span>
                </div>
              </motion.div>
            </>
          )}

          {/* Standard Action Cards */}
          {standardActions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ y: -6, scale: 1.01, borderColor: "#003527", boxShadow: "0 20px 40px -15px rgba(0, 53, 39, 0.12)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-12 md:col-span-6 bg-white border border-[#bfc9c3] rounded-xl p-6 flex flex-col relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[#003527]" style={{ fontSize: '120px' }}>{action.bgIcon}</span>
              </div>

              <div className="relative z-10 flex justify-between items-start mb-4">
                <span className={`px-2 py-1 ${action.categoryBg} rounded font-geist text-xs font-semibold uppercase tracking-wider flex items-center gap-1`}>
                  <span className="material-symbols-outlined text-[14px]">{action.categoryIcon}</span>
                  {action.categoryLabel}
                </span>
                <button className="text-[#404944] hover:text-[#003527] transition-colors" aria-label="Bookmark action">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>bookmark_add</span>
                </button>
              </div>

              <h3 className="font-geist text-xl font-medium text-[#141b2b] mb-2 relative z-10">{action.title}</h3>
              <p className="font-inter text-base text-[#404944] mb-6 flex-grow relative z-10">{action.description}</p>

              <div className="flex flex-wrap gap-4 mb-6 relative z-10">
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

              <Link
                to="/roadmap"
                className="w-full py-2 bg-[#f9f9ff] border border-[#bfc9c3] rounded-lg font-geist text-sm font-medium text-[#141b2b] hover:bg-[#e9edff] transition-colors relative z-10 text-center block"
              >
                Add to Roadmap
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SmartActions;
