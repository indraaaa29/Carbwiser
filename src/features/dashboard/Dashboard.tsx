import React from 'react';
import type { CarbonFootprint } from '../../types';

interface DashboardProps {
  footprint: CarbonFootprint;
  currentFootprint: number;
  adoptedCount: number;
  totalCount: number;
  theme: 'light' | 'dark';
  setView: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  footprint,
  currentFootprint,
  adoptedCount,
  totalCount,
  theme,
  setView,
}) => {
  const isDark = theme === 'dark';

  // Calculations for stats
  const totalEmissionsTons = (currentFootprint / 1000).toFixed(1);
  const reductionPercent = footprint.total_kg > 0
    ? Math.round(((footprint.total_kg - currentFootprint) / footprint.total_kg) * 100)
    : 0;

  // Breakdown percentages
  const { breakdown } = footprint;
  const totalBreakdown = (breakdown.transport + breakdown.energy + breakdown.diet + breakdown.consumption) || 1;
  const transportPct = Math.round((breakdown.transport / totalBreakdown) * 100);
  const energyPct = Math.round((breakdown.energy / totalBreakdown) * 100);
  const foodPct = Math.round((breakdown.diet / totalBreakdown) * 100);

  // Render Light Mode Bento Grid Dashboard
  if (!isDark) {
    return (
      <div className="p-margin-mobile md:p-margin-desktop bg-background min-h-screen">
        <header className="flex justify-between items-end mb-2xl">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-primary mb-sm">Dashboard</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Here is your carbon footprint overview for this year.</p>
          </div>
          <div className="flex items-center gap-md">
            <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <img
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover border border-outline-variant"
              src="https://lh3.googleusercontent.com/aida/AP1WRLvHrOGRk6GmhXK5Dgm1_7GKoRBdCQoZf0jrUEa2kqvsY4LOBF5jbQVxWBSAw-6LKi-8OUNmqm9fX7d9wHRKjfuFpQ5vYQy7qL91pOEp2Lpw4vsZoZzZ6oan6teH3D0ox5b8srEx8Eet_rXyB5_ZBRxx5EeyT3qEtc6d86ScnGQuf7RXPTrowCA0AtLF4IcvA_ZPKVEj0th-HojR7JkRl0t89j0Foh9hzJGaEnmnn03tKQEG8RrZ6dia_ME4"
            />
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg max-w-7xl mx-auto">
          {/* Eco Score Card */}
          <div className="col-span-1 md:col-span-4 bg-surface rounded-xl border border-outline-variant p-lg shadow-ambient hover:shadow-raised transition-all flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center mb-md">
                <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Eco Score</h3>
                <span className="material-symbols-outlined text-primary">psychiatry</span>
              </div>
              <div className="flex items-baseline gap-sm mb-sm">
                <span className="text-display-lg font-display-lg text-primary">{Math.min(99, 82 + reductionPercent)}</span>
                <span className="text-headline-md font-headline-md text-outline">/100</span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant">You are in the top 15% of sustainable users this month.</p>
            </div>
            <div className="mt-xl">
              <div className="w-full bg-surface-container-highest rounded-full h-2 mb-sm overflow-hidden">
                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(99, 82 + reductionPercent)}%` }}></div>
              </div>
              <div className="flex justify-between text-label-sm font-label-sm text-outline">
                <span>Needs Work</span>
                <span className="font-semibold text-primary">Adopted: {adoptedCount}/{totalCount}</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Annual Carbon Footprint */}
          <div className="col-span-1 md:col-span-8 bg-surface rounded-xl border border-outline-variant p-lg shadow-ambient hover:shadow-raised transition-all relative overflow-hidden flex flex-col justify-between">
            {/* Abstract decorative background */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-sage-muted/30 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-md">
                <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Annual Carbon Footprint</h3>
                <div className="px-sm py-xs bg-sage-muted text-primary rounded-full text-label-sm font-label-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span> {reductionPercent > 0 ? `${reductionPercent}% vs baseline` : '0% vs baseline'}
                </div>
              </div>
              <div className="mt-lg">
                <span className="text-display-lg font-display-lg text-primary block">{totalEmissionsTons}</span>
                <span className="text-headline-md font-headline-md text-on-surface-variant">Tons of CO₂ / year</span>
              </div>
            </div>
            <div className="mt-xl relative z-10 flex gap-sm flex-wrap">
              <button
                onClick={() => setView('roadmap')}
                className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container transition-colors h-[44px] cursor-pointer flex items-center justify-center"
              >
                Explore Roadmap
              </button>
              <button
                onClick={() => setView('simulations')}
                className="bg-transparent border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-surface-container-low transition-colors h-[44px] cursor-pointer flex items-center justify-center"
              >
                Simulate Changes
              </button>
            </div>
          </div>

          {/* Emission Breakdown */}
          <div className="col-span-1 md:col-span-6 bg-surface rounded-xl border border-outline-variant p-lg shadow-ambient hover:shadow-raised transition-all">
            <div className="flex justify-between items-center mb-xl">
              <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Emission Breakdown</h3>
              <span className="material-symbols-outlined text-outline">pie_chart</span>
            </div>
            <div className="space-y-lg">
              {/* Transportation */}
              <div>
                <div className="flex justify-between mb-sm text-body-md font-body-md">
                  <span className="text-on-surface flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-primary block"></span>
                    Transportation
                  </span>
                  <span className="font-bold text-primary">{transportPct}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${transportPct}%` }}></div>
                </div>
              </div>
              {/* Energy */}
              <div>
                <div className="flex justify-between mb-sm text-body-md font-body-md">
                  <span className="text-on-surface flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-secondary block"></span>
                    Energy
                  </span>
                  <span className="font-bold text-primary">{energyPct}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: `${energyPct}%` }}></div>
                </div>
              </div>
              {/* Food */}
              <div>
                <div className="flex justify-between mb-sm text-body-md font-body-md">
                  <span className="text-on-surface flex items-center gap-sm">
                    <span className="w-3 h-3 rounded-full bg-primary-fixed-dim block"></span>
                    Food & Diet
                  </span>
                  <span className="font-bold text-primary">{foodPct}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-primary-fixed-dim h-2 rounded-full" style={{ width: `${foodPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-1 md:col-span-6 bg-surface rounded-xl border border-outline-variant p-lg shadow-ambient hover:shadow-raised transition-all flex flex-col">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Recent Activity</h3>
              <button className="text-primary text-label-md font-label-md hover:underline cursor-pointer">View All</button>
            </div>
            <div className="flex-grow flex flex-col justify-around">
              {/* Activity Item 1 */}
              <div className="flex items-center gap-md py-md border-b border-surface-variant last:border-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">flight</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-body-md font-body-md text-on-surface">Business Flight to NY</h4>
                  <p className="text-label-sm font-label-sm text-outline">Today, 10:45 AM</p>
                </div>
                <div className="text-right">
                  <span className="text-body-md font-body-md text-error-red font-bold">+1.2t CO₂</span>
                </div>
              </div>
              {/* Activity Item 2 */}
              <div className="flex items-center gap-md py-md border-b border-surface-variant last:border-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">directions_car</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-body-md font-body-md text-on-surface">Weekly Commute Logged</h4>
                  <p className="text-label-sm font-label-sm text-outline">Yesterday</p>
                </div>
                <div className="text-right">
                  <span className="text-body-md font-body-md text-on-surface-variant">+45kg CO₂</span>
                </div>
              </div>
              {/* Activity Item 3 */}
              <div className="flex items-center gap-md py-md border-b border-surface-variant last:border-0">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
                  <span className="material-symbols-outlined">forest</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-body-md font-body-md text-on-surface">Offset Project Contribution</h4>
                  <p className="text-label-sm font-label-sm text-outline">Oct 12, 2023</p>
                </div>
                <div className="text-right">
                  <span className="text-body-md font-body-md text-secondary font-bold">-0.5t CO₂</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Dark Mode Command Center Dashboard
  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-background min-h-screen text-on-surface">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="font-display-lg-mobile md:font-display-lg text-on-surface tracking-tight">Command Center</h2>
          <p className="font-body-lg text-on-surface-variant mt-2">Monitor your impact and optimize your ecological footprint.</p>
        </div>
        <div className="flex items-center gap-md">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <img
            alt="Climate Leader Avatar"
            className="w-10 h-10 rounded-full object-cover border border-white/10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaD_DIk_7nyVNY7J7F8hi3gFfXXz03FVMOSpMJu2Hlfg4JBM2Qs0o6S8UXvYT2UGl-qM949RQIpryg5108aCY2lw1VZy201bM6tXcpv8bHem4KZ3UftvSj4Gnfq7DDdzPsGmy2QiWFZOZY7g7Rn_U9hGeYL767z4RTYmlVjKo3iGlOT5v7cW1i15Z_Q2oDHYgZ9oVMHkae5z3yQuvTSuX7qknGqtyAK6C9eUzoUMUdiIPupkxgwLEurLHfaVBIfiAfmuU9uy4pBezd"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-7xl mx-auto">
        {/* Left Column: Impact Profile */}
        <div className="lg:col-span-5 flex flex-col gap-gutter">
          <section className="glass-panel rounded-2xl p-panel-padding glow-emerald relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <span className="material-symbols-outlined text-6xl text-primary transform rotate-12">public</span>
            </div>
            
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Your Impact Profile
            </h3>

            <div className="mb-10">
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Annual Emissions</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg-mobile md:font-display-lg text-[#10b981] text-glow font-bold tracking-tighter">
                  {Math.round(currentFootprint).toLocaleString()}
                </span>
                <span className="font-body-md text-primary">kg CO2 / yr</span>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <span className="font-label-sm text-on-surface">Reduction Progress</span>
                <span className="font-label-sm text-primary">{reductionPercent}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary-container to-primary-container rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500"
                  style={{ width: `${reductionPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">
                Adopted {adoptedCount} of {totalCount} roadmap actions
              </p>
            </div>

            <div>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-4">Milestones Achieved</p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <span className="material-symbols-outlined text-[14px]">local_florist</span>
                  Eco Starter
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm text-xs transition-all ${
                  reductionPercent >= 10 
                    ? 'bg-secondary-container/20 border border-secondary/20 text-secondary' 
                    : 'opacity-40 border border-dashed border-white/10'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">military_tech</span>
                  10% Club
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-sm text-xs transition-all ${
                  reductionPercent >= 20 
                    ? 'bg-tertiary-container/20 border border-tertiary/20 text-tertiary' 
                    : 'opacity-40 border border-dashed border-white/10'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">campaign</span>
                  Green Advocate
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Roadmap & Simulation */}
        <div className="lg:col-span-7 flex flex-col gap-gutter">
          {/* Section A: Roadmap Summary */}
          <section>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">route</span>
              Personalized Reduction Roadmap
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:bg-white/5 group flex justify-between items-center">
                <div>
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] uppercase">Diet</span>
                  <h4 className="font-headline-md text-[18px] text-on-surface leading-tight mt-2">Swap beef for poultry</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mt-1">Poultry has a significantly lower methane footprint.</p>
                </div>
                <div className="text-right whitespace-nowrap shrink-0">
                  <span className="text-primary font-bold text-lg block">-600 kg</span>
                  <button 
                    onClick={() => setView('roadmap')}
                    className="text-xs text-secondary hover:underline mt-1 block cursor-pointer"
                  >
                    View in Roadmap
                  </button>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:bg-white/5 group flex justify-between items-center">
                <div>
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] uppercase">Transport</span>
                  <h4 className="font-headline-md text-[18px] text-on-surface leading-tight mt-2">Work from home 1 day/week</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mt-1">Reducing commute miles directly lowers fuel consumption.</p>
                </div>
                <div className="text-right whitespace-nowrap shrink-0">
                  <span className="text-primary font-bold text-lg block">-437 kg</span>
                  <button 
                    onClick={() => setView('roadmap')}
                    className="text-xs text-secondary hover:underline mt-1 block cursor-pointer"
                  >
                    View in Roadmap
                  </button>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6 transition-all duration-300 hover:bg-white/5 group flex justify-between items-center">
                <div>
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] uppercase">Energy</span>
                  <h4 className="font-headline-md text-[18px] text-on-surface leading-tight mt-2">Lower thermostat by 2 degrees</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mt-1">Heating accounts for a major portion of energy use.</p>
                </div>
                <div className="text-right whitespace-nowrap shrink-0">
                  <span className="text-primary font-bold text-lg block">-312 kg</span>
                  <button 
                    onClick={() => setView('roadmap')}
                    className="text-xs text-secondary hover:underline mt-1 block cursor-pointer"
                  >
                    View in Roadmap
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section B: Simulation Console */}
          <section className="mt-8">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">model_training</span>
              Lifestyle Simulation Console
            </h3>
            <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                  type="text"
                  onClick={() => setView('simulations')}
                  readOnly
                  placeholder="Go vegetarian, switch to an EV..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] font-body-md cursor-pointer"
                />
              </div>
              <button 
                onClick={() => setView('simulations')}
                className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-secondary-container to-primary-container text-white font-label-sm font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer"
              >
                Run Simulation
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
