import { useState, useCallback } from "react";
import { SnakeGame } from "./games/SnakeGame";
import { Match3Game } from "./games/Match3GameEnhanced";
import { WordleGame } from "./games/WordleGame";
import { MemoryGame } from "./games/MemoryGame";
import { GemMatchGame } from "./games/GemMatchGame";
import { BattleGame } from "./games/BattleGameEnhanced";

interface GameDef {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
}

const GAMES: GameDef[] = [
  { id: "snake", name: "Snake", emoji: "🐍", gradient: "from-pink-500 to-fuchsia-500" },
  { id: "match3", name: "Tile Match", emoji: "✨", gradient: "from-fuchsia-500 to-purple-500" },
  { id: "wordle", name: "Wordle", emoji: "📖", gradient: "from-violet-500 to-indigo-400" },
  { id: "memory", name: "Memory", emoji: "🦋", gradient: "from-rose-400 to-pink-500" },
  { id: "gems", name: "Gem Match", emoji: "💎", gradient: "from-cyan-400 to-fuchsia-500" },
  { id: "battle", name: "Battle", emoji: "⚔️", gradient: "from-amber-400 to-pink-500" },
];

const StarDecoration = ({ className = "" }: { className?: string }) => (
  <span className={`y2k-sparkle absolute pointer-events-none text-lg ${className}`}>✦</span>
);

export const Overworld = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const handleCloseGame = useCallback(() => setActiveGame(null), []);

  if (activeGame === "snake") return <SnakeGame onClose={handleCloseGame} />;
  if (activeGame === "match3") return <Match3Game onClose={handleCloseGame} />;
  if (activeGame === "wordle") return <WordleGame onClose={handleCloseGame} />;
  if (activeGame === "memory") return <MemoryGame onClose={handleCloseGame} />;
  if (activeGame === "gems") return <GemMatchGame onClose={handleCloseGame} />;
  if (activeGame === "battle") return <BattleGame onClose={handleCloseGame} />;

  return (
    <div className="y2k-bg min-h-screen flex flex-col items-center overflow-hidden relative">
      {/* Floating sparkles */}
      <StarDecoration className="top-[5%] left-[10%] text-pink-300" />
      <StarDecoration className="top-[12%] right-[15%] text-fuchsia-300 text-2xl" />
      <StarDecoration className="top-[30%] left-[5%] text-yellow-300" />
      <StarDecoration className="bottom-[20%] right-[8%] text-pink-200 text-xl" />
      <StarDecoration className="top-[50%] left-[3%] text-cyan-300" />
      <StarDecoration className="bottom-[40%] right-[4%] text-fuchsia-200 text-2xl" />
      <StarDecoration className="top-[70%] left-[12%] text-yellow-200" />
      <StarDecoration className="top-[8%] left-[50%] text-pink-400" />

      {/* Floating hearts */}
      <span className="y2k-float absolute top-[15%] right-[20%] text-3xl pointer-events-none opacity-40">💖</span>
      <span className="y2k-float absolute bottom-[25%] left-[8%] text-2xl pointer-events-none opacity-30" style={{ animationDelay: "1s" }}>💗</span>
      <span className="y2k-float absolute top-[60%] right-[12%] text-xl pointer-events-none opacity-30" style={{ animationDelay: "2s" }}>💕</span>

      {/* Chrome header bar */}
      <div className="w-full y2k-chrome-bar py-3 px-6 flex items-center justify-center gap-3 z-10">
        <span className="text-2xl">⭐</span>
        <h1 className="y2k-title text-3xl md:text-5xl tracking-wide">
          GAME ZONE
        </h1>
        <span className="text-2xl">⭐</span>
      </div>

      {/* Subtitle banner */}
      <div className="y2k-subtitle-banner mt-4 mb-6 px-8 py-2">
        <p className="text-xs md:text-sm tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
          ✨ Pick a game & play, babe ✨
        </p>
      </div>

      {/* Game grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-6 max-w-3xl w-full mx-4">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            className={`y2k-card group relative flex flex-col items-center justify-center gap-3 py-8 px-4 cursor-pointer transition-all duration-200 ${
              hoveredGame === game.id ? "y2k-card-hover" : ""
            }`}
          >
            {/* Gloss overlay */}
            <div className="absolute inset-0 y2k-gloss rounded-2xl pointer-events-none" />

            {/* Emoji icon */}
            <span className="text-4xl md:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-200">
              {game.emoji}
            </span>

            {/* Game name */}
            <span
              className="text-sm md:text-base font-bold tracking-wide text-white drop-shadow-md"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {game.name}
            </span>

            {/* Sparkle on hover */}
            {hoveredGame === game.id && (
              <span className="absolute -top-2 -right-2 text-yellow-300 text-xl y2k-sparkle">✦</span>
            )}

            {/* NEW badge on one game */}
            {game.id === "match3" && (
              <span className="absolute -top-2 -left-2 bg-yellow-400 text-pink-700 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md y2k-pulse" style={{ fontFamily: "'Poppins', sans-serif" }}>
                NEW!
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom decorative strip */}
      <div className="mt-auto w-full y2k-bottom-strip py-3 flex items-center justify-center gap-2">
        <span className="text-pink-300 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
          💖 made with love 💖
        </span>
      </div>
    </div>
  );
};
