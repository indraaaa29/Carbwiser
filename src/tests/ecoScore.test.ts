import { describe, it, expect } from 'vitest';
import { calculateFootprint } from '../lib/carbonCalculation';
import type { UserProfile } from '../lib/recommendationEngine';

describe('Eco Score Logic', () => {
  it('assigns Excellent label to very low carbon footprints', () => {
    const profile: UserProfile = {
      transportMode: 'walk',
      weeklyDistance: 10,
      energySource: 'renewable',
      monthlyKwh: 100,
      householdSize: '2',
      dietType: 'vegan',
      reductionGoal: '25',
    };
    // Total should be around 800 kg. Eco score is 100 - (800 / 7000) * 50 = 94.2
    const metrics = calculateFootprint(profile);
    expect(metrics.ecoScore).toBeGreaterThanOrEqual(80);
    expect(metrics.ecoScoreLabel).toBe('Excellent');
  });

  it('assigns Good label to moderate footprints', () => {
    // Total is ~1800 (food) + 260 (transport) + 270 (energy) = 2330 kg.
    // Score is 100 - (2330 / 7000) * 50 = 83.3 -> Actually this might also fall into Excellent. Let's make it higher for "Good".
    // Let's check with an omnivore.
    const profile2: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 80,
      energySource: 'grid',
      monthlyKwh: 400,
      householdSize: '2',
      dietType: 'flexitarian',
      reductionGoal: '25',
    };
    const metrics = calculateFootprint(profile2);
    // Total should be around 3500 kg. Score should be ~75.
    expect(metrics.ecoScore).toBeLessThan(80);
    expect(metrics.ecoScore).toBeGreaterThanOrEqual(60);
    expect(metrics.ecoScoreLabel).toBe('Good');
  });

  it('assigns Needs Work label to high footprints', () => {
    const profile: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 300,
      energySource: 'grid',
      monthlyKwh: 800,
      householdSize: '1',
      dietType: 'omnivore',
      reductionGoal: '25',
    };
    // Total is ~8000 kg. Score is 100 - (8000 / 7000) * 50 = 42.8. Let's make it even higher.
    const superHighProfile: UserProfile = {
      ...profile,
      weeklyDistance: 500,
      monthlyKwh: 1200,
    };
    const metrics2 = calculateFootprint(superHighProfile);
    // Score is < 40.
    expect(metrics2.ecoScore).toBeLessThan(40);
    expect(metrics2.ecoScoreLabel).toBe('Needs Work');
  });

  it('verifies that eco score changes dynamically based on emission levels', () => {
    const p1: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 200,
      energySource: 'grid',
      monthlyKwh: 500,
      householdSize: '1',
      dietType: 'omnivore',
      reductionGoal: '25',
    };
    const p2: UserProfile = {
      ...p1,
      transportMode: 'walk', // green choice
      dietType: 'vegan',     // green choice
    };

    const metrics1 = calculateFootprint(p1);
    const metrics2 = calculateFootprint(p2);

    expect(metrics1.ecoScore).not.toBe(metrics2.ecoScore);
    expect(metrics2.ecoScore).toBeGreaterThan(metrics1.ecoScore);
  });
});
