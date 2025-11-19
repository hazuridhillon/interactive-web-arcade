import { useEffect, useState, useCallback } from "react";
import { X, Flower2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

// Garden decoration positions (static)
const FLOWERS = [
  { x: 3, y: 2, rotation: 15 },
  { x: 16, y: 3, rotation: -20 },
  { x: 2, y: 15, rotation: 30 },
  { x: 18, y: 16, rotation: -15 },
  { x: 8, y: 5, rotation: 45 },
  { x: 14, y: 12, rotation: -30 },
  { x: 5, y: 18, rotation: 20 },
  { x: 17, y: 8, rotation: -10 },
];

const BUTTERFLIES = [
  { x: 200, y: 100, delay: 0 },
  { x: 350, y: 150, delay: 2 },
  { x: 150, y: 350, delay: 4 },
];

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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-background via-accent/30 to-muted/40 flex items-center justify-center">
      {/* Dappled sunlight effect overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-yellow-100/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      </div>

      {/* Floating butterflies */}
      {BUTTERFLIES.map((butterfly, i) => (
        <div
          key={i}
          className="absolute pointer-events-none animate-float"
          style={{
            left: butterfly.x,
            top: butterfly.y,
            animationDelay: `${butterfly.delay}s`,
            animationDuration: "8s",
          }}
        >
          <Sparkles className="w-5 h-5 text-primary/60 animate-glow-pulse" />
        </div>
      ))}

      <div className="relative glass-effect rounded-3xl p-8 glow-soft max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              Secret Garden
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Flower2 className="w-4 h-4 text-accent" />
              Dewdrops collected: {score}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/20 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Garden Board */}
        <div
          className="relative rounded-3xl overflow-hidden glow-soft"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            background: "linear-gradient(135deg, hsl(82 26% 87%), hsl(120 20% 90%), hsl(100 25% 88%))",
          }}
        >
          {/* Garden path border */}
          <div className="absolute inset-0 border-8 border-accent/40 rounded-3xl pointer-events-none" />
          
          {/* Grass texture pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  hsl(120 30% 75%) 0px,
                  transparent 2px,
                  transparent 24px
                ),
                repeating-linear-gradient(
                  0deg,
                  hsl(120 30% 75%) 0px,
                  transparent 2px,
                  transparent 24px
                )`,
              }}
            />
          </div>

          {/* Garden decorations - flowers */}
          {FLOWERS.map((flower, i) => (
            <div
              key={`flower-${i}`}
              className="absolute pointer-events-none animate-float"
              style={{
                left: flower.x * CELL_SIZE + CELL_SIZE / 2 - 8,
                top: flower.y * CELL_SIZE + CELL_SIZE / 2 - 8,
                transform: `rotate(${flower.rotation}deg)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "6s",
              }}
            >
              <Flower2 className="w-4 h-4 text-primary/70" />
            </div>
          ))}

          {/* Small garden stones/bushes */}
          {[4, 10, 15].map((pos, i) => (
            <div
              key={`stone-${i}`}
              className="absolute rounded-full bg-rose-mauve/20 backdrop-blur-sm"
              style={{
                left: pos * CELL_SIZE + 6,
                top: (i * 7 + 3) * CELL_SIZE + 6,
                width: CELL_SIZE - 12,
                height: CELL_SIZE - 12,
              }}
            />
          ))}

          {/* Glowing dewdrop (food) */}
          <div
            className="absolute rounded-full animate-glow-pulse transition-all duration-300"
            style={{
              left: food.x * CELL_SIZE + 4,
              top: food.y * CELL_SIZE + 4,
              width: CELL_SIZE - 8,
              height: CELL_SIZE - 8,
              background: "radial-gradient(circle, hsl(180 100% 85%), hsl(200 100% 75%))",
              boxShadow: "0 0 20px hsl(180 100% 80% / 0.8), inset 0 2px 8px hsl(200 100% 95%)",
            }}
          >
            {/* Dewdrop highlight */}
            <div 
              className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80 blur-sm"
            />
          </div>

          {/* Caterpillar Snake */}
          {snake.map((segment, index) => {
            const opacity = 1 - index * 0.03;
            const isHead = index === 0;
            
            return (
              <div
                key={index}
                className="absolute rounded-full transition-all duration-100"
                style={{
                  left: segment.x * CELL_SIZE + 3,
                  top: segment.y * CELL_SIZE + 3,
                  width: CELL_SIZE - 6,
                  height: CELL_SIZE - 6,
                  background: isHead 
                    ? "linear-gradient(135deg, hsl(82 26% 77%), hsl(120 30% 70%))"
                    : `linear-gradient(135deg, hsl(82 26% ${77 - index * 2}%) ${opacity}, hsl(120 30% ${70 - index * 2}%) ${opacity})`,
                  boxShadow: isHead 
                    ? "0 0 15px hsl(82 26% 77% / 0.6), inset 0 2px 4px hsl(120 30% 85%)"
                    : `0 0 8px hsl(82 26% 77% / ${opacity * 0.4})`,
                }}
              >
                {/* Caterpillar head details */}
                {isHead && (
                  <>
                    {/* Eyes */}
                    <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-foreground/70 rounded-full" />
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-foreground/70 rounded-full" />
                    {/* Rosy cheeks */}
                    <div className="absolute top-2.5 left-0.5 w-2 h-1.5 bg-primary/40 rounded-full blur-sm" />
                    <div className="absolute top-2.5 right-0.5 w-2 h-1.5 bg-primary/40 rounded-full blur-sm" />
                  </>
                )}
                
                {/* Segment highlight */}
                <div 
                  className="absolute top-0.5 left-1/4 w-1/2 h-1/3 rounded-full bg-white/30 blur-sm"
                />
              </div>
            );
          })}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 glass-effect flex flex-col items-center justify-center gap-4 animate-fade-in">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Garden Complete!
                </h3>
                <div className="flex items-center gap-2 justify-center">
                  <Flower2 className="w-5 h-5 text-accent" />
                  <p className="text-lg text-muted-foreground">
                    {score} Dewdrops collected
                  </p>
                </div>
              </div>
              <Button
                onClick={handleRestart}
                className="bg-gradient-to-r from-accent to-primary text-white hover:opacity-90 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Explore Again
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <p className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-2">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 font-medium">Arrow Keys</span>
          <span>or</span>
          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 font-medium">WASD</span>
          <span>to guide the caterpillar</span>
        </p>
      </div>
    </div>
  );
};
