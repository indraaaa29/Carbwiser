// ─── CarbWiser Recommendation Engine ────────────────────────────────────────
// Reads the user's lifestyle assessment profile from localStorage and produces
// a ranked, personalised list of actions with a "Why this recommendation?"
// explanation for each.

export interface UserProfile {
  transportMode: string;   // 'car' | 'ev' | 'bus' | 'metro' | 'bike' | 'walk'
  weeklyDistance: number;  // km/week
  energySource: string;    // 'grid' | 'renewable' | 'gas' | 'mixed'
  monthlyKwh: number;      // kWh/month
  dietType: string;        // 'omnivore' | 'flexitarian' | 'vegetarian' | 'vegan'
  householdSize: string;   // '1' | '2' | '3-4' | '5+'
  reductionGoal: string;   // '10' | '25' | '50' | 'zero'
}

export interface RecommendationReason {
  /** Short headline shown in the "Why this recommendation?" block */
  headline: string;
  /** One or two sentences of personalised context */
  detail: string;
  /** The category share string, e.g. "52% of your footprint" */
  share: string;
  /** Animated bar width percentage for the insight card */
  barPercent: number;
  /** Fact/tip shown in the bottom callout of the insight card */
  tip: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'mobility' | 'energy' | 'waste';
  categoryLabel: string;
  categoryIcon: string;
  categoryBg: string;
  estReduction: string;          // display string e.g. "45 kg CO₂/mo"
  estReductionKg: number;        // numeric for sorting
  impact: { label: string; color: string; dot: string };
  cost: { label: string; color: string; dot: string };
  difficulty: { label: string; color: string; dot: string };
  bgIcon: string;
  isPrimary?: boolean;
  reason: RecommendationReason;
  score: number;                 // higher = more relevant to this user
}

// ─── Default profile used when no assessment has been completed ───────────────
export const DEFAULT_PROFILE: UserProfile = {
  transportMode: 'car',
  weeklyDistance: 80,
  energySource: 'grid',
  monthlyKwh: 400,
  dietType: 'omnivore',
  householdSize: '2',
  reductionGoal: '25',
};

// ─── Load profile from localStorage ──────────────────────────────────────────
export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('carbwiser_profile');
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      transportMode: parsed.transportMode || DEFAULT_PROFILE.transportMode,
      weeklyDistance: Number(parsed.weeklyDistance) || DEFAULT_PROFILE.weeklyDistance,
      energySource: parsed.energySource || DEFAULT_PROFILE.energySource,
      monthlyKwh: Number(parsed.monthlyKwh) || DEFAULT_PROFILE.monthlyKwh,
      dietType: parsed.dietType || DEFAULT_PROFILE.dietType,
      householdSize: parsed.householdSize || DEFAULT_PROFILE.householdSize,
      reductionGoal: parsed.reductionGoal || DEFAULT_PROFILE.reductionGoal,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

// ─── Save profile to localStorage ────────────────────────────────────────────
export function saveUserProfile(profile: Partial<UserProfile>): void {
  const existing = loadUserProfile();
  localStorage.setItem('carbwiser_profile', JSON.stringify({ ...existing, ...profile }));
}

import { CANDIDATES } from '../constants/recommendationCandidates';

// ─── Main engine function ─────────────────────────────────────────────────────
export function generateRecommendations(profile: UserProfile): Recommendation[] {
  const goalBoost = { '10': 1.0, '25': 1.1, '50': 1.25, zero: 1.4 }[profile.reductionGoal] ?? 1.0;

  const scored = CANDIDATES.map(factory => {
    const rec = factory(profile);
    // Apply goal urgency multiplier
    rec.score = rec.score * goalBoost;
    return rec;
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Mark the top-scoring one as primary
  if (scored.length > 0) {
    scored[0].isPrimary = true;
    scored[0].categoryLabel = 'Top Recommendation';
    scored[0].categoryBg = 'bg-[#064e3b] text-[#80bea6]';
    scored[0].categoryIcon = 'eco';
  }

  // Return top 6 to keep the UI from being overwhelming
  return scored.slice(0, 6);
}
