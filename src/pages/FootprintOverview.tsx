import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1500,
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

const emissionCategories = [
  {
    label: 'Transportation',
    icon: 'directions_car',
    percentage: 45,
    color: 'bg-[#0060ac]',
    trackColor: 'bg-[#a4c9ff]/30',
    textColor: 'text-[#0060ac]',
    bgColor: 'bg-[#64a8fe]/20',
    iconColor: 'text-[#0060ac]',
  },
  {
    label: 'Energy',
    icon: 'bolt',
    percentage: 35,
    color: 'bg-[#2b6954]',
    trackColor: 'bg-[#bdcac1]/30',
    textColor: 'text-[#2b6954]',
    bgColor: 'bg-[#2b6954]/10',
    iconColor: 'text-[#2b6954]',
  },
  {
    label: 'Food',
    icon: 'restaurant',
    percentage: 20,
    color: 'bg-[#3b4741]',
    trackColor: 'bg-[#dce2f7]',
    textColor: 'text-[#3b4741]',
    bgColor: 'bg-[#3b4741]/10',
    iconColor: 'text-[#3b4741]',
  },
];

const FootprintOverview: React.FC = () => {
  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter overflow-x-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#b0f0d6]/20 blur-[100px] rounded-full blob-shape opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#2b6954]/10 blur-[120px] rounded-full blob-shape opacity-60" style={{ animationDelay: '-4s' }} />
      </div>

      <Navbar />

      <main className="flex-grow w-full px-4 md:px-10 max-w-[1440px] mx-auto py-8 flex flex-col gap-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-fade-in mb-2">
          <div>
            <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] tracking-tight">Overview</h1>
            <p className="font-inter text-lg text-[#404944] mt-2 max-w-2xl leading-7">
              Your personal climate impact terrain. Track, understand, and reduce your carbon footprint.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-5 py-2.5 rounded-full border border-[#bfc9c3] shadow-sm">
            <span className="material-symbols-outlined text-[#003527]">calendar_month</span>
            <span className="font-geist text-sm font-semibold text-[#141b2b]">2024 Year to Date</span>
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
                  <span className="material-symbols-outlined text-[#95d3ba]" style={{ fontSize: '28px' }}>public</span>
                  <span className="font-geist text-sm font-bold text-[#95d3ba] uppercase tracking-[0.15em]">Annual Carbon Footprint</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[72px] md:text-[96px] font-geist font-bold leading-none tracking-tighter text-white drop-shadow-md">4,250</span>
                  </div>
                  <span className="font-geist text-2xl text-[#b0f0d6] font-medium mt-2">kg CO₂e</span>
                </div>

                <div className="flex items-center gap-3 mt-2 bg-[#064e3b]/40 px-4 py-3 rounded-2xl w-fit border border-[#b0f0d6]/10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#b0f0d6] text-[#002117] shadow-inner">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_downward</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-geist text-2xl text-white leading-none font-bold">12%</span>
                    <span className="font-geist text-xs text-[#95d3ba] uppercase tracking-wider mt-1">vs. previous year</span>
                  </div>
                </div>
              </div>

              {/* Eco Score Orb */}
              <div className="flex flex-col items-center justify-center self-center p-8 bg-[#2b6954]/20 rounded-full border border-[#b0f0d6]/20 shadow-2xl relative min-w-[240px] min-h-[240px]">
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
                <span className="font-geist text-sm font-bold text-[#95d3ba] uppercase tracking-widest mb-4 z-10">Eco Score</span>

                <div className="relative flex items-center justify-center w-32 h-32 z-10">
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
                      animate={{ pathLength: 0.85 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-[56px] font-geist font-bold text-white leading-none tracking-tight">
                      <AnimatedNumber value={85} />
                    </span>
                  </div>
                </div>

                <div className="mt-6 px-4 py-1.5 rounded-full bg-[#b0f0d6] text-[#002117] font-geist text-sm font-bold z-10 uppercase tracking-widest shadow-sm">
                  Excellent
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
              <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Emission Breakdown</h2>
            </div>

            <div className="flex flex-col gap-8 relative z-10">
              {emissionCategories.map((cat) => (
                <div key={cat.label} className="flex flex-col gap-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center ${cat.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                      </div>
                      <span className="font-inter text-lg text-[#141b2b] font-medium">{cat.label}</span>
                    </div>
                    <span className={`font-geist text-2xl font-bold ${cat.textColor}`}>
                      <AnimatedNumber value={cat.percentage} suffix="%" />
                    </span>
                  </div>
                  <div className={`w-full h-4 ${cat.trackColor} rounded-full overflow-hidden shadow-inner relative`}>
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
      </main>

      <Footer />
    </div>
  );
};

export default FootprintOverview;
