import { TRANSPORT_FACTORS, ENERGY_FACTORS } from './carbonFactors';
import type { Recommendation, UserProfile } from '../lib/recommendationEngine';

const HIGH   = { label: 'High',   color: 'text-[#047857]', dot: 'bg-[#10b981]' };
const MEDIUM = { label: 'Medium', color: 'text-[#92400e]', dot: 'bg-[#f59e0b]' };
const EASY   = { label: 'Easy',   color: 'text-[#047857]', dot: 'bg-[#10b981]' };
const SAVES  = { label: 'Saves Money', color: 'text-[#047857]', dot: 'bg-[#10b981]' };
const LOW_COST = { label: 'Low Cost',  color: 'text-[#92400e]', dot: 'bg-[#f59e0b]' };

function transportShare(p: UserProfile): number {
  const map: Record<string, number> = { car: 52, ev: 30, bus: 15, metro: 12, bike: 5, walk: 3 };
  return map[p.transportMode] ?? 30;
}

function energyShare(p: UserProfile): number {
  const kw = p.monthlyKwh;
  if (p.energySource === 'renewable') return 8;
  if (p.energySource === 'gas') return kw > 400 ? 38 : 28;
  return kw > 600 ? 42 : kw > 300 ? 30 : 20;
}

function foodShare(p: UserProfile): number {
  const map: Record<string, number> = { omnivore: 28, flexitarian: 18, vegetarian: 12, vegan: 8 };
  return map[p.dietType] ?? 20;
}

function distanceLabel(km: number): string {
  if (km < 30) return 'short';
  if (km < 80) return 'moderate';
  return 'long';
}

export type CandidateFactory = (p: UserProfile) => Recommendation;

export const CANDIDATES: CandidateFactory[] = [

  // ── MOBILITY ────────────────────────────────────────────────────────────────

  (p) => {
    const share = transportShare(p);
    const relevant = ['car', 'ev'].includes(p.transportMode);
    const reduction = relevant ? Math.round(p.weeklyDistance * 0.4 * TRANSPORT_FACTORS.car) : 12;
    return {
      id: 'public-transport',
      title: 'Take Public Transport Twice a Week',
      description: 'Swap your car for a bus, train, or metro on two of your regular weekly commutes. This alone can cut your transport emissions by up to 15% per month.',
      category: 'mobility',
      categoryLabel: relevant ? 'Top Recommendation' : 'Mobility',
      categoryIcon: relevant ? 'eco' : 'commute',
      categoryBg: relevant ? 'bg-[#064e3b] text-[#80bea6]' : 'bg-[#d4e3ff] text-[#003c70]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: HIGH,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'directions_bus',
      score: relevant ? (share * 1.5 + (p.weeklyDistance > 50 ? 20 : 0)) : 20,
      reason: {
        headline: `Transportation makes up ~${share}% of your footprint`,
        detail: relevant
          ? `You travel around ${p.weeklyDistance} km per week by ${p.transportMode === 'car' ? 'car' : 'EV'}. Replacing just two of those trips with public transport each week is the single highest-impact change you can make right now.`
          : `Even occasional car use adds up. Two car-free commutes a week can meaningfully reduce your weekly transport impact.`,
        share: `${share}% of footprint`,
        barPercent: share,
        tip: `Switching two days a week could save you up to ${Math.round(reduction * 12)} kg CO₂ per year — equivalent to planting ${Math.round((reduction * 12) / (TRANSPORT_FACTORS.car * 100))} trees.`,
      },
    };
  },

  (p) => {
    const share = transportShare(p);
    const relevant = p.transportMode === 'car' && p.weeklyDistance > 40;
    const reduction = relevant ? Math.round(p.weeklyDistance * 0.3 * TRANSPORT_FACTORS.car) : 10;
    return {
      id: 'work-from-home',
      title: 'Work From Home 2 Days a Week',
      description: 'Skip the commute twice a week to meaningfully reduce your weekly transport emissions and save on fuel or transit costs.',
      category: 'mobility',
      categoryLabel: 'Mobility',
      categoryIcon: 'commute',
      categoryBg: 'bg-[#d4e3ff] text-[#003c70]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: relevant ? HIGH : MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'home_work',
      score: relevant ? share * 1.2 : 15,
      reason: {
        headline: relevant
          ? `Your ${distanceLabel(p.weeklyDistance)} weekly commute is a major emissions source`
          : 'Cutting commute days is one of the easiest wins',
        detail: relevant
          ? `With ${p.weeklyDistance} km of weekly travel by car, eliminating even two commutes saves significant fuel and CO₂ with zero lifestyle sacrifice.`
          : `Two fewer commutes per week adds up to over 100 fewer journeys per year — a meaningful reduction for almost any lifestyle.`,
        share: `${share}% transport share`,
        barPercent: Math.min(share, 60),
        tip: `Working from home 2 days a week could save you approximately £${Math.round(reduction * 0.3 * 12)} in fuel or transit costs annually.`,
      },
    };
  },

  (p) => {
    const share = transportShare(p);
    const relevant = p.transportMode === 'car' && p.weeklyDistance < 30;
    const reduction = 18;
    return {
      id: 'cycle-short-trips',
      title: 'Cycle or Walk for Trips Under 3 km',
      description: 'For short local errands and journeys under 3 km, choose cycling or walking instead of driving. Short car trips have a disproportionately high carbon cost per km.',
      category: 'mobility',
      categoryLabel: 'Active Travel',
      categoryIcon: 'directions_bike',
      categoryBg: 'bg-[#d9e6dd] text-[#131e19]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'pedal_bike',
      score: relevant ? 55 : (p.weeklyDistance < 50 ? 30 : 10),
      reason: {
        headline: relevant
          ? 'Your short weekly distance is perfect for active travel'
          : 'Short car trips are the least efficient driving you do',
        detail: relevant
          ? `At ${p.weeklyDistance} km/week, most of your journeys are likely short enough to walk or cycle. Cold-start car engines on short trips emit up to 60% more per km than highway driving.`
          : `Cold-start short trips (under 3 km) produce more carbon per kilometre than any other driving. Switching just a few of these per week makes a real difference.`,
        share: `${share}% of your emissions`,
        barPercent: Math.min(share, 50),
        tip: 'Cold engines on trips under 3 km produce up to 3× more CO₂ per km than warm highway driving.',
      },
    };
  },

  // ── ENERGY ──────────────────────────────────────────────────────────────────

  (p) => {
    const share = energyShare(p);
    const relevant = ['grid', 'gas', 'mixed'].includes(p.energySource);
    const reduction = relevant ? Math.round(Math.max(share * 1.2, 18)) : 8;
    return {
      id: 'green-energy-tariff',
      title: 'Switch to a Green Energy Tariff',
      description: 'Contact your energy provider and switch to a 100% renewable electricity plan. Most providers offer green tariffs at comparable or even lower rates.',
      category: 'energy',
      categoryLabel: relevant ? 'Top Energy Action' : 'Energy',
      categoryIcon: 'wind_power',
      categoryBg: relevant ? 'bg-[#064e3b] text-[#80bea6]' : 'bg-[#dce2f7] text-[#404944]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: relevant ? HIGH : MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'wind_power',
      score: relevant ? (share * 2 + (p.monthlyKwh > 400 ? 25 : 0)) : 10,
      reason: {
        headline: `Home energy accounts for ~${share}% of your footprint`,
        detail: relevant
          ? `You're currently using ${p.energySource === 'grid' ? 'grid electricity' : p.energySource === 'gas' ? 'natural gas' : 'a mixed energy mix'} and consuming around ${p.monthlyKwh} kWh/month. Switching to a renewable tariff is a one-time change with immediate, lasting impact.`
          : `Even with some renewable energy, switching fully can still reduce your remaining grid-sourced emissions.`,
        share: `${share}% of footprint`,
        barPercent: share,
        tip: `At ${p.monthlyKwh} kWh/month, switching to renewables could eliminate up to ${Math.round(p.monthlyKwh * ENERGY_FACTORS.grid)} kg of CO₂ per month from your home energy.`,
      },
    };
  },

  (p) => {
    const share = energyShare(p);
    const highUsage = p.monthlyKwh > 350;
    const reduction = highUsage ? 25 : 12;
    return {
      id: 'thermostat-ac',
      title: 'Reduce AC & Heating by 1–2°C',
      description: 'Adjust your thermostat by 1–2°C and reduce heating or cooling by one hour per day. Small changes in home temperature add up significantly over a year.',
      category: 'energy',
      categoryLabel: 'Home Energy',
      categoryIcon: 'thermostat',
      categoryBg: 'bg-[#dce2f7] text-[#404944]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'nest_eco_leaf',
      score: highUsage ? share * 1.3 : share * 0.8,
      reason: {
        headline: highUsage
          ? `Your ${p.monthlyKwh} kWh/month usage is above average`
          : 'Thermostat adjustments are the easiest energy win',
        detail: highUsage
          ? `The average UK household uses around 300 kWh/month. Your ${p.monthlyKwh} kWh suggests heating or cooling is a significant driver — even a 1°C shift can reduce energy use by 6–10%.`
          : `Each degree of thermostat adjustment reduces your heating or cooling load by around 6%. It's the smallest change with the most consistent savings.`,
        share: `${share}% of your emissions`,
        barPercent: Math.min(share, 45),
        tip: 'Each 1°C reduction in heating or increase in AC set-point cuts energy use by approximately 6–8%.',
      },
    };
  },

  (p) => {
    const share = energyShare(p);
    const relevant = p.energySource !== 'renewable';
    const reduction = 10;
    return {
      id: 'led-lighting',
      title: 'Replace Bulbs with LED Lighting',
      description: 'Swap remaining incandescent or halogen bulbs for LED equivalents. LEDs use up to 90% less energy and last 25× longer — a one-time change with years of savings.',
      category: 'energy',
      categoryLabel: 'Home Energy',
      categoryIcon: 'lightbulb',
      categoryBg: 'bg-[#dce2f7] text-[#404944]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: MEDIUM,
      cost: LOW_COST,
      difficulty: EASY,
      bgIcon: 'lightbulb',
      score: relevant ? share * 0.9 : 8,
      reason: {
        headline: 'Lighting is an easy, one-time home energy win',
        detail: relevant
          ? `Your current energy mix (${p.energySource}) means that every unit of electricity you save has a real carbon impact. LED lighting is a one-time upgrade with a 2–3 month payback period.`
          : `Even with renewable energy, reducing consumption lowers your total demand — and LEDs last for over a decade.`,
        share: `${share}% home energy share`,
        barPercent: Math.min(share, 35),
        tip: 'LEDs use 90% less energy than traditional bulbs and last up to 25,000 hours — once installed, you rarely think about them again.',
      },
    };
  },

  // ── FOOD / DIET ─────────────────────────────────────────────────────────────

  (p) => {
    const share = foodShare(p);
    const relevant = p.dietType === 'omnivore';
    const reduction = relevant ? 35 : (p.dietType === 'flexitarian' ? 15 : 8);
    return {
      id: 'meat-free-days',
      title: 'Go Meat-Free Three Days a Week',
      description: 'Replace meat with plant-based meals on three days each week. A flexitarian diet is one of the highest-impact personal changes you can make for the planet.',
      category: 'waste',
      categoryLabel: relevant ? 'High Food Impact' : 'Food & Diet',
      categoryIcon: 'restaurant',
      categoryBg: relevant ? 'bg-[#064e3b] text-[#80bea6]' : 'bg-[#d9e6dd] text-[#131e19]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: relevant ? HIGH : MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'eco',
      score: relevant ? share * 2.2 : (p.dietType === 'flexitarian' ? share * 1.2 : 5),
      reason: {
        headline: relevant
          ? `Food choices account for ~${share}% of your personal footprint`
          : `Your diet already helps — going further saves even more`,
        detail: relevant
          ? `As an omnivore, your diet is one of the largest individual levers available to you. Beef alone produces 27× more CO₂ per kg than tofu. Three plant-based days per week could cut your food emissions by 30–40%.`
          : `You're already making good food choices. Three fully meat-free days per week is the next achievable step that compounds your existing impact.`,
        share: `${share}% food footprint`,
        barPercent: share,
        tip: 'Producing 1 kg of beef generates around 27 kg CO₂e — compared to just 2 kg for legumes. Three meat-free days adds up to over 400 kg CO₂ saved per year.',
      },
    };
  },

  (p) => {
    const share = foodShare(p);
    const relevant = p.dietType === 'omnivore' || p.dietType === 'flexitarian';
    const reduction = 12;
    return {
      id: 'local-seasonal',
      title: 'Buy Local & Seasonal Produce',
      description: 'Prioritise locally grown, seasonal fruits and vegetables. Out-of-season and imported produce can have 10–50× higher transport and refrigeration emissions.',
      category: 'waste',
      categoryLabel: 'Food & Diet',
      categoryIcon: 'local_florist',
      categoryBg: 'bg-[#d9e6dd] text-[#131e19]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'compost',
      score: relevant ? share * 1.1 : 15,
      reason: {
        headline: 'Where your food comes from matters as much as what it is',
        detail: relevant
          ? `Food transport and refrigeration add hidden emissions to your shopping basket. Seasonal, local alternatives are often cheaper and fresher — with a fraction of the carbon cost.`
          : `Even plant-based diets can carry import and refrigeration footprints. Choosing local and seasonal produce is the natural next step after diet changes.`,
        share: `${share}% food contribution`,
        barPercent: Math.min(share, 30),
        tip: 'Air-freighted out-of-season produce can emit 50× more CO₂ per kg than locally grown equivalents. Seasonal shopping is cheaper and almost always lower-carbon.',
      },
    };
  },

  (p) => {
    const share = foodShare(p);
    const householdMultiplier = p.householdSize === '5+' ? 1.5 : p.householdSize === '3-4' ? 1.2 : 1;
    const reduction = Math.round(10 * householdMultiplier);
    return {
      id: 'reduce-food-waste',
      title: 'Cut Food Waste by Planning Meals Weekly',
      description: 'Plan your weekly meals before shopping to buy only what you need. The average household wastes around 30% of food purchased — all of which carries embedded carbon.',
      category: 'waste',
      categoryLabel: 'Food & Diet',
      categoryIcon: 'grocery',
      categoryBg: 'bg-[#d9e6dd] text-[#131e19]',
      estReduction: `${reduction} kg CO₂/mo`,
      estReductionKg: reduction,
      impact: MEDIUM,
      cost: SAVES,
      difficulty: EASY,
      bgIcon: 'compost',
      score: (share * 0.9) * householdMultiplier,
      reason: {
        headline: `Household size of ${p.householdSize} means more potential food waste savings`,
        detail: `A ${p.householdSize === '1' ? 'solo' : p.householdSize === '2' ? 'two-person' : 'family'} household wastes an average of ${p.householdSize === '5+' ? '£900' : p.householdSize === '3-4' ? '£700' : '£400'} of food per year. That wasted food has embedded carbon from production, transport and refrigeration that's released for nothing.`,
        share: `${share}% food category`,
        barPercent: Math.min(share, 28),
        tip: `Meal planning can cut grocery bills by 20–30% and eliminate most household food waste — saving money while reducing emissions.`,
      },
    };
  },

];
