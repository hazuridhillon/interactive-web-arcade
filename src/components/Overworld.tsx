/**
 * Overworld.tsx — The game hub / selection screen.
 * Shows a grid of game cards. Clicking one launches that game full-screen.
 * When a game calls onClose, we return to this hub.
 */

import { useState, useCallback } from "react";
import { SnakeGame } from "./games/SnakeGame";
import { Match3Game } from "./games/Match3Game";
import { WordleGame } from "./games/WordleGame";
import { MemoryGame } from "./games/MemoryGame";
import { GemMatchGame } from "./games/GemMatchGame";
import { BattleGame } from "./games/BattleGame";
import { Sparkles, Grid3X3, BookOpen, Layers, Diamond, Swords, Star } from "lucide-react";

/* ---------- Game definitions ---------- */
// Each entry maps an id to its display info and colors.

interface GameDef {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  shadowColor: string;
  isNew?: boolean;
}

const GAMES: GameDef[] = [
  { id: "snake", name: "Snake", subtitle: "Secret Garden", icon: <Sparkles size={22} strokeWidth={2.5} />, color: "#ff6fcf", shadowColor: "#cc4fa3" },
  { id: "match3", name: "Tile Match", subtitle: "Moroccan Court", icon: <Grid3X3 size={22} strokeWidth={2.5} />, color: "#fff176", shadowColor: "#ccc05e", isNew: true },
  { id: "wordle", name: "Wordle", subtitle: "Library Nook", icon: <BookOpen size={22} strokeWidth={2.5} />, color: "#80e8ff", shadowColor: "#5cb8cc" },
  { id: "memory", name: "Memory", subtitle: "Botanical", icon: <Layers size={22} strokeWidth={2.5} />, color: "#b388ff", shadowColor: "#8a66cc" },
  { id: "gems", name: "Gem Match", subtitle: "Crystal Cave", icon: <Diamond size={22} strokeWidth={2.5} />, color: "#69f0ae", shadowColor: "#4cc08a" },
  { id: "battle", name: "Battle", subtitle: "Enchanted Duel", icon: <Swords size={22} strokeWidth={2.5} />, color: "#ff8a65", shadowColor: "#cc6e50" },
];

/* ---------- Component ---------- */

export const Overworld = () => {
  // Which game is currently open (null = show hub)
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleCloseGame = useCallback(() => setActiveGame(null), []);

  // If a game is active, render it full-screen instead of the hub
  if (activeGame === "snake") return <SnakeGame onClose={handleCloseGame} />;
  if (activeGame === "match3") return <Match3Game onClose={handleCloseGame} />;
  if (activeGame === "wordle") return <WordleGame onClose={handleCloseGame} />;
  if (activeGame === "memory") return <MemoryGame onClose={handleCloseGame} />;
  if (activeGame === "gems") return <GemMatchGame onClose={handleCloseGame} />;
  if (activeGame === "battle") return <BattleGame onClose={handleCloseGame} />;

  // Hub layout
  return (
    <div className="y2k-lavender-bg min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Header — title and decorative star divider */}
      <header className="w-full max-w-3xl mx-auto pt-14 pb-6 px-6 text-center">
        <p
          className="text-[10px] uppercase tracking-[0.45em] mb-4"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#9b7abf" }}
        >
          Select your world
        </p>
        <h1 style={{ fontFamily: "'Bungee', cursive", lineHeight: 1.1 }}>
          <span className="text-5xl md:text-7xl" style={{ color: "#1a1040" }}>GAME</span>
          {" "}
          <span className="text-5xl md:text-7xl" style={{ color: "#ff0098" }}>ZONE</span>
        </h1>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="h-[2px] w-10 bg-[#ff0098]/30" />
          <Star size={14} fill="#ff0098" color="#ff0098" />
          <div className="h-[2px] w-10 bg-[#ff0098]/30" />
        </div>
      </header>

      {/* Game grid — 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-6 max-w-3xl w-full">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="y2k-vivid-card group relative flex flex-col items-start p-5 text-left"
            style={{
              backgroundColor: game.color,
              boxShadow: `0 6px 0 0 ${game.shadowColor}`,
              borderRadius: "22px",
            }}
          >
            {/* Frosted icon box */}
            <div className="mb-3 p-2 rounded-xl bg-white/40 backdrop-blur-sm">
              <span style={{ color: "#1a1040" }}>{game.icon}</span>
            </div>

            {/* Game name and subtitle */}
            <h3
              className="text-lg md:text-xl leading-tight mb-1"
              style={{ fontFamily: "'Bungee', cursive", color: "#1a1040" }}
            >
              {game.name}
            </h3>
            <p
              className="text-[9px] uppercase tracking-[0.25em]"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#1a1040", opacity: 0.5 }}
            >
              {game.subtitle}
            </p>

            {/* "NEW" badge — only shown for games marked isNew */}
            {game.isNew && (
              <span className="y2k-new-badge">
                NEW
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto pb-6 text-center">
        <p
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Poppins', sans-serif", color: "#9b7abf" }}
        >
          made by hazuri
        </p>
      </footer>
    </div>
  );
};
