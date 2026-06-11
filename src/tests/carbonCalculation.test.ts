import { describe, it, expect } from 'vitest';
import { calculateFootprint } from '../lib/carbonCalculation';
import type { UserProfile } from '../lib/recommendationEngine';

describe('Carbon Calculation Engine', () => {
  it('calculates carbon footprint for a high-emission profile correctly', () => {
    const highProfile: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 300, // Long distance commute
      energySource: 'grid',
      monthlyKwh: 800,     // Heavy grid reliance
      householdSize: '1',  // Divided by 1
      dietType: 'omnivore',
      reductionGoal: '25',
    };

    const metrics = calculateFootprint(highProfile);

    // Transport emissions: 300 * 52 * 0.21 = 3276 kg
    // Energy emissions: (800 * 12 * 0.233) / 1 = 2236.8 -> ~2237 kg
    // Food emissions: 2500 kg
    // Total: 3276 + 2237 + 2500 = 8013 kg
    expect(metrics.total).toBeCloseTo(8013, 0);
    expect(metrics.categories.transportation.kg).toBeCloseTo(3276, 0);
    expect(metrics.categories.energy.kg).toBeCloseTo(2237, 0);
    expect(metrics.categories.food.kg).toBeCloseTo(2500, 0);
  });

  it('calculates carbon footprint for a medium-emission profile correctly', () => {
    const medProfile: UserProfile = {
      transportMode: 'bus',
      weeklyDistance: 80,
      energySource: 'mixed',
      monthlyKwh: 400,
      householdSize: '2',  // Divided by 2
      dietType: 'flexitarian',
      reductionGoal: '25',
    };

    const metrics = calculateFootprint(medProfile);

    // Transport: 80 * 52 * 0.10 = 416 kg
    // Energy: (400 * 12 * 0.15) / 2 = 360 kg
    // Food: 1800 kg
    // Total: 416 + 360 + 1800 = 2576 kg
    expect(metrics.total).toBeCloseTo(2576, 0);
    expect(metrics.categories.transportation.kg).toBeCloseTo(416, 0);
    expect(metrics.categories.energy.kg).toBeCloseTo(360, 0);
    expect(metrics.categories.food.kg).toBeCloseTo(1800, 0);
  });

  it('calculates carbon footprint for a low-emission profile correctly', () => {
    const lowProfile: UserProfile = {
      transportMode: 'walk',
      weeklyDistance: 20,
      energySource: 'renewable',
      monthlyKwh: 200,
      householdSize: '3-4', // Divided by 3.5
      dietType: 'vegan',
      reductionGoal: '25',
    };

    const metrics = calculateFootprint(lowProfile);

    // Transport: 20 * 52 * 0 = 0 kg
    // Energy: (200 * 12 * 0) / 3.5 = 0 kg
    // Food: 800 kg
    // Total: 800 kg
    expect(metrics.total).toBe(800);
    expect(metrics.categories.transportation.kg).toBe(0);
    expect(metrics.categories.energy.kg).toBe(0);
    expect(metrics.categories.food.kg).toBe(800);
  });

  it('verifies that changing inputs changes calculations', () => {
    const baseProfile: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 100,
      energySource: 'grid',
      monthlyKwh: 300,
      householdSize: '2',
      dietType: 'omnivore',
      reductionGoal: '25',
    };

    const firstMetrics = calculateFootprint(baseProfile);

    const changedProfile = {
      ...baseProfile,
      weeklyDistance: 200, // Double distance
      dietType: 'vegan',   // Green diet
    };

    const secondMetrics = calculateFootprint(changedProfile);

    expect(firstMetrics.total).not.toBe(secondMetrics.total);
    expect(secondMetrics.categories.transportation.kg).toBeGreaterThan(firstMetrics.categories.transportation.kg);
    expect(secondMetrics.categories.food.kg).toBeLessThan(firstMetrics.categories.food.kg);
  });
});
