export interface UserProfile {
  location: string;
  householdSize: number;
  budgetConstraint: 'Low Cost Only' | 'Moderate Investment' | 'High Investment';
  dietType: 'Heavy Meat' | 'Average Meat' | 'Vegetarian' | 'Vegan';
  transportHabits: string;
  energySource: 'Grid (Fossil/Coal)' | 'Grid (Natural Gas)' | 'Renewable (Solar/Wind)';
  statedPriorities: string;
}

export interface CarbonBreakdown {
  transport: number;
  diet: number;
  energy: number;
  consumption: number;
}

export interface CarbonFootprint {
  total_kg: number;
  breakdown: CarbonBreakdown;
}

export interface ActionRecommendation {
  rank: number;
  title: string;
  category: 'Transport' | 'Diet' | 'Energy' | 'Consumption';
  current_co2_contribution_kg: number;
  projected_savings_kg: number;
  rationale: string;
  relatable_equivalence: string;
  cost: 'Zero' | 'Low' | 'Medium' | 'High';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SimulationResult {
  new_footprint_kg: number;
  savings_kg: number;
  narrative: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  description: string;
  savings_tons: number;
  progress_percent?: number;
  icon: string;
}
