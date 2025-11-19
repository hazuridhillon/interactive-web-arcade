import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const TILE_TYPES = 6;
const GRID_SIZE = 8;
const TILE_SIZE = 50;

const TILE_COLORS = [
  'from-[#FFB3C6] to-[#FFC2D1]', // Rose
  'from-[#FFDAB9] to-[#FFB347]', // Peach
  'from-[#E6E6FA] to-[#D8BFD8]', // Lavender
  'from-[#C9D5B5] to-[#A8C8A0]', // Sage
  'from-[#FFF4F0] to-[#F5E6E0]', // Cream
  'from-[#E07855] to-[#C86B47]', // Terracotta
];

const TILE_PATTERNS = ['✦', '❀', '◈', '◇', '◉', '☀'];

export const Match3Game = ({ onClose }: Match3GameProps) => {
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [selectedTile, setSelectedTile] = useState<{x: number, y: number} | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const createTile = useCallback((x: number, y: number): Tile => ({
    id: `${x}-${y}-${Date.now()}-${Math.random()}`,
    type: Math.floor(Math.random() * TILE_TYPES),
    x,
    y,
    matched: false,
  }), []);

  const initializeGrid = useCallback(() => {
    const newGrid: Tile[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        newGrid[y][x] = createTile(x, y);
      }
    }
    setGrid(newGrid);
  }, [createTile]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

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
          newGrid[y + emptySpaces][x] = { ...newGrid[y][x], y: y + emptySpaces };
          newGrid[y][x] = createTile(x, y);
        }
      }
      
      for (let y = 0; y < emptySpaces; y++) {
        newGrid[y][x] = createTile(x, y);
      }
    }
    
    setGrid(newGrid);
    setTimeout(() => checkMatches(newGrid), 300);
  };

  const handleTileClick = (x: number, y: number) => {
    if (gameOver) return;

    if (!selectedTile) {
      setSelectedTile({ x, y });
    } else {
      const dx = Math.abs(selectedTile.x - x);
      const dy = Math.abs(selectedTile.y - y);
      
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        swapTiles(selectedTile.x, selectedTile.y, x, y);
        setMoves(prev => {
          const newMoves = prev - 1;
          if (newMoves <= 0) {
            setGameOver(true);
          }
          return newMoves;
        });
      }
      setSelectedTile(null);
    }
  };

  const swapTiles = (x1: number, y1: number, x2: number, y2: number) => {
    const newGrid = grid.map(row => row.map(tile => ({ ...tile })));
    const temp = newGrid[y1][x1];
    newGrid[y1][x1] = { ...newGrid[y2][x2], x: x1, y: y1 };
    newGrid[y2][x2] = { ...temp, x: x2, y: y2 };
    setGrid(newGrid);
    
    setTimeout(() => {
      const hasMatches = checkMatches(newGrid);
      if (!hasMatches) {
        const revertGrid = newGrid.map(row => row.map(tile => ({ ...tile })));
        const temp = revertGrid[y1][x1];
        revertGrid[y1][x1] = { ...revertGrid[y2][x2], x: x1, y: y1 };
        revertGrid[y2][x2] = { ...temp, x: x2, y: y2 };
        setGrid(revertGrid);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#E07855] via-[#F4A582] to-[#FFDAB9] overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-48 rounded-t-full bg-gradient-to-b from-[#8B4513] to-[#A0522D]" />
        <div className="absolute top-20 right-20 w-40 h-56 rounded-t-full bg-gradient-to-b from-[#8B4513] to-[#A0522D]" />
        <div className="absolute bottom-10 left-1/4 w-24 h-32 rounded-full bg-gradient-to-br from-[#D2691E] to-[#8B4513]" />
        <div className="absolute top-1/3 right-10 text-6xl">🌺</div>
        <div className="absolute bottom-1/4 left-20 text-5xl">🏺</div>
      </div>

      {/* Sunlight overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FFD700] via-transparent to-transparent opacity-10" />

      {/* Game Container */}
      <div className="relative glass-effect rounded-3xl p-8 max-w-2xl w-full mx-4 border-2 border-white/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-[#8B4513] drop-shadow-lg">Mediterranean Villa</h2>
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-full border-2 border-white/40">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
              <span className="font-bold text-[#8B4513]">{score}</span>
            </div>
            <div className="glass-effect px-4 py-2 rounded-full border-2 border-white/40">
              <span className="font-bold text-[#8B4513]">Moves: {moves}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/50 hover:bg-white/70 border-2 border-white"
          >
            <X className="w-6 h-6 text-[#8B4513]" />
          </Button>
        </div>

        {/* Game Board */}
        <div className="relative bg-gradient-to-br from-[#DEB887] to-[#D2B48C] rounded-2xl p-4 border-4 border-[#8B4513] shadow-2xl">
          <div 
            className="grid gap-1" 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
            }}
          >
            {grid.map((row, y) =>
              row.map((tile, x) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(x, y)}
                  disabled={tile.matched}
                  className={`
                    relative rounded-lg bg-gradient-to-br ${TILE_COLORS[tile.type]}
                    border-3 border-white shadow-lg
                    transition-all duration-200
                    hover:scale-105 hover:shadow-xl
                    ${selectedTile?.x === x && selectedTile?.y === y ? 'ring-4 ring-[#FFD700] scale-110' : ''}
                    ${tile.matched ? 'opacity-0 scale-0' : 'opacity-100'}
                  `}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                >
                  <span className="text-2xl drop-shadow-md">{TILE_PATTERNS[tile.type]}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-[#8B4513] font-medium drop-shadow">
          Match 3 or more tiles by swapping adjacent pieces
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 text-center border-3 border-white/60 max-w-md">
            <h3 className="text-4xl font-bold mb-4 text-[#8B4513]">Game Over!</h3>
            <p className="text-2xl mb-6 text-[#8B4513]">Final Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setScore(0);
                  setMoves(30);
                  setGameOver(false);
                  initializeGrid();
                }}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
              >
                Play Again
              </Button>
              <Button onClick={onClose} variant="outline" className="border-2">
                <Home className="w-4 h-4 mr-2" />
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
