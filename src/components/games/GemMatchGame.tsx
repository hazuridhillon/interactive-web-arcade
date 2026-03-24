import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Diamond } from 'lucide-react';

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

const GEM_STYLES = [
  { bg: '#ff6fcf', shadow: '#cc4fa3', symbol: '◆' },
  { bg: '#b388ff', shadow: '#8a66cc', symbol: '●' },
  { bg: '#80e8ff', shadow: '#5cb8cc', symbol: '★' },
  { bg: '#69f0ae', shadow: '#4cc08a', symbol: '▲' },
  { bg: '#fff176', shadow: '#ccc05e', symbol: '■' },
  { bg: '#ff8a65', shadow: '#cc6e50', symbol: '♦' },
];

export const GemMatchGame = ({ onClose }: GemMatchGameProps) => {
  const [grid, setGrid] = useState<GemTile[][]>([]);
  const [selectedTile, setSelectedTile] = useState<{x: number, y: number} | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(25);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const createTile = useCallback((x: number, y: number): GemTile => ({
    id: `${x}-${y}-${Date.now()}-${Math.random()}`,
    type: Math.floor(Math.random() * GEM_TYPES),
    x, y, matched: false,
  }), []);

  const initializeGrid = useCallback(() => {
    const newGrid: GemTile[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) { newGrid[y][x] = createTile(x, y); }
    }
    setGrid(newGrid); setCombo(0);
  }, [createTile]);

  useEffect(() => { initializeGrid(); }, [initializeGrid]);

  const checkMatches = useCallback((currentGrid: GemTile[][]): boolean => {
    let hasMatches = false;
    const matchedPositions = new Set<string>();
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE - 2; x++) {
        const type = currentGrid[y][x].type;
        if (type === currentGrid[y][x+1].type && type === currentGrid[y][x+2].type) {
          matchedPositions.add(`${x},${y}`); matchedPositions.add(`${x+1},${y}`); matchedPositions.add(`${x+2},${y}`);
          hasMatches = true;
        }
      }
    }
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE - 2; y++) {
        const type = currentGrid[y][x].type;
        if (type === currentGrid[y+1][x].type && type === currentGrid[y+2][x].type) {
          matchedPositions.add(`${x},${y}`); matchedPositions.add(`${x},${y+1}`); matchedPositions.add(`${x},${y+2}`);
          hasMatches = true;
        }
      }
    }
    if (hasMatches) {
      const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
      matchedPositions.forEach(pos => { const [x, y] = pos.split(',').map(Number); newGrid[y][x].matched = true; });
      setGrid(newGrid);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(prev => prev + matchedPositions.size * 10 * newCombo);
      setTimeout(() => { dropTiles(newGrid); }, 400);
    } else { setCombo(0); }
    return hasMatches;
  }, [combo]);

  const dropTiles = (currentGrid: GemTile[][]) => {
    const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
    for (let x = 0; x < GRID_SIZE; x++) {
      let emptySpaces = 0;
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (newGrid[y][x].matched) { emptySpaces++; }
        else if (emptySpaces > 0) {
          newGrid[y + emptySpaces][x] = { ...newGrid[y][x], y: y + emptySpaces, matched: false };
          newGrid[y][x] = createTile(x, y);
        }
      }
      for (let y = 0; y < emptySpaces; y++) { newGrid[y][x] = createTile(x, y); }
    }
    setGrid(newGrid);
    setTimeout(() => { checkMatches(newGrid); }, 300);
  };

  const handleTileClick = (x: number, y: number) => {
    if (gameOver) return;
    if (!selectedTile) { setSelectedTile({ x, y }); }
    else {
      const dx = Math.abs(selectedTile.x - x);
      const dy = Math.abs(selectedTile.y - y);
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        swapTiles(selectedTile.x, selectedTile.y, x, y);
        setMoves(prev => { const n = prev - 1; if (n <= 0) setGameOver(true); return n; });
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
      if (!checkMatches(newGrid)) {
        const revert = newGrid.map(row => row.map(tile => ({ ...tile })));
        const t = revert[y1][x1];
        revert[y1][x1] = { ...revert[y2][x2], x: x1, y: y1 };
        revert[y2][x2] = { ...t, x: x2, y: y2 };
        setGrid(revert);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#e8eaf6' }}>
      <div className="relative rounded-[22px] p-6 max-w-2xl w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #8a66cc' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Diamond className="w-6 h-6" style={{ color: '#b388ff' }} />
            <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-xl">Gem Match</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#b388ff', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
              <Sparkles className="w-3 h-3 inline" /> {score}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#80e8ff', color: '#1a1040', fontFamily: "'Poppins', sans-serif" }}>
              Moves: {moves}
            </span>
            {combo > 1 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold animate-bounce" style={{ backgroundColor: '#fff176', color: '#1a1040', fontFamily: "'Bungee', cursive" }}>
                x{combo}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5"><X className="w-5 h-5" style={{ color: '#1a1040' }} /></button>
        </div>

        {/* Board */}
        <div className="rounded-[16px] p-2 mx-auto" style={{ backgroundColor: '#ede7f6', border: '3px solid #d1c4e9', width: 'fit-content' }}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)` }}>
            {grid.map((row) =>
              row.map((tile) => {
                const gem = GEM_STYLES[tile.type];
                const isSelected = selectedTile?.x === tile.x && selectedTile?.y === tile.y;
                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile.x, tile.y)}
                    disabled={tile.matched}
                    className="flex items-center justify-center transition-all duration-200"
                    style={{
                      width: TILE_SIZE, height: TILE_SIZE,
                      backgroundColor: gem.bg, borderRadius: 10,
                      boxShadow: `0 3px 0 0 ${gem.shadow}`,
                      opacity: tile.matched ? 0 : 1,
                      transform: tile.matched ? 'scale(0)' : isSelected ? 'scale(1.15)' : 'scale(1)',
                      border: isSelected ? '3px solid #1a1040' : '2px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    <span style={{ fontSize: 20, color: '#1a1040', fontWeight: 'bold', opacity: 0.6 }}>{gem.symbol}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>
          Click two adjacent gems to swap and match 3+
        </p>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-[22px] p-8 text-center" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #8a66cc' }}>
            <Diamond className="w-12 h-12 mx-auto mb-3" style={{ color: '#b388ff' }} />
            <h3 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-3xl mb-2">Cave Explored!</h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040' }} className="text-lg mb-5">Score: {score}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setScore(0); setMoves(25); setGameOver(false); initializeGrid(); }} className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1" style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#b388ff', boxShadow: '0 4px 0 0 #8a66cc', color: '#fff' }}>
                Again
              </button>
              <button onClick={onClose} className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1" style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#80e8ff', boxShadow: '0 4px 0 0 #5cb8cc', color: '#1a1040' }}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
