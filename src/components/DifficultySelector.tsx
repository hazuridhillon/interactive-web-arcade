import { Button } from '@/components/ui/button';
import { Trophy, Target, Flame } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-effect rounded-3xl p-8 max-w-lg w-full mx-4 glow-soft border-2 border-primary/30">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Choose Your Challenge
        </h2>
        <p className="text-center text-muted-foreground mb-6">Select a difficulty level</p>
        
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => onSelect('easy')}
            className="h-auto py-4 px-6 bg-gradient-to-r from-[#C9D5B5] to-[#A8C8A0] hover:from-[#B5C7A3] hover:to-[#96B68E] text-foreground border-2 border-[#7A9B6E] transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 w-full">
              <Trophy className="w-6 h-6" />
              <div className="text-left flex-1">
                <div className="font-bold text-lg">Easy</div>
                <div className="text-sm opacity-90">{easyDesc}</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => onSelect('medium')}
            className="h-auto py-4 px-6 bg-gradient-to-r from-[#FFDAB9] to-[#FFB347] hover:from-[#FFC99F] hover:to-[#FF9F2D] text-foreground border-2 border-[#D2691E] transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 w-full">
              <Target className="w-6 h-6" />
              <div className="text-left flex-1">
                <div className="font-bold text-lg">Medium</div>
                <div className="text-sm opacity-90">{mediumDesc}</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => onSelect('hard')}
            className="h-auto py-4 px-6 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A6F] hover:from-[#FF5252] hover:to-[#D84860] text-white border-2 border-[#C94560] transition-all hover:scale-105"
          >
            <div className="flex items-center gap-3 w-full">
              <Flame className="w-6 h-6" />
              <div className="text-left flex-1">
                <div className="font-bold text-lg">Hard</div>
                <div className="text-sm opacity-90">{hardDesc}</div>
              </div>
            </div>
          </Button>
        </div>
        
        <Button
          onClick={onCancel}
          variant="ghost"
          className="w-full mt-4 text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
