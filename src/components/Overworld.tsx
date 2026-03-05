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
  color: string;
  borderColor: string;
  hasNewBadge?: boolean;
}

const GAMES: GameDef[] = [
  { id: "snake", name: "SNAKE", color: "#00ff00", borderColor: "#00cc00" },
  { id: "match3", name: "TILE MATCH", color: "#ff00ff", borderColor: "#cc00cc", hasNewBadge: true },
  { id: "wordle", name: "WORDLE", color: "#00bfff", borderColor: "#0099cc" },
  { id: "memory", name: "MEMORY", color: "#ff6600", borderColor: "#cc5200" },
  { id: "gems", name: "GEM MATCH", color: "#ff0000", borderColor: "#cc0000" },
  { id: "battle", name: "BATTLE", color: "#ffff00", borderColor: "#cccc00" },
];

// Simple pixel mascot as a grid of colored cells
const MASCOT_PIXELS = [
  [0,0,1,1,1,0,0,0],
  [0,1,2,2,2,1,0,0],
  [0,1,3,2,3,1,0,0],
  [0,1,2,2,2,1,0,0],
  [1,1,1,1,1,1,1,0],
  [0,0,1,4,1,0,0,0],
  [0,1,1,1,1,1,0,0],
  [0,1,0,0,0,1,0,0],
];
const PIXEL_COLORS: Record<number, string> = {
  0: "transparent",
  1: "#00bfff",
  2: "#ffe0b2",
  3: "#222",
  4: "#ff0000",
};

const PixelMascot = () => (
  <div className="pixel-bounce inline-block" style={{ imageRendering: "pixelated" }}>
    <div className="grid" style={{ gridTemplateColumns: "repeat(8, 6px)", gap: 0 }}>
      {MASCOT_PIXELS.flat().map((c, i) => (
        <div key={i} style={{ width: 6, height: 6, background: PIXEL_COLORS[c] }} />
      ))}
    </div>
  </div>
);

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
    <div className="retro-bg min-h-screen p-4 flex flex-col items-center" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      {/* Decorative stars */}
      <span className="retro-star" style={{ top: 30, left: 40 }}>✦</span>
      <span className="retro-star" style={{ top: 80, right: 60 }}>⚡</span>
      <span className="retro-star" style={{ bottom: 120, left: 100 }}>★</span>
      <span className="retro-star" style={{ top: 200, right: 120 }}>✦</span>

      {/* Title area */}
      <div className="flex items-center gap-4 mt-8 mb-2">
        <PixelMascot />
        <h1 className="neon-glow text-3xl md:text-5xl tracking-wider" style={{ color: "#00ffff" }}>
          GAME ZONE
        </h1>
        <PixelMascot />
      </div>

      {/* Marquee */}
      <div className="w-full max-w-2xl overflow-hidden my-3" style={{ border: "1px solid #00ffff" }}>
        <div className="retro-marquee whitespace-nowrap text-xs py-1" style={{ color: "#ffff00" }}>
          ★ Welcome to the ULTIMATE arcade! ★ Play FREE games! ★ Challenge your friends! ★ New games added weekly! ★ You are visitor #00048271 ★
        </div>
      </div>

      {/* Game grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 my-4 max-w-3xl w-full"
        style={{ border: "2px solid #00ffff" }}
      >
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className="retro-btn relative text-center py-6 px-4 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none"
            style={{
              backgroundColor: game.color,
              borderColor: game.borderColor,
              boxShadow: `4px 4px 0px #000`,
              borderWidth: 4,
              borderStyle: "outset",
            }}
          >
            <span className="text-xs md:text-sm font-bold drop-shadow-none" style={{ color: "#000", fontFamily: "'Press Start 2P', cursive" }}>
              {game.name}
            </span>
            {game.hasNewBadge && (
              <span className="blink-badge absolute -top-2 -right-2 text-[8px] px-1 py-0.5" style={{ background: "#ff0000", color: "#fff" }}>
                NEW!
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Visitor counter */}
      <div className="my-4 text-[10px]" style={{ color: "#888" }}>
        <span style={{ border: "1px solid #444", padding: "2px 8px", background: "#111" }}>
          You are visitor #00048271
        </span>
      </div>

      {/* Footer */}
      <footer className="mt-auto pb-4 text-center text-[8px]" style={{ color: "#666" }}>
        © 2003 GAME ZONE | Best viewed in 800×600 | Internet Explorer 6
      </footer>
    </div>
  );
};
