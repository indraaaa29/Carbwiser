// CarbWiser Type Definitions

export interface EmissionCategory {
  id: string;
  label: string;
  icon: string;
  percentage: number;
  value: number;
  unit: string;
  color: string;
  trackColor: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'mobility' | 'energy' | 'waste' | 'food';
  categoryLabel: string;
  categoryIcon: string;
  estReduction: string;
  impact: 'high' | 'medium' | 'low';
  cost: 'high' | 'medium' | 'low' | 'none';
  difficulty: 'easy' | 'moderate' | 'hard';
  isPrimary?: boolean;
  insight?: string;
  icon: string;
}

export interface RoadmapMilestone {
  id: string;
  week: string;
  title: string;
  description: string;
  departments: string[];
  icon: string;
  isActive: boolean;
}

export interface SimulatorState {
  remoteWorkDays: number;
  switchToEv: boolean;
  thermostatOffset: number;
  greenEnergyTariff: boolean;
  plantBasedMeals: number;
  locallySourced: boolean;
}

export interface ProgressMetric {
  label: string;
  value: number;
  unit: string;
  trend: number;
  trendLabel: string;
}

export interface AssessmentData {
  transportMode: string;
  weeklyDistance: string;
  energySource: string;
  monthlyKwh: string;
  dietType: string;
  householdSize: string;
  reductionGoal: string;
}

export type NavLink = {
  href: string;
  label: string;
  active?: boolean;
};

export interface CommittedAction {
  id: string;
  title: string;
  category: 'mobility' | 'energy' | 'waste' | 'food';
  estimatedReduction: number; // in kg CO2e
  difficulty: 'easy' | 'moderate' | 'hard';
  committedAt: number; // timestamp
  completedAt?: number; // timestamp
  status: 'committed' | 'completed';
}
