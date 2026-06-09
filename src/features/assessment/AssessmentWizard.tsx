import React, { useState } from 'react';
import type { UserProfile } from '../../types';

interface AssessmentWizardProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onSubmit, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    location: 'New York, US',
    householdSize: 3,
    budgetConstraint: 'Moderate Investment',
    dietType: 'Average Meat',
    transportHabits: 'Commute 15 miles daily in gas car, fly once a year',
    energySource: 'Grid (Natural Gas)',
    statedPriorities: 'Save money, reduce emissions'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'householdSize' ? parseInt(value, 10) || 1 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="w-full mx-auto my-6 bg-surface dark:bg-[#0f131d] border border-outline-variant dark:border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-raised">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-9xl text-primary">eco</span>
      </div>

      <div className="mb-8">
        <h2 className="text-headline-lg font-headline-lg text-primary mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          CarbWiser Lifestyle Assessment
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Let's assess your current habits to estimate your carbon footprint and generate a custom roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Location</label>
            <input
              required
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="e.g. New York, US"
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Household Size</label>
            <input
              required
              type="number"
              name="householdSize"
              min="1"
              max="20"
              value={profile.householdSize}
              onChange={handleChange}
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Budget Constraints</label>
            <select
              name="budgetConstraint"
              value={profile.budgetConstraint}
              onChange={handleChange}
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            >
              <option value="Low Cost Only">Low Cost Only (No expensive upgrades)</option>
              <option value="Moderate Investment">Moderate Investment Allowed</option>
              <option value="High Investment">High Investment / No Constraints</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Diet Type</label>
            <select
              name="dietType"
              value={profile.dietType}
              onChange={handleChange}
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            >
              <option value="Heavy Meat">Heavy Meat</option>
              <option value="Average Meat">Average Meat</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Transport Habits</label>
            <input
              required
              name="transportHabits"
              value={profile.transportHabits}
              onChange={handleChange}
              placeholder="e.g. Commute 20 miles daily in gas SUV, fly twice a year"
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Home Energy Source</label>
            <select
              name="energySource"
              value={profile.energySource}
              onChange={handleChange}
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            >
              <option value="Grid (Fossil/Coal)">Grid (Fossil/Coal)</option>
              <option value="Grid (Natural Gas)">Grid (Natural Gas)</option>
              <option value="Renewable (Solar/Wind)">Renewable (Solar/Wind)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Stated Priorities</label>
            <input
              required
              name="statedPriorities"
              value={profile.statedPriorities}
              onChange={handleChange}
              placeholder="e.g. Save money, easy transition, high impact"
              className="bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary-container transition-all hover:shadow-[0_4px_12px_rgba(1,45,29,0.15)] cursor-pointer text-center flex items-center justify-center h-[52px]"
        >
          {isLoading ? 'Analyzing Carbon Profile...' : 'Generate My Roadmap'}
        </button>
      </form>
    </div>
  );
};
