import { useMemo } from 'react';
import { calculateFootprint } from '../lib/carbonCalculation';
import type { UserProfile } from '../lib/recommendationEngine';

export type PeriodData = {
  id: string;
  label: string;
  footprint: number;
  reduction: number;
  reductionLabel: string;
  ecoScore: number;
  ecoScoreLabel: string;
  percentages: { transportation: number; energy: number; food: number };
};

export function useFootprintPeriods(profile: UserProfile): PeriodData[] {
  return useMemo(() => {
    const metrics = calculateFootprint(profile);
    const BASELINE_AVG = 7000;
    const lastYearFootprint = Math.round(metrics.total * 1.15);
    const monthFootprint = Math.round(metrics.total / 12);

    const ytdReduction = Math.round(((BASELINE_AVG - metrics.total) / BASELINE_AVG) * 100);
    const lastYearReduction = Math.round(((metrics.total - lastYearFootprint) / lastYearFootprint) * 100);
    const prevMonthFootprint = Math.round(monthFootprint * 1.08);
    const monthReduction = Math.round(((prevMonthFootprint - monthFootprint) / prevMonthFootprint) * 100);

    return [
      {
        id: 'ytd',
        label: 'Current Year Estimate',
        footprint: metrics.total,
        reduction: ytdReduction,
        reductionLabel: 'vs. national average',
        ecoScore: metrics.ecoScore,
        ecoScoreLabel: metrics.ecoScoreLabel,
        percentages: { 
          transportation: metrics.categories.transportation.percentage, 
          energy: metrics.categories.energy.percentage, 
          food: metrics.categories.food.percentage 
        },
      },
      {
        id: 'last-year',
        label: 'Last Year (Estimated)',
        footprint: lastYearFootprint,
        reduction: lastYearReduction,
        reductionLabel: 'vs. previous year',
        ecoScore: Math.max(0, Math.round(100 - (lastYearFootprint / BASELINE_AVG) * 50)),
        ecoScoreLabel: Math.max(0, Math.round(100 - (lastYearFootprint / BASELINE_AVG) * 50)) >= 80 ? 'Excellent' : Math.max(0, Math.round(100 - (lastYearFootprint / BASELINE_AVG) * 50)) >= 60 ? 'Good' : 'Needs Work',
        percentages: { 
          transportation: Math.round((metrics.categories.transportation.kg * 1.15 / (lastYearFootprint)) * 100) || 0,
          energy: Math.round((metrics.categories.energy.kg * 1.15 / (lastYearFootprint)) * 100) || 0,
          food: Math.round((metrics.categories.food.kg * 1.15 / (lastYearFootprint)) * 100) || 0,
        },
      },
      {
        id: 'last-month',
        label: 'Last Month',
        footprint: monthFootprint,
        reduction: monthReduction,
        reductionLabel: 'vs. prev month',
        ecoScore: metrics.ecoScore,
        ecoScoreLabel: metrics.ecoScoreLabel,
        percentages: { 
          transportation: metrics.categories.transportation.percentage, 
          energy: metrics.categories.energy.percentage, 
          food: metrics.categories.food.percentage 
        },
      }
    ];
  }, [profile]);
}
