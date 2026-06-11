import type { UserProfile } from './recommendationEngine';
import { TRANSPORT_FACTORS, ENERGY_FACTORS, DIET_FACTORS } from '../constants/carbonFactors';

export interface CarbonMetrics {
  total: number;
  ecoScore: number;
  ecoScoreLabel: string;
  reductionGoalKg: number;
  categories: {
    transportation: { kg: number; percentage: number };
    energy: { kg: number; percentage: number };
    food: { kg: number; percentage: number };
  };
}

export function calculateFootprint(profile: UserProfile): CarbonMetrics {
  // 1. Transportation Calculation
  const factor = TRANSPORT_FACTORS[profile.transportMode] ?? TRANSPORT_FACTORS.car;
  const transportAnnualKm = profile.weeklyDistance * 52;
  const transportKg = transportAnnualKm * factor;

  // 2. Energy Calculation
  const eFactor = ENERGY_FACTORS[profile.energySource] ?? ENERGY_FACTORS.grid;
  // Divide home energy by household size roughly
  let hSize = 2;
  if (profile.householdSize === '1') hSize = 1;
  if (profile.householdSize === '3-4') hSize = 3.5;
  if (profile.householdSize === '5+') hSize = 5;
  const energyAnnualKwh = profile.monthlyKwh * 12;
  const energyKg = (energyAnnualKwh * eFactor) / hSize;

  // 3. Food/Diet Calculation
  const foodKg = DIET_FACTORS[profile.dietType] ?? DIET_FACTORS.omnivore;

  // Totals
  const total = Math.round(transportKg + energyKg + foodKg);

  const tPercent = Math.round((transportKg / total) * 100) || 0;
  const ePercent = Math.round((energyKg / total) * 100) || 0;
  const fPercent = Math.round((foodKg / total) * 100) || 0;

  // Eco Score calculation
  // Let's assume a baseline "Average" footprint is around 7000 kg.
  // 0 kg -> 100 score, 7000 kg -> 50 score, 14000+ kg -> 0 score
  let ecoScore = 100 - (total / 7000) * 50;
  ecoScore = Math.max(0, Math.min(100, Math.round(ecoScore)));

  let ecoScoreLabel = 'Average';
  if (ecoScore >= 80) ecoScoreLabel = 'Excellent';
  else if (ecoScore >= 60) ecoScoreLabel = 'Good';
  else if (ecoScore < 40) ecoScoreLabel = 'Needs Work';

  // Reduction target
  const goalValue = profile.reductionGoal === 'zero' ? 100 : Number(profile.reductionGoal) || 25;
  const reductionGoalKg = Math.round(total * (goalValue / 100));

  return {
    total,
    ecoScore,
    ecoScoreLabel,
    reductionGoalKg,
    categories: {
      transportation: { kg: Math.round(transportKg), percentage: tPercent },
      energy: { kg: Math.round(energyKg), percentage: ePercent },
      food: { kg: Math.round(foodKg), percentage: fPercent },
    }
  };
}
