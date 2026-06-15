import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { useActions } from '../context/ActionContext';
import { calculateFootprint } from '../lib/carbonCalculation';
import { calculateProgressMetrics } from '../lib/progress';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';

const CATEGORY_META: Record<string, { icon: string; iconBg: string; iconColor: string; location: string }> = {
  mobility: { icon: 'directions_car', iconBg: 'bg-[#d4e3ff]', iconColor: 'text-[#001c39]', location: 'Transport' },
  energy: { icon: 'bolt', iconBg: 'bg-[#d9e6dd]', iconColor: 'text-[#131e19]', location: 'Home Energy' },
  waste: { icon: 'compost', iconBg: 'bg-[#e1e8fd]', iconColor: 'text-[#003c70]', location: 'Food & Diet' },
  food: { icon: 'restaurant', iconBg: 'bg-[#e1e8fd]', iconColor: 'text-[#003c70]', location: 'Food & Diet' },
};

const ProgressTracking: React.FC = () => {
  const { profile } = useProfile();
  const { actions } = useActions();
  
  const metrics = useMemo(() => calculateFootprint(profile), [profile]);
  const progress = useMemo(() => calculateProgressMetrics(metrics, actions), [metrics, actions]);
  
  const { potentialReduction, completedReduction, progressPercentage, goalsCompleted, activeHabits, journeyData } = progress;

  const activeInitiatives = useMemo(() => actions.filter(a => a.status === 'committed'), [actions]);

  // Use top 4 committed actions for the roadmap preview
  const roadmapItems = useMemo(() => {
    return activeInitiatives.slice(0, 4).map((a) => ({
      label: a.title,
      date: new Date(a.committedAt).toLocaleDateString(),
      status: 'active' as const,
      progress: 0,
    }));
  }, [activeInitiatives]);

  const totalGoalsCount = activeHabits + goalsCompleted;

  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        {/* Hero Section */}
        <section className="mb-8 rounded-2xl overflow-hidden relative min-h-[400px] flex items-center shadow-lg border border-[#bfc9c3]">
          <img
            alt="Flourishing forest representing ecological restoration"
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://lh3.googleusercontent.com/aida/AP1WRLtwaLymwW8MPX4IAsd63y8Y2cvqpq_XvjtuVSkmQcGrDkPG346NMQhKZJZvyvGFWo5twN4D2UMh5cPbU3f9k90UaYeEGjQ4hKRbSQnSa7oDX5t4nkdTVZckxOuhDD-mShTMp7sulFTYR9gxAEE_QZgLhwIxsz8IgOV4KJ1Bp3xKU7ld7b6R91LFLkpDgMGjQ8jJnfHWLCZTfr6G2oGR6N9jhmPfJETv0Mmnot6mUM0pD06fKvwLsiCZUA"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003527]/90 via-[#003527]/70 to-transparent z-10" />

          <div className="relative z-20 p-8 md:p-16 max-w-3xl">
              <h1 className="font-geist text-3xl md:text-5xl font-semibold text-white mb-4">Progress Tracking</h1>
              <p className="font-inter text-lg text-[#80bea6] max-w-2xl mb-8 leading-7">
                See how your daily choices are adding up. Track your personal carbon reduction over time based on the actions you have committed to and completed.
              </p>

            {/* Hero Metric */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 inline-block">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>co2</span>
                <h2 className="font-geist text-sm font-medium text-white">Completed Reduction</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-geist text-5xl font-semibold text-white">
                  <AnimatedNumber value={completedReduction} />
                </span>
                <span className="font-inter text-base text-[#80bea6]">kg CO2e</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <div className="bg-[#b0f0d6]/20 rounded-xl px-2 py-0.5 flex items-center gap-1 backdrop-blur-sm border border-[#b0f0d6]/30">
                  <span className="material-symbols-outlined text-[14px] text-[#b0f0d6]" style={{ fontVariationSettings: "'FILL' 0" }}>moving</span>
                  <span className="font-geist text-xs text-[#b0f0d6]">{potentialReduction} kg potential committed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Goals Completed */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#b0f0d6]/20 rounded-full blur-2xl group-hover:bg-[#b0f0d6]/30 transition-all duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Goals Completed</h2>
                <div className="w-10 h-10 rounded-full bg-[#064e3b] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#80bea6]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-geist text-5xl font-semibold text-[#003527]">
                    <AnimatedNumber value={goalsCompleted} />
                  </span>
                  <span className="font-inter text-base text-[#404944]">of {totalGoalsCount} committed actions completed</span>
                </div>
                <div className="w-full bg-[#dce2f7] rounded-full h-3 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalGoalsCount > 0 ? Math.round((goalsCompleted / totalGoalsCount) * 100) : 0}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#003527] to-[#95d3ba] h-full rounded-full relative"
                  >
                  </motion.div>
                </div>
                <p className="font-geist text-sm text-[#404944] mt-2">{progressPercentage}% to your reduction goal</p>
              </div>
            </article>

            {/* Active Initiatives */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 shadow-sm flex-grow">
                <div className="mb-4 flex justify-between items-end">
                <div>
                  <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Active Habits</h2>
                  <p className="font-inter text-sm text-[#404944] mt-1">Actions you have committed to making.</p>
                </div>
                <span className="font-geist text-4xl font-semibold text-[#003527]">
                  <AnimatedNumber value={activeInitiatives.length} />
                </span>
              </div>
              
              {activeInitiatives.length === 0 ? (
                <div className="bg-[#f9f9ff] border border-[#bfc9c3] rounded-lg p-4 mt-4 text-center">
                  <p className="font-geist text-sm text-[#404944] mb-3">No actions committed yet.</p>
                  <Link to="/actions" className="inline-block bg-[#003527] text-white px-4 py-2 rounded-lg font-geist text-xs font-medium hover:bg-[#064e3b] transition-colors">
                    Explore Recommendations
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2">
                  {activeInitiatives.map((item) => {
                    const meta = CATEGORY_META[item.category] || CATEGORY_META.waste;
                    return (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f1f3ff] transition-colors border border-[#bfc9c3]/30"
                      >
                        <div className={`w-8 h-8 rounded-full ${meta.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <span className={`material-symbols-outlined ${meta.iconColor} text-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-geist text-sm font-medium text-[#141b2b] truncate">{item.title}</h3>
                          <p className="font-geist text-xs text-[#404944]">{item.estimatedReduction} kg CO2e potential</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Impact Commitment Journey Chart */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 flex flex-col shadow-sm relative overflow-hidden h-[400px]">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }}
              />

              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Impact Commitment Journey</h2>
                  <p className="font-inter text-sm text-[#404944] mt-1">Accumulated reduction potential from your committed and completed actions.</p>
                </div>
                {/* Legend */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#003527]" />
                    <span className="font-geist text-xs text-[#404944]">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#95d3ba]" />
                    <span className="font-geist text-xs text-[#404944]">Potential</span>
                  </div>
                </div>
              </div>

              {/* Stacked Bar Chart for Journey */}
              <div className="relative flex-grow flex items-end justify-between pt-6 border-b border-[#bfc9c3] gap-2 sm:gap-4 pb-2 z-10">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-t border-[#bfc9c3] opacity-30 w-full h-0 border-dashed" />
                  ))}
                </div>

                {journeyData.map((d, index) => (
                  <div key={`${d.label}-${index}`} className="relative z-10 flex flex-col justify-end w-full group">
                    <div className="w-full flex justify-center items-end h-[200px] gap-1 relative flex-col">
                      <div className="h-full w-4 flex flex-col justify-end">
                          {/* Potential Bar (Stacked on top) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: d.heightPotential }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="w-full bg-[#95d3ba] rounded-t-sm shadow-sm relative group z-10 cursor-pointer border-b border-[#003527]/20"
                            title={`Potential: ${d.potentialAccumulated}`}
                          >
                          </motion.div>
                          {/* Completed Bar (Base) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: d.heightCompleted }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                            className="w-full bg-[#003527] rounded-sm relative group z-10 cursor-pointer"
                            title={`Completed: ${d.completedAccumulated}`}
                          >
                          </motion.div>
                      </div>

                      {/* Tooltip for combined */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-[#293040] text-[#edf0ff] text-xs py-1.5 px-2.5 rounded-lg whitespace-nowrap transition-opacity shadow-lg z-20 pointer-events-none text-center">
                        <div>Completed: {d.completedAccumulated} kg</div>
                        <div className="text-[#95d3ba]">Potential: {d.potentialAccumulated} kg</div>
                      </div>
                    </div>
                    <span className="font-geist text-xs text-[#404944] text-center mt-3 block truncate">{d.label}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Roadmap Status */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 flex flex-col shadow-sm">
              <div className="mb-4 flex justify-between items-center border-b border-[#bfc9c3] pb-4">
                <div>
                  <h2 className="font-geist text-2xl font-medium text-[#141b2b]">My Action Plan</h2>
                  <p className="font-inter text-sm text-[#404944] mt-1">Actions you are currently working on.</p>
                </div>
                <Link to="/roadmap" className="font-geist text-sm font-medium text-[#003527] hover:underline">View Full Roadmap</Link>
              </div>

              {roadmapItems.length === 0 ? (
                <div className="text-center py-6 text-[#404944]">
                  <p className="font-inter text-sm">No actions in progress.</p>
                </div>
              ) : (
                <div className="flex-grow flex flex-col sm:flex-row relative pt-2 gap-4 overflow-x-auto pb-4 hide-scrollbar mt-4">
                  {/* Horizontal connecting line (desktop) */}
                  <div className="hidden sm:block absolute top-[28px] left-6 right-6 h-px bg-[#bfc9c3]" />
                  {/* Vertical line (mobile) */}
                  <div className="sm:hidden absolute left-[28px] top-6 bottom-6 w-px bg-[#bfc9c3]" />

                  {roadmapItems.map((item) => (
                    <div key={item.label} className="flex sm:flex-col items-start gap-3 relative z-10 bg-white sm:min-w-[160px] flex-1">
                      {/* Node */}
                      <div className="w-8 h-8 rounded-full border-2 border-[#003527] bg-white flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 sm:mx-auto shadow-[0_0_0_4px_rgba(0,53,39,0.1)]">
                        <div className="w-3 h-3 rounded-full bg-[#003527]" />
                      </div>

                      {/* Content */}
                      <div className="sm:text-center mt-1 sm:mt-3 w-full">
                        <h3 className="font-geist text-sm font-medium text-[#141b2b] font-bold">
                          {item.label}
                        </h3>
                        <p className="font-inter text-sm mt-1 text-[#003527] font-medium">
                          Since {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressTracking;
