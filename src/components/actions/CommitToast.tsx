import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Recommendation } from '../../lib/recommendationEngine';

export function CommitToast({ action, onClose }: { action: Recommendation, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50 w-auto md:w-[400px] bg-white border-l-8 border-[#2b6954] rounded-xl shadow-2xl overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#b0f0d6] flex items-center justify-center text-[#003527] shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">check</span>
          </div>
          <div>
            <h4 className="font-geist text-xs font-bold text-[#2b6954] uppercase tracking-wider mb-1 flex items-center gap-1">
              Action Added
            </h4>
            <p className="font-geist text-lg font-medium text-[#141b2b] leading-tight mb-2">{action.title}</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 ${action.categoryBg} rounded text-xs font-semibold flex items-center gap-1`}>
                <span className="material-symbols-outlined text-[12px]" aria-hidden="true">{action.categoryIcon}</span>
                {action.categoryLabel}
              </span>
              <span className="font-inter text-xs font-medium text-[#2b6954] bg-[#b0f0d6]/30 px-2 py-0.5 rounded">
                -{action.estReduction}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-3 border-t border-[#bfc9c3]/30 pt-4">
          <Link 
            to="/roadmap" 
            className="flex-1 bg-[#003527] text-white text-center py-2.5 rounded-lg font-geist text-sm font-semibold hover:bg-[#064e3b] transition-colors"
          >
            View Roadmap
          </Link>
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 bg-white text-[#003527] border border-[#bfc9c3] text-center py-2.5 rounded-lg font-geist text-sm font-semibold hover:bg-[#f9f9ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
          >
            Continue Exploring
          </button>
        </div>
      </div>
    </motion.div>
  );
}
