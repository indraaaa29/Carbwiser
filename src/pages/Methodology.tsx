import React from 'react';

const Methodology: React.FC = () => {
  return (
    <div className="bg-[#f4f6f3] text-[#141b2b] min-h-screen flex flex-col font-inter">
      <main id="main-content" className="flex-grow w-full px-4 md:px-10 max-w-[1440px] mx-auto py-8 md:py-16">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1e8fd] rounded-full mb-4">
            <span className="material-symbols-outlined text-[#003527] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
            <span className="font-geist text-xs font-semibold text-[#003527] uppercase tracking-wider">Transparency &amp; Trust</span>
          </div>
          <h1 className="font-geist text-4xl md:text-5xl font-semibold text-[#141b2b] mb-4 leading-tight">How CarbWiser Calculates Your Carbon Footprint</h1>
          <p className="font-inter text-lg text-[#404944] leading-8 max-w-3xl">
            We believe in radical transparency. Understanding how your carbon footprint is calculated helps you trust the insights and take confident action. Here is the methodology behind CarbWiser.
          </p>
        </header>

        <section className="space-y-8 md:space-y-12">
          {/* Transportation */}
          <div className="bg-white border border-[#bfc9c3] rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4e3ff] opacity-30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-[#003527] rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>directions_car</span>
              </div>
              <h2 className="font-geist text-2xl md:text-3xl font-semibold text-[#003527]">Transportation Calculations</h2>
            </div>
            
            <div className="relative z-10 text-[#404944] leading-relaxed text-base md:text-lg">
              <p>We calculate your transportation emissions based on your primary mode of travel and estimated weekly distance. Each transport mode (like a gasoline car, electric vehicle, or bus) has a unique carbon intensity factor.</p>
              <p className="mt-3">By multiplying your weekly distance by this factor and scaling it up for the entire year, we estimate your annual travel impact.</p>
            </div>
          </div>

          {/* Energy */}
          <div className="bg-white border border-[#bfc9c3] rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b0f0d6] opacity-30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-[#003527] rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              </div>
              <h2 className="font-geist text-2xl md:text-3xl font-semibold text-[#003527]">Energy Calculations</h2>
            </div>
            
            <div className="relative z-10 text-[#404944] leading-relaxed text-base md:text-lg">
              <p>Home energy emissions are calculated using your monthly electricity and gas usage (kWh) and the carbon intensity of your specific energy source, such as standard grid power or renewable tariffs.</p>
              <p className="mt-3">Because home energy is typically shared, we divide the total footprint by your household size to accurately reflect your individual contribution.</p>
            </div>
          </div>

          {/* Food */}
          <div className="bg-white border border-[#bfc9c3] rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e2dec6] opacity-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-[#003527] rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              </div>
              <h2 className="font-geist text-2xl md:text-3xl font-semibold text-[#003527]">Food Calculations</h2>
            </div>
            
            <div className="relative z-10 text-[#404944] leading-relaxed text-base md:text-lg">
              <p>Your dietary choices play a major role in your footprint. We map your selected diet type (Vegan, Vegetarian, Flexitarian, or Omnivore) to average annual emission factors established by environmental research.</p>
              <p className="mt-3">These baselines account for the entire lifecycle of food production, including land use, farming processes, and typical supply chain logistics.</p>
            </div>
          </div>

          {/* Eco Score */}
          <div className="bg-white border border-[#bfc9c3] rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f9e5c4] opacity-30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-[#003527] rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <h2 className="font-geist text-2xl md:text-3xl font-semibold text-[#003527]">Eco Score Generation</h2>
            </div>
            
            <div className="relative z-10 text-[#404944] leading-relaxed text-base md:text-lg">
              <p>Your Eco Score is a simple 0–100 rating that contextualizes your emissions. A score of 100 represents a near-zero carbon footprint, while lower scores indicate higher emissions.</p>
              <p className="mt-3">We measure your total footprint against a global average baseline. As you adopt greener habits and your estimated carbon output drops, your Eco Score dynamically increases to reflect your progress.</p>
            </div>
          </div>

          {/* Recommendation Logic */}
          <div className="bg-white border border-[#bfc9c3] rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#dce2f7] opacity-40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-[#003527] rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <h2 className="font-geist text-2xl md:text-3xl font-semibold text-[#003527]">Recommendation Logic</h2>
            </div>
            
            <div className="relative z-10 text-[#404944] leading-relaxed text-base md:text-lg">
              <p>Our recommendation engine analyzes your lifestyle profile to find the most effective ways for you to cut emissions. Instead of generic advice, we rank actions based on their impact specifically for your habits.</p>
              <p className="mt-3">For example, if you commute long distances by car, reducing travel days will be ranked highly. Actions are scored on their estimated CO₂ reduction, cost, and difficulty, ensuring you always see the most practical and impactful suggestions first.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Methodology;
