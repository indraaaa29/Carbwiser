import React from 'react';

export interface OptionCardProps {
  value: string;
  icon: string;
  label: string;
  sub: string;
  selected: boolean;
  onSelect: (val: string) => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({ value, icon, label, sub, selected, onSelect }) => (
  <button
    className={`option-card rounded-2xl p-4 flex flex-col items-center gap-3 text-center group transition-all duration-300 border-2 ${
      selected ? 'option-card-selected border-[#064e3b]' : 'option-card-unselected border-transparent'
    }`}
    data-value={value}
    onClick={() => onSelect(value)}
    type="button"
    aria-pressed={selected}
    aria-label={`${label}: ${sub}`}
  >
    <div className={`p-4 rounded-full transition-all duration-300 transform group-hover:scale-105 ${
      selected
        ? 'bg-[#064e3b] text-[#80bea6]'
        : 'bg-[#e1e8fd] group-hover:bg-[#064e3b] group-hover:text-[#80bea6]'
    }`} aria-hidden="true">
      <span className="material-symbols-outlined text-4xl" aria-hidden="true">{icon}</span>
    </div>
    <div className="mt-1">
      <span className="block font-geist text-base font-semibold text-[#141b2b]">{label}</span>
      <span className="block font-inter text-sm text-[#404944] mt-1">{sub}</span>
    </div>
  </button>
);
