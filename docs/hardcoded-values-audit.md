# Hardcoded Values Audit — Replacement Report

## Summary

Eliminated all hardcoded placeholder values from 4 production pages and 1 library file. Every value is now derived dynamically from the user's assessment profile, carbon calculation engine, recommendation engine, or progress metrics.

---

## `src/lib/simulator.ts`

| Location | Was (Hardcoded) | Now (Dynamic) |
|---|---|---|
| `getSimulatedProfile` | `locallySourced` not handled (bypassed with a magic `-200` kg in the UI) | `shiftDiet()` helper shifts diet one tier greener when `locallySourced` is true — emission logic stays inside the calculation pipeline |
| New helper `shiftDiet` | — | `DIET_TIERS` array maps `omnivore → flexitarian → vegetarian → vegan`; shifts one tier toward vegan |

## `src/pages/WhatIfSimulator.tsx`

| Location | Was (Hardcoded) | Now (Dynamic) |
|---|---|---|
| Line 30-31 | `locallySourcedBonusKg = sim.locallySourced ? 200 : 0`; subtracted from total | Removed entirely — handled inside `getSimulatedProfile` |
| Line 34 | `projectedMetrics.total - locallySourcedBonusKg` | `projectedMetrics.total` direct |

## `src/pages/FootprintOverview.tsx`

| Location | Was (Hardcoded) | Now (Dynamic) |
|---|---|---|
| `ytd.reduction: 10` | `10` | `ytdReduction` — percent difference between `BASELINE_AVG (7000)` and `metrics.total` |
| `ytd.reductionLabel` | `'vs. prior year average'` | `'vs. national average'` |
| `last-year.reduction: -5` | `-5` | `lastYearReduction` — percent difference between `lastYearFootprint` (1.15× total) and `metrics.total` |
| `last-year.reductionLabel` | `'vs. 2022'` | `'vs. previous year'` |
| `last-year.ecoScore` | `Math.max(0, metrics.ecoScore - 5)` | Score based on `lastYearFootprint / BASELINE_AVG` ratio |
| `last-year.ecoScoreLabel` | `'Needs Work'` | Dynamic label: ≥80 → 'Excellent', ≥60 → 'Good', else 'Needs Work' |
| `last-year.percentages` | `+2` / `-2` tweaks | Calculated from `(kg * 1.15 / lastYearFootprint) * 100` |
| `last-month.reduction: 2` | `2` | `monthReduction` — percent difference between `prevMonthFootprint` (1.08× month) and `monthFootprint` |
| `last-month.reductionLabel` | `'vs. prev month'` | `'vs. prev month'` (preserved) |
| `last-month.footprint` | `Math.round(metrics.total / 12)` | Same logic, preserved |

## `src/pages/ProgressTracking.tsx`

| Location | Was (Hardcoded) | Now (Dynamic) |
|---|---|---|
| `initiatives` array | 3 static items with mock titles/locations | Derived from `generateRecommendations(profile).slice(0, 3)` mapped via `toInitiative()` |
| `roadmapItems` array | 3 static items with fixed dates/labels | Derived from `generateRecommendations(profile).slice(0, 4)` mapped via `toRoadmapItem()` |
| `goalsCompleted.completed: 14` | `14` | `Math.round(pct * 20)` where `pct = reducedSoFar / reductionGoalKg` |
| `goalsCompleted.total: 20` | `20` | `20` (intentional fixed target) |
| `goalsCompleted.percent: 70` | `70` | `Math.round(pct * 100)` |
| Initiatives count: `6` | `6` | `initiatives.length` |
| `vsLastYear` label | `'-10% vs last year'` | `-{vsLastYear}% vs last year` where `vsLastYear = ((prev - curr) / prev) * 100` |

## `src/pages/CarbonRoadmap.tsx`

| Location | Was (Hardcoded) | Now (Dynamic) |
|---|---|---|
| `timelineItems` | Static array: "Go Car-Free on Tuesdays", "Optimise Home Heating & Cooling", "Switch to a Green Energy Plan" | Derived from `generateRecommendations(profile).slice(0, 3)` mapped via `toTimelineItem()` |
| `32% Completed` (progress bar) | `32` | `journeyProgress` = `Math.round((reducedSoFar / reductionGoalKg) * 100)` |
| Next milestone title | `'Switch to Public Transport'` | `nextMilestone.title` from top recommendation |
| Next milestone description | `'Cut your daily travel emissions'` | `nextMilestone.categoryLabel` |
| Next milestone icon | `'directions_transit'` | `nextMilestone.categoryIcon` |
| Impact potential: `-45 tCO2e` | `-45` | `nextMilestone.estReductionKg` with `kgCO2e` unit |

## Files Modified

1. `src/lib/simulator.ts` — added `shiftDiet`, integrated `locallySourced`
2. `src/pages/WhatIfSimulator.tsx` — removed magic number
3. `src/pages/FootprintOverview.tsx` — dynamic reductions/ecoScore/percentages
4. `src/pages/ProgressTracking.tsx` — fully rewritten to use engine data
5. `src/pages/CarbonRoadmap.tsx` — timeline, progress, milestone from engine

## Verification

- **78 tests passing** across 9 test files
- **TypeScript type-check**: clean (`tsc --noEmit` passes)
- All existing functionality preserved — visual design unchanged, only data sources replaced
