import type { UserProfile, CarbonFootprint, ActionRecommendation } from '../types';

export function calculateBaseFootprint(profile: UserProfile): CarbonFootprint {
  // 1. Transportation Calculations
  let transport = 3000; // Baseline
  const habitsLower = profile.transportHabits.toLowerCase();
  
  if (habitsLower.includes('suv') || habitsLower.includes('truck')) {
    transport += 1500;
  }
  if (habitsLower.includes('electric') || habitsLower.includes('ev') || habitsLower.includes('hybrid')) {
    transport -= 1800;
  }
  if (habitsLower.includes('no car') || habitsLower.includes('bike') || habitsLower.includes('walk') || habitsLower.includes('transit')) {
    transport = Math.max(400, transport - 2200);
  }
  // Extract any mileage numbers
  const milesMatch = habitsLower.match(/(\d{1,3}(,\d{3})*|\d+)\s*mile/);
  if (milesMatch) {
    const miles = parseInt(milesMatch[1].replace(/,/g, ''), 10);
    if (miles > 0) {
      transport = Math.min(8000, Math.max(500, miles * 0.35));
    }
  }

  // 2. Diet Calculations
  let diet = 1800;
  if (profile.dietType === 'Heavy Meat') diet = 2500;
  if (profile.dietType === 'Vegetarian') diet = 1100;
  if (profile.dietType === 'Vegan') diet = 700;

  // 3. Home Energy Calculations
  let energyBase = 3500;
  if (profile.energySource === 'Grid (Fossil/Coal)') energyBase = 4800;
  if (profile.energySource === 'Renewable (Solar/Wind)') energyBase = 600;
  
  // Distribute over household size (shared utility)
  const energy = Math.round(energyBase / profile.householdSize);

  // 4. Consumption Calculations
  const consumption = 1200 + (profile.householdSize * 300);

  const total_kg = Math.round(transport + diet + energy + consumption);

  return {
    total_kg,
    breakdown: {
      transport: Math.round(transport),
      diet: Math.round(diet),
      energy: Math.round(energy),
      consumption: Math.round(consumption),
    }
  };
}

export function generateStaticRecommendations(profile: UserProfile, footprint: CarbonFootprint): ActionRecommendation[] {
  const pool: ActionRecommendation[] = [
    {
      rank: 1,
      title: "Swap beef for poultry",
      category: "Diet",
      current_co2_contribution_kg: footprint.breakdown.diet,
      projected_savings_kg: Math.round(footprint.breakdown.diet * 0.35),
      rationale: "Poultry has a significantly lower methane footprint than beef. Making this swap reduces resource intensity.",
      relatable_equivalence: "Equivalence: Planting 10 trees.",
      cost: "Low",
      difficulty: "Easy"
    },
    {
      rank: 2,
      title: "Work from home 1 day/week",
      category: "Transport",
      current_co2_contribution_kg: footprint.breakdown.transport,
      projected_savings_kg: Math.round(footprint.breakdown.transport * 0.2),
      rationale: "Reducing commute miles directly lowers fuel consumption and wear on passenger vehicles.",
      relatable_equivalence: "Equivalence: Powering a home for 15 days.",
      cost: "Zero",
      difficulty: "Easy"
    },
    {
      rank: 3,
      title: "Lower thermostat by 2 degrees",
      category: "Energy",
      current_co2_contribution_kg: footprint.breakdown.energy,
      projected_savings_kg: Math.round(footprint.breakdown.energy * 0.12),
      rationale: "Heating and cooling account for a major portion of home energy use. Minimizing it saves coal/gas grid overhead.",
      relatable_equivalence: "Equivalence: 2,500 smartphone charges saved.",
      cost: "Zero",
      difficulty: "Easy"
    },
    {
      rank: 4,
      title: "Switch to Electric Vehicle",
      category: "Transport",
      current_co2_contribution_kg: footprint.breakdown.transport,
      projected_savings_kg: Math.round(footprint.breakdown.transport * 0.7),
      rationale: "Electric powertrains produce zero tailpipe emissions. Pairing this with a clean grid maximizes carbon savings.",
      relatable_equivalence: "Equivalence: Eliminating 250 gallons of gas usage annually.",
      cost: "High",
      difficulty: "Medium"
    },
    {
      rank: 5,
      title: "Install solar panels",
      category: "Energy",
      current_co2_contribution_kg: footprint.breakdown.energy,
      projected_savings_kg: Math.round(footprint.breakdown.energy * 0.9),
      rationale: "Rooftop solar completely offsets daytime grid demand, generating renewable energy directly at the source.",
      relatable_equivalence: "Equivalence: Planting 90 trees.",
      cost: "High",
      difficulty: "Hard"
    },
    {
      rank: 6,
      title: "LED Bulb Retrofit",
      category: "Energy",
      current_co2_contribution_kg: Math.round(footprint.breakdown.energy * 0.1),
      projected_savings_kg: Math.round(footprint.breakdown.energy * 0.08),
      rationale: "LED bulbs consume 85% less energy than standard incandescents and last up to 25 times longer.",
      relatable_equivalence: "Equivalence: Taking 0.1 cars off the road for a year.",
      cost: "Low",
      difficulty: "Easy"
    }
  ];

  // Filters based on budgetConstraint
  const filtered = [...pool];
  
  if (profile.budgetConstraint === 'Low Cost Only') {
    // Deprioritize High Cost actions
    filtered.sort((a, b) => {
      if (a.cost === 'High' && b.cost !== 'High') return 1;
      if (a.cost !== 'High' && b.cost === 'High') return -1;
      return b.projected_savings_kg - a.projected_savings_kg;
    });
  } else {
    // Sort by largest projected savings
    filtered.sort((a, b) => b.projected_savings_kg - a.projected_savings_kg);
  }

  // Recalculate Ranks
  return filtered.map((item, idx) => ({
    ...item,
    rank: idx + 1
  })).slice(0, 4); // Limit to top 4 recommendations
}
