# Profile Context Architecture

## Overview

Centralized user profile state management using React Context. Eliminates repeated `localStorage.getItem`/`JSON.parse` calls across 7 pages by maintaining an in-memory cache and providing a unified `useProfile()` hook.

## Files

| File | Role |
|---|---|
| `src/context/ProfileContext.tsx` | Context definition, `ProfileProvider`, `useProfile` hook |
| `src/App.tsx` | Wraps routes with `<ProfileProvider>` |

## Context Shape

```ts
interface ProfileContextValue {
  profile: UserProfile;          // In-memory cached profile
  updateProfile: (updates: Partial<UserProfile>) => void;  // Merge + persist
  hasProfile: boolean;           // True if localStorage key exists
}
```

## Data Flow

```
                     ┌─────────────────┐
                     │  localStorage   │
                     │  carbwiser_profile │
                     └────────┬────────┘
                     │
                    sync on mount ───┐
                     │               │
                              ▼     │
                     ┌───────────────────┐     ┌──────────────────┐
                     │  ProfileProvider  │────▶│  React Context   │
                     │  (src/context/)   │     │  (in-memory)     │
                     └───────────────────┘     └────────┬─────────┘
                                                         │
              ┌──────────────────────────────────────────┼──────────────┐
              │                    │                      │              │
              ▼                    ▼                      ▼              ▼
     FootprintOverview    ProgressTracking       CarbonRoadmap    WhatIfSimulator
     CarbonHotspots       SmartActions           LifestyleAssessment

     LifestyleAssessment also calls updateProfile() to persist assessment results.
```

## Provider Lifecycle

1. **Mount**: `useState(() => loadFromStorage())` reads `localStorage('carbwiser_profile')` synchronously — zero flicker, no async delay
2. **Update**: `updateProfile()` merges partial updates into current state, writes back to localStorage synchronously
3. **Consumption**: all pages call `useProfile()` → get cached profile with zero parsing overhead

## Pages Updated

| Page | Before | After |
|---|---|---|
| `FootprintOverview.tsx` | `loadUserProfile()` in `useMemo` | `useProfile().profile` in component body |
| `ProgressTracking.tsx` | `useMemo(() => loadUserProfile(), [])` | `useProfile().profile` |
| `CarbonRoadmap.tsx` | `useMemo(() => loadUserProfile(), [])` | `useProfile().profile` |
| `WhatIfSimulator.tsx` | `useMemo(() => loadUserProfile(), [])` | `useProfile().profile` |
| `CarbonHotspots.tsx` | `useMemo(() => loadUserProfile(), [])` | `useProfile().profile` |
| `SmartActions.tsx` | `useState(() => loadUserProfile())` + `useState(() => !!localStorage.getItem(...))` | `useProfile().profile` + `useProfile().hasProfile` |
| `LifestyleAssessment.tsx` | `saveUserProfile(...)` from recommendationEngine | `updateProfile(...)` from context |

## Removed Direct Imports

The following function imports were eliminated from all pages:
- `loadUserProfile` — previously imported by 7 pages
- `saveUserProfile` — previously imported by 1 page

Both functions still exist in `src/lib/recommendationEngine.ts` (used internally by `generateRecommendations` and kept for backward compatibility), but pages no longer call them directly.

## Verification

- **82 tests pass** (all 9 test files)
- **TypeScript**: clean (`tsc --noEmit`)
- No visual changes — data flow only
- Single source of truth: all profile reads go through context cache
