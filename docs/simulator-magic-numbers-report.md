# WhatIfSimulator — Magic Numbers Removal Report

## Scope

Audit and replacement of all magic numbers in `src/pages/WhatIfSimulator.tsx` and `src/lib/simulator.ts`.

## Constants Created

### `src/constants/carbonFactors.ts` (shared constants)

| Constant | Value | Used By |
|---|---|---|
| `KG_TO_TONNE` | `1000` | WhatIfSimulator |
| `PCT_MULTIPLIER` | `100` | WhatIfSimulator |
| `WORK_DAYS_PER_WEEK` | `5` | simulator.ts |
| `MAX_MEALS_PER_WEEK` | `21` | simulator.ts (→ PLANT_MEALS_MAX) |

### `src/lib/simulator.ts` (simulator-specific constants)

| Constant | Value | Description |
|---|---|---|
| `REMOTE_DAYS_MIN` | `0` | UI range bound |
| `REMOTE_DAYS_MAX` | `WORK_DAYS_PER_WEEK` | UI range bound |
| `THERMOSTAT_MIN` | `-3` | UI range bound |
| `THERMOSTAT_MAX` | `3` | UI range bound |
| `PLANT_MEALS_MIN` | `0` | UI range bound |
| `PLANT_MEALS_MAX` | `MAX_MEALS_PER_WEEK` | UI range bound |
| `REMOTE_SAVINGS_PER_DAY` | `25` | Cost savings per remote work day |
| `EV_ANNUAL_SAVINGS` | `240` | Cost savings for EV switch |
| `GREEN_TARIFF_SAVINGS` | `180` | Cost savings for green tariff |
| `PLANT_MEAL_SAVINGS` | `15` | Cost savings per plant-based meal |
| `THERMOSTAT_EFFICIENCY` | `0.05` | Energy change per 1°C offset |
| `FLEXITARIAN_THRESHOLD` | `3` | Diet shift: omnivore → flexitarian |
| `VEGETARIAN_THRESHOLD` | `7` | Diet shift: flexitarian → vegetarian |
| `VEGAN_THRESHOLD` | `14` | Diet shift: vegetarian → vegan |
| `LOCAL_SOURCE_SHIFT` | `1` | Diet tiers to shift when locallySourced |

## Magic Numbers Removed

### `simulator.ts` — 10 magic numbers replaced

| Line | Was | Now | Category |
|---|---|---|---|
| 14 | `25` | `REMOTE_SAVINGS_PER_DAY` | Cost estimate |
| 15 | `240` | `EV_ANNUAL_SAVINGS` | Cost estimate |
| 16 | `180` | `GREEN_TARIFF_SAVINGS` | Cost estimate |
| 17 | `15` | `PLANT_MEAL_SAVINGS` | Cost estimate |
| 32 | `5` | `WORK_DAYS_PER_WEEK` | Shared constant |
| 37 | `0.05` | `THERMOSTAT_EFFICIENCY` | Carbon factor config |
| 41 | `14` | `VEGAN_THRESHOLD` | Diet shift threshold |
| 42 | `7` | `VEGETARIAN_THRESHOLD` | Diet shift threshold |
| 43 | `3` | `FLEXITARIAN_THRESHOLD` | Diet shift threshold |
| 46 | `1` | `LOCAL_SOURCE_SHIFT` | Diet shift config |

### `WhatIfSimulator.tsx` — 4 source files now provide all constants

| Line(s) | Was | Now | Source |
|---|---|---|---|
| 29 | `1000` | `KG_TO_TONNE` | `carbonFactors.ts` |
| 30 | `/ 1000` | `/ KG_TO_TONNE` | `carbonFactors.ts` |
| 31 | `/ 1000` | `/ KG_TO_TONNE` | `carbonFactors.ts` |
| 34 | `* 100` | `* PCT_MULTIPLIER` | `carbonFactors.ts` |
| 35 | `* 100` | `* PCT_MULTIPLIER` | `carbonFactors.ts` |
| 73, 82 | `5` | `REMOTE_DAYS_MAX` | `simulator.ts` |
| 74, 81 | `0` | `REMOTE_DAYS_MIN` | `simulator.ts` |
| 116, 125 | `3` | `THERMOSTAT_MAX` | `simulator.ts` |
| 117, 124 | `-3` | `THERMOSTAT_MIN` | `simulator.ts` |
| 159, 168 | `21` | `PLANT_MEALS_MAX` | `simulator.ts` |
| 160, 167 | `0` | `PLANT_MEALS_MIN` | `simulator.ts` |

### Bar width calculation refactored

The complex inline expression at lines 224-228:

```tsx
// Before (inline, impossible to reason about):
width: `${Math.max(0, 100 - baseWidth - Math.max(0, (projected / BASELINE) * 100 - baseWidth))}%`

// After (named intermediates, clear intent):
const baselinePct = PCT_MULTIPLIER;
const projectedPct = (projectedTonnes / BASELINE_TONNES) * PCT_MULTIPLIER;
const targetPct = (targetTonnes / BASELINE_TONNES) * PCT_MULTIPLIER;
const gapAboveTarget = Math.max(0, projectedPct - targetPct);
const reductionBarWidth = Math.max(0, baselinePct - targetPct - gapAboveTarget);
```

### Simulator-specific `calcSavings` function

All cost estimate numbers in `calcSavings` are now named constants (`REMOTE_SAVINGS_PER_DAY`, `EV_ANNUAL_SAVINGS`, etc.). These are cost assumptions, not carbon calculations, so they are kept in `simulator.ts` with clear documentation.

## Verification

- **82 tests pass** (all 9 test files, including 3 simulator tests)
- **TypeScript**: clean (`tsc --noEmit`)
- **Build**: succeeds
- **No hidden adjustments**: the `locallySourcedBonusKg` was already removed in a prior fix; no other post-calculation tweaks exist
