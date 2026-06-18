import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { calculateFootprint } from '../lib/carbonCalculation';
import { useProfile } from '../context/ProfileContext';
import { useActions } from '../context/ActionContext';
import { calculateProgressMetrics } from '../lib/progress';
import type { CommittedAction } from '../types';

interface TimelineItem {
  week: string;
  title: string;
  description: string;
  departments: { icon: string; label: string }[];
  icon: string;
  isActive: boolean;
  status: 'committed' | 'completed';
}

const WEEK_ICONS = ['forest', 'energy_savings_leaf', 'electric_bolt', 'compost'];
const DEPT_MAP: Record<string, { icon: string; label: string }[]> = {
  mobility: [
    { icon: 'directions_bike', label: 'Active Travel' },
    { icon: 'subway', label: 'Public Transport' },
  ],
  energy: [
    { icon: 'thermostat', label: 'Home Energy' },
  ],
  waste: [
    { icon: 'compost', label: 'Waste Reduction' },
  ],
  food: [
    { icon: 'restaurant', label: 'Food & Diet' },
  ]
};

function toTimelineItem(action: CommittedAction, index: number): TimelineItem {
  return {
    week: `Week ${index + 1}`,
    title: action.title,
    description: `Committed on ${new Date(action.committedAt).toLocaleDateString()}`,
    departments: DEPT_MAP[action.category] ?? DEPT_MAP.waste,
    icon: WEEK_ICONS[index % WEEK_ICONS.length],
    isActive: action.status === 'committed',
    status: action.status,
  };
}

const CarbonRoadmap: React.FC = () => {
  const { profile } = useProfile();
  const { actions } = useActions();
  const metrics = useMemo(() => calculateFootprint(profile), [profile]);
  const progress = useMemo(() => calculateProgressMetrics(metrics, actions), [metrics, actions]);

  const journeyProgress = progress.progressPercentage;

  const timelineItems = useMemo(() => {
    // Sort actions by committedAt
    return [...actions].sort((a, b) => a.committedAt - b.committedAt).map(toTimelineItem);
  }, [actions]);

  const nextMilestone = useMemo(() => {
    return actions.sort((a, b) => a.committedAt - b.committedAt).find(a => a.status === 'committed');
  }, [actions]);

  const currentTonnes = (metrics.total / 1000).toFixed(1);
  const targetTonnes = ((metrics.total - metrics.reductionGoalKg) / 1000).toFixed(1);

  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <main id="main-content" className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        {/* Landscape Hero Banner */}
        <div className="mb-12 relative rounded-3xl overflow-hidden bg-[#064e3b] p-8 md:p-12 flex flex-col justify-end min-h-[320px] shadow-lg border border-[#95d3ba]/30">
          <img
            alt="Lush green forest canopy viewed from above"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1440&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/90 via-[#003527]/40 to-transparent" />

          <div className="relative z-10 text-white">
            <h1 className="font-geist text-3xl md:text-5xl font-semibold mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-[40px] md:text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">hiking</span>
              My Carbon Roadmap
            </h1>
            <p className="font-inter text-lg text-[#b0f0d6] max-w-2xl opacity-90">
              A genuine timeline generated from your committed actions to help you reach your goals.
            </p>
          </div>
        </div>

        {/* Bento-style Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative mb-12">
          {/* Landscape path background */}
          <div className="absolute inset-0 landscape-path pointer-events-none -z-10 rounded-3xl" />

          {/* Target Summary Card */}
          <div className="glass-card rounded-2xl p-8 md:col-span-8 flex flex-col justify-between shadow-sm border-t-4 border-t-[#2b6954]">
            <div>
              <h2 className="font-geist text-xs font-semibold uppercase text-[#2b6954] mb-6 tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">explore</span>
                Footprint Trajectory
              </h2>
              <div className="flex items-end gap-8 mb-10 flex-wrap">
                <div>
                  <p className="font-geist text-sm text-[#404944] mb-1">Current Footprint</p>
                  <p className="font-geist text-3xl font-semibold text-[#141b2b]">
                    {currentTonnes} <span className="font-inter text-base font-normal text-[#404944]">tCO2e/yr</span>
                  </p>
                </div>
                <div className="hidden sm:flex flex-grow h-px bg-[#95d3ba] mb-4 relative items-center justify-center">
                  <div className="bg-white border border-[#95d3ba] rounded-full p-1 flex absolute" aria-hidden="true">
                    <span className="material-symbols-outlined text-[#2b6954] text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">eco</span>
                  </div>
                </div>
                <div>
                  <p className="font-geist text-sm text-[#404944] mb-1">My Target ({profile.reductionGoal === 'zero' ? 'Net Zero' : `-${profile.reductionGoal}%`})</p>
                  <p className="font-geist text-3xl font-semibold text-[#003527]">
                    {targetTonnes} <span className="font-inter text-base font-normal text-[#404944]">tCO2e/yr</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between font-geist text-xs mb-3 text-[#404944]">
                <span>Journey Progress</span>
                <span className="text-[#2b6954] font-bold bg-[#b0f0d6]/30 px-2 py-0.5 rounded-md">{journeyProgress}% Completed</span>
              </div>
              <div
                className="w-full h-4 bg-[#dce2f7] rounded-full relative shadow-inner"
                role="meter"
                aria-valuenow={journeyProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Journey Progress: ${journeyProgress}% Completed`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${journeyProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-[#2b6954] rounded-full relative"
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center">
                    <motion.div
                      animate={{
                        y: [-2, 2, -2],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="bg-[#2b6954] border-2 border-[#b0f0d6] text-white rounded-full p-1 shadow-lg flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px] block" style={{ fontVariationSettings: "'FILL' 1" }}>
                        directions_walk
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Milestone Card */}
          <div className="bg-gradient-to-br from-[#064e3b] to-[#003527] rounded-2xl p-8 md:col-span-4 shadow-md text-white relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-white opacity-10 transform -rotate-12" style={{ fontSize: '120px' }} aria-hidden="true">park</span>
            <h2 className="font-geist text-xs font-semibold uppercase text-[#b0f0d6] mb-6 tracking-wider relative z-10">Your Next Milestone</h2>
            {actions.length === 0 ? (
              <div className="relative z-10">
                <p className="font-inter text-sm text-[#b0f0d6] mb-4">Start committing to actions to see your roadmap.</p>
                <Link to="/actions" className="inline-block bg-[#b0f0d6] text-[#003527] px-5 py-2.5 rounded-lg font-geist text-sm font-medium hover:bg-[#95d3ba] transition-colors focus:outline-none focus:ring-2 focus:ring-[#b0f0d6] focus:ring-offset-2">
                  Explore Actions
                </Link>
              </div>
            ) : nextMilestone ? (
              <>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[#b0f0d6] flex items-center justify-center text-[#064e3b] shadow-inner" aria-hidden="true">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {DEPT_MAP[nextMilestone.category]?.[0]?.icon || 'star'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-geist text-xl font-medium">{nextMilestone.title}</h3>
                    <p className="font-inter text-sm text-[#95d3ba] capitalize">{nextMilestone.category}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#b0f0d6]/20 relative z-10">
                  <p className="font-geist text-sm text-[#95d3ba] mb-1">Impact Potential</p>
                  <p className="font-geist text-2xl font-medium text-[#b0f0d6]">
                    -{nextMilestone.estimatedReduction} <span className="font-inter text-base">kgCO2e</span>
                  </p>
                </div>
              </>
            ) : (
              <div className="relative z-10">
                <p className="font-inter text-sm text-[#b0f0d6] mb-4">You have completed all committed actions!</p>
                <Link to="/actions" className="inline-block bg-[#b0f0d6] text-[#003527] px-4 py-2 rounded-lg font-geist text-sm font-medium hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#b0f0d6] focus:ring-offset-2 focus:ring-offset-[#064e3b]">
                  Find more actions
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="md:col-span-12">
          <h2 className="font-geist text-2xl font-medium text-[#003527] mb-10 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2b6954]" aria-hidden="true">map</span>
            Action Timeline
          </h2>

          {timelineItems.length === 0 ? (
            <div className="bg-white border border-[#bfc9c3] rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-[#f9f9ff] rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#2b6954] text-[32px]">map</span>
              </div>
              <h3 className="font-geist text-2xl font-medium text-[#141b2b] mb-2">No actions committed yet</h3>
              <p className="font-inter text-[#404944] mb-6 max-w-md mx-auto">Visit Smart Actions to commit to lifestyle changes and build your personalized roadmap.</p>
              <Link to="/actions" className="inline-block bg-[#003527] text-white px-6 py-3 rounded-lg font-geist text-sm font-medium hover:bg-[#064e3b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2">
                Explore Recommendations
              </Link>
            </div>
          ) : (
            <ol className="relative pl-8 md:pl-12 ml-4 md:ml-8 border-l-4 border-dashed border-[#2b6954]/40 space-y-10" aria-label="Roadmap stages">
              {timelineItems.map((item) => (
                <li key={item.title} className="relative">
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[42px] md:-left-[58px] top-2 w-12 h-12 rounded-full flex items-center justify-center shadow-md border-4 z-10 ${
                      item.status === 'completed' 
                        ? 'bg-[#95d3ba] text-[#003527] border-[#f9f9ff]'
                        : 'bg-[#2b6954] text-white border-[#f9f9ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]" aria-hidden="true">{item.status === 'completed' ? 'check' : item.icon}</span>
                  </div>

                  {/* Timeline Card */}
                  <div
                    className={`rounded-2xl border p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden ${
                      item.status === 'completed'
                        ? 'bg-[#f0fdf6] border-[#95d3ba]'
                        : 'bg-white border-[#bfc9c3]/50 hover:border-[#2b6954]/60'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#b0f0d6] opacity-10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-4 py-1.5 rounded-full font-geist text-xs font-bold uppercase tracking-wider border ${
                          item.status === 'completed'
                            ? 'bg-[#b0f0d6] text-[#003527] border-[#b0f0d6]'
                            : 'bg-[#e9edff] text-[#141b2b] border-[#bfc9c3]/30 text-[#2b6954]'
                        }`}
                      >
                        {item.week} {item.status === 'completed' ? '(Completed)' : ''}
                      </span>
                    </div>

                    <h3 className="font-geist text-2xl font-medium text-[#141b2b] mb-3 group-hover:text-[#003527] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-inter text-base text-[#404944] mb-6">{item.description}</p>

                    <div className="flex gap-3 flex-wrap">
                      {item.departments.map((dept) => (
                        <span
                          key={dept.label}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-geist text-xs font-semibold border ${
                            item.isActive
                              ? 'bg-[#e9edff] text-[#141b2b] border-[#bfc9c3]/30 text-[#2b6954]'
                              : 'bg-[#e9edff] text-[#141b2b] border-[#bfc9c3]/30'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[18px] ${item.isActive ? 'text-[#2b6954]' : 'text-[#bfc9c3]'}`}>{dept.icon}</span>
                          {dept.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
};

export default CarbonRoadmap;
