import { useState, useEffect, useCallback } from 'react';
import { X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DifficultySelector } from '@/components/DifficultySelector';

interface Tile {
  id: string;
  type: number;
  x: number;
  y: number;
  matched: boolean;
}

interface Match3GameProps {
  onClose: () => void;
}

const GRID_SIZE = 8;
const TILE_SIZE = 50;

const TILE_COLORS = [
  'from-[#FFB3C6] to-[#FFC2D1]', // Rose
  'from-[#FFDAB9] to-[#FFB347]', // Peach
  'from-[#E6E6FA] to-[#D8BFD8]', // Lavender
  'from-[#C9D5B5] to-[#A8C8A0]', // Sage
  'from-[#FFF4F0] to-[#F5E6E0]', // Cream
  'from-[#E07855] to-[#C86B47]', // Terracotta
  'from-[#B88B8B] to-[#9D7373]', // Mauve
  'from-[#FFD1DC] to-[#FFABC1]', // Light pink
];

const TILE_PATTERNS = ['✦', '❀', '◈', '◇', '◉', '☀', '✿', '◆'];

export const Match3Game = ({ onClose }: Match3GameProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [draggingTile, setDraggingTile] = useState<{x: number, y: number} | null>(null);
  const [dragTarget, setDragTarget] = useState<{x: number, y: number} | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [tileTypes, setTileTypes] = useState(6);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const createTile = useCallback((x: number, y: number, types: number): Tile => ({
    id: `${x}-${y}-${Date.now()}-${Math.random()}`,
    type: Math.floor(Math.random() * types),
    x,
    y,
    matched: false,
  }), []);

  const initializeGrid = useCallback(() => {
    const newGrid: Tile[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        newGrid[y][x] = createTile(x, y, tileTypes);
      }
    }
    setGrid(newGrid);
  }, [createTile, tileTypes]);

  useEffect(() => {
    if (difficulty) {
      initializeGrid();
      if (timeLimit) {
        setTimeRemaining(timeLimit);
      }
    }
  }, [difficulty, initializeGrid, timeLimit]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setGameOver(true);
    }
  }, [timeRemaining, gameOver]);

  const handleDifficultySelect = (diff: 'easy' | 'medium' | 'hard') => {
    if (diff === 'easy') {
      setMoves(40);
      setTileTypes(4);
      setTimeLimit(null);
    } else if (diff === 'medium') {
      setMoves(30);
      setTileTypes(6);
      setTimeLimit(null);
    } else {
      setMoves(25);
      setTileTypes(7);
      setTimeLimit(180); // 3 minutes
    }
    setDifficulty(diff);
  };

  const checkMatches = useCallback((currentGrid: Tile[][]): boolean => {
    let hasMatches = false;
    const matchedPositions = new Set<string>();

    // Check horizontal matches
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE - 2; x++) {
        const type = currentGrid[y][x].type;
        if (type === currentGrid[y][x + 1].type && type === currentGrid[y][x + 2].type) {
          matchedPositions.add(`${x},${y}`);
          matchedPositions.add(`${x + 1},${y}`);
          matchedPositions.add(`${x + 2},${y}`);
          hasMatches = true;
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE - 2; y++) {
        const type = currentGrid[y][x].type;
        if (type === currentGrid[y + 1][x].type && type === currentGrid[y + 2][x].type) {
          matchedPositions.add(`${x},${y}`);
          matchedPositions.add(`${x},${y + 1}`);
          matchedPositions.add(`${x},${y + 2}`);
          hasMatches = true;
        }
      }
    }

    if (hasMatches) {
      const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
      matchedPositions.forEach(pos => {
        const [x, y] = pos.split(',').map(Number);
        newGrid[y][x].matched = true;
      });
      setGrid(newGrid);
      setScore(prev => prev + matchedPositions.size * 10);
      
      setTimeout(() => {
        dropTiles(newGrid);
      }, 300);
    }

    return hasMatches;
  }, []);

  const dropTiles = (currentGrid: Tile[][]) => {
    const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
    
    for (let x = 0; x < GRID_SIZE; x++) {
      let emptySpaces = 0;
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (newGrid[y][x].matched) {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          newGrid[y + emptySpaces][x] = { ...newGrid[y][x], y: y + emptySpaces, matched: false };
          newGrid[y][x] = createTile(x, y, tileTypes);
        }
      }
      
      for (let y = 0; y < emptySpaces; y++) {
        newGrid[y][x] = createTile(x, y, tileTypes);
      }
    }
    
    setGrid(newGrid);
    setTimeout(() => {
      if (!checkMatches(newGrid)) {
        // No more cascading matches
      }
    }, 300);
  };

  const isAdjacent = (x1: number, y1: number, x2: number, y2: number) => {
    return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
  };

  const handleMouseDown = (x: number, y: number) => {
    if (gameOver || moves === 0) return;
    setDraggingTile({ x, y });
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (!draggingTile || gameOver) return;
    if (isAdjacent(draggingTile.x, draggingTile.y, x, y)) {
      setDragTarget({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (!draggingTile || !dragTarget || gameOver) {
      setDraggingTile(null);
      setDragTarget(null);
      return;
    }

    swapTiles(draggingTile, dragTarget);
    setDraggingTile(null);
    setDragTarget(null);
  };

  const swapTiles = (tile1: {x: number, y: number}, tile2: {x: number, y: number}) => {
    const newGrid = grid.map(row => row.map(tile => ({ ...tile })));
    const temp = newGrid[tile1.y][tile1.x];
    newGrid[tile1.y][tile1.x] = { ...newGrid[tile2.y][tile2.x], x: tile1.x, y: tile1.y };
    newGrid[tile2.y][tile2.x] = { ...temp, x: tile2.x, y: tile2.y };
    
    setGrid(newGrid);
    setMoves(prev => prev - 1);

    setTimeout(() => {
      if (!checkMatches(newGrid)) {
        // No match, swap back
        const revertGrid = newGrid.map(row => row.map(tile => ({ ...tile })));
        const tempRevert = revertGrid[tile1.y][tile1.x];
        revertGrid[tile1.y][tile1.x] = { ...revertGrid[tile2.y][tile2.x], x: tile1.x, y: tile1.y };
        revertGrid[tile2.y][tile2.x] = { ...tempRevert, x: tile2.x, y: tile2.y };
        setGrid(revertGrid);
        setMoves(prev => prev + 1); // Refund the move
      }
    }, 500);
  };

  useEffect(() => {
    if (moves === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [moves, gameOver]);

  if (!difficulty) {
    return (
      <DifficultySelector
        onSelect={handleDifficultySelect}
        onCancel={onClose}
        easyDesc="40 moves, 4 tile types"
        mediumDesc="30 moves, 6 tile types"
        hardDesc="25 moves, 7 tiles, 3min timer"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#E07855] via-[#F4A582] to-[#FFDAB9] overflow-hidden">
      {/* Mediterranean Villa Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl">🏛️</div>
        <div className="absolute top-20 right-20 text-5xl">🌺</div>
        <div className="absolute bottom-20 left-20 text-6xl">🏺</div>
        <div className="absolute bottom-10 right-10 text-5xl">🌸</div>
        <div className="absolute top-1/2 left-10 text-4xl">☀️</div>
      </div>

      {/* Terracotta tiles pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #E07855 0px, #E07855 20px, transparent 20px, transparent 40px)`,
        }}
      />

      <div className="relative z-10 glass-effect rounded-3xl p-8 glow-soft max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <div className="glass-effect px-4 py-2 rounded-xl border-2 border-[#E07855]">
              <span className="text-sm font-semibold text-foreground">Score: {score}</span>
            </div>
            <div className="glass-effect px-4 py-2 rounded-xl border-2 border-[#E07855]">
              <span className="text-sm font-semibold text-foreground">Moves: {moves}</span>
            </div>
            {timeRemaining !== null && (
              <div className="glass-effect px-4 py-2 rounded-xl border-2 border-[#E07855]">
                <span className="text-sm font-semibold text-foreground">
                  Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-destructive/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-foreground drop-shadow-lg">
          Mediterranean Villa
        </h2>

        {/* Game grid */}
        <div 
          className="grid gap-2 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
            width: `${GRID_SIZE * (TILE_SIZE + 8)}px` 
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, y) =>
            row.map((tile) => {
              const isDragging = draggingTile?.x === tile.x && draggingTile?.y === tile.y;
              const isTarget = dragTarget?.x === tile.x && dragTarget?.y === tile.y;
              
              return (
                <div
                  key={tile.id}
                  onMouseDown={() => handleMouseDown(tile.x, tile.y)}
                  onMouseEnter={() => handleMouseEnter(tile.x, tile.y)}
                  className={`
                    bg-gradient-to-br ${TILE_COLORS[tile.type]}
                    rounded-lg flex items-center justify-center
                    text-2xl font-bold text-white
                    cursor-grab active:cursor-grabbing
                    transition-all duration-300
                    border-3 border-white shadow-lg
                    ${tile.matched ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                    ${isDragging ? 'scale-110 shadow-2xl ring-4 ring-white z-10' : ''}
                    ${isTarget ? 'scale-105 ring-4 ring-yellow-400' : ''}
                    hover:scale-105 hover:shadow-xl
                  `}
                  style={{
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`,
                    userSelect: 'none',
                  }}
                >
                  <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                    {TILE_PATTERNS[tile.type]}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Drag tiles to swap adjacent ones and match 3 or more!
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 max-w-md w-full mx-4 text-center glow-strong">
            <div className="text-6xl mb-4">☀️</div>
            <h3 className="text-3xl font-bold mb-2 text-foreground">Game Over!</h3>
            <p className="text-xl mb-6 text-muted-foreground">Final Score: {score}</p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setScore(0);
                  setGameOver(false);
                  setDifficulty(null);
                }}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-primary text-foreground"
              >
                <Home className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2"
              >
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
