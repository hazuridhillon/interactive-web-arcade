/**
 * DifficultySelector.tsx — A shared full-screen picker for game difficulty.
 * Used by Memory and Battle games before gameplay starts.
 * Shows three vivid buttons (Easy/Medium/Hard) with custom descriptions.
 */

import { Trophy, Target, Flame, ArrowLeft } from 'lucide-react';

interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onCancel: () => void;
  easyDesc: string;
  mediumDesc: string;
  hardDesc: string;
}

export const DifficultySelector = ({ 
  onSelect, 
  onCancel, 
  easyDesc, 
  mediumDesc, 
  hardDesc 
}: DifficultySelectorProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center y2k-lavender-bg">
      <div className="rounded-[22px] p-8 max-w-lg w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #d8b4fe' }}>
        <h2 style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }} className="text-3xl text-center mb-2">
          Pick Your Level
        </h2>
        <p className="text-center text-sm mb-6" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>
          How brave are you feeling?
        </p>
        
        {/* Difficulty buttons — each has its own color */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSelect('easy')}
            className="flex items-center gap-3 w-full text-left rounded-[16px] p-4 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#69f0ae', boxShadow: '0 5px 0 0 #4cc08a', color: '#1a1040' }}
          >
            <div className="p-2 rounded-xl bg-white/40"><Trophy className="w-6 h-6" /></div>
            <div className="flex-1">
              <div style={{ fontFamily: "'Bungee', cursive" }} className="text-lg">Easy</div>
              <div style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xs opacity-70">{easyDesc}</div>
            </div>
          </button>
          
          <button
            onClick={() => onSelect('medium')}
            className="flex items-center gap-3 w-full text-left rounded-[16px] p-4 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#fff176', boxShadow: '0 5px 0 0 #ccc05e', color: '#1a1040' }}
          >
            <div className="p-2 rounded-xl bg-white/40"><Target className="w-6 h-6" /></div>
            <div className="flex-1">
              <div style={{ fontFamily: "'Bungee', cursive" }} className="text-lg">Medium</div>
              <div style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xs opacity-70">{mediumDesc}</div>
            </div>
          </button>
          
          <button
            onClick={() => onSelect('hard')}
            className="flex items-center gap-3 w-full text-left rounded-[16px] p-4 transition-all hover:-translate-y-1"
            style={{ backgroundColor: '#ff6fcf', boxShadow: '0 5px 0 0 #cc4fa3', color: '#1a1040' }}
          >
            <div className="p-2 rounded-xl bg-white/40"><Flame className="w-6 h-6" /></div>
            <div className="flex-1">
              <div style={{ fontFamily: "'Bungee', cursive" }} className="text-lg">Hard</div>
              <div style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xs opacity-70">{hardDesc}</div>
            </div>
          </button>
        </div>
        
        {/* Back button */}
        <button
          onClick={onCancel}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm transition-all hover:opacity-70"
          style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
};
