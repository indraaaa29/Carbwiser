import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../lib/recommendationEngine';
import type { UserProfile } from '../lib/recommendationEngine';

describe('Recommendation Engine', () => {
  it('prioritises mobility recommendations for heavy transport users', () => {
    const highTransportProfile: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 400, // Very long commute
      energySource: 'renewable', // Energy is already clean
      monthlyKwh: 100,
      householdSize: '4',
      dietType: 'vegan', // Diet is clean
      reductionGoal: '25',
    };

    const recs = generateRecommendations(highTransportProfile);

    // The primary recommendation or top recommendations should belong to the mobility category
    expect(recs.length).toBeGreaterThan(0);
    const topRec = recs[0];
    expect(topRec.category).toBe('mobility');
    expect(topRec.isPrimary).toBe(true);

    // Should contain public transport or WFH recommendation
    const ids = recs.map(r => r.id);
    expect(ids).toContain('public-transport');
  });

  it('prioritises energy recommendations for high energy users', () => {
    const highEnergyProfile: UserProfile = {
      transportMode: 'walk', // Clean transport
      weeklyDistance: 10,
      energySource: 'grid',  // High grid reliance
      monthlyKwh: 900,       // Very high usage
      householdSize: '1',
      dietType: 'vegan',     // Clean diet
      reductionGoal: '25',
    };

    const recs = generateRecommendations(highEnergyProfile);

    expect(recs.length).toBeGreaterThan(0);
    const topRec = recs[0];
    expect(topRec.category).toBe('energy');

    const ids = recs.map(r => r.id);
    expect(ids).toContain('green-energy-tariff');
  });

  it('generates different recommendations for different profiles', () => {
    const p1: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 300,
      energySource: 'renewable',
      monthlyKwh: 150,
      householdSize: '2',
      dietType: 'vegan',
      reductionGoal: '50',
    };

    const p2: UserProfile = {
      transportMode: 'walk',
      weeklyDistance: 10,
      energySource: 'grid',
      monthlyKwh: 600,
      householdSize: '2',
      dietType: 'omnivore',
      reductionGoal: '10',
    };

    const recs1 = generateRecommendations(p1);
    const recs2 = generateRecommendations(p2);

    const firstTopRec = recs1[0];
    const secondTopRec = recs2[0];

    // Top recommendations should differ in focus
    expect(firstTopRec.id).not.toBe(secondTopRec.id);
    expect(firstTopRec.category).toBe('mobility');
    // For p2, omnivore diet + high energy grid should rank energy or food/diet actions highly
    expect(['energy', 'waste'].includes(secondTopRec.category)).toBe(true);
  });
});
