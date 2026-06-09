import React from 'react';

interface LandingPageProps {
  onCalculate: () => void;
  onExploreSandbox: () => void;
  hasProfile: boolean;
  onNavigateToView: (view: string) => void;
}

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
            <img
              alt="Misty ancient forest view from above"
              className="w-full h-full object-cover opacity-20"
              src="https://lh3.googleusercontent.com/aida/AP1WRLvLf5EDN_XWz6hB6wUzQ6uYIadD2bEFAbEOmD9Vv6LdBAw5p5rErt0zTZi7-oBOYmVxGFKNe3J6huS-jjeeJGQN94h7wEoJ2q-NGzH0JZYXP9zuLYOBOHeBST7VqSdW-kIuR_QZeE-L0_KQeGesk-EX5t-yc69Zv4LVLc-Z1JLHhdRnuSnK4uul3C9Jl6eI3SYxcY9uIZEvXnl9yZnY5Ihf2OYALISABY4CuYNKD1bWFIC3u4V1Tm-WLp_0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background to-background"></div>
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
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto mt-lg leading-relaxed">
              CarbWiser leverages advanced AI to provide precise, actionable insights for your carbon footprint. Navigate the complexities of environmental stewardship with clinical precision and organic simplicity.
            </p>
            <div className="pt-xl flex flex-col sm:flex-row justify-center items-center gap-md max-w-lg mx-auto">
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
                  src="https://lh3.googleusercontent.com/aida/AP1WRLv5_zk2x83aGtVKKAsJC13xNlxPETMvApWh11NLBbTUdrg1_5uQO2MgpVvLQgmgg1Boug0ojYcHWPdvODi8qZMbNGC7T6e-vZvdh5qR5g7nQBNDGflShKNxu7gEmzoaHDpHzPCiB8tYEisLd42NBGqumIKDs_It8GR4xw88w_y7wHIy1yQL7z152y2X2fOT_5vf7gb7BgSB_6D6MxVpBDq4_HBHqMw-lqD9RtJPBRFnv375GMb4ehm-K9SX"
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
