import { useState, useEffect } from 'react';
import { X, Sparkles, Flower2, Moon, Sun, Star, Gem, Heart, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Card {
  id: number;
  type: number;
  flipped: boolean;
  matched: boolean;
}

interface MemoryGameProps {
  onClose: () => void;
}

const CARD_TYPES = [
  { icon: Flower2, color: 'text-[#FFB3C6]', name: 'Rose' },
  { icon: Sparkles, color: 'text-[#E6E6FA]', name: 'Lavender' },
  { icon: Leaf, color: 'text-[#C9D5B5]', name: 'Sage' },
  { icon: Moon, color: 'text-[#FFF4F0]', name: 'Moon' },
  { icon: Sun, color: 'text-[#FFDAB9]', name: 'Sun' },
  { icon: Gem, color: 'text-[#B88B8B]', name: 'Crystal' },
  { icon: Heart, color: 'text-[#FFC2D1]', name: 'Heart' },
  { icon: Star, color: 'text-[#FFD700]', name: 'Star' },
];

export const MemoryGame = ({ onClose }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const cardPairs = CARD_TYPES.flatMap((_, index) => [
      { id: index * 2, type: index, flipped: false, matched: false },
      { id: index * 2 + 1, type: index, flipped: false, matched: false },
    ]);
    
    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
  };

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      cards[index].matched
    ) {
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlippedIndices;

      if (cards[first].type === cards[second].type) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          if (newMatches === CARD_TYPES.length) {
            setTimeout(() => setGameOver(true), 500);
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F5E6D3] via-[#FFF4F0] to-[#E8D5C4] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-4xl rotate-12">🌸</div>
        <div className="absolute top-20 right-20 text-3xl -rotate-12">🦋</div>
        <div className="absolute bottom-20 left-20 text-4xl rotate-45">🌿</div>
        <div className="absolute bottom-10 right-10 text-3xl -rotate-45">✨</div>
      </div>

      {/* Linen texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #8B4513 0px, #8B4513 1px, transparent 1px, transparent 4px),
                           repeating-linear-gradient(90deg, #8B4513 0px, #8B4513 1px, transparent 1px, transparent 4px)`
        }}
      />

      {/* Game Container */}
      <div className="relative glass-effect rounded-3xl p-8 max-w-3xl w-full mx-4 border-2 border-[#8B4513]/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-[#8B4513] drop-shadow-sm">Botanical Collection</h2>
            <div className="flex gap-3">
              <div className="glass-effect px-4 py-2 rounded-full border-2 border-[#8B4513]/30">
                <span className="font-bold text-[#8B4513]">Moves: {moves}</span>
              </div>
              <div className="glass-effect px-4 py-2 rounded-full border-2 border-[#8B4513]/30">
                <span className="font-bold text-[#8B4513]">Pairs: {matches}/{CARD_TYPES.length}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/50 hover:bg-white/70 border-2 border-[#8B4513]"
          >
            <X className="w-6 h-6 text-[#8B4513]" />
          </Button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {cards.map((card, index) => {
            const CardIcon = CARD_TYPES[card.type].icon;
            const cardColor = CARD_TYPES[card.type].color;
            
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.matched}
                className={`
                  relative aspect-square rounded-2xl
                  transition-all duration-500 transform-gpu
                  ${card.flipped || card.matched ? 'rotate-y-180' : 'rotate-y-0'}
                  ${card.matched ? 'opacity-70 scale-95' : 'hover:scale-105'}
                  preserve-3d cursor-pointer
                `}
                style={{ perspective: '1000px' }}
              >
                {/* Card Back */}
                <div
                  className={`
                    absolute inset-0 backface-hidden rounded-2xl
                    bg-gradient-to-br from-[#E6D5C3] to-[#D2B48C]
                    border-3 border-[#8B4513] shadow-lg
                    flex items-center justify-center
                    ${card.flipped || card.matched ? 'invisible' : 'visible'}
                  `}
                >
                  <div className="text-4xl opacity-30">🌿</div>
                </div>

                {/* Card Front */}
                <div
                  className={`
                    absolute inset-0 backface-hidden rounded-2xl rotate-y-180
                    bg-gradient-to-br from-[#FFF4F0] to-[#F5E6E0]
                    border-3 border-[#8B4513] shadow-xl
                    flex items-center justify-center
                    ${card.flipped || card.matched ? 'visible' : 'invisible'}
                  `}
                >
                  <CardIcon className={`w-16 h-16 ${cardColor} drop-shadow-lg`} />
                  {card.matched && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#FFD700] animate-pulse" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="text-center text-[#8B4513] font-medium">
          Find all matching pairs of botanical specimens
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 text-center border-3 border-[#8B4513]/40 max-w-md">
            <div className="text-6xl mb-4">🌸🦋🌿</div>
            <h3 className="text-4xl font-bold mb-4 text-[#8B4513]">Collection Complete!</h3>
            <p className="text-2xl mb-6 text-[#8B4513]">
              Completed in {moves} moves
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={initializeGame}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow border-2"
              >
                New Collection
              </Button>
              <Button onClick={onClose} variant="outline" className="border-2 border-[#8B4513]">
                <Leaf className="w-4 h-4 mr-2" />
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
