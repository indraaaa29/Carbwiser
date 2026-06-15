import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateFootprint } from '../lib/carbonCalculation';
import { useProfile } from '../context/ProfileContext';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { generateRecommendations } from '../lib/recommendationEngine';

type PeriodData = {
  id: string;
  label: string;
  footprint: number;
  reduction: number;
  reductionLabel: string;
  ecoScore: number;
  ecoScoreLabel: string;
  percentages: { transportation: number; energy: number; food: number };
};

const baseCategories = [
  {
    label: 'Transportation',
    icon: 'directions_car',
    color: 'bg-[#0060ac]',
    trackColor: 'bg-[#a4c9ff]/30',
    textColor: 'text-[#0060ac]',
    bgColor: 'bg-[#64a8fe]/20',
    iconColor: 'text-[#0060ac]',
  },
  {
    label: 'Energy',
    icon: 'bolt',
    color: 'bg-[#2b6954]',
    trackColor: 'bg-[#bdcac1]/30',
    textColor: 'text-[#2b6954]',
    bgColor: 'bg-[#2b6954]/10',
    iconColor: 'text-[#2b6954]',
  },
  {
    label: 'Food',
    icon: 'restaurant',
    color: 'bg-[#3b4741]',
    trackColor: 'bg-[#dce2f7]',
    textColor: 'text-[#3b4741]',
    bgColor: 'bg-[#3b4741]/10',
    iconColor: 'text-[#3b4741]',
  },
];

const FootprintOverview: React.FC = () => {
  const [selectedPeriodId, setSelectedPeriodId] = React.useState('ytd');
  const { profile } = useProfile();

  const periods: PeriodData[] = useMemo(() => {
    const metrics = calculateFootprint(profile);
    const BASELINE_AVG = 7000;
    const lastYearFootprint = Math.round(metrics.total * 1.15);
    const monthFootprint = Math.round(metrics.total / 12);

    const ytdReduction = Math.round(((BASELINE_AVG - metrics.total) / BASELINE_AVG) * 100);
    const lastYearReduction = Math.round(((metrics.total - lastYearFootprint) / lastYearFootprint) * 100);
    const prevMonthFootprint = Math.round(monthFootprint * 1.08);
    const monthReduction = Math.round(((prevMonthFootprint - monthFootprint) / prevMonthFootprint) * 100);

    return [
      {
        id: 'ytd',
        label: 'Current Year Estimate',
        footprint: metrics.total,
        reduction: ytdReduction,
        reductionLabel: 'vs. national average',
        ecoScore: metrics.ecoScore,
        ecoScoreLabel: metrics.ecoScoreLabel,
        percentages: { 
          transportation: metrics.categories.transportation.percentage, 
          energy: metrics.categories.energy.percentage, 
          food: metrics.categories.food.percentage 
        },
      },
      {
        id: 'last-year',
        label: 'Last Year (Estimated)',
        footprint: lastYearFootprint,
        reduction: lastYearReduction,
        reductionLabel: 'vs. previous year',
        ecoScore: Math.max(0, Math.round(100 - (lastYearFootprint / BASELINE_AVG) * 50)),
        ecoScoreLabel: Math.max(0, Math.round(100 - (lastYearFootprint / BASELINE_AVG) * 50)) >= 80 ? 'Excellent' : Math.max(0, Math.round(100 - (lastYearFootprint / BASELINE_AVG) * 50)) >= 60 ? 'Good' : 'Needs Work',
        percentages: { 
          transportation: Math.round((metrics.categories.transportation.kg * 1.15 / (lastYearFootprint)) * 100) || 0,
          energy: Math.round((metrics.categories.energy.kg * 1.15 / (lastYearFootprint)) * 100) || 0,
          food: Math.round((metrics.categories.food.kg * 1.15 / (lastYearFootprint)) * 100) || 0,
        },
      },
      {
        id: 'last-month',
        label: 'Last Month',
        footprint: monthFootprint,
        reduction: monthReduction,
        reductionLabel: 'vs. prev month',
        ecoScore: metrics.ecoScore,
        ecoScoreLabel: metrics.ecoScoreLabel,
        percentages: { 
          transportation: metrics.categories.transportation.percentage, 
          energy: metrics.categories.energy.percentage, 
          food: metrics.categories.food.percentage 
        },
      }
    ];
  }, [profile]);

  const currentData = periods.find(p => p.id === selectedPeriodId) || periods[0];
  
  const currentCategories = baseCategories.map(cat => ({
    ...cat,
    percentage: currentData.percentages[cat.label.toLowerCase() as keyof typeof currentData.percentages]
  }));

  const biggestHotspot = currentCategories.reduce((prev, current) => (prev.percentage > current.percentage) ? prev : current);
  const recommendations = useMemo(() => generateRecommendations(profile), [profile]);
  const catMap: Record<string, string> = { 'Transportation': 'mobility', 'Energy': 'energy', 'Food': 'food' };
  const hotspotRec = recommendations.find(r => r.category === catMap[biggestHotspot.label]) || recommendations[0];

  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter overflow-x-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#b0f0d6]/20 blur-[100px] rounded-full blob-shape opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2b6954]/10 blur-[120px] rounded-full blob-shape opacity-60" style={{ animationDelay: '-4s' }} />
      </div>


      <main id="main-content" className="flex-grow w-full px-4 md:px-10 max-w-[1440px] mx-auto py-8 flex flex-col gap-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in mb-2">
          <div>
            <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] tracking-tight">My Footprint</h1>
            <p className="font-inter text-lg text-[#404944] mt-2 max-w-2xl leading-7">
              A clear picture of your personal climate impact. See where your emissions come from and what you can do to reduce them.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-[#bfc9c3] shadow-sm hover:border-[#003527] transition-colors focus-within:ring-2 focus-within:ring-[#003527]/50">
            <span className="material-symbols-outlined text-[#003527]" aria-hidden="true">calendar_month</span>
            <select 
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="bg-transparent border-none outline-none font-geist text-sm font-semibold text-[#141b2b] cursor-pointer appearance-none pr-6 relative z-10"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23141b2b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '16px' }}
              aria-label="Select reporting period"
            >
              {periods.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Organic Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Hero Cell: Total Footprint & Eco Score */}
          <div className="flex-grow lg:w-2/3 bg-[#003527] text-white rounded-[40px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden animate-fade-in-delay-1 shadow-xl border border-[#064e3b]">
            {/* Background SVG */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="footprint-glow" cx="50%" cy="0%" r="70%">
                    <stop offset="0%" stopColor="#b0f0d6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#003527" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100" height="100" fill="url(#footprint-glow)" />
                <path d="M0,100 C30,80 70,90 100,60 L100,100 Z" fill="#002117" opacity="0.3" />
                <path d="M0,100 C40,90 60,70 100,80 L100,100 Z" fill="#0b513d" opacity="0.2" />
              </svg>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10 h-full">
              {/* Total Footprint */}
              <div className="flex flex-col gap-6 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#95d3ba]" aria-hidden="true" style={{ fontSize: '28px' }}>public</span>
                  <span className="font-geist text-sm font-bold text-[#95d3ba] uppercase tracking-[0.15em]">Annual Carbon Footprint</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[72px] md:text-[96px] font-geist font-bold leading-none tracking-tighter text-white drop-shadow-md">
                      <AnimatedNumber value={currentData.footprint} />
                    </span>
                  </div>
                  <span className="font-geist text-2xl text-[#b0f0d6] font-medium mt-2">kg CO₂e</span>
                </div>

                <div className="flex items-center gap-3 mt-2 bg-[#064e3b]/40 px-4 py-3 rounded-2xl w-fit border border-[#b0f0d6]/10" aria-label={`${Math.abs(currentData.reduction)}% reduction ${currentData.reductionLabel}`}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#b0f0d6] text-[#002117] shadow-inner" aria-hidden="true">
                    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '20px' }}>
                      {currentData.reduction > 0 ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-geist text-2xl text-white leading-none font-bold" aria-hidden="true">
                      <AnimatedNumber value={Math.abs(currentData.reduction)} suffix="%" />
                    </span>
                    <span className="font-geist text-xs text-[#95d3ba] uppercase tracking-wider mt-1">{currentData.reductionLabel}</span>
                  </div>
                </div>
              </div>

              {/* Eco Score Orb */}
              <div
                className="flex flex-col items-center justify-center self-center p-8 bg-[#2b6954]/20 rounded-full border border-[#b0f0d6]/20 shadow-2xl relative min-w-[240px] min-h-[240px]"
                role="img"
                aria-label={`Eco Score: ${currentData.ecoScore} out of 100 – ${currentData.ecoScoreLabel}`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#b0f0d6]/10 blur-xl blob-shape pointer-events-none"
                  animate={{
                    scale: [1, 1.15, 0.95, 1.1, 1],
                    opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="font-geist text-sm font-bold text-[#95d3ba] uppercase tracking-widest mb-4 z-10" aria-hidden="true">Eco Score</span>

                <div className="relative flex items-center justify-center w-32 h-32 z-10" aria-hidden="true">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 36 36">
                    <path
                      className="text-[#064e3b]/50"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <motion.path
                      className="text-[#b0f0d6]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="3"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(176, 240, 214, 0.6))' }}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: currentData.ecoScore / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-[56px] font-geist font-bold text-white leading-none tracking-tight">
                      <AnimatedNumber value={currentData.ecoScore} />
                    </span>
                  </div>
                </div>

                <div className="mt-6 px-4 py-1.5 rounded-full bg-[#b0f0d6] text-[#002117] font-geist text-sm font-bold z-10 uppercase tracking-widest shadow-sm">
                  {currentData.ecoScoreLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Emission Breakdown */}
            <div className="flex-grow lg:w-1/3 bg-white/90 border border-[#bfc9c3]/60 rounded-[40px] p-8 md:p-10 flex flex-col gap-8 animate-fade-in-delay-2 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,100 C20,90 40,80 100,95 L100,100 Z" fill="#2b6954" />
                  <path d="M0,100 C30,85 60,75 100,90 L100,100 Z" fill="#003527" opacity="0.5" />
                </svg>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-[#2b6954]" style={{ fontSize: '24px' }}>layers</span>
                <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Your Emissions by Category</h2>
              </div>

            <div className="flex flex-col gap-8 relative z-10">
              {currentCategories.map((cat) => (
                <div key={cat.label} className="flex flex-col gap-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center ${cat.iconColor} transition-transform group-hover:scale-110 duration-300`} aria-hidden="true">
                        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                      </div>
                      <span className="font-inter text-lg text-[#141b2b] font-medium">{cat.label}</span>
                    </div>
                    <span className={`font-geist text-2xl font-bold ${cat.textColor}`} aria-hidden="true">
                      <AnimatedNumber value={cat.percentage} suffix="%" />
                    </span>
                  </div>
                  <div
                    className={`w-full h-4 ${cat.trackColor} rounded-full overflow-hidden shadow-inner relative`}
                    role="meter"
                    aria-valuenow={cat.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${cat.label}: ${cat.percentage}% of your emissions`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      className={`h-full ${cat.color} rounded-full relative overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Biggest Hotspot Insight Card */}
        <div className="mt-8 bg-[#fff5f5] border border-[#ffcfcf] rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 animate-fade-in-delay-3">
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#ba1a1a]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center shrink-0 shadow-inner relative z-10">
            <span className="material-symbols-outlined text-[40px]" aria-hidden="true">local_fire_department</span>
          </div>

          <div className="relative z-10 flex-grow text-center md:text-left">
            <h3 className="font-geist text-sm font-bold text-[#ba1a1a] uppercase tracking-wider mb-2">Your Biggest Hotspot</h3>
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2 justify-center md:justify-start">
              <span className="font-geist text-3xl font-semibold text-[#141b2b]">{biggestHotspot.label} Emissions</span>
              <span className="font-inter text-lg text-[#ba1a1a] font-medium bg-[#ba1a1a]/10 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                {biggestHotspot.percentage}% of your total footprint
              </span>
            </div>
            <p className="font-inter text-[#404944] max-w-2xl mb-4 mx-auto md:mx-0">
              This category contributes the largest share of your annual emissions and offers the greatest reduction opportunity.
            </p>
            {hotspotRec && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-[#2b6954] bg-[#b0f0d6]/30 px-4 py-2 rounded-lg w-fit mx-auto md:mx-0">
                <span className="material-symbols-outlined text-[18px]">trending_down</span>
                Potential Reduction: {hotspotRec.estReduction} with top recommended action
              </div>
            )}
          </div>

          <div className="relative z-10 shrink-0 mt-4 md:mt-0 w-full md:w-auto">
            <Link 
              to="/actions" 
              className="w-full md:w-auto bg-[#ba1a1a] text-white px-6 py-4 md:py-3 rounded-xl font-geist text-sm font-semibold hover:bg-[#93000a] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              View Recommendations
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Next Steps CTA */}
        <section className="mt-8 bg-white border border-[#bfc9c3]/60 rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-delay-3">
          {/* Background element */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#b0f0d6]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="font-geist text-3xl font-semibold text-[#003527] mb-3">Ready to reduce your footprint?</h2>
            <p className="font-inter text-lg text-[#404944]">Get personalized actions based on your carbon hotspots and lifestyle choices.</p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link 
              to="/actions" 
              className="bg-[#003527] text-white px-8 py-4 rounded-xl font-geist text-base font-semibold hover:bg-[#064e3b] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">psychology</span>
              View Smart Actions
            </Link>
            <Link 
              to="/roadmap" 
              className="bg-[#f9f9ff] text-[#003527] border-2 border-[#003527] px-8 py-4 rounded-xl font-geist text-base font-semibold hover:bg-[#e1e8fd] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">map</span>
              Explore Roadmap
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FootprintOverview;
