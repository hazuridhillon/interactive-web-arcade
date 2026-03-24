/**
 * MemoryGame.tsx — A card-matching memory game.
 * Flip two cards at a time to find matching pairs.
 * Difficulty controls number of pairs and flip speed.
 */

import { useState, useEffect } from 'react';
import { Sparkles, Flower2, Moon, Sun, Star, Gem, Heart, Leaf } from 'lucide-react';
import { DifficultySelector } from '@/components/DifficultySelector';
import { GameHeader } from '@/components/GameHeader';
import { GameOverModal } from '@/components/GameOverModal';

interface Card { id: number; type: number; flipped: boolean; matched: boolean; }
interface MemoryGameProps { onClose: () => void; }

const CARD_TYPES = [
  { icon: Flower2, color: '#ff6fcf', name: 'Rose' },
  { icon: Sparkles, color: '#b388ff', name: 'Sparkle' },
  { icon: Leaf, color: '#69f0ae', name: 'Leaf' },
  { icon: Moon, color: '#80e8ff', name: 'Moon' },
  { icon: Sun, color: '#fff176', name: 'Sun' },
  { icon: Gem, color: '#ff8a65', name: 'Crystal' },
  { icon: Heart, color: '#ff0098', name: 'Heart' },
  { icon: Star, color: '#f48fb1', name: 'Star' },
];

export const MemoryGame = ({ onClose }: MemoryGameProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flipDelay, setFlipDelay] = useState(1000);
  const [numPairs, setNumPairs] = useState(8);

  useEffect(() => { if (difficulty) initializeGame(); }, [difficulty]);

  const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const cardPairs = CARD_TYPES.slice(0, numPairs).flatMap((_, index) => [
      { id: index * 2, type: index, flipped: false, matched: false },
      { id: index * 2 + 1, type: index, flipped: false, matched: false },
    ]);
    setCards(fisherYatesShuffle(cardPairs));
    setFlippedIndices([]); setMoves(0); setMatches(0); setGameOver(false);
  };

  const handleDifficultySelect = (diff: 'easy' | 'medium' | 'hard') => {
    if (diff === 'easy') { setNumPairs(4); setFlipDelay(1200); }
    else if (diff === 'medium') { setNumPairs(6); setFlipDelay(1000); }
    else { setNumPairs(8); setFlipDelay(700); }
    setDifficulty(diff);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || cards[index].matched) return;
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    const newCards = [...cards]; newCards[index].flipped = true; setCards(newCards);

    if (newFlippedIndices.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlippedIndices;
      if (cards[first].type === cards[second].type) {
        setTimeout(() => {
          const matchedCards = [...cards]; matchedCards[first].matched = true; matchedCards[second].matched = true;
          setCards(matchedCards); setFlippedIndices([]);
          const newMatches = matches + 1; setMatches(newMatches);
          if (newMatches === numPairs) setTimeout(() => setGameOver(true), 500);
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...cards]; resetCards[first].flipped = false; resetCards[second].flipped = false;
          setCards(resetCards); setFlippedIndices([]);
        }, flipDelay);
      }
    }
  };

  if (!difficulty) {
    return <DifficultySelector onSelect={handleDifficultySelect} onCancel={onClose} easyDesc="8 cards (4 pairs)" mediumDesc="12 cards (6 pairs)" hardDesc="16 cards (8 pairs), faster" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden y2k-lavender-bg">
      <div className="relative rounded-[22px] p-6 max-w-3xl w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc4fa3' }}>
        <GameHeader
          title="Memory"
          badges={[
            { label: `Moves: ${moves}`, bg: '#fff176' },
            { label: `Pairs: ${matches}/${numPairs}`, bg: '#69f0ae' },
          ]}
          onClose={onClose}
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {cards.map((card, index) => {
            const CardIcon = CARD_TYPES[card.type].icon;
            const cardColor = CARD_TYPES[card.type].color;
            const isRevealed = card.flipped || card.matched;
            return (
              <button key={card.id} onClick={() => handleCardClick(index)} disabled={card.matched}
                className="aspect-square rounded-[14px] transition-all duration-300 flex items-center justify-center"
                style={{
                  backgroundColor: isRevealed ? '#fff' : '#ff6fcf',
                  border: `3px solid ${isRevealed ? cardColor : '#cc4fa3'}`,
                  boxShadow: `0 4px 0 0 ${isRevealed ? cardColor : '#cc4fa3'}`,
                  opacity: card.matched ? 0.5 : 1,
                  transform: card.matched ? 'scale(0.9)' : isRevealed ? 'scale(1.02)' : 'scale(1)',
                  cursor: card.matched ? 'default' : 'pointer',
                }}>
                {isRevealed ? <CardIcon className="w-10 h-10 md:w-12 md:h-12" style={{ color: cardColor }} /> : <Star className="w-6 h-6" style={{ color: '#fff', opacity: 0.4 }} />}
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>Find all matching pairs</p>
      </div>

      {gameOver && (
        <GameOverModal
          title="Complete!"
          message={`Finished in ${moves} moves`}
          icon={<Sparkles className="w-12 h-12 mx-auto" style={{ color: '#ff0098' }} />}
          onPlayAgain={initializeGame}
          onClose={onClose}
          shadowColor="#cc4fa3"
        />
      )}
    </div>
  );
};
