import { useState, useCallback } from "react";
import { SnakeGame } from "./games/SnakeGame";
import { Match3Game } from "./games/Match3GameEnhanced";
import { WordleGame } from "./games/WordleGame";
import { MemoryGame } from "./games/MemoryGame";
import { GemMatchGame } from "./games/GemMatchGame";
import { BattleGame } from "./games/BattleGameEnhanced";
import { Sparkles, Grid3X3, BookOpen, Layers, Diamond, Swords } from "lucide-react";

interface GameDef {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
}

const GAMES: GameDef[] = [
  { id: "snake", name: "Snake", subtitle: "Secret Garden", icon: <Sparkles size={28} />, accentColor: "#4ade80" },
  { id: "match3", name: "Tile Match", subtitle: "Moroccan Court", icon: <Grid3X3 size={28} />, accentColor: "#c084fc" },
  { id: "wordle", name: "Wordle", subtitle: "Library Nook", icon: <BookOpen size={28} />, accentColor: "#fbbf24" },
  { id: "memory", name: "Memory", subtitle: "Botanical", icon: <Layers size={28} />, accentColor: "#f472b6" },
  { id: "gems", name: "Gem Match", subtitle: "Crystal Cave", icon: <Diamond size={28} />, accentColor: "#22d3ee" },
  { id: "battle", name: "Battle", subtitle: "Enchanted Duel", icon: <Swords size={28} />, accentColor: "#fb923c" },
];

export const Overworld = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleCloseGame = useCallback(() => setActiveGame(null), []);

  if (activeGame === "snake") return <SnakeGame onClose={handleCloseGame} />;
  if (activeGame === "match3") return <Match3Game onClose={handleCloseGame} />;
  if (activeGame === "wordle") return <WordleGame onClose={handleCloseGame} />;
  if (activeGame === "memory") return <MemoryGame onClose={handleCloseGame} />;
  if (activeGame === "gems") return <GemMatchGame onClose={handleCloseGame} />;
  if (activeGame === "battle") return <BattleGame onClose={handleCloseGame} />;

  return (
    <div className="y2k-bg min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto pt-16 pb-8 px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-pink-400/60 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Select your world
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
          GAME <span className="y2k-gradient-text">ZONE</span>
        </h1>
        <div className="mt-4 mx-auto w-16 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
      </header>

      {/* Game grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 max-w-3xl w-full">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="y2k-game-card group relative flex flex-col items-start p-5 text-left cursor-pointer transition-all duration-300"
          >
            {/* Icon */}
            <div
              className="mb-4 p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                color: game.accentColor,
                background: `${game.accentColor}15`,
                boxShadow: `0 0 0px ${game.accentColor}00`,
              }}
            >
              {game.icon}
            </div>

            {/* Text */}
            <h3 className="text-base font-semibold text-white/90 tracking-wide mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {game.name}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {game.subtitle}
            </p>

            {/* Hover arrow */}
            <span className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/40 transition-all duration-300 text-lg">
              →
            </span>

            {/* NEW tag */}
            {game.id === "match3" && (
              <span
                className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: game.accentColor,
                  color: "#000",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                New
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto pb-6 text-center">
        <p className="text-[10px] text-white/20 tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
          made with love
        </p>
      </footer>
    </div>
  );
};
