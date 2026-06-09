import React from 'react';
import { motion } from 'framer-motion';
import LineWaves from '../components/LineWaves/LineWaves';
import { PlaceCard } from '@/components/ui/card-22';

interface LandingPageProps {
  onCalculate: () => void;
  onExploreSandbox: () => void;
  hasProfile: boolean;
  onNavigateToView: (view: string) => void;
}

const FEATURED_STAYS = [
  {
    title: "Tiskita Jungle Lodge",
    images: [
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["Carbon Neutral", "Solar Powered"],
    rating: 4.9,
    dateRange: "Oct 12 - 19",
    hostType: "Superhost",
    isTopRated: true,
    description: "An off-grid biodiversity sanctuary powered entirely by local solar energy and hydro power, nestled deep in the tropical rainforest.",
    pricePerNight: 145
  },
  {
    title: "EcoDome Patagonia",
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["Zero Waste", "Geothermal"],
    rating: 4.8,
    dateRange: "Nov 5 - 12",
    hostType: "Eco-host",
    isTopRated: false,
    description: "Geodesic domes nestled in the wild Argentinian Patagonia. Offers zero-waste organic dining and self-contained geothermal heating.",
    pricePerNight: 210
  },
  {
    title: "Green Village Bamboo Villa",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["100% Bamboo", "Organic Farm"],
    rating: 4.95,
    dateRange: "Sep 20 - 27",
    hostType: "Superhost",
    isTopRated: true,
    description: "Architectural masterpiece built fully of sustainable bamboo along the sacred Ayung River, featuring permaculture gardens.",
    pricePerNight: 185
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
} as const;

export const LandingPage: React.FC<LandingPageProps> = ({
  onCalculate,
  onExploreSandbox,
  hasProfile,
  onNavigateToView,
}) => {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
      {/* TopNavBar */}
      <header className="w-full bg-surface dark:bg-ink-black border-b border-outline-variant dark:border-surface-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto h-16">
          <div className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary tracking-tight">
            CarbWiser
          </div>
          <nav className="hidden md:flex items-center gap-lg">
            <button
              onClick={() => hasProfile ? onNavigateToView('overview') : onCalculate()}
              className="text-on-surface-variant dark:text-surface-variant text-label-md font-label-md hover:text-primary dark:hover:text-inverse-primary transition-colors opacity-80 duration-200 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => hasProfile ? onNavigateToView('roadmap') : onCalculate()}
              className="text-on-surface-variant dark:text-surface-variant text-label-md font-label-md hover:text-primary dark:hover:text-inverse-primary transition-colors opacity-80 duration-200 cursor-pointer"
            >
              Roadmap
            </button>
            <button
              onClick={() => hasProfile ? onNavigateToView('simulations') : onCalculate()}
              className="text-on-surface-variant dark:text-surface-variant text-label-md font-label-md hover:text-primary dark:hover:text-inverse-primary transition-colors opacity-80 duration-200 cursor-pointer"
            >
              Simulator
            </button>
          </nav>
          <div className="flex items-center">
            <button
              aria-label="Account"
              onClick={() => hasProfile ? onNavigateToView('overview') : onCalculate()}
              className="text-primary dark:text-inverse-primary p-2 hover:bg-surface-container-low rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="absolute inset-0 z-0">
            <LineWaves
              speed={0.3}
              innerLineCount={32}
              outerLineCount={36}
              warpIntensity={1.0}
              rotation={-45}
              edgeFadeWidth={0.0}
              colorCycleSpeed={1.0}
              brightness={0.2}
              color1="#012d1d"
              color2="#10b981"
              color3="#3e6750"
              enableMouseInteraction={true}
              mouseInfluence={2.0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background to-background"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-lg">
            <div className="inline-flex items-center gap-sm px-4 py-2 bg-sage-muted dark:bg-[#1f2e24] text-primary rounded-full text-label-sm font-label-sm uppercase tracking-widest mb-md">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              AI-Powered Sustainability
            </div>
            <h1 className="text-display-lg font-display-lg text-primary tracking-tight leading-tight">
              Smarter Choices.<br />
              <span className="text-secondary">Lower Emissions.</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[672px] mx-auto mt-lg leading-relaxed">
              CarbWiser leverages advanced AI to provide precise, actionable insights for your carbon footprint. Navigate the complexities of environmental stewardship with clinical precision and organic simplicity.
            </p>
            <div className="pt-xl flex flex-col sm:flex-row justify-center items-center gap-md max-w-[512px] mx-auto">
              <button
                onClick={onCalculate}
                className="bg-primary text-on-primary text-label-md font-label-md px-8 py-4 rounded-lg hover:bg-primary-container transition-all hover:shadow-[0_4px_12px_rgba(1,45,29,0.15)] w-full sm:w-auto h-[52px] flex items-center justify-center cursor-pointer"
              >
                Calculate My Footprint
              </button>
              <button
                onClick={onExploreSandbox}
                className="bg-transparent text-primary border-2 border-outline-variant hover:border-primary text-label-md font-label-md px-8 py-4 rounded-lg transition-all w-full sm:w-auto h-[52px] flex items-center justify-center cursor-pointer"
              >
                Explore the Platform
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Bento Grid */}
        <section className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-xl">
              <h2 className="text-headline-lg font-headline-lg text-primary">Intelligent Data. Sustainable Impact.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {/* Personalized */}
              <div className="glass-card rounded-xl p-lg flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-primary mb-sm">Personalized</h3>
                <p className="text-body-md font-body-md text-on-surface-variant flex-grow">
                  Tailored insights based on your unique operational data. Our algorithms adapt to your specific industry and usage patterns.
                </p>
              </div>
              {/* Actionable */}
              <div className="glass-card rounded-xl p-lg flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-primary mb-sm">Actionable</h3>
                <p className="text-body-md font-body-md text-on-surface-variant flex-grow">
                  Clear, step-by-step roadmaps to reduce emissions. Transform raw data into immediate, implementable sustainability strategies.
                </p>
              </div>
              {/* Visual */}
              <div className="glass-card rounded-xl p-lg flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-primary mb-sm">Visual</h3>
                <p className="text-body-md font-body-md text-on-surface-variant flex-grow">
                  Intuitive dashboards that make complex environmental metrics easy to understand, track, and share with stakeholders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center">
              <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-container-highest">
                <img
                  alt="Minimalist workspace showing analytics dashboard on laptop"
                  className="w-full h-full object-cover"
                  src="/workspace_dashboard_mockup.png"
                />
              </div>
              <div className="order-1 lg:order-2 space-y-lg">
                <h2 className="text-headline-lg font-headline-lg text-primary">How CarbWiser Works</h2>
                <div className="space-y-md">
                  <div className="flex gap-md">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-md text-label-md font-bold">1</div>
                    <div>
                      <h4 className="text-headline-md font-headline-md text-primary mb-xs">Connect Data</h4>
                      <p className="text-body-md font-body-md text-on-surface-variant">Seamlessly integrate your operational systems or upload historical data.</p>
                    </div>
                  </div>
                  <div className="flex gap-md">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-md text-label-md font-bold">2</div>
                    <div>
                      <h4 className="text-headline-md font-headline-md text-primary mb-xs">AI Analysis</h4>
                      <p className="text-body-md font-body-md text-on-surface-variant">Our engine processes your metrics against global environmental standards.</p>
                    </div>
                  </div>
                  <div className="flex gap-md">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-label-md text-label-md font-bold">3</div>
                    <div>
                      <h4 className="text-headline-md font-headline-md text-primary mb-xs">Execute Roadmap</h4>
                      <p className="text-body-md font-body-md text-on-surface-variant">Follow tailored recommendations to reach your carbon-neutral targets.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Sustainable Eco-Stays */}
        <section className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-7xl mx-auto space-y-xl">
            <div className="text-center max-w-2xl mx-auto space-y-sm">
              <h2 className="text-headline-lg font-headline-lg text-primary font-bold">Featured Carbon-Certified Stays</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Explore beautiful, sustainable accommodations. Handpicked destinations with a commitment to low-emission operations.
              </p>
            </div>
            <motion.div 
              className="cards-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {FEATURED_STAYS.map((prop, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <PlaceCard
                    title={prop.title}
                    images={prop.images}
                    tags={prop.tags}
                    rating={prop.rating}
                    dateRange={prop.dateRange}
                    hostType={prop.hostType}
                    isTopRated={prop.isTopRated}
                    description={prop.description}
                    pricePerNight={prop.pricePerNight}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg bg-surface-container-highest dark:bg-ink-black border-t border-outline-variant dark:border-surface-variant mt-auto">
        <div className="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant">
          © 2024 CarbWiser. Guided Sustainability for a Greener Planet.
        </div>
        <div className="flex flex-wrap justify-center gap-md">
          <a className="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary underline transition-all" href="#">Privacy Policy</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary underline transition-all" href="#">Terms of Service</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary underline transition-all" href="#">Sustainability Commitment</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary underline transition-all" href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};
