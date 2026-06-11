import type { CarbonMetrics } from './carbonCalculation';
import type { CommittedAction } from '../types';

export interface ProgressMetrics {
  potentialReduction: number;
  completedReduction: number;
  progressPercentage: number;
  goalsCompleted: number;
  activeHabits: number;
  journeyData: {
    label: string;
    potentialAccumulated: number;
    completedAccumulated: number;
    heightPotential: string;
    heightCompleted: string;
  }[];
}

export function calculateProgressMetrics(metrics: CarbonMetrics, actions: CommittedAction[]): ProgressMetrics {
  let potentialReduction = 0;
  let completedReduction = 0;
  let activeHabits = 0;
  let goalsCompleted = 0;

  actions.forEach(a => {
    if (a.status === 'completed') {
      completedReduction += a.estimatedReduction;
      goalsCompleted += 1;
    } else if (a.status === 'committed') {
      potentialReduction += a.estimatedReduction;
      activeHabits += 1;
    }
  });

  const progressPercentage = metrics.reductionGoalKg > 0 
    ? Math.min(100, Math.round((completedReduction / metrics.reductionGoalKg) * 100))
    : 0;

  // Build Impact Commitment Journey chart data based on actual timestamps
  type Event = { time: number; type: 'commit' | 'complete'; val: number };
  const events: Event[] = [];
  
  actions.forEach(a => {
    if (a.committedAt) events.push({ time: a.committedAt, type: 'commit', val: a.estimatedReduction });
    if (a.completedAt) events.push({ time: a.completedAt, type: 'complete', val: a.estimatedReduction });
  });
  
  events.sort((a, b) => a.time - b.time);
  
  let currentPotential = 0;
  let currentCompleted = 0;
  
  const journeyDataMap = new Map<string, { potentialAccumulated: number, completedAccumulated: number }>();
  
  events.forEach(e => {
    if (e.type === 'commit') {
        currentPotential += e.val;
    } else if (e.type === 'complete') {
        currentPotential = Math.max(0, currentPotential - e.val); // Move from potential to completed
        currentCompleted += e.val;
    }
    
    const dateStr = new Date(e.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    journeyDataMap.set(dateStr, { potentialAccumulated: currentPotential, completedAccumulated: currentCompleted });
  });

  const journeyData = Array.from(journeyDataMap.entries()).map(([label, data]) => {
    const totalMax = Math.max(metrics.reductionGoalKg, currentPotential + currentCompleted, 1);
    return {
      label,
      potentialAccumulated: data.potentialAccumulated,
      completedAccumulated: data.completedAccumulated,
      heightPotential: `${Math.min(100, Math.round((data.potentialAccumulated / totalMax) * 100))}%`,
      heightCompleted: `${Math.min(100, Math.round((data.completedAccumulated / totalMax) * 100))}%`,
    };
  });

  // Flat baseline if no actions taken yet
  if (journeyData.length === 0) {
    journeyData.push({
      label: 'Today',
      potentialAccumulated: 0,
      completedAccumulated: 0,
      heightPotential: '0%',
      heightCompleted: '0%'
    });
  }

  return {
    potentialReduction,
    completedReduction,
    progressPercentage,
    goalsCompleted,
    activeHabits,
    journeyData,
  };
}
