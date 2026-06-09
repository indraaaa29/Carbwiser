import React from 'react';
import type { ActionRecommendation } from '../../types';

interface LedgerProps {
  actions: ActionRecommendation[];
  adoptedList: number[];
  footprint: number;
}

export const Ledger: React.FC<LedgerProps> = ({ actions, adoptedList, footprint }) => {
  const adoptedActions = actions.filter(a => adoptedList.includes(a.rank));
  const totalSaved = adoptedActions.reduce((sum, a) => sum + a.projected_savings_kg, 0);

  const monthlyData = [
    { month: 'Jan', emissions: footprint + totalSaved * 0.9 },
    { month: 'Feb', emissions: footprint + totalSaved * 0.8 },
    { month: 'Mar', emissions: footprint + totalSaved * 0.65 },
    { month: 'Apr', emissions: footprint + totalSaved * 0.4 },
    { month: 'May', emissions: footprint + totalSaved * 0.25 },
    { month: 'Jun (Current)', emissions: footprint, current: true }
  ];

  const maxEmissions = Math.max(...monthlyData.map(d => d.emissions), 1000);

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-background min-h-screen text-on-surface">
      <div className="max-w-7xl mx-auto space-y-gutter">
        <header className="mb-8">
          <h3 className="font-display-lg text-primary flex items-center gap-2 font-bold text-3xl">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            Stewardship Impact Ledger
          </h3>
          <p className="text-body-lg text-on-surface-variant mt-2">
            Verify your historical carbon ledger, adopted goals, and long-term emission trends.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7">
            <section className="glass-panel rounded-2xl p-panel-padding h-full flex flex-col justify-between">
              <h4 className="font-bold text-[#dfe2f1] mb-6 text-sm uppercase tracking-wider">
                Monthly Emission Trends (kg CO₂ / mo)
              </h4>

              <div className="flex h-64 items-end justify-between gap-4 border-b border-white/10 pb-2 px-4">
                {monthlyData.map((d, idx) => {
                  const heightPct = Math.round((d.emissions / maxEmissions) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.round(d.emissions).toLocaleString()}
                      </span>
                      <div 
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          d.current 
                            ? 'bg-gradient-to-t from-emerald-500/80 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-gradient-to-t from-indigo-500/40 to-indigo-500/80'
                        }`}
                      />
                      <span className="text-[10px] font-semibold text-slate-500">{d.month}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Historical baseline</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active optimizations applied</span>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <section className="glass-panel rounded-2xl p-panel-padding h-full flex flex-col justify-between">
              <h4 className="font-bold text-[#dfe2f1] mb-4 text-sm uppercase tracking-wider">
                Adopted Optimizations Ledger
              </h4>

              <div className="flex-1 overflow-y-auto space-y-3 max-h-[280px] pr-2">
                {adoptedActions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">inventory_2</span>
                    No optimizations adopted yet.<br />Tick off actions on the Roadmap to update your ledger.
                  </div>
                ) : (
                  adoptedActions.map(action => (
                    <div key={action.rank} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs text-primary font-bold">{action.category}</span>
                        <p className="text-xs font-semibold text-[#dfe2f1] mt-0.5">{action.title}</p>
                      </div>
                      <span className="text-xs text-primary font-black">-{action.projected_savings_kg} kg/yr</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Annual Savings</span>
                <span className="text-lg font-bold text-primary">-{totalSaved.toLocaleString()} kg CO₂</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
