import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { calculateFootprint } from '../lib/carbonCalculation';
import { useProfile } from '../context/ProfileContext';
import { generateRecommendations } from '../lib/recommendationEngine';
import { calculateProgressMetrics } from '../lib/progress';
import type { Recommendation } from '../lib/recommendationEngine';

interface TimelineItem {
  week: string;
  title: string;
  description: string;
  departments: { icon: string; label: string }[];
  icon: string;
  isActive: boolean;
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
    { icon: 'restaurant', label: 'Food & Diet' },
  ],
};

function toTimelineItem(rec: Recommendation, index: number): TimelineItem {
  return {
    week: `Step ${index + 1}`,
    title: rec.title,
    description: rec.description,
    departments: DEPT_MAP[rec.category] ?? DEPT_MAP.waste,
    icon: WEEK_ICONS[index % WEEK_ICONS.length],
    isActive: index === 0,
  };
}

const CarbonRoadmap: React.FC = () => {
  const { profile } = useProfile();
  const metrics = useMemo(() => calculateFootprint(profile), [profile]);
  const progress = useMemo(() => calculateProgressMetrics(metrics), [metrics]);
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);

  const journeyProgress = useMemo(() => {
    const pct = Math.min(100, Math.max(0, Math.round((progress.reducedSoFar / Math.max(1, metrics.reductionGoalKg)) * 100)));
    return pct;
  }, [progress.reducedSoFar, metrics.reductionGoalKg]);

  const timelineItems = useMemo(() => recommendations.slice(0, 3).map(toTimelineItem), [recommendations]);

  const nextMilestone = useMemo(() => recommendations[0], [recommendations]);

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
            src="https://lh3.googleusercontent.com/aida/AP1WRLvGpY0KKcqdIKtFLkWrN60va00xsm_jkZJ8P2sgnuP4EKt_ZxoBSBLFcBR3q-qcp-5tstHh_DmxbTe-AJQIMni26yyh9TZAYw-_gLqFe-_ECYcUsjsfl1p5ZaLrh0cEMTRzRuiOaSMDsRvZqicgO4e3Kl_8neVnB6WdB2w-P8SUiSy7L2isYj4RUchCEMsUw_lQjgvlUG_orbyXARN-4Ak7J6DFbPEcKn_cta0e8xTDsMAxnZJpII1XBQA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003527]/90 via-[#003527]/40 to-transparent" />

          <div className="relative z-10 text-white">
            <h1 className="font-geist text-3xl md:text-5xl font-semibold mb-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-[40px] md:text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">hiking</span>
              My Carbon Roadmap
            </h1>
            <p className="font-inter text-lg text-[#b0f0d6] max-w-2xl opacity-90">
              A step-by-step personal plan to help you reduce your carbon footprint through practical, achievable lifestyle changes.
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
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full bg-[#b0f0d6] flex items-center justify-center text-[#064e3b] shadow-inner" aria-hidden="true">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {nextMilestone?.categoryIcon || 'directions_transit'}
                </span>
              </div>
              <div>
                <h3 className="font-geist text-2xl font-medium">{nextMilestone?.title || 'Switch to Public Transport'}</h3>
                <p className="font-inter text-sm text-[#95d3ba]">{nextMilestone?.categoryLabel || 'Cut your daily travel emissions'}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#b0f0d6]/20 relative z-10">
              <p className="font-geist text-sm text-[#95d3ba] mb-1">Impact Potential</p>
              <p className="font-geist text-2xl font-medium text-[#b0f0d6]">
                -{nextMilestone?.estReductionKg || 45} <span className="font-inter text-base">kgCO2e</span>
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="md:col-span-12">
          <h2 className="font-geist text-2xl font-medium text-[#003527] mb-10 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2b6954]" aria-hidden="true">map</span>
            Action Timeline
          </h2>

          <ol className="relative pl-8 md:pl-12 ml-4 md:ml-8 border-l-4 border-dashed border-[#2b6954]/40 space-y-10" aria-label="Roadmap stages">
            {timelineItems.map((item) => (
              <li key={item.week} className="relative">
                {/* Timeline Node */}
                <div
                  className={`absolute -left-[42px] md:-left-[58px] top-2 w-12 h-12 rounded-full flex items-center justify-center shadow-md border-4 z-10 ${
                    item.isActive
                      ? 'bg-[#2b6954] text-white border-[#f9f9ff]'
                      : 'bg-[#f9f9ff] text-[#bfc9c3] border-[#2b6954]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]" aria-hidden="true">{item.icon}</span>
                </div>

                {/* Timeline Card */}
                <div
                  className={`rounded-2xl border p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                    item.isActive
                      ? 'bg-white border-[#95d3ba]/50 hover:border-[#2b6954]'
                      : 'bg-white border-[#bfc9c3]/50 hover:border-[#2b6954]/60 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#b0f0d6] opacity-10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-4 py-1.5 rounded-full font-geist text-xs font-bold uppercase tracking-wider border ${
                        item.isActive
                          ? 'bg-[#b0f0d6]/40 text-[#003527] border-[#b0f0d6]'
                          : 'bg-[#dce2f7] text-[#404944]'
                      }`}
                    >
                      {item.week}
                    </span>
                    <span className="material-symbols-outlined text-[#2b6954] opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" aria-hidden="true">
                      arrow_forward
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
        </div>
      </main>
    </div>
  );
};

export default CarbonRoadmap;
