import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export const SnakeGame = ({ onClose }: { onClose: () => void }) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => prev + 1);
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, generateFood]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    generateFood();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-background via-primary/10 to-secondary/20 flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative glass-effect rounded-3xl p-8 glow-soft">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Snake</h2>
            <p className="text-sm text-muted-foreground">Score: {score}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Game Board */}
        <div
          className="relative bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden glow-soft"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
        >
          {/* Food */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-secondary via-primary to-accent animate-glow-pulse"
            style={{
              left: food.x * CELL_SIZE + 2,
              top: food.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              boxShadow: "0 0 20px hsl(var(--primary) / 0.6)",
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute rounded-lg transition-all duration-100"
              style={{
                left: segment.x * CELL_SIZE + 2,
                top: segment.y * CELL_SIZE + 2,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                background: index === 0
                  ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))"
                  : `linear-gradient(135deg, hsl(var(--primary) / ${1 - index * 0.05}), hsl(var(--secondary) / ${1 - index * 0.05}))`,
                boxShadow: index === 0 ? "0 0 15px hsl(var(--primary) / 0.5)" : "none",
              }}
            />
          ))}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 glass-effect flex flex-col items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-foreground">Game Over!</h3>
              <p className="text-lg text-muted-foreground">Final Score: {score}</p>
              <Button
                onClick={handleRestart}
                className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 rounded-full px-6"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Use Arrow Keys or WASD to move
        </p>
      </div>
    </div>
  );
};
