import React from 'react';
import type { ActionRecommendation } from '../../types';

interface RoadmapProps {
  actions: ActionRecommendation[];
  adoptedList: number[];
  onToggleHabit: (rank: number, savings: number) => void;
  theme: 'light' | 'dark';
}

interface Milestone {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  description: string;
  savings_tons: number;
  progress_percent?: number;
  icon: string;
  rank: number;
  savings_kg: number;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  actions,
  adoptedList,
  onToggleHabit,
  theme,
}) => {
  const isDark = theme === 'dark';

  // Map actions dynamically to milestones
  const milestones: Milestone[] = actions.map((action) => {
    const isAdopted = adoptedList.includes(action.rank);
    // Find the first unadopted item
    const firstUnadopted = actions.find(a => !adoptedList.includes(a.rank));
    
    // Status resolution
    let status: 'Completed' | 'In Progress' | 'Upcoming' = 'Upcoming';
    if (isAdopted) {
      status = 'Completed';
    } else if (firstUnadopted && firstUnadopted.rank === action.rank) {
      status = 'In Progress';
    }

    // Icon resolution
    let icon: string;
    if (status === 'Completed') {
      icon = 'check';
    } else if (status === 'In Progress') {
      icon = action.category === 'Transport' ? 'directions_bus' : 'sync';
    } else {
      icon = action.category === 'Energy' ? 'solar_power' : 'eco';
    }

    return {
      id: `ms_${action.rank}`,
      title: action.title,
      category: action.category,
      status,
      description: action.rationale,
      savings_tons: parseFloat((action.projected_savings_kg / 1000).toFixed(2)),
      progress_percent: status === 'In Progress' ? 60 : undefined,
      icon,
      rank: action.rank,
      savings_kg: action.projected_savings_kg
    };
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-sage-muted text-secondary';
      case 'In Progress': return 'bg-secondary-fixed text-on-secondary-fixed-variant';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const currentTons = actions
    .filter(a => !adoptedList.includes(a.rank))
    .reduce((sum, a) => sum + a.projected_savings_kg, 1800) / 1000;

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface min-h-screen text-on-surface">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-xl">
          <h2 className="text-display-lg font-display-lg text-primary mb-sm">Carbon Roadmap</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">Your guided path to sustainability. Track your milestones and projected impact over time.</p>
        </header>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-md mb-2xl">
          <div className="bg-surface-white dark:bg-surface-container border border-surface-variant rounded-xl p-lg hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-md">
              <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Current Footprint</h3>
              <span className="material-symbols-outlined text-outline">co2</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="text-headline-lg font-headline-lg text-primary">
                {currentTons.toFixed(1)}
              </span>
              <span className="text-body-md font-body-md text-on-surface-variant">tons/year</span>
            </div>
            <div className="mt-md bg-surface-container-low rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (currentTons / 6) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-surface-white dark:bg-surface-container border border-surface-variant rounded-xl p-lg hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-md">
              <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Target Footprint</h3>
              <span className="material-symbols-outlined text-secondary">flag</span>
            </div>
            <div className="flex items-baseline gap-sm">
              <span className="text-headline-lg font-headline-lg text-secondary">1.8</span>
              <span className="text-body-md font-body-md text-on-surface-variant">tons/year</span>
            </div>
            <p className="text-label-sm font-label-sm text-secondary-container mt-md bg-primary-container inline-block px-sm py-xs rounded-full">Objective: Dec 2026</p>
          </div>
        </section>

        {/* Vertical Roadmap Journey */}
        <section className="relative">
          <div className="timeline-line"></div>

          {milestones.map((ms) => {
            const isCompleted = ms.status === 'Completed';
            const isInProgress = ms.status === 'In Progress';
            const isUpcoming = ms.status === 'Upcoming';

            return (
              <article
                key={ms.id}
                onClick={() => onToggleHabit(ms.rank, ms.savings_kg)}
                className={`relative pl-xl mb-xl group cursor-pointer transition-opacity ${
                  isUpcoming ? 'opacity-70 hover:opacity-100' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className={`timeline-dot transition-all ${
                  isCompleted 
                    ? 'bg-primary text-surface-white' 
                    : isInProgress 
                    ? 'bg-secondary-fixed text-on-secondary-fixed-variant' 
                    : 'bg-surface-variant text-outline'
                }`}>
                  <span className={`material-symbols-outlined text-[16px] ${isInProgress ? 'animate-spin' : ''}`}>
                    {ms.icon}
                  </span>
                </div>

                {/* Timeline Card */}
                <div className={`bg-surface-white dark:bg-surface-container rounded-xl p-lg transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(1,45,29,0.04)] ${
                  isInProgress 
                    ? 'border-2 border-primary-fixed shadow-[0_4px_20px_rgba(1,45,29,0.04)]' 
                    : isDark 
                    ? 'border border-white/5' 
                    : 'border border-surface-variant'
                } relative overflow-hidden`}>
                  {isInProgress && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  )}
                  
                  <div className="flex justify-between items-start mb-sm gap-2">
                    <div className="flex-grow">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant opacity-80 block mb-1">{ms.category}</span>
                      <h4 className="text-headline-md font-headline-md text-primary dark:text-inverse-primary leading-tight">{ms.title}</h4>
                    </div>
                    <span className={`px-sm py-xs rounded-full text-label-sm font-label-sm flex items-center gap-xs shrink-0 ${getStatusClass(ms.status)}`}>
                      {isInProgress && <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>}
                      {ms.status}
                    </span>
                  </div>

                  <p className="text-body-md font-body-md text-on-surface-variant mb-md">{ms.description}</p>
                  
                  {isInProgress && ms.progress_percent !== undefined && (
                    <div className="mb-md">
                      <div className="mb-sm flex justify-between text-label-sm font-label-sm text-on-surface-variant">
                        <span>Progress</span>
                        <span>{ms.progress_percent}%</span>
                      </div>
                      <div className="bg-surface-container-low rounded-full h-2 overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: `${ms.progress_percent}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center gap-xs font-label-md text-label-md ${isUpcoming ? 'text-outline' : 'text-secondary'}`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {isUpcoming ? 'target' : 'arrow_downward'}
                    </span>
                    <span>
                      {isUpcoming ? 'Est. Impact: ' : isCompleted ? '' : 'Projected: '}-{ms.savings_tons} tons CO2
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};
