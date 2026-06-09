import React from 'react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onReset: () => void;
  theme: 'light' | 'dark';
  userName?: string;
  userLevel?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  onReset,
  theme,
  userName = "Alex R.",
  userLevel = "Level 4 Steward",
}) => {
  // Navigation items based on theme
  const menuItems = theme === 'dark' 
    ? [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'roadmap', label: 'My Roadmap', icon: 'route' },
        { id: 'ledger', label: 'Impact Ledger', icon: 'account_balance_wallet' },
        { id: 'simulations', label: 'Simulations', icon: 'model_training' },
        { id: 'stays', label: 'Eco Stays', icon: 'travel_explore' },
      ]
    : [
        { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
        { id: 'roadmap', label: 'Roadmap', icon: 'alt_route' },
        { id: 'simulations', label: 'Simulator', icon: 'analytics' },
        { id: 'stays', label: 'Eco Stays', icon: 'travel_explore' },
      ];

  const sidebarTitle = 'CarbWiser';
  const sidebarSubtitle = theme === 'dark' ? 'Elite Stewardship' : 'Carbon Neutral Path';

  return (
    <nav className="bg-surface-container-low dark:bg-ink-black border-r border-outline-variant dark:border-surface-variant hidden md:flex flex-col h-full p-lg gap-sm w-[280px] fixed left-0 top-0 bottom-0 z-50">
      <div className="mb-xl flex items-center gap-md px-sm">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
        <div>
          <h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary tracking-tight">
            {sidebarTitle}
          </h1>
          <p className="text-label-sm font-label-sm text-on-surface-variant">{sidebarSubtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-xs overflow-y-auto">
        {menuItems.map(item => {
          const isActive = currentView === item.id || (item.id === 'overview' && currentView === 'dashboard') || (item.id === 'simulations' && currentView === 'simulations');
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-md px-md py-sm rounded-lg text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-secondary-fixed dark:bg-primary-container text-on-secondary-fixed-variant dark:text-on-primary-container font-bold scale-95'
                  : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-label-md font-label-md">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-lg border-t border-outline-variant dark:border-surface-variant flex flex-col gap-xs">
        <button
          onClick={onReset}
          className="flex items-center gap-md px-md py-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-surface-container-highest rounded-lg transition-all cursor-pointer text-left w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md font-label-md">Reset Profile</span>
        </button>

        <div className="flex items-center gap-3 px-md pt-lg border-t border-outline-variant dark:border-surface-variant mt-sm">
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 overflow-hidden shrink-0">
            <img
              alt="Climate Leader Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaD_DIk_7nyVNY7J7F8hi3gFfXXz03FVMOSpMJu2Hlfg4JBM2Qs0o6S8UXvYT2UGl-qM949RQIpryg5108aCY2lw1VZy201bM6tXcpv8bHem4KZ3UftvSj4Gnfq7DDdzPsGmy2QiWFZOZY7g7Rn_U9hGeYL767z4RTYmlVjKo3iGlOT5v7cW1i15Z_Q2oDHYgZ9oVMHkae5z3yQuvTSuX7qknGqtyAK6C9eUzoUMUdiIPupkxgwLEurLHfaVBIfiAfmuU9uy4pBezd"
            />
          </div>
          <div>
            <p className="font-label-sm text-on-surface font-medium">{userName}</p>
            <p className="text-[10px] text-primary">{userLevel}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
