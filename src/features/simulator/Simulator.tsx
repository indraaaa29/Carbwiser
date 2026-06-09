import React, { useState } from 'react';
import type { SimulationResult } from '../../types';

interface SimulatorProps {
  currentFootprint: number;
  theme: 'light' | 'dark';
  onRunAIPrompt: (prompt: string, current: number) => Promise<SimulationResult>;
}

export const Simulator: React.FC<SimulatorProps> = ({ currentFootprint, onRunAIPrompt }) => {
  // Simulator controls state
  const [commute, setCommute] = useState<number>(150);
  const [meatDays, setMeatDays] = useState<number>(4);
  const [temp, setTemp] = useState<number>(22);
  const [renewable, setRenewable] = useState<boolean>(false);
  const [led, setLed] = useState<boolean>(true);

  // AI Simulation query state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiResult, setAiResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleRunAi = async () => {
    if (!searchQuery.trim()) return;
    setIsSimulating(true);
    setAiResult(null);
    try {
      const res = await onRunAIPrompt(searchQuery, currentFootprint);
      setAiResult(res);
    } catch (err) {
      console.error(err);
      // Direct heuristic fallback
      const q = searchQuery.toLowerCase();
      let savings = Math.round(currentFootprint * 0.1);
      let narrative = `Simulated lifestyle modification for "${searchQuery}". A moderate lifestyle optimization reduces baseline footprint by approximately 10%.`;

      if (q.includes('vegan')) {
        savings = 1100;
        narrative = "Going vegan eliminates emissions from livestock and dairy production, which is a major contributor to global agricultural greenhouse gases.";
      } else if (q.includes('vegetarian')) {
        savings = 700;
        narrative = "Adopting a vegetarian diet eliminates high-impact beef and pork consumption, saving considerable methane and feed crop overhead.";
      } else if (q.includes('ev') || q.includes('electric vehicle') || q.includes('electric car')) {
        savings = 1500;
        narrative = "Switching to an EV eliminates internal combustion engine tailpipe emissions completely, relying instead on the grid's average carbon intensity.";
      } else if (q.includes('solar') || q.includes('panels')) {
        savings = 1800;
        narrative = "Rooftop solar installations offset peak residential electric demand, creating clean energy locally and reducing power plant reliance.";
      }

      setAiResult({
        new_footprint_kg: Math.max(300, currentFootprint - savings),
        savings_kg: savings,
        narrative
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Heuristic calculation logic
  const calculateSimulatedImpact = () => {
    // Baseline calculations (commute: 150km, meat: 4 days, temp: 22C, renewable: false, led: true)
    const commuteDiff = (150 - commute) * 0.15 * 52; // kg CO2 saved per year
    const meatDiff = (4 - meatDays) * 6 * 52; // kg CO2 saved per year
    const tempDiff = (22 - temp) * 120; // kg CO2 saved per year (lower temp saves energy)
    const renewableSavings = renewable ? 1500 : 0;
    const ledSavings = led ? 250 : 0;

    let totalSavingsKg = commuteDiff + meatDiff + tempDiff + renewableSavings + ledSavings;
    if (aiResult) {
      totalSavingsKg += aiResult.savings_kg;
    }
    
    const totalSavingsTons = Math.max(-2.0, totalSavingsKg / 1000);

    // Financial savings
    const commuteCostSaved = (150 - commute) * 0.08 * 52; // gas savings
    const meatCostSaved = (4 - meatDays) * 4 * 52; // food savings
    const energyCostSaved = (22 - temp) * 15; // thermostat savings
    const renewableCost = renewable ? -80 : 0; // green energy premium
    const ledCostSaved = led ? 40 : 0; // LED efficiency savings

    let totalMoneySavings = Math.round(commuteCostSaved + meatCostSaved + energyCostSaved + renewableCost + ledCostSaved);
    if (aiResult) {
      totalMoneySavings += Math.round(aiResult.savings_kg * 0.2); // extra dynamic money savings
    }

    // Eco Score calculation
    const baseScore = 82;
    const scoreImprovement = Math.round((totalSavingsKg / (currentFootprint || 5000)) * 20);
    const newScore = Math.min(100, Math.max(40, baseScore + scoreImprovement));

    // Progress bar width
    const barWidth = Math.min(100, Math.max(5, Math.round(((newScore - 40) / 60) * 100)));

    return {
      reductionTons: totalSavingsTons.toFixed(1),
      moneySavings: totalMoneySavings,
      newScore,
      barWidth,
    };
  };

  const { reductionTons, moneySavings, newScore, barWidth } = calculateSimulatedImpact();

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-background min-h-screen text-on-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-xl">
          <h1 className="text-display-lg font-display-lg text-on-surface mb-sm">What-If Simulator</h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-[672px] mt-sm">
            Adjust lifestyle factors to instantly visualize their impact on your carbon footprint and potential financial savings.
          </p>
        </header>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          {/* Controls Panel */}
          <div className="lg:col-span-7 flex flex-col gap-lg">
            {/* Simulation Console Card */}
            <div className="bg-surface-white dark:bg-surface-container rounded-xl border border-surface-variant p-lg md:p-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">model_training</span>
                Lifestyle Simulation Console
              </h3>
              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <div className="relative w-full flex-1">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Go vegetarian, switch to an EV..."
                    className="w-full bg-surface-container-low dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] font-body-md"
                  />
                </div>
                <button 
                  onClick={handleRunAi}
                  disabled={isSimulating || !searchQuery.trim()}
                  className="w-full md:w-auto px-8 py-4 rounded-xl bg-secondary text-white font-label-sm font-semibold hover:bg-secondary/90 hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 whitespace-nowrap cursor-pointer h-[52px] flex items-center justify-center"
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>
              </div>

              {aiResult && (
                <div className="p-lg bg-surface-container-low dark:bg-black/20 rounded-xl border border-outline-variant dark:border-white/5 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-sm border-b border-surface-variant dark:border-white/5 pb-2">
                    <h4 className="font-bold text-primary">AI Simulation Result</h4>
                    <button 
                      onClick={() => setAiResult(null)}
                      className="text-xs text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-sm">{aiResult.narrative}</p>
                  <span className="text-xs font-bold text-secondary">
                    Projected Savings: -{aiResult.savings_kg} kg CO₂ / yr
                  </span>
                </div>
              )}
            </div>

            {/* Sliders Card */}
            <div className="bg-surface-white dark:bg-surface-container rounded-xl border border-surface-variant p-lg md:p-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">tune</span>
                Lifestyle Adjustments
              </h3>
              
              <div className="space-y-xl">
                {/* Slider 1: Commute */}
                <div>
                  <div className="flex justify-between items-end mb-sm">
                    <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Weekly Commute</label>
                    <span className="text-body-md font-body-md font-semibold text-primary">{commute} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={commute}
                    onChange={(e) => setCommute(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <div className="flex justify-between text-label-sm font-label-sm text-outline mt-xs">
                    <span>0</span>
                    <span>500 km</span>
                  </div>
                </div>

                {/* Slider 2: Meat */}
                <div>
                  <div className="flex justify-between items-end mb-sm">
                    <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Meat Consumption</label>
                    <span className="text-body-md font-body-md font-semibold text-primary">{meatDays} days/wk</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    value={meatDays}
                    onChange={(e) => setMeatDays(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <div className="flex justify-between text-label-sm font-label-sm text-outline mt-xs">
                    <span>0</span>
                    <span>7 days</span>
                  </div>
                </div>

                {/* Slider 3: Temperature */}
                <div>
                  <div className="flex justify-between items-end mb-sm">
                    <label className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Home Temperature</label>
                    <span className="text-body-md font-body-md font-semibold text-primary">{temp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="26"
                    step="0.5"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <div className="flex justify-between text-label-sm font-label-sm text-outline mt-xs">
                    <span>16°C</span>
                    <span>26°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggles Card */}
            <div className="bg-surface-white dark:bg-surface-container rounded-xl border border-surface-variant p-lg md:p-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-lg flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">home_iot_device</span>
                Home Upgrades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between p-md border border-surface-variant rounded-lg bg-surface-container-low">
                  <div>
                    <p className="text-body-md font-body-md font-medium text-on-surface">Renewable Energy</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Switch provider</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={renewable}
                      onChange={(e) => setRenewable(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] animate-all"></div>
                  </label>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-md border border-surface-variant rounded-lg bg-surface-container-low">
                  <div>
                    <p className="text-body-md font-body-md font-medium text-on-surface">LED Conversion</p>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">All fixtures</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={led}
                      onChange={(e) => setLed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] animate-all"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-5 h-full">
            <div className="rounded-xl p-xl shadow-lg bg-sage-muted dark:bg-surface-container overflow-hidden border border-outline-variant/30 dark:border-white/5 relative h-full">
              {/* Subtle design glows */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 space-y-lg">
                <h3 className="text-headline-md font-headline-md font-semibold mb-xl flex items-center gap-sm text-primary">
                  <span className="material-symbols-outlined">visibility</span>
                  Projected Impact
                </h3>

                {/* Reduction Metric */}
                <div className="bg-white/40 dark:bg-black/20 rounded-lg p-lg border border-primary/10 dark:border-white/5">
                  <p className="text-label-md font-label-md text-primary/70 dark:text-sage-muted uppercase tracking-wider mb-xs">Estimated Reduction</p>
                  <div className="flex items-baseline gap-sm">
                    <span className="text-display-lg font-display-lg font-bold text-primary dark:text-[#4edea3]">
                      {parseFloat(reductionTons) > 0 ? `-${reductionTons}` : reductionTons}
                    </span>
                    <span className="text-body-lg font-body-lg text-primary/80 dark:text-white/80">tons CO₂e/yr</span>
                  </div>
                  <div className="mt-sm w-full bg-primary/10 dark:bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-primary dark:bg-[#4edea3] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>

                {/* Savings Metric */}
                <div className="bg-white/40 dark:bg-black/20 rounded-lg p-lg border border-primary/10 dark:border-white/5">
                  <p className="text-label-md font-label-md text-primary/70 dark:text-sage-muted uppercase tracking-wider mb-xs">Money Savings</p>
                  <div className="flex items-baseline gap-sm">
                    <span className="text-display-lg font-display-lg font-bold text-secondary dark:text-[#c0c1ff]">
                      {moneySavings >= 0 ? `+$${moneySavings}` : `-$${Math.abs(moneySavings)}`}
                    </span>
                    <span className="text-body-lg font-body-lg text-primary/80 dark:text-white/80">/yr</span>
                  </div>
                  <p className="text-label-sm font-label-sm text-primary/70 dark:text-white/60 mt-xs flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary dark:text-[#4edea3]">trending_up</span>
                    {moneySavings >= 0 ? 'Positive financial impact' : 'Net investment required'}
                  </p>
                </div>

                {/* Eco Score Metric */}
                <div className="bg-white/40 dark:bg-black/20 rounded-lg p-lg border border-primary/10 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-label-md font-label-md text-primary/70 dark:text-sage-muted uppercase tracking-wider mb-xs">New Eco Score</p>
                    <span className="text-headline-lg font-headline-lg font-bold text-primary dark:text-white">{newScore}/100</span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-primary dark:border-[#4edea3] flex items-center justify-center bg-primary-container text-on-primary shrink-0">
                    <span className="material-symbols-outlined text-on-primary text-2xl">eco</span>
                  </div>
                </div>

                <button className="w-full mt-xl py-md px-lg bg-primary hover:bg-primary-container text-on-primary rounded-lg text-label-md font-label-md font-bold transition-colors cursor-pointer text-center h-[48px] flex items-center justify-center border-none outline-none">
                  Apply Changes to Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
