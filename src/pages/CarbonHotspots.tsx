import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const hotspots = [
  {
    id: 'transportation',
    label: 'Transportation',
    badge: 'Primary Contributor',
    badgeIcon: 'local_shipping',
    percentage: '52%',
    description: 'Fleet operations, corporate travel, and logistics form the overwhelming majority of current emissions, driven primarily by legacy combustion engine fleets in regional distribution centers.',
    isPrimary: true,
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvLsQ31Jf9Ef3iUCmPNX8D_fVfJW9g9pfkM216aO91pKKM0Ri46XoMaLZM-2Hdo_bEb4sSrcOZdUq2TaCW3VGyex6bg4BI-isdrBotyWd-qIWz4_rMMlsaDJSZY12WcwboJpO-wfpBeRdMxZkC7URS-u3SbqqEmVrsDTdpwjcu9lrSHK8IDLLwTI2w8XtHuBC9Po7IJo7Bdwzj9FkOBS4uETBR-xToaw_BmtB7F2-YKJ0HOMivlgDeNBA',
  },
];

const secondaryHotspots = [
  {
    id: 'facilities',
    label: 'Facilities HVAC',
    badge: 'Secondary Contributor',
    badgeIcon: 'domain',
    percentage: '28%',
    description: 'Energy consumption across tier-1 office buildings and regional server hubs.',
    trend: { label: 'Stable Impact', type: 'stable' },
    colSpan: 'md:col-span-7',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvdK64MNyefgzF6KBrvW1Mn_xOGT8rsTLaNheQQmqNUiBWca7jWbcwu6FuKu2TA5JapOtyHX-zuKFMulRzVy7J5IscZ3iEZwn2FmPXYx-XlxRitpwd9wblurRHKuQOYNbvkyBuLC-zfWwCQff25KfXNSRjmofkLpSZ7ATb-9YAEsJt8MDHKEt076HbfBn056S2A1Hz6sEKLVS0t8a6QPs3145wxBqdxXsBc7iTng3Mu7mYupYbJhrYtWw',
  },
  {
    id: 'supplychain',
    label: 'Supply Chain',
    badge: 'Tertiary Contributor',
    badgeIcon: 'inventory_2',
    percentage: '15%',
    description: 'Scope 3 upstream manufacturing and raw material extraction processes.',
    trend: { label: 'Rising Trend', type: 'rising' },
    colSpan: 'md:col-span-5',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLtmQLBU4L6TPuPy9RibK61j1XPJ1LvKGeSoEbhPQhW1VubMsb8dCwsdxhKpBUhSLLZc7WJMZ2EHycVavAs-wC33mwePm1fd2tJd-o3EbXdvhHAr5c_OIaD5YZRXjm4wcMQk-SvASTmGO-IKHRRhlhh9vjvIXv4QN512VearD4-Y3SiUCYTIrRjuHhE4i7ONh0e2aMShu9p51GpMxiOKHTy2T6HeWtAjnTNvwv8Mx5uOBD_6EKUcLaHRTg',
  },
];

const initiatives = [
  { name: 'Fleet Electrification Phase 1', target: 'Target: -12% Transport Emissions', progress: 45, status: 'In Progress', date: 'Q4 2024' },
  { name: 'HVAC Optimization Algorithm', target: 'Target: -5% Facility Emissions', progress: 80, status: 'Deployment', date: 'Q2 2024' },
];

const CarbonHotspots: React.FC = () => {
  return (
    <div className="text-[#141b2b] min-h-screen flex flex-col font-inter" style={{ backgroundColor: '#f2efe9' }}>
      <Navbar />

      <main className="w-full px-4 md:px-10 max-w-[1440px] mx-auto py-8 space-y-8 md:space-y-16">
        {/* Header */}
        <section className="max-w-3xl">
          <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] mb-4 leading-tight">Carbon Footprint</h1>
          <p className="font-inter text-lg text-[#404944] leading-7">
            Deep dive into the structural drivers of your organizational carbon footprint. Identifying these primary contributors is the crucial first step toward pragmatic reduction strategies.
          </p>
        </section>

        {/* Hotspot Cards */}
        <section className="flex flex-col gap-6">
          {/* Primary Hotspot: Transportation */}
          <div className="w-full bg-[#003527] text-white rounded-[32px] overflow-hidden relative flex flex-col md:flex-row group shadow-lg">
            <div className="absolute inset-0 z-0">
              <img
                alt="Atmospheric forest landscape"
                className="w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                src={hotspots[0].image}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#003527] via-[#003527]/90 to-transparent" />
            </div>

            <div className="p-8 md:p-16 flex-1 flex flex-col justify-between relative z-10 w-full md:w-3/5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#b0f0d6]" style={{ fontVariationSettings: "'FILL' 1" }}>{hotspots[0].badgeIcon}</span>
                  <span className="font-geist text-xs font-bold text-[#b0f0d6] uppercase tracking-widest">{hotspots[0].badge}</span>
                </div>
                <h2 className="font-geist text-5xl font-semibold text-white mb-4">{hotspots[0].label}</h2>
                <p className="font-inter text-lg text-white/90 max-w-lg leading-7">{hotspots[0].description}</p>
              </div>
              <div className="mt-16 md:mt-20">
                <div className="font-geist text-[80px] leading-[80px] font-bold text-[#b0f0d6] tracking-tighter">{hotspots[0].percentage}</div>
                <div className="font-geist text-sm text-white/80 mt-2">of total structural emissions</div>
              </div>
            </div>
          </div>

          {/* Secondary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {secondaryHotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className={`${hotspot.colSpan} bg-white border border-[#e2dec6] rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <img alt="" className="w-full h-full object-cover" src={hotspot.image} />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[#2b6954]" style={{ fontVariationSettings: "'FILL' 1" }}>{hotspot.badgeIcon}</span>
                    <span className="font-geist text-xs font-semibold text-[#404944] uppercase tracking-widest">{hotspot.badge}</span>
                  </div>
                  <h3 className="font-geist text-3xl font-semibold text-[#003527] mb-4">{hotspot.label}</h3>
                  <p className="font-inter text-base text-[#404944] max-w-sm">{hotspot.description}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#e2dec6] relative z-10">
                  <div className="flex justify-between items-end">
                    <div className="font-geist font-bold text-[#003527] tracking-tighter" style={{ fontSize: hotspot.id === 'facilities' ? '56px' : '48px', lineHeight: hotspot.id === 'facilities' ? '56px' : '48px' }}>
                      {hotspot.percentage}
                    </div>
                    {hotspot.trend.type === 'stable' ? (
                      <div className="bg-[#e2dec6]/50 text-[#003527] px-4 py-2 rounded-full font-geist text-xs font-semibold">{hotspot.trend.label}</div>
                    ) : (
                      <div className="bg-[#ba1a1a]/10 text-[#ba1a1a] px-4 py-2 rounded-full font-geist text-xs font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        {hotspot.trend.label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Priority Reduction Initiatives */}
          <div className="w-full bg-white border border-[#e2dec6] rounded-[24px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-geist text-2xl font-medium text-[#003527]">Priority Reduction Initiatives</h3>
              <Link
                to="/roadmap"
                className="font-geist text-sm font-medium text-[#2b6954] hover:text-[#003527] transition-colors flex items-center gap-1 group"
              >
                View Roadmap <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="space-y-6">
              {initiatives.map((item) => (
                <div key={item.name} className="group p-4 -mx-4 rounded-xl hover:bg-[#f2efe9]/50 transition-colors">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="font-geist text-xl font-medium text-[#003527]">{item.name}</div>
                    <div className="font-geist text-xs text-[#404944] bg-white px-3 py-1 rounded-full border border-[#e2dec6]">{item.target}</div>
                  </div>
                  <div className="w-full bg-[#e2dec6] h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-[#003527] h-full rounded-full group-hover:bg-[#2b6954] transition-colors"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-geist text-sm font-semibold text-[#2b6954]">{item.status}</span>
                    <span className="font-geist text-xs text-[#404944]">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CarbonHotspots;
