import { WORK_DAYS_PER_WEEK, MAX_MEALS_PER_WEEK } from '../constants/carbonFactors';
import type { UserProfile } from './recommendationEngine';

export interface SimState {
  remoteWorkDays: number;
  switchToEv: boolean;
  thermostatOffset: number;
  greenEnergyTariff: boolean;
  plantBasedMeals: number;
  locallySourced: boolean;
}

// ─── UI range bounds (exported for WhatIfSimulator) ───────────────────────────
export const REMOTE_DAYS_MIN = 0;
export const REMOTE_DAYS_MAX = WORK_DAYS_PER_WEEK;
export const THERMOSTAT_MIN = -3;
export const THERMOSTAT_MAX = 3;
export const PLANT_MEALS_MIN = 0;
export const PLANT_MEALS_MAX = MAX_MEALS_PER_WEEK;

// ─── Cost savings estimates (USD/year) ───────────────────────────────────────
const REMOTE_SAVINGS_PER_DAY = 25;
const EV_ANNUAL_SAVINGS = 240;
const GREEN_TARIFF_SAVINGS = 180;
const PLANT_MEAL_SAVINGS = 15;

// ─── Thermostat efficiency ───────────────────────────────────────────────────
/** Each 1°C thermostat adjustment changes energy use by this fraction */
const THERMOSTAT_EFFICIENCY = 0.05;

// ─── Diet shift thresholds (plant-based meals per week) ──────────────────────
/** 3 plant-based meals/week shifts omnivore → flexitarian */
const FLEXITARIAN_THRESHOLD = 3;
/** 7 plant-based meals/week (~1/day) shifts to vegetarian */
const VEGETARIAN_THRESHOLD = 7;
/** 14 plant-based meals/week (~2/day) shifts to vegan */
const VEGAN_THRESHOLD = 14;
/** Number of diet tiers to shift when locallySourced is enabled */
const LOCAL_SOURCE_SHIFT = 1;

export function calcSavings(state: SimState): number {
  let savings = 0;
  savings += state.remoteWorkDays * REMOTE_SAVINGS_PER_DAY;
  if (state.switchToEv) savings += EV_ANNUAL_SAVINGS;
  if (state.greenEnergyTariff) savings += GREEN_TARIFF_SAVINGS;
  savings += state.plantBasedMeals * PLANT_MEAL_SAVINGS;
  return savings;
}

const DIET_TIERS: UserProfile['dietType'][] = ['omnivore', 'flexitarian', 'vegetarian', 'vegan'];

function shiftDiet(current: string, levels: number): UserProfile['dietType'] {
  const idx = DIET_TIERS.indexOf(current as UserProfile['dietType']);
  if (idx === -1) return current as UserProfile['dietType'];
  return DIET_TIERS[Math.max(0, Math.min(DIET_TIERS.length - 1, idx + levels))];
}

export function getSimulatedProfile(p: UserProfile, s: SimState): UserProfile {
  let newDist = Number(p.weeklyDistance) || 0;
  if (s.remoteWorkDays > 0) {
    newDist = newDist * (1 - (s.remoteWorkDays / WORK_DAYS_PER_WEEK));
  }
  
  let newKwh = Number(p.monthlyKwh) || 0;
  if (s.thermostatOffset < 0) {
    newKwh = newKwh * (1 + (s.thermostatOffset * THERMOSTAT_EFFICIENCY));
  }

  let newDiet = p.dietType;
  if (s.plantBasedMeals >= VEGAN_THRESHOLD && p.dietType !== 'vegan') newDiet = 'vegan';
  else if (s.plantBasedMeals >= VEGETARIAN_THRESHOLD && p.dietType !== 'vegan') newDiet = 'vegetarian';
  else if (s.plantBasedMeals >= FLEXITARIAN_THRESHOLD && p.dietType === 'omnivore') newDiet = 'flexitarian';

  if (s.locallySourced) {
    newDiet = shiftDiet(newDiet, LOCAL_SOURCE_SHIFT);
  }

  return {
    ...p,
    transportMode: s.switchToEv ? 'ev' : p.transportMode,
    weeklyDistance: Math.max(0, newDist),
    energySource: s.greenEnergyTariff ? 'renewable' : p.energySource,
    monthlyKwh: Math.max(0, newKwh),
    dietType: newDiet as UserProfile['dietType'],
  };
}
