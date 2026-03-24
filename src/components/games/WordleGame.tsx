/**
 * WordleGame.tsx — A 5-letter word guessing game (like Wordle).
 * Player has 6 attempts to guess the target word.
 * Tiles turn green (correct), yellow (wrong position), or grey (not in word).
 */

import { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';

interface WordleGameProps {
  onClose: () => void;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const WORD_LIST = [
  'PEACE', 'BLOOM', 'DREAM', 'HEART', 'LIGHT', 'MAGIC', 'GRACE', 'SWEET',
  'FAIRY', 'CLOUD', 'STARS', 'BLISS', 'CHARM', 'FLORA', 'PEARL', 'HONEY'
];

type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

const STATE_STYLES: Record<TileState, { bg: string; border: string; color: string }> = {
  correct: { bg: '#69f0ae', border: '#4cc08a', color: '#1a1040' },
  present: { bg: '#fff176', border: '#ccc05e', color: '#1a1040' },
  absent: { bg: '#ccc', border: '#999', color: '#666' },
  filled: { bg: '#f0d6ff', border: '#d8b4fe', color: '#1a1040' },
  empty: { bg: '#fff', border: '#e0c4f0', color: '#1a1040' },
};

export const WordleGame = ({ onClose }: WordleGameProps) => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [tileStates, setTileStates] = useState<TileState[][]>([]);
  const [keyStates, setKeyStates] = useState<Record<string, TileState>>({});

  useEffect(() => { setTargetWord(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]); }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'Enter') handleSubmit();
      else if (e.key === 'Backspace') setCurrentGuess(prev => prev.slice(0, -1));
      else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) setCurrentGuess(prev => prev + e.key.toUpperCase());
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

    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) { newTileState[i] = 'correct'; newKeyStates[letter] = 'correct'; targetLetters[i] = ''; }
    });
    guessLetters.forEach((letter, i) => {
      if (newTileState[i] !== 'correct') {
        const idx = targetLetters.indexOf(letter);
        if (idx !== -1) { newTileState[i] = 'present'; if (newKeyStates[letter] !== 'correct') newKeyStates[letter] = 'present'; targetLetters[idx] = ''; }
        else { newTileState[i] = 'absent'; if (!newKeyStates[letter]) newKeyStates[letter] = 'absent'; }
      }
    });

    setTileStates([...tileStates, newTileState]);
    setKeyStates(newKeyStates);
    if (currentGuess === targetWord) { setWon(true); setGameOver(true); }
    else if (newGuesses.length >= MAX_ATTEMPTS) { setGameOver(true); }
    setCurrentGuess('');
  };

  const handleKeyClick = (key: string) => {
    if (gameOver) return;
    if (key === 'ENTER') handleSubmit();
    else if (key === 'BACK') setCurrentGuess(prev => prev.slice(0, -1));
    else if (currentGuess.length < WORD_LENGTH) setCurrentGuess(prev => prev + key);
  };

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
  ];

  const resetGame = () => {
    setTargetWord(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
    setGuesses([]); setCurrentGuess(''); setTileStates([]); setKeyStates({}); setGameOver(false); setWon(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden y2k-lavender-bg">
      <div className="relative rounded-[22px] p-6 max-w-xl w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #d8b4fe' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" style={{ color: '#b388ff' }} />
            <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-2xl">Wordle</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5"><X className="w-5 h-5" style={{ color: '#1a1040' }} /></button>
        </div>

        {/* Board */}
        <div className="mb-5 space-y-2">
          {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {[...Array(WORD_LENGTH)].map((_, colIndex) => {
                const guess = guesses[rowIndex];
                const isCurrentRow = rowIndex === guesses.length;
                const letter = guess?.[colIndex] || (isCurrentRow ? currentGuess[colIndex] : '');
                const state = tileStates[rowIndex]?.[colIndex] || (letter ? 'filled' : 'empty');
                const s = STATE_STYLES[state];
                return (
                  <div
                    key={colIndex}
                    className="w-14 h-14 flex items-center justify-center rounded-[10px] text-2xl transition-all duration-200"
                    style={{
                      fontFamily: "'Bungee', cursive",
                      backgroundColor: s.bg, border: `3px solid ${s.border}`, color: s.color,
                      boxShadow: letter ? `0 3px 0 0 ${s.border}` : 'none',
                      transform: letter ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="space-y-1.5">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex gap-1 justify-center">
              {row.map(key => {
                const s = STATE_STYLES[keyStates[key] || 'empty'];
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyClick(key)}
                    className="px-2.5 py-3 rounded-[8px] text-xs transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
                    style={{
                      fontFamily: "'Bungee', cursive", fontSize: key.length > 1 ? 9 : 12,
                      backgroundColor: s.bg, border: `2px solid ${s.border}`, color: s.color,
                      boxShadow: `0 3px 0 0 ${s.border}`,
                      minWidth: key.length > 1 ? 52 : 32,
                    }}
                  >
                    {key === 'BACK' ? '←' : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>
          Guess the 5-letter word in {MAX_ATTEMPTS} tries
        </p>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-[22px] p-8 text-center" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #d8b4fe' }}>
            <h3 style={{ fontFamily: "'Bungee', cursive", color: won ? '#69f0ae' : '#ff0098' }} className="text-3xl mb-2">
              {won ? 'You Got It!' : 'Nice Try!'}
            </h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040' }} className="mb-1">
              {won ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}` : `The word was: ${targetWord}`}
            </p>
            <div className="flex gap-3 justify-center mt-5">
              <button onClick={resetGame} className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1" style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#b388ff', boxShadow: '0 4px 0 0 #8a66cc', color: '#fff' }}>
                New Word
              </button>
              <button onClick={onClose} className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1" style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#80e8ff', boxShadow: '0 4px 0 0 #5cb8cc', color: '#1a1040' }}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
