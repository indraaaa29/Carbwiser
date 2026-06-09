import { motion } from 'framer-motion';
import { PlaceCard } from '@/components/ui/card-22';

const ECO_PROPERTIES = [
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
  },
  {
    title: "Zero-Emission Swiss Chalet",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["Passive House", "Mountain Water"],
    rating: 4.75,
    dateRange: "Dec 1 - 8",
    hostType: "Local Steward",
    isTopRated: false,
    description: "Triple-glazed passive house structure utilizing pure glacier runoffs and heat-pump technology for warmth high in the Alps.",
    pricePerNight: 320
  },
  {
    title: "Eco Treehouse Canopy",
    images: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["Solar Only", "Low Impact"],
    rating: 4.85,
    dateRange: "Jul 10 - 15",
    hostType: "Superhost",
    isTopRated: false,
    description: "High canopy living amidst ancient redwood pines, operating entirely on 12V solar power with composting amenities.",
    pricePerNight: 160
  },
  {
    title: "Sossusvlei Desert Lodge",
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5edd0ea9?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=60"
    ],
    tags: ["Water Recycling", "Solar AC"],
    rating: 4.92,
    dateRange: "Aug 4 - 11",
    hostType: "Elite Steward",
    isTopRated: true,
    description: "Ultra-luxury eco-tourism lodge in Namibia utilizing state of the art water recycling systems and solar thermal cooling.",
    pricePerNight: 280
  }
];

export function EcoStays() {
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

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-background min-h-screen text-on-surface">
      <div className="max-w-7xl mx-auto space-y-gutter">
        <header className="mb-8">
          <h2 className="text-display-lg font-display-lg text-primary flex items-center gap-3 font-bold text-3xl">
            <span className="material-symbols-outlined text-primary text-3xl">travel_explore</span>
            Sustainable Travel & Lodging
          </h2>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-[720px]">
            Explore top-tier, carbon-certified accommodations. Support eco-tourism and keep your holiday travel footprint close to net-zero.
          </p>
        </header>

        <motion.div 
          className="cards-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {ECO_PROPERTIES.map((prop, idx) => (
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
    </div>
  );
}
