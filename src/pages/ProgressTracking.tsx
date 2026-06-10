import React from 'react';
import { Link } from 'react-router-dom';
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
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

const monthlyData = [
  { month: 'Jan', actual: 85, target: 80, height: '85%', targetTop: '20%' },
  { month: 'Feb', actual: 72, target: 75, height: '72%', targetTop: '25%' },
  { month: 'Mar', actual: 65, target: 70, height: '65%', targetTop: '30%' },
  { month: 'Apr', actual: 68, target: 65, height: '68%', targetTop: '35%' },
  { month: 'May', actual: 55, target: 60, height: '55%', targetTop: '40%' },
  { month: 'Jun', actual: 50, target: 55, height: '50%', targetTop: '45%' },
];

const initiatives = [
  { icon: 'solar_power', iconBg: 'bg-[#d4e3ff]', iconColor: 'text-[#001c39]', title: 'Solar Array Phase 2', location: 'Facility A' },
  { icon: 'local_shipping', iconBg: 'bg-[#d9e6dd]', iconColor: 'text-[#131e19]', title: 'Fleet Electrification', location: 'Logistics Hub' },
  { icon: 'wind_power', iconBg: 'bg-[#e1e8fd]', iconColor: 'text-[#003c70]', title: 'Wind Power PPA', location: 'Facility B' },
];

const roadmapItems = [
  { label: 'Supply Chain Audit', date: 'Completed Jul 15', status: 'done' },
  { label: 'HVAC Optimization', date: 'Completed Aug 02', status: 'done' },
  { label: 'Fleet Transition Ph 1', date: 'In Progress - 60%', progress: 60, status: 'active' },
  { label: 'Renewable Energy RFP', date: 'Scheduled Sep 10', status: 'pending' },
];

const ProgressTracking: React.FC = () => {
  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        {/* Hero Section */}
        <section className="mb-8 rounded-2xl overflow-hidden relative min-h-[400px] flex items-center shadow-lg border border-[#bfc9c3]">
          <img
            alt="Flourishing forest representing ecological restoration"
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://lh3.googleusercontent.com/aida/AP1WRLtwaLymwW8MPX4IAsd63y8Y2cvqpq_XvjtuVSkmQcGrDkPG346NMQhKZJZvyvGFWo5twN4D2UMh5cPbU3f9k90UaYeEGjQ4hKRbSQnSa7oDX5t4nkdTVZckxOuhDD-mShTMp7sulFTYR9gxAEE_QZgLhwIxsz8IgOV4KJ1Bp3xKU7ld7b6R91LFLkpDgMGjQ8jJnfHWLCZTfr6G2oGR6N9jhmPfJETv0Mmnot6mUM0pD06fKvwLsiCZUA"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003527]/90 via-[#003527]/70 to-transparent z-10" />

          <div className="relative z-20 p-8 md:p-16 max-w-3xl">
            <h1 className="font-geist text-3xl md:text-5xl font-semibold text-white mb-4">Progress Tracking</h1>
            <p className="font-inter text-lg text-[#80bea6] max-w-2xl mb-8 leading-7">
              Monitor your historical data and current velocity towards operational sustainability goals. Every step is a seed planted for our future.
            </p>

            {/* Hero Metric */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 inline-block">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>co2</span>
                <h2 className="font-geist text-sm font-medium text-white">Emissions Reduced</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-geist text-5xl font-semibold text-white">
                  <AnimatedNumber value={2450} />
                </span>
                <span className="font-inter text-base text-[#80bea6]">tCO2e</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <div className="bg-[#b0f0d6]/20 rounded-xl px-2 py-0.5 flex items-center gap-1 backdrop-blur-sm border border-[#b0f0d6]/30">
                  <span className="material-symbols-outlined text-[14px] text-[#b0f0d6]" style={{ fontVariationSettings: "'FILL' 0" }}>trending_down</span>
                  <span className="font-geist text-xs text-[#b0f0d6]">-12% vs last year</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Goals Completed */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#b0f0d6]/20 rounded-full blur-2xl group-hover:bg-[#b0f0d6]/30 transition-all duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Goals Completed</h2>
                <div className="w-10 h-10 rounded-full bg-[#064e3b] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#80bea6]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-geist text-5xl font-semibold text-[#003527]">
                    <AnimatedNumber value={14} />
                  </span>
                  <span className="font-inter text-base text-[#404944]">of 20 milestones reached</span>
                </div>
                <div className="w-full bg-[#dce2f7] rounded-full h-3 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#003527] to-[#95d3ba] h-full rounded-full relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
                <p className="font-geist text-sm text-[#404944] mt-2">70% to yearly target</p>
              </div>
            </article>

            {/* Active Initiatives */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 shadow-sm flex-grow">
              <div className="mb-4 flex justify-between items-end">
                <div>
                  <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Active Initiatives</h2>
                  <p className="font-inter text-sm text-[#404944] mt-1">Driving change across 3 facilities.</p>
                </div>
                <span className="font-geist text-4xl font-semibold text-[#003527]">
                  <AnimatedNumber value={6} />
                </span>
              </div>
              <ul className="space-y-2 mt-4">
                {initiatives.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f1f3ff] transition-colors border border-transparent hover:border-[#bfc9c3]/50 cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined ${item.iconColor} text-sm`} style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-geist text-sm font-medium text-[#141b2b] truncate">{item.title}</h3>
                      <p className="font-geist text-xs text-[#404944]">{item.location}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Monthly Bar Chart */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 flex flex-col shadow-sm relative overflow-hidden h-[400px]">
              {/* Subtle dot grid texture */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }}
              />

              <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                  <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Monthly Impact Profile</h2>
                  <p className="font-inter text-sm text-[#404944] mt-1">Carbon reduction velocity over the last 6 months.</p>
                </div>
                {/* Legend */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#003527]" />
                    <span className="font-geist text-xs text-[#404944]">Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-[#bfc9c3]" />
                    <span className="font-geist text-xs text-[#404944]">Target</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="relative flex-grow flex items-end justify-between pt-6 border-b border-[#bfc9c3] gap-2 sm:gap-4 pb-2 z-10">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-t border-[#bfc9c3] opacity-30 w-full h-0 border-dashed" />
                  ))}
                </div>

                {monthlyData.map((d) => (
                  <div key={d.month} className="relative z-10 flex flex-col justify-end w-full group">
                    <div className="w-full flex justify-center items-end h-[200px] relative">
                      {/* Target Line */}
                      <div
                        className="absolute w-full border-t-2 border-[#bfc9c3]/40"
                        style={{ top: d.targetTop }}
                        title={`Target: ${d.target}`}
                      />
                      {/* Actual Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: d.height }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-[#003527] to-[#95d3ba] hover:to-[#b0f0d6] transition-colors rounded-t-lg shadow-md relative group cursor-pointer"
                        title={`Actual: ${d.actual}`}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-[#293040] text-[#edf0ff] text-xs py-1.5 px-2.5 rounded-lg whitespace-nowrap transition-opacity shadow-lg z-20 pointer-events-none">
                          {d.actual} tCO2e
                        </div>
                      </motion.div>
                    </div>
                    <span className="font-geist text-xs text-[#404944] text-center mt-3 block">{d.month}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Roadmap Status */}
            <article className="bg-white rounded-2xl border border-[#bfc9c3] p-6 flex flex-col shadow-sm">
              <div className="mb-4 flex justify-between items-center border-b border-[#bfc9c3] pb-4">
                <div>
                  <h2 className="font-geist text-2xl font-medium text-[#141b2b]">Roadmap Status</h2>
                  <p className="font-inter text-sm text-[#404944] mt-1">Key milestones for Q3.</p>
                </div>
                <Link to="/roadmap" className="font-geist text-sm font-medium text-[#003527] hover:underline">View Full Roadmap</Link>
              </div>

              {/* Timeline: horizontal on desktop, vertical on mobile */}
              <div className="flex-grow flex flex-col sm:flex-row relative pt-2 gap-4 overflow-x-auto pb-4 hide-scrollbar mt-4">
                {/* Horizontal connecting line (desktop) */}
                <div className="hidden sm:block absolute top-[28px] left-6 right-6 h-px bg-[#bfc9c3]" />
                {/* Vertical line (mobile) */}
                <div className="sm:hidden absolute left-[28px] top-6 bottom-6 w-px bg-[#bfc9c3]" />

                {roadmapItems.map((item) => (
                  <div key={item.label} className="flex sm:flex-col items-start gap-3 relative z-10 bg-white sm:min-w-[160px] flex-1">
                    {/* Node */}
                    {item.status === 'done' && (
                      <div className="w-8 h-8 rounded-full bg-[#b0f0d6] flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 sm:mx-auto">
                        <span className="material-symbols-outlined text-[18px] text-[#0b513d]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    )}
                    {item.status === 'active' && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#003527] bg-white flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 sm:mx-auto shadow-[0_0_0_4px_rgba(0,53,39,0.1)]">
                        <div className="w-3 h-3 rounded-full bg-[#003527]" />
                      </div>
                    )}
                    {item.status === 'pending' && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#bfc9c3] bg-white flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 sm:mx-auto" />
                    )}

                    {/* Content */}
                    <div className="sm:text-center mt-1 sm:mt-3 w-full">
                      <h3 className={`font-geist text-sm font-medium ${
                        item.status === 'done' ? 'text-[#141b2b] line-through opacity-70' :
                        item.status === 'active' ? 'text-[#141b2b] font-bold' :
                        'text-[#404944]'
                      }`}>
                        {item.label}
                      </h3>
                      <p className={`font-inter text-sm mt-1 ${item.status === 'active' ? 'text-[#003527] font-medium' : 'text-[#404944]'}`}>
                        {item.date}
                      </p>
                      {item.status === 'active' && item.progress && (
                        <div className="mt-2 w-full bg-[#dce2f7] rounded-full h-1.5 max-w-[150px] sm:mx-auto">
                          <div className="bg-[#003527] h-1.5 rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgressTracking;
