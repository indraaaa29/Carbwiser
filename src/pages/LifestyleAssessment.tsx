import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useProfile } from '../context/ProfileContext';
import { OptionCard } from '../components/ui/OptionCard';
import { validateAssessmentStep } from '../lib/validation';

const steps = ['Transportation', 'Energy', 'Food', 'Household', 'Goal'];

const transportOptions = [
  { value: 'car', icon: 'directions_car', label: 'Car', sub: 'Gas, Diesel, or Hybrid' },
  { value: 'ev', icon: 'electric_car', label: 'Electric Vehicle', sub: 'Fully electric' },
  { value: 'bus', icon: 'directions_bus', label: 'Bus', sub: 'Public transit' },
  { value: 'metro', icon: 'subway', label: 'Metro / Train', sub: 'Rail network' },
  { value: 'bike', icon: 'pedal_bike', label: 'Bike', sub: 'Manual or e-bike' },
  { value: 'walk', icon: 'hiking', label: 'Walk', sub: 'Primarily on foot' },
];

const energyOptions = [
  { value: 'grid', icon: 'power', label: 'Grid Electricity', sub: 'Standard utility' },
  { value: 'renewable', icon: 'wind_power', label: 'Renewable', sub: 'Solar, wind, hydro' },
  { value: 'gas', icon: 'local_fire_department', label: 'Natural Gas', sub: 'Gas heating/cooking' },
  { value: 'mixed', icon: 'energy_savings_leaf', label: 'Mixed Sources', sub: 'Combination' },
];

const foodOptions = [
  { value: 'omnivore', icon: 'restaurant', label: 'Omnivore', sub: 'Meat daily' },
  { value: 'flexitarian', icon: 'eco', label: 'Flexitarian', sub: 'Occasional meat' },
  { value: 'vegetarian', icon: 'grass', label: 'Vegetarian', sub: 'No meat' },
  { value: 'vegan', icon: 'compost', label: 'Vegan', sub: 'Plant-based only' },
];

const householdOptions = [
  { value: '1', icon: 'person', label: '1 Person', sub: 'Solo household' },
  { value: '2', icon: 'group', label: '2 People', sub: 'Couple' },
  { value: '3-4', icon: 'family_restroom', label: '3-4 People', sub: 'Small family' },
  { value: '5+', icon: 'groups', label: '5+ People', sub: 'Large household' },
];

const goalOptions = [
  { value: '10', icon: 'trending_down', label: 'Reduce 10%', sub: 'Moderate target' },
  { value: '25', icon: 'eco', label: 'Reduce 25%', sub: 'Ambitious target' },
  { value: '50', icon: 'forest', label: 'Reduce 50%', sub: 'Transformative' },
  { value: 'zero', icon: 'public', label: 'Net Zero', sub: 'Full commitment' },
];

const LifestyleAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [transportMode, setTransportMode] = useState<string | null>(null);
  const [weeklyDistance, setWeeklyDistance] = useState('');
  const [energySource, setEnergySource] = useState<string | null>(null);
  const [monthlyKwh, setMonthlyKwh] = useState('');
  const [dietType, setDietType] = useState<string | null>(null);
  const [householdSize, setHouseholdSize] = useState<string | null>(null);
  const [reductionGoal, setReductionGoal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcerRef.current) {
      announcerRef.current.textContent = `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`;
    }
    if (stepContentRef.current) {
      const heading = stepContentRef.current.querySelector('h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
    }
  }, [currentStep]);

  const { updateProfile } = useProfile();

  const getFormData = () => ({
    transportMode,
    weeklyDistance,
    energySource,
    monthlyKwh,
    dietType,
    householdSize,
    reductionGoal,
  });

  const handleComplete = () => {
    const data = getFormData();
    const validation = validateAssessmentStep(4, data);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    updateProfile({
      transportMode: transportMode ?? 'car',
      weeklyDistance: Number(weeklyDistance) || 80,
      energySource: energySource ?? 'grid',
      monthlyKwh: Number(monthlyKwh) || 400,
      dietType: dietType ?? 'omnivore',
      householdSize: householdSize ?? '2',
      reductionGoal: reductionGoal ?? '25',
    });
    navigate('/overview');
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setError(null);
    const data = getFormData();
    const validation = validateAssessmentStep(currentStep, data);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="font-geist text-4xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
                How do you navigate your world?
              </h1>
              <p className="font-inter text-lg text-[#404944] leading-7">
                Your daily journey is the first step in understanding your environmental footprint.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {transportOptions.map((opt) => (
                <OptionCard key={opt.value} {...opt} selected={transportMode === opt.value} onSelect={setTransportMode} />
              ))}
            </div>
            <div className="flex flex-col gap-2 bg-white/60 p-6 rounded-2xl border border-[#bfc9c3]/50 shadow-sm">
              <label className="font-geist text-sm font-semibold text-[#003527] uppercase tracking-widest" htmlFor="commute-distance">
                Weekly Journey Distance (km)
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#404944]" aria-hidden="true">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">explore</span>
                </span>
                <input
                  className="w-full bg-white/80 border border-[#bfc9c3] rounded-xl pl-12 pr-4 py-4 text-[#141b2b] focus:outline-none focus:ring-2 focus:ring-[#003527] focus:border-[#003527] transition-all font-inter text-base placeholder:text-[#bfc9c3] shadow-inner"
                  id="commute-distance"
                  onChange={(e) => setWeeklyDistance(e.target.value)}
                  placeholder="e.g. 50"
                  type="number"
                  value={weeklyDistance}
                  min="0"
                  aria-describedby="commute-distance-hint"
                />
              </div>
              <p className="font-inter text-xs text-[#404944] mt-1" id="commute-distance-hint">Estimate the total distance you travel in a typical week.</p>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="font-geist text-4xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
                How do you power your home?
              </h1>
              <p className="font-inter text-lg text-[#404944] leading-7">
                Your energy source shapes a significant portion of your carbon footprint.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {energyOptions.map((opt) => (
                <OptionCard key={opt.value} {...opt} selected={energySource === opt.value} onSelect={setEnergySource} />
              ))}
            </div>
            <div className="flex flex-col gap-2 bg-white/60 p-6 rounded-2xl border border-[#bfc9c3]/50 shadow-sm">
              <label className="font-geist text-sm font-semibold text-[#003527] uppercase tracking-widest" htmlFor="monthly-kwh">
                Monthly Energy Usage (kWh)
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#404944]" aria-hidden="true">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">bolt</span>
                </span>
                <input
                  className="w-full bg-white/80 border border-[#bfc9c3] rounded-xl pl-12 pr-4 py-4 text-[#141b2b] focus:outline-none focus:ring-2 focus:ring-[#003527] focus:border-[#003527] transition-all font-inter text-base placeholder:text-[#bfc9c3] shadow-inner"
                  id="monthly-kwh"
                  onChange={(e) => setMonthlyKwh(e.target.value)}
                  placeholder="e.g. 400"
                  type="number"
                  value={monthlyKwh}
                  min="0"
                  aria-describedby="monthly-kwh-hint"
                />
              </div>
              <p className="font-inter text-xs text-[#404944] mt-1" id="monthly-kwh-hint">Check your utility bill for your average monthly usage.</p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="font-geist text-4xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
                What nourishes you?
              </h1>
              <p className="font-inter text-lg text-[#404944] leading-7">
                Food choices have a significant impact on your personal carbon footprint.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {foodOptions.map((opt) => (
                <OptionCard key={opt.value} {...opt} selected={dietType === opt.value} onSelect={setDietType} />
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="font-geist text-4xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
                Who shares your space?
              </h1>
              <p className="font-inter text-lg text-[#404944] leading-7">
                Household size affects how emissions are distributed across shared resources.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {householdOptions.map((opt) => (
                <OptionCard key={opt.value} {...opt} selected={householdSize === opt.value} onSelect={setHouseholdSize} />
              ))}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="font-geist text-4xl md:text-5xl font-semibold text-[#003527] mb-4 tracking-tight">
                Set your climate goal.
              </h1>
              <p className="font-inter text-lg text-[#404944] leading-7">
                What level of reduction are you committed to achieving this year?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {goalOptions.map((opt) => (
                <OptionCard key={opt.value} {...opt} selected={reductionGoal === opt.value} onSelect={setReductionGoal} />
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="text-[#141b2b] min-h-screen flex flex-col font-inter"
      style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(220, 235, 225, 0.5) 0%, rgba(240, 245, 241, 1) 90%)' }}
    >
      {/* Assessment Header */}
      <header className="w-full bg-[#f9f9ff]/80 backdrop-blur-md border-b border-[#bfc9c3] sticky top-0 z-10 shadow-sm">
        <div className="px-4 md:px-10 max-w-[1440px] mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#003527] font-geist text-2xl font-bold" aria-label="CarbWiser">
            <span className="material-symbols-outlined text-3xl" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
            <span>CarbWiser</span>
          </div>
          <Link
            to="/"
            className="text-[#404944] hover:text-[#141b2b] transition-colors font-geist text-sm font-medium flex items-center gap-1"
            aria-label="Save progress and exit assessment"
          >
            <span>Save &amp; Exit</span>
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>close</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#dce2f7] h-1.5" aria-hidden="true">
          <div
            className="bg-[#003527] h-full transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuetext={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`}
          aria-label="Assessment progress"
          className="sr-only"
        >
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </div>

        {/* Step Navigation */}
        <nav aria-label="Assessment steps" className="px-4 md:px-10 max-w-[1440px] mx-auto py-2 flex gap-4 overflow-x-auto hide-scrollbar font-geist text-xs">
          <ol role="list" className="flex gap-4">
          {steps.map((step, index) => (
            <li
              key={step}
              aria-current={index === currentStep ? 'step' : undefined}
              className={`whitespace-nowrap ${
                index === currentStep
                  ? 'text-[#003527] font-bold border-b-2 border-[#003527] pb-1'
                  : index < currentStep
                  ? 'text-[#2b6954]'
                  : 'text-[#404944]'
              }`}
            >
              <span aria-hidden="true">{index + 1}. </span>{step}
              {index < currentStep && <span className="sr-only"> (completed)</span>}
            </li>
          ))}
          </ol>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow flex flex-col items-center py-8 px-4 md:px-10 w-full max-w-4xl mx-auto">
        <div className="w-full" aria-live="polite" aria-atomic="true" ref={stepContentRef}>
          <span role="status" aria-live="polite" aria-atomic="true" className="sr-only" ref={announcerRef} />
          {renderStep()}
        </div>
        
        {error && (
          <div className="mt-6 w-full p-4 bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 rounded-xl flex items-center gap-3 text-[#ba1a1a]" role="alert">
            <span className="material-symbols-outlined" aria-hidden="true">error</span>
            <span className="font-inter text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="w-full flex justify-between items-center mt-auto pt-8 border-t border-[#bfc9c3]/50 mt-8">
          <button
            className="px-6 py-3 rounded-xl text-[#404944] hover:text-[#003527] font-geist text-sm font-medium transition-colors disabled:opacity-30 flex items-center gap-2"
            disabled={currentStep === 0}
            onClick={handleBack}
            type="button"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              className="bg-[#003527] text-white px-8 py-4 rounded-xl font-geist text-sm font-medium hover:bg-[#064e3b] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
              onClick={handleNext}
              type="button"
            >
              Continue Journey
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleComplete}
              type="button"
              className="bg-[#003527] text-white px-8 py-4 rounded-xl font-geist text-sm font-medium hover:bg-[#064e3b] transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              View My Footprint
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LifestyleAssessment;
