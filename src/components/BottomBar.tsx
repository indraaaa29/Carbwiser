import React from 'react';

interface BottomBarProps {
  currentView: string;
  setView: (view: string) => void;
  theme: 'light' | 'dark';
}

export const BottomBar: React.FC<BottomBarProps> = ({ currentView, setView, theme }) => {
  const navItems = theme === 'dark'
    ? [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'roadmap', label: 'Roadmap', icon: 'route' },
        { id: 'simulations', label: 'Simulate', icon: 'model_training' },
        { id: 'ledger', label: 'Ledger', icon: 'account_balance_wallet' }
      ]
    : [
        { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
        { id: 'roadmap', label: 'Roadmap', icon: 'alt_route' },
        { id: 'simulations', label: 'Simulator', icon: 'analytics' }
      ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-high/80 dark:bg-[#1c1f2a]/90 backdrop-blur-lg border-t border-outline-variant dark:border-white/10 shadow-2xl rounded-t-xl pb-safe">
      {navItems.map(item => {
        const isActive = currentView === item.id || (item.id === 'overview' && currentView === 'dashboard') || (item.id === 'simulations' && currentView === 'simulations');
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center scale-90 duration-150 rounded-lg p-2 cursor-pointer ${
              isActive ? 'text-primary' : 'text-on-surface-variant dark:text-[#bbcabf]'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-sm text-[10px] mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
