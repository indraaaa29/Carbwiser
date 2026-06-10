import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface SimState {
  remoteWorkDays: number;
  switchToEv: boolean;
  thermostatOffset: number;
  greenEnergyTariff: boolean;
  plantBasedMeals: number;
  locallySourced: boolean;
}

const BASELINE = 5.0;

function calcFootprint(state: SimState): number {
  let savings = 0;
  savings += state.remoteWorkDays * 0.12;
  if (state.switchToEv) savings += 0.6;
  savings += Math.abs(state.thermostatOffset) * 0.05;
  if (state.greenEnergyTariff) savings += 0.4;
  savings += state.plantBasedMeals * 0.02;
  if (state.locallySourced) savings += 0.1;
  return Math.max(1.0, BASELINE - savings);
}

function calcSavings(state: SimState): number {
  let $ = 0;
  $ += state.remoteWorkDays * 25;
  if (state.switchToEv) $ += 240;
  if (state.greenEnergyTariff) $ += 180;
  $ += state.plantBasedMeals * 15;
  return $;
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
  sub: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id, label, sub }) => (
  <div className="flex items-center justify-between pt-2">
    <div>
      <label htmlFor={id} className="font-geist text-sm font-semibold text-[#141b2b] block cursor-pointer">{label}</label>
      <span className="font-inter text-sm text-[#404944] mt-1 block">{sub}</span>
    </div>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center cursor-pointer w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 ${
        checked ? 'bg-[#003527]' : 'bg-[#bfc9c3]'
      }`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const WhatIfSimulator: React.FC = () => {
  const [sim, setSim] = useState<SimState>({
    remoteWorkDays: 2,
    switchToEv: false,
    thermostatOffset: -1,
    greenEnergyTariff: true,
    plantBasedMeals: 4,
    locallySourced: false,
  });

  const update = useCallback(<K extends keyof SimState>(key: K, value: SimState[K]) => {
    setSim((prev) => ({ ...prev, [key]: value }));
  }, []);

  const projected = calcFootprint(sim);
  const savings = calcSavings(sim);
  const reduction = Math.round(((BASELINE - projected) / BASELINE) * 100);
  const targetFootprint = 3.5;
  const baseWidth = (targetFootprint / BASELINE) * 100;

  return (
    <div className="bg-[#f4f6f3] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
            What-If Simulator
          </h1>
          <p className="font-inter text-lg text-[#404944] max-w-2xl leading-7">
            Toggle daily habits to see instant changes in your projected emissions and potential cost savings. Build your pragmatic path to zero impact.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Transportation */}
            <div className="bg-white rounded-2xl border border-[#bfc9c3]/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>directions_car</span>
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
                    max="5"
                    min="0"
                    type="range"
                    value={sim.remoteWorkDays}
                    onChange={(e) => update('remoteWorkDays', Number(e.target.value))}
                    aria-label="Remote work days per week"
                  />
                  <div className="flex justify-between font-geist text-xs text-[#404944] mt-1">
                    <span>0 days</span>
                    <span>5 days</span>
                  </div>
                </div>

                <Toggle
                  id="switch-ev"
                  checked={sim.switchToEv}
                  onChange={(v) => update('switchToEv', v)}
                  label="Switch to EV"
                  sub="Replace primary ICE vehicle with electric"
                />
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white rounded-2xl border border-[#bfc9c3]/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>bolt</span>
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
                    max="3"
                    min="-3"
                    type="range"
                    value={sim.thermostatOffset}
                    onChange={(e) => update('thermostatOffset', Number(e.target.value))}
                    aria-label="Thermostat offset in degrees Celsius"
                  />
                  <div className="flex justify-between font-geist text-xs text-[#404944] mt-1">
                    <span>-3°C</span>
                    <span>+3°C</span>
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
                <div className="w-10 h-10 rounded-full bg-[#003527]/10 flex items-center justify-center text-[#003527]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>restaurant</span>
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
                    max="21"
                    min="0"
                    type="range"
                    value={sim.plantBasedMeals}
                    onChange={(e) => update('plantBasedMeals', Number(e.target.value))}
                    aria-label="Plant-based meals per week"
                  />
                  <div className="flex justify-between font-geist text-xs text-[#404944] mt-1">
                    <span>0 meals</span>
                    <span>21 meals</span>
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
                backgroundImage: 'url(https://lh3.googleusercontent.com/aida/AP1WRLvEPPKJcFiRipsQwfK5nd9B7FVcwgtlXoI_i7xJ7MyU2408dWYpnlTMCXEvVDENPUAQroJt_NAannTP_LlU9TOpigakCU07ruWIF1LlhP1FWbRg4rPHqn1n-AcrzgN4LxPNKWT334QPUhhJvJDMBelTJwtY4sZqphbUJs8xN8ObzwcKlCL-hdgsDLDYKgqZg2268KTVdVjB5cpHETOBQKtiLP0qi47EilsK0aHrM9EbQrMY614CVbDwEw)',
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
                <div className="py-8 text-center">
                  <div className="font-geist font-semibold text-white mb-3 drop-shadow-md" style={{ fontSize: '64px', lineHeight: 1 }}>
                    {projected.toFixed(1)} <span className="text-white/80 font-normal" style={{ fontSize: '24px' }}>tCO2e</span>
                  </div>
                  <div className="font-inter text-lg text-white/90">Projected Carbon Footprint</div>
                </div>

                {/* Progress / Target Bar */}
                <div className="w-full mb-6">
                  <div className="flex justify-between font-geist text-sm text-white/90 mb-3">
                    <span>Current: {BASELINE}t</span>
                    <span>Target: {targetFootprint}t</span>
                  </div>
                  <div className="w-full h-5 bg-black/30 rounded-full overflow-hidden flex shadow-inner border border-white/10">
                    <div className="bg-white/40 h-full backdrop-blur-md" style={{ width: `${baseWidth}%` }} />
                    <div
                      className="bg-[#95d3ba] h-full transition-all duration-700 ease-in-out"
                      style={{
                        width: `${Math.max(0, 100 - baseWidth - Math.max(0, (projected / BASELINE) * 100 - baseWidth))}%`,
                        boxShadow: '0 0 10px rgba(149, 211, 186, 0.5)',
                      }}
                    />
                  </div>
                  <p className="text-center font-geist text-xs text-white/70 mt-3">
                    You are {Math.max(0, projected - targetFootprint).toFixed(1)}t away from your pragmatic target.
                  </p>
                </div>

                {/* Cost Savings */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 flex items-start gap-4">
                  <div className="p-2.5 bg-white/20 rounded-full text-white">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
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

      <Footer />
    </div>
  );
};

export default WhatIfSimulator;
