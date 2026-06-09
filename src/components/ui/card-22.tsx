import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlaceCardProps {
  images: string[];
  tags?: string[];
  rating?: number;
  title: string;
  dateRange?: string;
  hostType?: string;
  isTopRated?: boolean;
  description?: string;
  pricePerNight: number;
  className?: string;
}

export function PlaceCard({
  images,
  tags = [],
  rating,
  title,
  dateRange,
  hostType,
  isTopRated = false,
  description,
  pricePerNight,
  className
}: PlaceCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <motion.div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-surface dark:bg-surface-container border border-outline-variant/30 overflow-hidden shadow-sm hover:border-primary/20 transition-all duration-300",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -6,
        boxShadow: '0px 12px 30px -5px rgba(1, 45, 29, 0.08)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
    >
      {/* Image Container / Carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex] || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=800&auto=format&fit=crop&q=60'}
            alt={`${title} image ${currentIndex + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Carousel Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

        {/* Badges / Hearts overlay */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between z-10">
          {isTopRated && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/95 dark:bg-slate-900/95 text-[#012d1d] dark:text-[#4edea3] text-xs font-bold rounded-full shadow-sm backdrop-blur-sm">
              <Star className="w-3 h-3 fill-current text-amber-500" />
              Top Rated
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="ml-auto p-2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Save to favorites"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-all duration-200",
                isLiked ? "fill-red-500 text-red-500" : "text-slate-700 dark:text-slate-300"
              )}
            />
          </button>
        </div>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-full shadow-md hover:bg-white hover:scale-105 transition-all z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-full shadow-md hover:bg-white hover:scale-105 transition-all z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Carousel Indicator Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(idx, e)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200 cursor-pointer",
                  idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating and Tags */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex px-2 py-0.5 bg-sage-muted dark:bg-[#1f2e24] text-[#012d1d] dark:text-[#4edea3] text-[10px] font-semibold tracking-wider rounded-md uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          {rating !== undefined && (
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h4 className="font-bold text-[#012d1d] dark:text-white group-hover:text-primary transition-colors text-base line-clamp-1 mb-1">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Host & Date info */}
        {(hostType || dateRange) && (
          <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/80 border-t border-slate-100 dark:border-slate-800 pt-3 mb-3">
            {hostType && <span className="font-medium">{hostType}</span>}
            {hostType && dateRange && <span className="text-slate-300 dark:text-slate-700">•</span>}
            {dateRange && <span>{dateRange}</span>}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-extrabold text-[#012d1d] dark:text-white">
            ${pricePerNight}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">/ night</span>
        </div>
      </div>
    </motion.div>
  );
}
