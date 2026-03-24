/**
 * SnakeGame.tsx — Classic snake game themed as "Secret Garden".
 * Player controls a snake with arrow keys or WASD to collect pink dewdrops.
 * Hitting a wall or yourself ends the game.
 */

import { useEffect, useState, useCallback } from "react";
import { Flower2, Sparkles } from "lucide-react";
import { GameHeader } from "@/components/GameHeader";
import { GameOverModal } from "@/components/GameOverModal";

interface Position { x: number; y: number; }

const GRID_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

const FLOWERS = [
  { x: 3, y: 2, rotation: 15 }, { x: 16, y: 3, rotation: -20 },
  { x: 2, y: 15, rotation: 30 }, { x: 18, y: 16, rotation: -15 },
  { x: 8, y: 5, rotation: 45 }, { x: 14, y: 12, rotation: -30 },
];

export const SnakeGame = ({ onClose }: { onClose: () => void }) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case "ArrowUp": case "w": if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case "ArrowDown": case "s": if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case "ArrowLeft": case "a": if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case "ArrowRight": case "d": if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y };
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) { setGameOver(true); return prevSnake; }
        if (prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) { setGameOver(true); return prevSnake; }
        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) { setScore((p) => p + 1); generateFood(); } else { newSnake.pop(); }
        return newSnake;
      });
    }, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, generateFood]);

  const handleRestart = () => { setSnake(INITIAL_SNAKE); setDirection(INITIAL_DIRECTION); setGameOver(false); setScore(0); generateFood(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#e8f5e9' }}>
      {/* Decorative flowers */}
      {FLOWERS.map((f, i) => (
        <div key={i} className="absolute pointer-events-none opacity-20" style={{ left: `${f.x * 5}%`, top: `${f.y * 5}%`, transform: `rotate(${f.rotation}deg)` }}>
          <Flower2 className="w-8 h-8" style={{ color: '#ff6fcf' }} />
        </div>
      ))}

      <div className="relative rounded-[22px] p-6" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #4cc08a' }}>
        <GameHeader
          title="Secret Garden"
          badges={[{ label: <><Sparkles className="w-3 h-3 inline" /> Dewdrops: {score}</>, bg: 'transparent', color: '#9b7abf' }]}
          onClose={onClose}
        />

        {/* Board */}
        <div
          className="relative rounded-[16px] overflow-hidden"
          style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE, backgroundColor: '#c8e6c9', border: '3px solid #69f0ae' }}
        >
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: `repeating-linear-gradient(90deg, #2e7d32 0px, transparent 1px, transparent ${CELL_SIZE}px), repeating-linear-gradient(0deg, #2e7d32 0px, transparent 1px, transparent ${CELL_SIZE}px)`,
          }} />

          {/* Food */}
          <div className="absolute rounded-full" style={{
            left: food.x * CELL_SIZE + 4, top: food.y * CELL_SIZE + 4,
            width: CELL_SIZE - 8, height: CELL_SIZE - 8,
            backgroundColor: '#ff6fcf', boxShadow: '0 0 10px #ff6fcf80',
          }} />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div key={index} className="absolute rounded-full transition-all duration-75" style={{
              left: segment.x * CELL_SIZE + 2, top: segment.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4, height: CELL_SIZE - 4,
              backgroundColor: index === 0 ? '#69f0ae' : '#a5d6a7', border: '2px solid #43a047',
            }}>
              {index === 0 && (
                <>
                  <div className="absolute rounded-full bg-[#1a1040]" style={{ width: 4, height: 4, top: 4, left: 4 }} />
                  <div className="absolute rounded-full bg-[#1a1040]" style={{ width: 4, height: 4, top: 4, right: 4 }} />
                </>
              )}
            </div>
          ))}

          {/* Game Over inline */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <h3 style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }} className="text-2xl">Game Over!</h3>
              <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040' }}>{score} dewdrops collected</p>
              <button onClick={handleRestart} className="y2k-btn" style={{ backgroundColor: '#69f0ae', boxShadow: '0 4px 0 0 #4cc08a', color: '#1a1040' }}>
                Play Again
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-4 text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>
          Arrow Keys or WASD to move
        </p>
      </div>
    </div>
  );
};
