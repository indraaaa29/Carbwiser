import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { calculateFootprint } from '../lib/carbonCalculation';
import { Toggle } from '../components/ui/Toggle';
import { calcSavings, getSimulatedProfile } from '../lib/simulator';
import {
  REMOTE_DAYS_MIN, REMOTE_DAYS_MAX,
  THERMOSTAT_MIN, THERMOSTAT_MAX,
  PLANT_MEALS_MIN, PLANT_MEALS_MAX,
} from '../lib/simulator';
import { KG_TO_TONNE, PCT_MULTIPLIER } from '../constants/carbonFactors';
import type { SimState } from '../lib/simulator';

const WhatIfSimulator: React.FC = () => {
  const { profile } = useProfile();
  const baselineMetrics = useMemo(() => calculateFootprint(profile), [profile]);

  const [sim, setSim] = useState<SimState>({
    remoteWorkDays: 0,
    switchToEv: profile.transportMode === 'ev',
    thermostatOffset: 0,
    greenEnergyTariff: profile.energySource === 'renewable',
    plantBasedMeals: 0,
    locallySourced: false,
  });

  const update = useCallback(<K extends keyof SimState>(key: K, value: SimState[K]) => {
    setSim((prev) => ({ ...prev, [key]: value }));
  }, []);

  const simProfile = getSimulatedProfile(profile, sim);
  const projectedMetrics = calculateFootprint(simProfile);

  const BASELINE_TONNES = baselineMetrics.total / KG_TO_TONNE;
  const projectedTonnes = Math.max(0, projectedMetrics.total / KG_TO_TONNE);
  const targetTonnes = (baselineMetrics.total - baselineMetrics.reductionGoalKg) / KG_TO_TONNE;

  const savings = calcSavings(sim);

  const baselinePct = PCT_MULTIPLIER;
  const projectedPct = (projectedTonnes / BASELINE_TONNES) * PCT_MULTIPLIER;
  const targetPct = (targetTonnes / BASELINE_TONNES) * PCT_MULTIPLIER;
  const reduction = Math.round((1 - projectedTonnes / BASELINE_TONNES) * PCT_MULTIPLIER) || 0;

  const gapAboveTarget = Math.max(0, projectedPct - targetPct);
  const reductionBarWidth = Math.max(0, baselinePct - targetPct - gapAboveTarget);
  const distanceToTarget = Math.max(0, projectedTonnes - targetTonnes);

  return (
    <div className="bg-[#f4f6f3] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <main id="main-content" className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
            What-If Simulator
          </h1>
          <p className="font-inter text-lg text-[#404944] max-w-2xl leading-7">
            Toggle daily habits to see instant changes in your projected emissions based on your actual lifestyle assessment.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Transportation */}
            <div className="bg-white rounded-2xl border border-[#bfc9c3]/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527]" aria-hidden="true">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">directions_car</span>
                </div>
                <h2 className="font-geist text-2xl font-medium text-[#003527] tracking-tight">Transportation</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label htmlFor="remote-work" className="font-geist text-sm font-semibold text-[#141b2b]">Remote Work Days</label>
                    <span className="font-geist text-xs text-[#003527] bg-[#003527]/10 py-1.5 px-3 rounded-full">
                      {sim.remoteWorkDays} {sim.remoteWorkDays === 1 ? 'day' : 'days'} / week
                    </span>
                  </div>
                  <input
                    id="remote-work"
                    className="w-full"
                    max={REMOTE_DAYS_MAX}
                    min={REMOTE_DAYS_MIN}
                    type="range"
                    value={sim.remoteWorkDays}
                    onChange={(e) => update('remoteWorkDays', Number(e.target.value))}
                    aria-label="Remote work days per week"
                  />
                  <div className="flex justify-between font-geist text-xs text-[#404944] mt-1">
                    <span>{REMOTE_DAYS_MIN} days</span>
                    <span>{REMOTE_DAYS_MAX} days</span>
                  </div>
                </div>

                <Toggle
                  id="switch-ev"
                  checked={sim.switchToEv}
                  onChange={(v) => update('switchToEv', v)}
                  label="Switch to EV"
                  sub="Replace primary vehicle with electric"
                />
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white rounded-2xl border border-[#bfc9c3]/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527]" aria-hidden="true">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">bolt</span>
                </div>
                <h2 className="font-geist text-2xl font-medium text-[#003527] tracking-tight">Energy</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label htmlFor="thermostat" className="font-geist text-sm font-semibold text-[#141b2b]">Thermostat Offset</label>
                    <span className="font-geist text-xs text-[#003527] bg-[#003527]/10 py-1.5 px-3 rounded-full">
                      {sim.thermostatOffset > 0 ? '+' : ''}{sim.thermostatOffset}°C
                    </span>
                  </div>
                  <input
                    id="thermostat"
                    className="w-full"
                    max={THERMOSTAT_MAX}
                    min={THERMOSTAT_MIN}
                    type="range"
                    value={sim.thermostatOffset}
                    onChange={(e) => update('thermostatOffset', Number(e.target.value))}
                    aria-label="Thermostat offset in degrees Celsius"
                  />
                  <div className="flex justify-between font-geist text-xs text-[#404944] mt-1">
                    <span>{THERMOSTAT_MIN}°C</span>
                    <span>+{THERMOSTAT_MAX}°C</span>
                  </div>
                </div>

                <Toggle
                  id="green-energy"
                  checked={sim.greenEnergyTariff}
                  onChange={(v) => update('greenEnergyTariff', v)}
                  label="Green Energy Tariff"
                  sub="Switch to 100% renewable energy plan"
                />
              </div>
            </div>

            {/* Food */}
            <div className="bg-white rounded-2xl border border-[#bfc9c3]/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527]" aria-hidden="true">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">restaurant</span>
                </div>
                <h2 className="font-geist text-2xl font-medium text-[#003527] tracking-tight">Food</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label htmlFor="plant-meals" className="font-geist text-sm font-semibold text-[#141b2b]">Plant-Based Meals</label>
                    <span className="font-geist text-xs text-[#003527] bg-[#003527]/10 py-1.5 px-3 rounded-full">
                      {sim.plantBasedMeals} meals / week
                    </span>
                  </div>
                  <input
                    id="plant-meals"
                    className="w-full"
                    max={PLANT_MEALS_MAX}
                    min={PLANT_MEALS_MIN}
                    type="range"
                    value={sim.plantBasedMeals}
                    onChange={(e) => update('plantBasedMeals', Number(e.target.value))}
                    aria-label="Plant-based meals per week"
                  />
                  <div className="flex justify-between font-geist text-xs text-[#404944] mt-1">
                    <span>{PLANT_MEALS_MIN} meals</span>
                    <span>{PLANT_MEALS_MAX} meals</span>
                  </div>
                </div>

                <Toggle
                  id="local-produce"
                  checked={sim.locallySourced}
                  onChange={(v) => update('locallySourced', v)}
                  label="Locally Sourced Produce"
                  sub="Prioritize seasonal and local groceries"
                />
              </div>
            </div>
          </div>

          {/* Projection Panel */}
          <div className="lg:col-span-5 relative">
            <div
              className="sticky top-28 text-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1440&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="p-6 flex flex-col gap-4 bg-[#003527]/85 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <h3 className="font-geist text-xs font-semibold uppercase text-white/80 tracking-widest">Projected Impact</h3>
                  <span className="bg-white/20 text-white font-geist text-sm py-1.5 px-4 rounded-full backdrop-blur-md shadow-sm border border-white/10">
                    -{reduction}% Total Footprint
                  </span>
                </div>

                {/* Main Metric */}
                <div className="py-8 text-center" aria-live="polite" aria-atomic="true">
                  <div className="font-geist font-semibold text-white mb-3 drop-shadow-md" style={{ fontSize: '64px', lineHeight: 1 }}>
                    {projectedTonnes.toFixed(1)} <span className="text-white/80 font-normal" style={{ fontSize: '24px' }} aria-hidden="true">tCO2e</span>
                  </div>
                  <div className="font-inter text-lg text-white/90">Projected Carbon Footprint</div>
                </div>

                {/* Progress / Target Bar */}
                <div className="w-full mb-6">
                  <div className="flex justify-between font-geist text-sm text-white/90 mb-3">
                    <span>Current: {BASELINE_TONNES.toFixed(1)}t</span>
                    <span>Target: {targetTonnes.toFixed(1)}t</span>
                  </div>
                  <div className="w-full h-5 bg-black/30 rounded-full overflow-hidden flex shadow-inner border border-white/10"
                    role="meter"
                    aria-label="Projected vs Target Footprint"
                    aria-valuemin={0}
                    aria-valuemax={BASELINE_TONNES}
                    aria-valuenow={projectedTonnes}
                    aria-valuetext={`${projectedTonnes.toFixed(1)} tonnes, Target ${targetTonnes.toFixed(1)} tonnes`}
                  >
                    <div className="bg-white/40 h-full backdrop-blur-md" style={{ width: `${targetPct}%` }} />
                    <div
                      className="bg-[#95d3ba] h-full transition-all duration-700 ease-in-out"
                      style={{
                        width: `${reductionBarWidth}%`,
                        boxShadow: '0 0 10px rgba(149, 211, 186, 0.5)',
                      }}
                    />
                  </div>
                  <p className="text-center font-geist text-xs text-white/70 mt-3">
                    You are {distanceToTarget.toFixed(1)}t away from your pragmatic target.
                  </p>
                </div>

                {/* Cost Savings */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 flex items-start gap-4">
                  <div className="p-2.5 bg-white/20 rounded-full text-white" aria-hidden="true">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">savings</span>
                  </div>
                  <div>
                    <div className="font-geist text-3xl font-semibold text-white tracking-tight">+${savings.toLocaleString()}</div>
                    <div className="font-inter text-sm text-white/80 mt-1">Estimated annual savings based on your selected earthy habits.</div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to="/roadmap"
                  className="mt-4 w-full bg-white text-[#003527] font-geist text-sm font-bold py-4 px-6 rounded-xl hover:bg-[#f1f3ff] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center block"
                >
                  Commit to Action Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatIfSimulator;
