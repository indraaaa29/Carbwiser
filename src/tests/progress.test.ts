import { describe, it, expect } from 'vitest';
import { calculateProgressMetrics } from '../lib/progress';
import type { CarbonMetrics } from '../lib/carbonCalculation';

describe('Progress Tracking Logic', () => {
  it('calculates monthly and trajectory metrics correctly', () => {
    const metrics: CarbonMetrics = {
      total: 6000,
      ecoScore: 57,
      ecoScoreLabel: 'Good',
      reductionGoalKg: 1500, // 25% goal
      categories: {
        transportation: { kg: 2000, percentage: 33 },
        energy: { kg: 2000, percentage: 33 },
        food: { kg: 2000, percentage: 33 },
      },
    };

    const progress = calculateProgressMetrics(metrics);

    // baseMonthly = 6000 / 12 = 500 kg
    expect(progress.baseMonthly).toBe(500);

    // targetMonthly = (6000 - 1500) / 12 = 375 kg
    expect(progress.targetMonthly).toBe(375);

    // reducedSoFar = 1500 * 0.3 = 450 kg
    expect(progress.reducedSoFar).toBe(450);

    // monthlyData should have 6 entries
    expect(progress.monthlyData.length).toBe(6);
    expect(progress.monthlyData[0].month).toBe('Jan');
    expect(progress.monthlyData[5].month).toBe('Jun');

    // Verify height and targetPct formatting (contains %)
    expect(progress.monthlyData[0].height).toContain('%');
    expect(progress.monthlyData[0].targetPct).toContain('%');
  });
});
