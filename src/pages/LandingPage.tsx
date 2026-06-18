import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';


/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrameId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [start, target, duration]);
  return value;
}

/* ─── Intersection observer hook ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setInView(true); 
          obs.disconnect(); 
        } 
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const bars = [
  { label: 'Transportation', value: '3,800 kgCO2e', width: 75, color: 'bg-[#003527]' },
  { label: 'Home Energy',    value: '2,400 kgCO2e', width: 45, color: 'bg-[#2b6954]' },
  { label: 'Diet & Lifestyle', value: '1,200 kgCO2e', width: 30, color: 'bg-[#bfc9c3]' },
];

const methodologySteps = [
  { icon: 'hub',        step: '1. Share Your Habits', desc: 'Tell us about your daily travel, home energy use, and food choices. A quick 5-minute lifestyle snapshot.' },
  { icon: 'filter_alt', step: '2. Understand Your Impact',  desc: 'We break down your personal footprint across all categories so you can see exactly where you can make a difference.' },
  { icon: 'visibility', step: '3. Take Action',   desc: 'Get personalised, practical suggestions that fit your lifestyle — from small daily habits to bigger meaningful changes.' },
];

const LandingPage: React.FC = () => {
  /* ── hero card in-view trigger ── */
  const { ref: cardRef, inView: cardInView } = useInView(0.3);

  /* ── animated counter: 7 400 ── */
  const counterVal = useCountUp(7400, 1800, cardInView);
  const formatted = counterVal.toLocaleString();


  /* ── methodology section ── */
  const { ref: howRef, inView: howInView } = useInView(0.15);

  /* ── hero background ken-burns ref ── */
  const heroBgRef = useRef<HTMLImageElement>(null);

  return (
    <div className="bg-[#f9f9ff] text-[#141b2b] min-h-screen flex flex-col font-inter">

      <main className="flex-grow">

        {/* ═══════════════════════════════════════
            HERO  (#overview)
            ─ item 7: animate the background (gradient drift)
            ─ item 8: animate the overlay (pulse-soft)
        ═══════════════════════════════════════ */}
        <section
          className="relative min-h-[90vh] flex items-center overflow-hidden"
          id="overview"
        >
          {/* item 8 ─ animated background layer */}
          <div className="absolute inset-0 z-0">
            {/* Ken-Burns slow zoom on the forest image */}
            <img
              ref={heroBgRef}
              alt="Cinematic forest landscape"
              className="w-full h-full object-cover object-center"
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1440&auto=format&fit=crop"
              style={{ animation: 'kenBurns 20s ease-in-out infinite alternate' }}
            />

            {/* item 7 ─ drifting gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ animation: 'gradientDrift 12s ease-in-out infinite alternate' }}
            />

            {/* Noise grain */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="max-w-[1440px] mx-auto px-4 md:px-10 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 py-24">

            {/* Hero Copy ─ staggered fade-in */}
            <div className="md:col-span-7 flex flex-col gap-8">
              <div
                className="inline-flex items-center gap-3 w-max"
                style={{ animation: 'fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2b6954]" />
                <span className="font-geist text-sm font-medium text-[#003527] uppercase tracking-[0.2em]">Personal Climate Guide</span>
              </div>

              <h1
                className="font-geist text-5xl md:text-[64px] font-semibold text-[#003527] leading-tight tracking-tight"
                style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}
              >
                Understand.<br />Track.<br />Reduce.
              </h1>

              <p
                className="font-inter text-xl text-[#404944] max-w-xl pr-8 leading-8"
                style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both' }}
              >
                Simple, powerful tools to understand your personal impact. Make changes that matter — for your wallet, your health, and the planet.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both' }}
              >
                <Link
                  to="/assessment"
                  className="bg-[#003527] text-white hover:bg-[#064e3b] transition-all px-8 py-4 rounded-full font-geist text-sm font-medium flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 focus:ring-offset-[#f9f9ff]"
                >
                  Start Assessment
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Link>
                <button 
                  type="button"
                  className="glass-panel text-[#003527] border border-[#bfc9c3] hover:border-[#003527] transition-all px-8 py-4 rounded-full font-geist text-sm font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 focus:ring-offset-[#f9f9ff]"
                >
                  View Methodology
                </button>
              </div>
            </div>

            {/* ── Data Card (items 1, 2, 3, 4) ── */}
            <div
              ref={cardRef}
              className="md:col-span-5 mt-16 md:mt-0 relative"
              style={{ animation: 'fadeSlideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both' }}
            >
              <div className="glass-panel rounded-3xl p-8 cinematic-shadow relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#b0f0d6]/30 rounded-full blur-3xl -mr-16 -mt-16" />

                <h3 className="font-geist text-xs font-semibold text-[#404944] uppercase tracking-[0.1em] mb-2">
                  Total Carbon Footprint
                </h3>

                {/* item 1 ─ animated number counter */}
                <div className="font-geist text-4xl font-semibold text-[#003527] mb-8 flex items-baseline gap-2">
                  <span
                    key={cardInView ? 'counting' : 'idle'}
                    style={{
                      display: 'inline-block',
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {formatted}
                  </span>
                  <span className="text-base text-[#404944] font-normal font-inter">kgCO2e</span>
                </div>

                {/* items 2, 3, 4 ─ animated bars */}
                <div className="space-y-6 relative z-10">
                  {bars.map((item, i) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-inter text-sm text-[#141b2b]">{item.label}</span>
                        <span
                          className="font-geist text-sm font-medium text-[#003527]"
                          style={{
                            opacity: cardInView ? 1 : 0,
                            transform: cardInView ? 'translateY(0)' : 'translateY(6px)',
                            transition: `opacity 0.5s ${0.2 + i * 0.15}s, transform 0.5s ${0.2 + i * 0.15}s`,
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                      {/* Track */}
                      <div className="w-full bg-[#e9edff] rounded-full h-1 overflow-hidden">
                        {/* Fill bar — grows from 0 → target width */}
                        <div
                          className={`${item.color} h-1 rounded-full`}
                          style={{
                            width: cardInView ? `${item.width}%` : '0%',
                            transition: `width 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${0.3 + i * 0.18}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* === Narrative Feature Section === */}
        <section className="py-32 bg-[#f9f9ff]" id="features">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
                <h2 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] leading-tight">
                  Clarity over complexity.
                </h2>
                <p className="font-inter text-lg text-[#404944] leading-8">
                  We make sense of your daily choices, showing you exactly how your lifestyle shapes your carbon footprint — and what you can do about it today.
                </p>

                <div className="space-y-10 mt-4">
                  {[
                    {
                      icon: 'radar',
                      title: 'Easy Personal Tracking',
                      desc: 'Log your travel, home energy use, and food habits in minutes. We map them against global emission factors so you always know where you stand.',
                    },
                    {
                      icon: 'eco',
                      title: 'Goals That Fit Your Life',
                      desc: 'Set realistic reduction targets and track progress week by week. Every small change you make adds up to meaningful impact.',
                    },
                  ].map((feature) => (
                    <div key={feature.title} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full border border-[#003527]/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#003527]" style={{ fontVariationSettings: "'wght' 300" }}>{feature.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-geist text-xl font-medium text-[#003527] mb-2">{feature.title}</h3>
                        <p className="font-inter text-base text-[#404944]">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] cinematic-shadow">
                  <img
                    alt="Lush forest canopy"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
                  />
                  <div className="absolute bottom-8 left-8 right-8 glass-panel rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <p className="font-geist text-xs font-semibold uppercase tracking-wider text-[#003527] mb-1">Recommended Action</p>
                      <p className="font-inter text-base font-medium text-[#141b2b]">Switch to a green energy tariff at home</p>
                    </div>
                    <span className="bg-[#003527] text-white px-4 py-2 rounded-full font-geist text-sm whitespace-nowrap ml-4">-0.4 tCO2e</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            METHODOLOGY  (#how-it-works)
            item 5: staggered fade-up on cards + orbiting blob background
        ═══════════════════════════════════════ */}
        <section className="py-32 bg-[#f1f3ff] relative overflow-hidden" id="how-it-works">
          {/* Orbiting ambient blobs */}
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#95d3ba]/20 rounded-full blur-[100px] pointer-events-none"
            style={{ animation: 'orbitBlob 18s ease-in-out infinite alternate', transformOrigin: 'center center' }}
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#b0f0d6]/15 rounded-full blur-[80px] pointer-events-none"
            style={{ animation: 'orbitBlob 14s ease-in-out infinite alternate-reverse', transformOrigin: 'center center' }}
          />

          <div ref={howRef} className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10">
            <div
              className="max-w-3xl mb-20"
              style={{
                opacity: howInView ? 1 : 0,
                transform: howInView ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <h2 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] mb-6">
                The methodology behind the impact.
              </h2>
              <p className="font-inter text-xl text-[#404944] leading-8">
                A simple three-step flow that turns your everyday habits into a clear picture of your personal carbon footprint.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting line */}
              <div
                className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-[#bfc9c3]/50"
                style={{
                  transform: howInView ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform 1s cubic-bezier(0.4,0,0.2,1) 0.4s',
                }}
              />

              {methodologySteps.map((item, i) => (
                <div
                  key={item.step}
                  className="relative"
                  style={{
                    opacity: howInView ? 1 : 0,
                    transform: howInView ? 'translateY(0)' : 'translateY(32px)',
                    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.18}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.18}s`,
                  }}
                >
                  {/* Icon orb — gentle pulse on hover */}
                  <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border border-[#003527]/20 hover:scale-105 hover:border-[#003527]/40 transition-transform duration-300">
                    <span className="material-symbols-outlined text-[#003527] text-3xl" style={{ fontVariationSettings: "'wght' 300" }}>{item.icon}</span>
                  </div>
                  <h4 className="font-geist text-xl font-medium text-[#003527] mb-3">{item.step}</h4>
                  <p className="font-inter text-base text-[#404944] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA Section (item 6: "Contact Sustainability Experts" button removed) === */}
        <section className="relative py-40 overflow-hidden text-white flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img
              alt="Aerial view of mist over a lush green forest"
              className="w-full h-full object-cover object-center"
              src="https://images.unsplash.com/photo-1503785640985-f62e3aeee448?q=80&w=1000&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-[#003527]/80 backdrop-blur-[2px]" />
          </div>

          <div className="max-w-4xl mx-auto px-4 md:px-10 text-center relative z-10 flex flex-col items-center gap-8">
            <h2 className="font-geist text-4xl md:text-6xl text-white font-semibold leading-tight">
              Your footprint. Your future.
            </h2>
            <p className="font-inter text-xl text-[#b0f0d6] max-w-2xl font-light">
              Join thousands of individuals who are taking practical steps toward a lower-carbon lifestyle — one habit at a time.
            </p>
            {/* item 6: only one CTA button now */}
            <Link
              to="/assessment"
              className="bg-white text-[#003527] hover:bg-[#f1f3ff] transition-colors px-10 py-5 rounded-full font-geist text-lg shadow-lg hover:shadow-xl mt-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#003527]"
            >
              Start Baseline Assessment
            </Link>
          </div>
        </section>

      </main>

      {/* ─── Keyframe definitions ─── */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translateX(0)     translateY(0); }
          100% { transform: scale(1.08) translateX(-1.5%) translateY(-1%); }
        }
        @keyframes gradientDrift {
          0%   { background: linear-gradient(105deg, rgba(249,249,255,0.95) 0%, rgba(249,249,255,0.82) 45%, transparent 100%); }
          100% { background: linear-gradient(95deg,  rgba(249,249,255,0.98) 0%, rgba(249,249,255,0.75) 50%, transparent 100%); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbitBlob {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-6%, 4%)  scale(1.08); }
          66%  { transform: translate(4%, -3%)  scale(0.95); }
          100% { transform: translate(-3%, 6%)  scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
