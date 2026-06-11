export const TRANSPORT_FACTORS: Record<string, number> = {
  car: 0.21,    // kg CO2e per km
  ev: 0.05,     // assuming average grid mix
  bus: 0.10,
  metro: 0.04,
  bike: 0,
  walk: 0,
};

export const ENERGY_FACTORS: Record<string, number> = {
  grid: 0.233,  // kg CO2e per kWh
  renewable: 0.0,
  gas: 0.202,
  mixed: 0.15,
};

export const DIET_FACTORS: Record<string, number> = {
  omnivore: 2500,    // kg CO2e per year
  flexitarian: 1800,
  vegetarian: 1200,
  vegan: 800,
};

// ─── Shared conversion constants ──────────────────────────────────────────────
/** Convert kg to metric tonnes */
export const KG_TO_TONNE = 1000;

/** Multiply a ratio by this to get a percentage (0-100) */
export const PCT_MULTIPLIER = 100;

/** Maximum remote work days in a 5-day work week */
export const WORK_DAYS_PER_WEEK = 5;

/** Max plant-based meals assuming 3 meals/day × 7 days */
export const MAX_MEALS_PER_WEEK = 21;
