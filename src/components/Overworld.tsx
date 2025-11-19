import { useEffect, useState, useCallback } from "react";
import { Character } from "./Character";
import { GameStation } from "./GameStation";
import { FloatingParticles } from "./FloatingParticles";
import { SnakeGame } from "./games/SnakeGame";
import { Match3Game } from "./games/Match3Game";
import { WordleGame } from "./games/WordleGame";
import { MemoryGame } from "./games/MemoryGame";
import { GemMatchGame } from "./games/GemMatchGame";
import { BattleGame } from "./games/BattleGame";

interface Position {
  x: number;
  y: number;
}

type StationColor = "primary" | "secondary" | "accent" | "muted";

interface Station {
  id: string;
  name: string;
  position: Position;
  color: StationColor;
}

const STATIONS: Station[] = [
  { id: "snake", name: "Snake", position: { x: 200, y: 150 }, color: "primary" },
  { id: "match3", name: "Tile Match-3", position: { x: 500, y: 150 }, color: "secondary" },
  { id: "wordle", name: "Wordle", position: { x: 350, y: 300 }, color: "accent" },
  { id: "memory", name: "Memory Cards", position: { x: 200, y: 450 }, color: "muted" },
  { id: "gems", name: "Gem Match", position: { x: 500, y: 450 }, color: "primary" },
  { id: "battle", name: "Battle Game", position: { x: 650, y: 300 }, color: "secondary" },
];

const MOVE_SPEED = 5;
const INTERACTION_DISTANCE = 80;

export const Overworld = () => {
  const [characterPos, setCharacterPos] = useState<Position>({ x: 100, y: 100 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [nearStation, setNearStation] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setCharacterPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (keys.has("arrowup") || keys.has("w")) newY -= MOVE_SPEED;
        if (keys.has("arrowdown") || keys.has("s")) newY += MOVE_SPEED;
        if (keys.has("arrowleft") || keys.has("a")) newX -= MOVE_SPEED;
        if (keys.has("arrowright") || keys.has("d")) newX += MOVE_SPEED;

        // Keep character in bounds
        newX = Math.max(40, Math.min(760, newX));
        newY = Math.max(40, Math.min(560, newY));

        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [keys]);

  useEffect(() => {
    const checkProximity = () => {
      for (const station of STATIONS) {
        const distance = Math.sqrt(
          Math.pow(characterPos.x - station.position.x, 2) +
            Math.pow(characterPos.y - station.position.y, 2)
        );

        if (distance < INTERACTION_DISTANCE) {
          setNearStation(station.id);
          return;
        }
      }
      setNearStation(null);
    };

    checkProximity();
  }, [characterPos]);

  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => {
      if (e.key === " " && nearStation) {
        e.preventDefault();
        setActiveGame(nearStation);
      }
    };

    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, [nearStation]);

  const handleCloseGame = useCallback(() => {
    setActiveGame(null);
  }, []);

  if (activeGame === "snake") {
    return <SnakeGame onClose={handleCloseGame} />;
  }
  if (activeGame === "match3") {
    return <Match3Game onClose={handleCloseGame} />;
  }
  if (activeGame === "wordle") {
    return <WordleGame onClose={handleCloseGame} />;
  }
  if (activeGame === "memory") {
    return <MemoryGame onClose={handleCloseGame} />;
  }
  if (activeGame === "gems") {
    return <GemMatchGame onClose={handleCloseGame} />;
  }
  if (activeGame === "battle") {
    return <BattleGame onClose={handleCloseGame} />;
  }

  const currentStation = STATIONS.find((s) => s.id === nearStation);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <FloatingParticles />
      
      {/* Animated background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      {/* Game container */}
      <div className="relative w-[800px] h-[600px] mx-auto mt-12 glass-effect rounded-3xl glow-soft overflow-hidden">
        {STATIONS.map((station) => (
          <GameStation
            key={station.id}
            name={station.name}
            position={station.position}
            color={station.color}
            isNear={nearStation === station.id}
          />
        ))}
        
        <Character position={characterPos} isMoving={keys.size > 0} />
        
        {currentStation && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-effect px-6 py-3 rounded-full glow-soft animate-bounce-subtle">
            <p className="text-sm font-medium text-foreground">
              Press <span className="font-bold text-primary">SPACE</span> to play {currentStation.name}
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 glass-effect px-6 py-3 rounded-full glow-soft">
        <p className="text-sm font-medium text-foreground">
          Use <span className="font-bold text-primary">Arrow Keys</span> or <span className="font-bold text-primary">WASD</span> to move
        </p>
      </div>
    </div>
  );
};
