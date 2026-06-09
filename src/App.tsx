import React, { useState, useEffect } from 'react';
import type { UserProfile, CarbonFootprint, ActionRecommendation, SimulationResult } from './types';
import { calculateBaseFootprint, generateStaticRecommendations } from './utils/calculator';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { LandingPage } from './pages/LandingPage';
import { AssessmentWizard } from './features/assessment/AssessmentWizard';
import { Dashboard } from './features/dashboard/Dashboard';
import { Roadmap } from './features/roadmap/Roadmap';
import { Ledger } from './features/ledger/Ledger';
import { Simulator } from './features/simulator/Simulator';

export default function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('cp_key') || '');
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('cw_profile');
    return cached ? JSON.parse(cached).profile : null;
  });
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(() => {
    const cached = localStorage.getItem('cw_profile');
    return cached ? JSON.parse(cached).footprint : null;
  });
  const [actions, setActions] = useState<ActionRecommendation[]>(() => {
    const cached = localStorage.getItem('cw_profile');
    return cached ? JSON.parse(cached).actions : [];
  });
  const [adoptedList, setAdoptedList] = useState<number[]>(() => {
    const cached = localStorage.getItem('cw_adopted');
    return cached ? JSON.parse(cached) : [];
  });
  const [currentFootprint, setCurrentFootprint] = useState<number>(() => {
    const cached = localStorage.getItem('cw_profile');
    if (!cached) return 0;
    const parsed = JSON.parse(cached);
    const cachedAdopted = localStorage.getItem('cw_adopted');
    const adopted: number[] = cachedAdopted ? JSON.parse(cachedAdopted) : [];
    const savedSavings = parsed.actions
      .filter((a: ActionRecommendation) => adopted.includes(a.rank))
      .reduce((sum: number, a: ActionRecommendation) => sum + a.projected_savings_kg, 0);
    return parsed.footprint.total_kg - savedSavings;
  });

  const [currentView, setView] = useState<string>(() => {
    const cached = localStorage.getItem('cw_profile');
    return cached ? 'overview' : 'landing';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const cachedTheme = localStorage.getItem('cw_theme');
    return (cachedTheme === 'light' || cachedTheme === 'dark') ? cachedTheme : 'dark';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Apply theme class to HTML element on change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('cw_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleOnboardSubmit = (userProfile: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      const calculated = calculateBaseFootprint(userProfile);
      const generatedActions = generateStaticRecommendations(userProfile, calculated);

      setProfile(userProfile);
      setFootprint(calculated);
      setActions(generatedActions);
      setCurrentFootprint(calculated.total_kg);
      setAdoptedList([]);

      localStorage.setItem('cw_profile', JSON.stringify({
        profile: userProfile,
        footprint: calculated,
        actions: generatedActions
      }));
      localStorage.setItem('cw_adopted', JSON.stringify([]));
      setIsLoading(false);
      setView('overview');
    }, 1000);
  };

  const handleExploreSandbox = () => {
    const mockProfile: UserProfile = {
      location: "New York, US",
      householdSize: 3,
      budgetConstraint: "Moderate Investment",
      dietType: "Average Meat",
      transportHabits: "Commute 15 miles daily in gas car, fly once a year",
      energySource: "Grid (Natural Gas)",
      statedPriorities: "Save money, reduce emissions"
    };
    handleOnboardSubmit(mockProfile);
  };

  const handleToggleHabit = (rank: number, savings: number) => {
    const updated = [...adoptedList];
    const idx = updated.indexOf(rank);
    if (idx > -1) {
      updated.splice(idx, 1);
      setCurrentFootprint(prev => prev + savings);
    } else {
      updated.push(rank);
      setCurrentFootprint(prev => prev - savings);
    }
    setAdoptedList(updated);
    localStorage.setItem('cw_adopted', JSON.stringify(updated));
  };

  const handleReset = () => {
    localStorage.removeItem('cw_profile');
    localStorage.removeItem('cw_adopted');
    setProfile(null);
    setFootprint(null);
    setActions([]);
    setAdoptedList([]);
    setCurrentFootprint(0);
    setView('landing');
  };

  const handleRunAIPrompt = async (promptText: string, current: number): Promise<SimulationResult> => {
    if (!apiKey) {
      throw new Error("No API key configured");
    }
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: `You are CarbWiser AI. Respond ONLY with a valid, minified JSON object matching the requested schema: {"new_footprint_kg": <number>, "narrative": "<string>"}`,
        messages: [{ role: 'user', content: `Current footprint: ${current} kg. Simulate scenario: "${promptText}". Output JSON.` }]
      })
    });
    if (!response.ok) {
      throw new Error("API request failed");
    }
    const result = await response.json();
    const data = JSON.parse(result.content[0].text.trim());
    return {
      new_footprint_kg: data.new_footprint_kg,
      savings_kg: current - data.new_footprint_kg,
      narrative: data.narrative
    };
  };

  const saveKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('cp_key', key);
  };

  // Switch views
  if (currentView === 'landing') {
    return (
      <LandingPage
        onCalculate={() => setView('assessment')}
        onExploreSandbox={handleExploreSandbox}
        hasProfile={!!profile}
        onNavigateToView={setView}
      />
    );
  }

  if (currentView === 'assessment') {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={saveKey}
            placeholder="Anthropic API Key"
            className="bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-xs text-on-surface placeholder:text-slate-500 focus:border-primary focus:outline-none"
          />
        </div>
        {/* Background Atmospheric Glow */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>
        <div className="w-full max-w-2xl">
          <div className="mb-4">
            <button
              onClick={() => setView('landing')}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Landing
            </button>
          </div>
          <AssessmentWizard onSubmit={handleOnboardSubmit} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative bg-background text-on-background">
      {/* Background Atmospheric Glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-container opacity-10 blur-[100px]" />
      </div>

      {/* Sidebar (Desktop) */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        onReset={handleReset}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Mobile Header Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant dark:border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">CarbWiser</h1>
        <div className="flex gap-4">
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-white/10 overflow-hidden">
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGeI4U41TUfADjPvs1z-QboZSnB2irE8aZUK0aXQnEsBXzq4eSocOlNfT2xqu-0Ay1dZdlUjEqfW4dcGSt06hR-WE4y8iUz7qqUMG8ATawCmQXVM8OodLP4O60t-TxGiJH_GyeUimGe0hpre-L8YZ9-_jY4QJbnB4YreLuK9Rl8XIa8xtTkA_tnBz2LtY3UoBv3fySiJENsg2IkXRn63B11CMdzRJWmApqFfhD2vektQ_d7vynMJnM5s2Kynh3MR1TjJEhPX3qCjVZ"
            />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[280px] pt-20 lg:pt-0 pb-24 lg:pb-0 w-full">
        {currentView === 'overview' && (
          <Dashboard 
            footprint={footprint!} 
            currentFootprint={currentFootprint} 
            adoptedCount={adoptedList.length} 
            totalCount={actions.length}
            theme={theme}
            setView={setView}
          />
        )}
        {currentView === 'roadmap' && (
          <Roadmap 
            actions={actions} 
            adoptedList={adoptedList} 
            onToggleHabit={handleToggleHabit} 
            theme={theme}
          />
        )}
        {currentView === 'ledger' && (
          <Ledger 
            actions={actions} 
            adoptedList={adoptedList} 
            footprint={currentFootprint} 
          />
        )}
        {currentView === 'simulations' && (
          <Simulator 
            currentFootprint={currentFootprint} 
            onRunAIPrompt={handleRunAIPrompt} 
            theme={theme}
          />
        )}
      </main>

      {/* BottomNav (Mobile) */}
      <BottomBar currentView={currentView} setView={setView} theme={theme} />
    </div>
  );
}
