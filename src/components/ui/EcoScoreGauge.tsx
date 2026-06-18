import { motion } from 'framer-motion';
import { AnimatedNumber } from './AnimatedNumber';

export function EcoScoreGauge({ score }: { score: number }) {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 z-10" aria-hidden="true">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 36 36">
        <path
          className="text-[#064e3b]/50"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <motion.path
          className="text-[#b0f0d6]"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
          style={{ filter: 'drop-shadow(0 0 8px rgba(176, 240, 214, 0.6))' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-[56px] font-geist font-bold text-white leading-none tracking-tight">
          <AnimatedNumber value={score} />
        </span>
      </div>
    </div>
  );
}
