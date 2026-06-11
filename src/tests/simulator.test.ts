import { describe, it, expect } from 'vitest';
import { calcSavings, getSimulatedProfile } from '../lib/simulator';
import type { SimState } from '../lib/simulator';
import type { UserProfile } from '../lib/recommendationEngine';

describe('What-If Simulator Logic', () => {
  it('calculates financial savings correctly based on SimState', () => {
    const state: SimState = {
      remoteWorkDays: 2,       // 2 * 25 = 50
      switchToEv: true,        // 240
      thermostatOffset: -1,    // no savings value direct, savings for energy is greenEnergyTariff
      greenEnergyTariff: true, // 180
      plantBasedMeals: 5,      // 5 * 15 = 75
      locallySourced: true,    // local sourcing has carbon bonus but no direct money savings
    };

    // Total savings: 50 + 240 + 180 + 75 = 545
    const savings = calcSavings(state);
    expect(savings).toBe(545);
  });

  it('updates simulated user profile based on simulator actions', () => {
    const profile: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 100,
      energySource: 'grid',
      monthlyKwh: 400,
      householdSize: '2',
      dietType: 'omnivore',
      reductionGoal: '25',
    };

    const state: SimState = {
      remoteWorkDays: 2,       // 40% reduction in weeklyDistance (100 * 0.6 = 60km)
      switchToEv: true,        // transportMode EV
      thermostatOffset: -2,    // 10% reduction in energy usage (400 * 0.9 = 360kWh)
      greenEnergyTariff: true, // energySource renewable
      plantBasedMeals: 7,      // vegetarian diet
      locallySourced: false,
    };

    const simulated = getSimulatedProfile(profile, state);

    expect(simulated.transportMode).toBe('ev');
    expect(simulated.weeklyDistance).toBe(60);
    expect(simulated.energySource).toBe('renewable');
    expect(simulated.monthlyKwh).toBe(360);
    expect(simulated.dietType).toBe('vegetarian');
  });

  it('verifies diet conversion thresholds for plant based meals', () => {
    const profile: UserProfile = {
      transportMode: 'car',
      weeklyDistance: 100,
      energySource: 'grid',
      monthlyKwh: 400,
      householdSize: '2',
      dietType: 'omnivore',
      reductionGoal: '25',
    };

    // 0-2 meals
    const simulated0 = getSimulatedProfile(profile, {
      remoteWorkDays: 0,
      switchToEv: false,
      thermostatOffset: 0,
      greenEnergyTariff: false,
      plantBasedMeals: 2,
      locallySourced: false,
    });
    expect(simulated0.dietType).toBe('omnivore');

    // 3 meals -> flexitarian
    const simulated3 = getSimulatedProfile(profile, {
      remoteWorkDays: 0,
      switchToEv: false,
      thermostatOffset: 0,
      greenEnergyTariff: false,
      plantBasedMeals: 3,
      locallySourced: false,
    });
    expect(simulated3.dietType).toBe('flexitarian');

    // 7 meals -> vegetarian
    const simulated7 = getSimulatedProfile(profile, {
      remoteWorkDays: 0,
      switchToEv: false,
      thermostatOffset: 0,
      greenEnergyTariff: false,
      plantBasedMeals: 7,
      locallySourced: false,
    });
    expect(simulated7.dietType).toBe('vegetarian');

    // 14 meals -> vegan
    const simulated14 = getSimulatedProfile(profile, {
      remoteWorkDays: 0,
      switchToEv: false,
      thermostatOffset: 0,
      greenEnergyTariff: false,
      plantBasedMeals: 14,
      locallySourced: false,
    });
    expect(simulated14.dietType).toBe('vegan');
  });
});
