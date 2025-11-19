import { useState, useEffect } from 'react';
import { X, BookOpen, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordleGameProps {
  onClose: () => void;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WORD_LIST = [
  'PEACE', 'BLOOM', 'DREAM', 'HEART', 'LIGHT', 'MAGIC', 'GRACE', 'SWEET',
  'FAIRY', 'CLOUD', 'STARS', 'BLISS', 'CHARM', 'FLORA', 'CRYSTAL', 'PEARL'
];

type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export const WordleGame = ({ onClose }: WordleGameProps) => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tileStates, setTileStates] = useState<TileState[][]>([]);
  const [keyStates, setKeyStates] = useState<Record<string, TileState>>({});

  useEffect(() => {
    const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(word);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => (prev + e.key.toUpperCase()));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, gameOver, targetWord]);

  const handleSubmit = () => {
    if (currentGuess.length !== WORD_LENGTH || gameOver) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    const newTileState: TileState[] = [];
    const newKeyStates = { ...keyStates };
    const targetLetters = targetWord.split('');
    const guessLetters = currentGuess.split('');

    // First pass: mark correct letters
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        newTileState[i] = 'correct';
        newKeyStates[letter] = 'correct';
        targetLetters[i] = '';
      }
    });

    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (newTileState[i] !== 'correct') {
        const index = targetLetters.indexOf(letter);
        if (index !== -1) {
          newTileState[i] = 'present';
          if (newKeyStates[letter] !== 'correct') {
            newKeyStates[letter] = 'present';
          }
          targetLetters[index] = '';
        } else {
          newTileState[i] = 'absent';
          if (!newKeyStates[letter]) {
            newKeyStates[letter] = 'absent';
          }
        }
      }
    });

    setTileStates([...tileStates, newTileState]);
    setKeyStates(newKeyStates);

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
    }

    setCurrentGuess('');
  };

  const handleKeyClick = (key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'BACK') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const getTileClass = (state: TileState) => {
    switch (state) {
      case 'correct': return 'bg-gradient-to-br from-[#C9D5B5] to-[#A8C8A0] border-[#7A9B6E] text-white';
      case 'present': return 'bg-gradient-to-br from-[#FFDAB9] to-[#FFB347] border-[#D2691E] text-white';
      case 'absent': return 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-600 text-white';
      case 'filled': return 'bg-gradient-to-br from-[#FFF4F0] to-[#F5E6E0] border-[#8B4513] text-[#8B4513]';
      default: return 'bg-gradient-to-br from-white to-[#FFF4F0] border-[#D2B48C] text-[#8B4513]';
    }
  };

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F5E6D3] via-[#FFF4F0] to-[#E6D5C3] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#8B4513] to-transparent" />
        <div className="absolute top-20 right-20 text-6xl">📚</div>
        <div className="absolute bottom-20 left-20 text-5xl">🌿</div>
      </div>

      {/* Reading lamp glow */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-radial from-[#FFD700] to-transparent opacity-20 blur-3xl" />

      {/* Floating dust particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Tea cup */}
      <div className="absolute bottom-10 right-10 opacity-60">
        <Coffee className="w-16 h-16 text-[#8B4513]" />
        <div className="absolute -top-2 left-1/2 w-8 h-8 bg-white rounded-full opacity-30 blur-sm animate-pulse" />
      </div>

      {/* Game Container */}
      <div className="relative glass-effect rounded-3xl p-8 max-w-xl w-full mx-4 border-2 border-[#8B4513]/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#8B4513]" />
            <h2 className="text-3xl font-bold text-[#8B4513] drop-shadow-sm">Cozy Library</h2>
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

        {/* Game Board */}
        <div className="mb-6 space-y-2">
          {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {[...Array(WORD_LENGTH)].map((_, colIndex) => {
                const guess = guesses[rowIndex];
                const isCurrentRow = rowIndex === guesses.length;
                const letter = guess?.[colIndex] || (isCurrentRow ? currentGuess[colIndex] : '');
                const state = tileStates[rowIndex]?.[colIndex] || (letter ? 'filled' : 'empty');

                return (
                  <div
                    key={colIndex}
                    className={`
                      w-14 h-14 flex items-center justify-center
                      rounded-lg border-3 font-bold text-2xl
                      transition-all duration-300
                      ${getTileClass(state)}
                      ${letter ? 'scale-105' : 'scale-100'}
                      shadow-md
                    `}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="space-y-2">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex gap-1 justify-center">
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className={`
                    px-3 py-4 rounded-lg border-2 font-bold text-sm
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    ${key === 'ENTER' || key === 'BACK' ? 'px-4' : ''}
                    ${getTileClass(keyStates[key] || 'empty')}
                    shadow-md hover:shadow-lg
                  `}
                >
                  {key === 'BACK' ? '←' : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-[#8B4513] text-sm font-medium">
          Guess the 5-letter word in {MAX_ATTEMPTS} tries
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 text-center border-3 border-[#8B4513]/40 max-w-md">
            <h3 className="text-4xl font-bold mb-4 text-[#8B4513]">
              {won ? '🎉 Victory!' : '📖 Good Try!'}
            </h3>
            <p className="text-xl mb-2 text-[#8B4513]">
              {won ? 'You found the word!' : `The word was: ${targetWord}`}
            </p>
            <p className="text-lg mb-6 text-[#8B4513]/70">
              Solved in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
                  setTargetWord(word);
                  setGuesses([]);
                  setCurrentGuess('');
                  setTileStates([]);
                  setKeyStates({});
                  setGameOver(false);
                  setWon(false);
                }}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow border-2"
              >
                New Word
              </Button>
              <Button onClick={onClose} variant="outline" className="border-2 border-[#8B4513]">
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
