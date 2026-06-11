import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useActions } from '../context/ActionContext';
import { calculateFootprint } from '../lib/carbonCalculation';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Insight {
  contribution: string;         // "52% of your total emissions"
  comparisonStat: string;       // multiplier label
  comparisonNote: string;       // full sentence
  reductionOpportunity: string; // plain-language potential
  action: string;               // concrete next step
  actionIcon: string;           // material symbol
  actionLink: string;           // route
  reductionPotential: string;   // e.g. "Up to 35%"
}

interface HotspotData {
  id: string;
  label: string;
  badge: string;
  badgeIcon: string;
  percentage: string;
  description: string;
  image: string;
  insight: Insight;
  colSpan?: string;
  trend?: { label: string; type: string };
}

interface CategoryDef {
  label: string;
  badgeIcon: string;
  description: string;
  image: string;
  action: string;
  actionIcon: string;
}

const CATEGORY_DEFS: Record<string, CategoryDef> = {
  transportation: {
    label: 'Transportation',
    badgeIcon: 'directions_car',
    description: 'Daily car trips, flights, and road travel make up the largest share of a typical personal carbon footprint. Reducing unnecessary car journeys and choosing public transport can make an immediate difference.',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvLsQ31Jf9Ef3iUCmPNX8D_fVfJW9g9pfkM216aO91pKKM0Ri46XoMaLZM-2Hdo_bEb4sSrcOZdUq2TaCW3VGyex6bg4BI-isdrBotyWd-qIWz4_rMMlsaDJSZY12WcwboJpO-wfpBeRdMxZkC7URS-u3SbqqEmVrsDTdpwjcu9lrSHK8IDLLwTI2w8XtHuBC9Po7IJo7Bdwzj9FkOBS4uETBR-xToaw_BmtB7F2-YKJ0HOMivlgDeNBA',
    action: 'Use public transport or cycle twice per week this month.',
    actionIcon: 'directions_bus',
  },
  energy: {
    label: 'Home Energy',
    badgeIcon: 'home',
    description: 'Heating, cooling, and powering your home. Switching to a green energy tariff or improving insulation can significantly cut your footprint.',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLvdK64MNyefgzF6KBrvW1Mn_xOGT8rsTLaNheQQmqNUiBWca7jWbcwu6FuKu2TA5JapOtyHX-zuKFMulRzVy7J5IscZ3iEZwn2FmPXYx-XlxRitpwd9wblurRHKuQOYNbvkyBuLC-zfWwCQff25KfXNSRjmofkLpSZ7ATb-9YAEsJt8MDHKEt076HbfBn056S2A1Hz6sEKLVS0t8a6QPs3145wxBqdxXsBc7iTng3Mu7mYupYbJhrYtWw',
    action: 'Switch to a green energy tariff with your provider.',
    actionIcon: 'energy_savings_leaf',
  },
  food: {
    label: 'Food & Shopping',
    badgeIcon: 'shopping_bag',
    description: 'What you eat and buy matters. Reducing meat consumption and choosing locally sourced products are some of the most impactful personal changes you can make.',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLtmQLBU4L6TPuPy9RibK61j1XPJ1LvKGeSoEbhPQhW1VubMsb8dCwsdxhKpBUhSLLZc7WJMZ2EHycVavAs-wC33mwePm1fd2tJd-o3EbXdvhHAr5c_OIaD5YZRXjm4wcMQk-SvASTmGO-IKHRRhlhh9vjvIXv4QN512VearD4-Y3SiUCYTIrRjuHhE4i7ONh0e2aMShu9p51GpMxiOKHTy2T6HeWtAjnTNvwv8Mx5uOBD_6EKUcLaHRTg',
    action: 'Go meat-free three days per week starting this week.',
    actionIcon: 'restaurant',
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InsightPanelProps {
  insight: Insight;
  dark?: boolean;
}

const InsightPanel: React.FC<InsightPanelProps> = React.memo(({ insight, dark = false }) => {
  const textBase = dark ? 'text-white/90' : 'text-[#404944]';
  const textStrong = dark ? 'text-white' : 'text-[#003527]';
  const textMuted = dark ? 'text-white/60' : 'text-[#6b7880]';
  const borderColor = dark ? 'border-white/20' : 'border-[#e2dec6]';
  const labelBg = dark ? 'bg-white/10' : 'bg-[#f2efe9]';
  const statBg = dark ? 'bg-[#b0f0d6]/15 text-[#b0f0d6]' : 'bg-[#003527]/8 text-[#003527]';
  const actionBg = dark
    ? 'bg-white/10 border border-white/20 hover:bg-white/20'
    : 'bg-[#003527]/5 border border-[#e2dec6] hover:bg-[#003527]/10';

  return (
    <div className={`mt-8 pt-6 border-t ${borderColor} grid grid-cols-1 sm:grid-cols-2 gap-5`}>
      {/* 1. Current contribution */}
      <div className={`rounded-xl p-4 ${labelBg}`}>
        <div className={`flex items-center gap-1.5 mb-2 ${textMuted}`}>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="font-geist text-[10px] font-bold uppercase tracking-widest">Your Contribution</span>
        </div>
        <p className={`font-inter text-sm leading-6 ${textBase}`}>{insight.contribution}</p>
      </div>

      {/* 2. Comparison against other categories */}
      <div className={`rounded-xl p-4 ${labelBg}`}>
        <div className={`flex items-center gap-1.5 mb-2 ${textMuted}`}>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>compare_arrows</span>
          <span className="font-geist text-[10px] font-bold uppercase tracking-widest">vs. Other Categories</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`font-geist text-2xl font-bold ${statBg} px-2 py-0.5 rounded-lg`}>{insight.comparisonStat}</span>
        </div>
        <p className={`font-inter text-sm leading-6 ${textBase}`}>{insight.comparisonNote}</p>
      </div>

      {/* 3. Reduction opportunity */}
      <div className={`rounded-xl p-4 ${labelBg}`}>
        <div className={`flex items-center gap-1.5 mb-2 ${textMuted}`}>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
          <span className="font-geist text-[10px] font-bold uppercase tracking-widest">Reduction Opportunity</span>
        </div>
        <div className={`font-geist text-xl font-bold mb-1 ${textStrong}`}>{insight.reductionPotential}</div>
        <p className={`font-inter text-sm leading-6 ${textBase}`}>{insight.reductionOpportunity}</p>
      </div>

      {/* 4. Recommended next action */}
      <div className={`rounded-xl p-4 ${labelBg}`}>
        <div className={`flex items-center gap-1.5 mb-2 ${textMuted}`}>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
          <span className="font-geist text-[10px] font-bold uppercase tracking-widest">Recommended Action</span>
        </div>
        <p className={`font-inter text-sm leading-6 mb-3 ${textBase}`}>{insight.action}</p>
        <Link
          to={insight.actionLink}
          className={`inline-flex items-center gap-1.5 font-geist text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${actionBg} ${textStrong}`}
        >
          <span className="material-symbols-outlined text-[14px]">{insight.actionIcon}</span>
          Start this action
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
});


// ─── Page ─────────────────────────────────────────────────────────────────────

const CarbonHotspots: React.FC = () => {
  const { profile } = useProfile();
  const { actions } = useActions();
  const metrics = useMemo(() => calculateFootprint(profile), [profile]);

  const { primaryHotspot, secondaryHotspots } = useMemo(() => {
    const cats = [
      { id: 'transportation', kg: metrics.categories.transportation.kg, pct: metrics.categories.transportation.percentage },
      { id: 'energy', kg: metrics.categories.energy.kg, pct: metrics.categories.energy.percentage },
      { id: 'food', kg: metrics.categories.food.kg, pct: metrics.categories.food.percentage }
    ].sort((a, b) => b.kg - a.kg);

    const lowestKg = cats[2].kg || 1;

    const buildInsight = (cat: typeof cats[0], rank: number): Insight => ({
      contribution: `${CATEGORY_DEFS[cat.id].label} accounts for ${cat.pct}% of your footprint — generating approximately ${(cat.kg / 1000).toFixed(1)} tCO₂e per year based on your profile.`,
      comparisonStat: `${(cat.kg / lowestKg).toFixed(1)}×`,
      comparisonNote: `Your ${CATEGORY_DEFS[cat.id].label.toLowerCase()} emissions are ${(cat.kg / lowestKg).toFixed(1)}× higher than your lowest emitting category.`,
      reductionOpportunity: rank === 0 ? 'This is your highest-leverage category. Modest changes here have massive impact.' : 'Tackling this category yields steady, measurable carbon reduction.',
      action: CATEGORY_DEFS[cat.id].action,
      actionIcon: CATEGORY_DEFS[cat.id].actionIcon,
      actionLink: '/actions',
      reductionPotential: rank === 0 ? 'Up to 35%' : 'Up to 20%',
    });

    const primary: HotspotData = {
      id: cats[0].id,
      label: CATEGORY_DEFS[cats[0].id].label,
      badge: 'Biggest Impact',
      badgeIcon: CATEGORY_DEFS[cats[0].id].badgeIcon,
      percentage: `${cats[0].pct}%`,
      description: CATEGORY_DEFS[cats[0].id].description,
      image: CATEGORY_DEFS[cats[0].id].image,
      insight: buildInsight(cats[0], 0),
    };

    const secondary: HotspotData[] = [
      {
        id: cats[1].id,
        label: CATEGORY_DEFS[cats[1].id].label,
        badge: 'Second Largest',
        badgeIcon: CATEGORY_DEFS[cats[1].id].badgeIcon,
        percentage: `${cats[1].pct}%`,
        description: CATEGORY_DEFS[cats[1].id].description,
        colSpan: 'md:col-span-7',
        trend: { label: 'Stable Impact', type: 'stable' },
        image: CATEGORY_DEFS[cats[1].id].image,
        insight: buildInsight(cats[1], 1),
      },
      {
        id: cats[2].id,
        label: CATEGORY_DEFS[cats[2].id].label,
        badge: 'Third Largest',
        badgeIcon: CATEGORY_DEFS[cats[2].id].badgeIcon,
        percentage: `${cats[2].pct}%`,
        description: CATEGORY_DEFS[cats[2].id].description,
        colSpan: 'md:col-span-5',
        trend: { label: 'Rising Trend', type: 'rising' },
        image: CATEGORY_DEFS[cats[2].id].image,
        insight: buildInsight(cats[2], 2),
      }
    ];

    return { primaryHotspot: primary, secondaryHotspots: secondary };
  }, [metrics]);

  return (
    <div className="text-[#141b2b] min-h-screen flex flex-col font-inter" style={{ backgroundColor: '#f2efe9' }}>
      <main className="w-full px-4 md:px-10 max-w-[1440px] mx-auto py-8 space-y-8 md:space-y-16">
        {/* Header */}
        <section className="max-w-3xl">
          <h1 className="font-geist text-3xl md:text-5xl font-semibold text-[#003527] mb-4 leading-tight">Carbon Footprint</h1>
          <p className="font-inter text-lg text-[#404944] leading-7">
            A clear look at where your personal carbon emissions come from. Understanding these key areas is the first step to reducing your impact in a practical, lasting way.
          </p>
        </section>

        {/* Hotspot Cards */}
        <section className="flex flex-col gap-6">
          {/* Primary Hotspot */}
          <div className="w-full bg-[#003527] text-white rounded-[32px] overflow-hidden relative flex flex-col md:flex-row group shadow-lg">
            <div className="absolute inset-0 z-0">
              <img
                alt="Atmospheric landscape"
                className="w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                src={primaryHotspot.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#003527] via-[#003527]/90 to-transparent" />
            </div>

            <div className="p-8 md:p-16 flex-1 flex flex-col justify-between relative z-10 w-full md:w-3/5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#b0f0d6]" style={{ fontVariationSettings: "'FILL' 1" }}>{primaryHotspot.badgeIcon}</span>
                  <span className="font-geist text-xs font-bold text-[#b0f0d6] uppercase tracking-widest">{primaryHotspot.badge}</span>
                </div>
                <h2 className="font-geist text-5xl font-semibold text-white mb-4">{primaryHotspot.label}</h2>
                <p className="font-inter text-lg text-white/90 max-w-lg leading-7">{primaryHotspot.description}</p>
              </div>
              <div className="mt-10 md:mt-14">
                <div className="font-geist text-[80px] leading-[80px] font-bold text-[#b0f0d6] tracking-tighter">{primaryHotspot.percentage}</div>
                <div className="font-geist text-sm text-white/80 mt-2">of your total personal emissions</div>

                {/* Insight panel — dark variant */}
                <InsightPanel insight={primaryHotspot.insight} dark />
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

                <div className="mt-6 relative z-10">
                  <div className="flex justify-between items-end border-t border-[#e2dec6] pt-4">
                    <div
                      className="font-geist font-bold text-[#003527] tracking-tighter"
                      style={{
                        fontSize: hotspot.id === 'facilities' ? '56px' : '48px',
                        lineHeight: hotspot.id === 'facilities' ? '56px' : '48px',
                      }}
                    >
                      {hotspot.percentage}
                    </div>
                    {hotspot.trend?.type === 'stable' ? (
                      <div className="bg-[#e2dec6]/50 text-[#003527] px-4 py-2 rounded-full font-geist text-xs font-semibold">{hotspot.trend.label}</div>
                    ) : (
                      <div className="bg-[#ba1a1a]/10 text-[#ba1a1a] px-4 py-2 rounded-full font-geist text-xs font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        {hotspot.trend?.label}
                      </div>
                    )}
                  </div>

                  {/* Insight panel — light variant */}
                  <InsightPanel insight={hotspot.insight} dark={false} />
                </div>
              </div>
            ))}
          </div>

          {/* Priority Reduction Initiatives */}
          <div className="w-full bg-white border border-[#e2dec6] rounded-[24px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-geist text-2xl font-medium text-[#003527]">Your Reduction Goals</h3>
              <Link
                to="/roadmap"
                className="font-geist text-sm font-medium text-[#2b6954] hover:text-[#003527] transition-colors flex items-center gap-1 group"
              >
                View Roadmap{' '}
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            
            {actions.length === 0 ? (
              <div className="bg-[#f2efe9]/50 border border-[#e2dec6] rounded-xl p-8 text-center">
                <p className="font-geist text-[#404944] mb-4">No actions committed yet.</p>
                <Link to="/actions" className="inline-flex bg-[#003527] text-white px-6 py-2.5 rounded-lg font-geist text-sm font-medium hover:bg-[#064e3b] transition-colors">
                  Explore Recommendations
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {actions.map((item) => (
                  <div key={item.id} className="group p-4 -mx-4 rounded-xl hover:bg-[#f2efe9]/50 transition-colors">
                    <div className="flex justify-between items-baseline mb-3">
                      <div className="font-geist text-xl font-medium text-[#003527]">{item.title}</div>
                      <div className="font-geist text-xs text-[#404944] bg-white px-3 py-1 rounded-full border border-[#e2dec6]">- {item.estimatedReduction} kg CO2e potential</div>
                    </div>
                    <div className="w-full bg-[#e2dec6] h-4 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-colors ${item.status === 'completed' ? 'bg-[#95d3ba]' : 'bg-[#003527] group-hover:bg-[#2b6954]'}`}
                        style={{ width: item.status === 'completed' ? '100%' : '50%' }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="font-geist text-sm font-semibold text-[#2b6954]">
                        {item.status === 'completed' ? 'Completed ✓' : 'In Progress'}
                      </span>
                      <span className="font-geist text-xs text-[#404944]">
                        Committed: {new Date(item.committedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default React.memo(CarbonHotspots);
