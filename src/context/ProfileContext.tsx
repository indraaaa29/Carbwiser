import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { DEFAULT_PROFILE, type UserProfile } from '../lib/recommendationEngine';

const STORAGE_KEY = 'carbwiser_profile';

function loadFromStorage(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

function saveToStorage(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => loadFromStorage());

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveToStorage(next);
      return next;
    });
  }, []);

  const hasProfile = profile !== DEFAULT_PROFILE;

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, hasProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
