import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
  sub: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id, label, sub }) => (
  <div className="flex items-center justify-between pt-2">
    <div>
      <label htmlFor={id} className="font-geist text-sm font-semibold text-[#141b2b] block cursor-pointer" id={`${id}-label`}>{label}</label>
      <span id={`${id}-desc`} className="font-inter text-sm text-[#404944] mt-1 block">{sub}</span>
    </div>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-desc`}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center cursor-pointer w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003527] focus-visible:ring-offset-2 ${
        checked ? 'bg-[#003527]' : 'bg-[#bfc9c3]'
      }`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
        aria-hidden="true"
      />
    </button>
  </div>
);
