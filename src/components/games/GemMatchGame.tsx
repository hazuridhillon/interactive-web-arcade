import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GemTile {
  id: string;
  type: number;
  x: number;
  y: number;
  matched: boolean;
}

interface GemMatchGameProps {
  onClose: () => void;
}

const GEM_TYPES = 6;
const GRID_SIZE = 8;
const TILE_SIZE = 50;

const GEM_GRADIENTS = [
  { from: '#FFB3C6', to: '#FFC2D1', border: '#FF8FAB', name: 'Rose Quartz' },
  { from: '#E6E6FA', to: '#D8BFD8', border: '#C4A0E0', name: 'Amethyst' },
  { from: '#FFF4F0', to: '#FFFFFF', border: '#D3D3D3', name: 'Moonstone' },
  { from: '#C9D5B5', to: '#A8C8A0', border: '#7A9B6E', name: 'Jade' },
  { from: '#FFDAB9', to: '#FFB347', border: '#D2691E', name: 'Topaz' },
  { from: '#E0BBE4', to: '#D4A5D8', border: '#B47EB3', name: 'Opal' },
];

export const GemMatchGame = ({ onClose }: GemMatchGameProps) => {
  const [grid, setGrid] = useState<GemTile[][]>([]);
  const [selectedTile, setSelectedTile] = useState<{x: number, y: number} | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const createTile = useCallback((x: number, y: number): GemTile => ({
    id: `${x}-${y}-${Date.now()}-${Math.random()}`,
    type: Math.floor(Math.random() * GEM_TYPES),
    x,
    y,
    matched: false,
  }), []);

  const initializeGrid = useCallback(() => {
    const newGrid: GemTile[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        newGrid[y][x] = createTile(x, y);
      }
    }
    setGrid(newGrid);
    setCombo(0);
  }, [createTile]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const checkMatches = useCallback((currentGrid: GemTile[][]): boolean => {
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
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(prev => prev + matchedPositions.size * 10 * newCombo);
      
      setTimeout(() => {
        dropTiles(newGrid);
      }, 400);
    } else {
      setCombo(0);
    }

    return hasMatches;
  }, [combo]);

  const dropTiles = (currentGrid: GemTile[][]) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#4A3B5C] via-[#6B5B7B] to-[#8B7BA8] overflow-hidden">
      {/* Cave crystals background */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-glow-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              background: `radial-gradient(circle, ${GEM_GRADIENTS[Math.floor(Math.random() * GEM_TYPES)].from}, transparent)`,
              opacity: 0.3,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Ethereal glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#E6E6FA]/10 via-transparent to-transparent animate-pulse" />

      {/* Game Container */}
      <div className="relative glass-effect rounded-3xl p-8 max-w-2xl w-full mx-4 border-2 border-white/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Gem className="w-8 h-8 text-[#E6E6FA]" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Crystal Cave</h2>
            <div className="flex gap-2">
              <div className="glass-effect px-4 py-2 rounded-full border-2 border-white/40">
                <span className="font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {score}
                </span>
              </div>
              <div className="glass-effect px-4 py-2 rounded-full border-2 border-white/40">
                <span className="font-bold text-white">Moves: {moves}</span>
              </div>
              {combo > 1 && (
                <div className="glass-effect px-4 py-2 rounded-full border-2 border-[#FFD700]/60 bg-[#FFD700]/20 animate-bounce-subtle">
                  <span className="font-bold text-[#FFD700]">Combo x{combo}!</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/20 hover:bg-white/30 border-2 border-white"
          >
            <X className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Game Board */}
        <div className="relative bg-gradient-to-br from-[#3A2B4C]/80 to-[#2A1B3C]/80 rounded-2xl p-4 border-3 border-white/30 shadow-2xl">
          <div 
            className="grid gap-2" 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
            }}
          >
            {grid.map((row, y) =>
              row.map((tile, x) => {
                const gem = GEM_GRADIENTS[tile.type];
                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(x, y)}
                    disabled={tile.matched}
                    className={`
                      relative rounded-xl
                      transition-all duration-300
                      hover:scale-110 hover:z-10
                      ${selectedTile?.x === x && selectedTile?.y === y ? 'ring-4 ring-white scale-110 z-10' : ''}
                      ${tile.matched ? 'opacity-0 scale-0' : 'opacity-100'}
                    `}
                    style={{ 
                      width: TILE_SIZE, 
                      height: TILE_SIZE,
                      background: `linear-gradient(135deg, ${gem.from}, ${gem.to})`,
                      border: `3px solid ${gem.border}`,
                      boxShadow: `0 0 15px ${gem.from}40, inset 0 2px 8px rgba(255,255,255,0.3)`,
                    }}
                  >
                    <div className="absolute inset-2 rounded-lg bg-white/20" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-white font-medium drop-shadow">
          Match 3 or more crystals to collect them
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 text-center border-3 border-white/60 max-w-md">
            <Gem className="w-16 h-16 mx-auto mb-4 text-[#E6E6FA]" />
            <h3 className="text-4xl font-bold mb-4 text-white">Cave Explored!</h3>
            <p className="text-2xl mb-6 text-white">Final Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setScore(0);
                  setMoves(20);
                  setGameOver(false);
                  initializeGrid();
                }}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
              >
                Explore Again
              </Button>
              <Button onClick={onClose} variant="outline" className="border-2 border-white text-white hover:bg-white/20">
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
