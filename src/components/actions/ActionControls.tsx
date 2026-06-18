import { useActions } from '../../context/ActionContext';
import type { Recommendation } from '../../lib/recommendationEngine';

export function ActionControls({ action, isPrimary = false, onCommitSuccess }: { action: Recommendation, isPrimary?: boolean, onCommitSuccess?: (action: Recommendation) => void }) {
  const { actions, commitAction, removeAction, markActionCompleted } = useActions();
  
  const committedState = actions.find(a => a.id === action.id);
  
  const handleCommit = () => {
    commitAction({
      id: action.id,
      title: action.title,
      category: action.category,
      estimatedReduction: action.estReductionKg,
      difficulty: action.difficulty.label.toLowerCase() as 'easy' | 'moderate' | 'hard'
    });
    if (onCommitSuccess) onCommitSuccess(action);
  };

  if (!committedState) {
    return (
      <button 
        type="button" 
        onClick={handleCommit}
        className={`w-full py-2 bg-[#003527] text-white rounded-lg font-geist text-sm font-medium hover:bg-[#064e3b] transition-colors mt-4 relative z-10 focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2 ${isPrimary ? 'sm:w-auto px-6' : ''}`}
      >
        Commit Action
      </button>
    );
  }
  
  if (committedState.status === 'completed') {
    return (
      <div className={`w-full py-2 bg-[#b0f0d6] text-[#003527] rounded-lg font-geist text-sm font-bold text-center mt-4 border border-[#95d3ba] flex items-center justify-center gap-2 relative z-10 ${isPrimary ? 'sm:w-auto px-6' : ''}`}>
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
        Completed
      </div>
    );
  }
  
  return (
    <div className={`flex gap-2 mt-4 relative z-10 ${isPrimary ? 'sm:w-auto' : ''}`}>
      <button 
        type="button" 
        onClick={() => markActionCompleted(action.id)}
        className="flex-1 py-2 px-4 bg-[#003527] text-white border border-[#003527] rounded-lg font-geist text-sm font-medium hover:bg-[#064e3b] transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#003527] focus:ring-offset-2"
      >
        <span className="material-symbols-outlined text-[16px]">check</span> Complete
      </button>
      <button 
        type="button" 
        onClick={() => removeAction(action.id)}
        className="flex-1 py-2 px-4 bg-[#f9f9ff] text-[#ba1a1a] border border-[#ba1a1a]/30 rounded-lg font-geist text-sm font-medium hover:bg-[#ba1a1a]/10 transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#ba1a1a] focus:ring-offset-2"
      >
        <span className="material-symbols-outlined text-[16px]">close</span> Remove
      </button>
    </div>
  );
}
