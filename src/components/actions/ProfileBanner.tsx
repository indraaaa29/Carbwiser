import { Link } from 'react-router-dom';
import type { UserProfile } from '../../lib/recommendationEngine';

const TRANSPORT_LABELS: Record<string, string> = {
  car: 'Car driver', ev: 'EV driver', bus: 'Bus user',
  metro: 'Rail commuter', bike: 'Cyclist', walk: 'Walker',
};
const DIET_LABELS: Record<string, string> = {
  omnivore: 'Omnivore', flexitarian: 'Flexitarian',
  vegetarian: 'Vegetarian', vegan: 'Vegan',
};
const ENERGY_LABELS: Record<string, string> = {
  grid: 'Grid electricity', renewable: 'Renewable energy',
  gas: 'Natural gas', mixed: 'Mixed energy',
};

export function ProfileBanner({ profile, hasProfile }: { profile: UserProfile; hasProfile: boolean }) {
  if (!hasProfile) return null;
  const chips = [
    { icon: 'directions_car', label: TRANSPORT_LABELS[profile.transportMode] ?? profile.transportMode },
    { icon: 'bolt', label: ENERGY_LABELS[profile.energySource] ?? profile.energySource },
    { icon: 'restaurant', label: DIET_LABELS[profile.dietType] ?? profile.dietType },
    { icon: 'home', label: `${profile.householdSize} ${profile.householdSize === '1' ? 'person' : 'people'}` },
  ];
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="font-geist text-xs font-semibold text-[#404944] uppercase tracking-wider mr-1">
        Personalised for:
      </span>
      {chips.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#e1e8fd] rounded-full font-inter text-xs text-[#003527]">
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{c.icon}</span>
          {c.label}
        </span>
      ))}
      <Link
        to="/assessment"
        className="ml-auto font-geist text-xs text-[#2b6954] hover:text-[#003527] underline underline-offset-2 transition-colors"
      >
        Update profile
      </Link>
    </div>
  );
}
