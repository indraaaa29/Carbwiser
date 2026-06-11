import type { CarbonMetrics } from './carbonCalculation';

export interface ProgressMetrics {
  baseMonthly: number;
  targetMonthly: number;
  reducedSoFar: number;
  monthlyData: {
    month: string;
    actual: number;
    target: number;
    height: string;
    targetPct: string;
  }[];
}

export function calculateProgressMetrics(metrics: CarbonMetrics): ProgressMetrics {
  const baseMonthly = Math.round(metrics.total / 12);
  const targetMonthly = Math.round((metrics.total - metrics.reductionGoalKg) / 12);
  const reducedSoFar = Math.max(0, Math.round(metrics.reductionGoalKg * 0.3));

  const monthlyData = [
    { month: 'Jan', actual: Math.round(baseMonthly * 1.15), target: Math.round(baseMonthly * 1.1) },
    { month: 'Feb', actual: Math.round(baseMonthly * 1.1), target: Math.round(baseMonthly * 1.05) },
    { month: 'Mar', actual: Math.round(baseMonthly * 1.05), target: Math.round(baseMonthly * 1.0) },
    { month: 'Apr', actual: Math.round(baseMonthly * 1.02), target: Math.round(targetMonthly * 1.15) },
    { month: 'May', actual: Math.round(baseMonthly * 0.98), target: Math.round(targetMonthly * 1.05) },
    { month: 'Jun', actual: baseMonthly, target: targetMonthly },
  ].map((d) => ({
    ...d,
    height: `${Math.min(100, Math.round((d.actual / (baseMonthly * 1.2)) * 100))}%`,
    targetPct: `${Math.min(100, Math.round((d.target / (baseMonthly * 1.2)) * 100))}%`,
  }));

  return {
    baseMonthly,
    targetMonthly,
    reducedSoFar,
    monthlyData,
  };
}
