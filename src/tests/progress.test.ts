import { describe, it, expect } from 'vitest';
import { calculateProgressMetrics } from '../lib/progress';
import type { CarbonMetrics } from '../lib/carbonCalculation';
import type { CommittedAction } from '../types';

describe('Progress Tracking Logic', () => {
  it('calculates metrics based on committed actions correctly', () => {
    const metrics: CarbonMetrics = {
      total: 6000,
      ecoScore: 57,
      ecoScoreLabel: 'Good',
      reductionGoalKg: 1500,
      categories: {
        transportation: { kg: 2000, percentage: 33 },
        energy: { kg: 2000, percentage: 33 },
        food: { kg: 2000, percentage: 33 },
      },
    };

    const actions: CommittedAction[] = [
      { id: '1', title: 'Action 1', category: 'mobility', difficulty: 'easy', estimatedReduction: 100, committedAt: 1000, status: 'committed' },
      { id: '2', title: 'Action 2', category: 'energy', difficulty: 'moderate', estimatedReduction: 200, committedAt: 2000, completedAt: 3000, status: 'completed' },
      { id: '3', title: 'Action 3', category: 'food', difficulty: 'hard', estimatedReduction: 300, committedAt: 4000, status: 'committed' }
    ];

    const progress = calculateProgressMetrics(metrics, actions);

    expect(progress.potentialReduction).toBe(400); // 100 + 300
    expect(progress.completedReduction).toBe(200); // 200
    expect(progress.activeHabits).toBe(2);
    expect(progress.goalsCompleted).toBe(1);
    expect(progress.progressPercentage).toBe(13); // Math.round(200 / 1500 * 100) = 13%

    // Journey Data should have events mapped out
    expect(progress.journeyData.length).toBeGreaterThan(0);
    expect(progress.journeyData[progress.journeyData.length - 1].potentialAccumulated).toBe(400);
    expect(progress.journeyData[progress.journeyData.length - 1].completedAccumulated).toBe(200);
  });
});
