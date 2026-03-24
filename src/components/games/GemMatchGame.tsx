/**
 * GemMatchGame.tsx — A match-3 gem puzzle (click-to-swap version).
 * Click two adjacent gems to swap them and match 3+ in a row/column.
 * Features combo scoring — consecutive matches multiply points.
 */

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Diamond } from 'lucide-react';
import { GameHeader } from '@/components/GameHeader';
import { GameOverModal } from '@/components/GameOverModal';

interface GemTile { id: string; type: number; x: number; y: number; matched: boolean; }
interface GemMatchGameProps { onClose: () => void; }

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
    id: `${x}-${y}-${Date.now()}-${Math.random()}`, type: Math.floor(Math.random() * GEM_TYPES), x, y, matched: false,
  }), []);

  const initializeGrid = useCallback(() => {
    const newGrid: GemTile[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) { newGrid[y] = []; for (let x = 0; x < GRID_SIZE; x++) newGrid[y][x] = createTile(x, y); }
    setGrid(newGrid); setCombo(0);
  }, [createTile]);

  useEffect(() => { initializeGrid(); }, [initializeGrid]);

  const checkMatches = useCallback((currentGrid: GemTile[][]): boolean => {
    let hasMatches = false;
    const matched = new Set<string>();
    for (let y = 0; y < GRID_SIZE; y++) for (let x = 0; x < GRID_SIZE - 2; x++) {
      const t = currentGrid[y][x].type;
      if (t === currentGrid[y][x+1].type && t === currentGrid[y][x+2].type) { matched.add(`${x},${y}`); matched.add(`${x+1},${y}`); matched.add(`${x+2},${y}`); hasMatches = true; }
    }
    for (let x = 0; x < GRID_SIZE; x++) for (let y = 0; y < GRID_SIZE - 2; y++) {
      const t = currentGrid[y][x].type;
      if (t === currentGrid[y+1][x].type && t === currentGrid[y+2][x].type) { matched.add(`${x},${y}`); matched.add(`${x},${y+1}`); matched.add(`${x},${y+2}`); hasMatches = true; }
    }
    if (hasMatches) {
      const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
      matched.forEach(pos => { const [x, y] = pos.split(',').map(Number); newGrid[y][x].matched = true; });
      setGrid(newGrid);
      const newCombo = combo + 1; setCombo(newCombo);
      setScore(prev => prev + matched.size * 10 * newCombo);
      setTimeout(() => dropTiles(newGrid), 400);
    } else { setCombo(0); }
    return hasMatches;
  }, [combo]);

  const dropTiles = (currentGrid: GemTile[][]) => {
    const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
    for (let x = 0; x < GRID_SIZE; x++) {
      let empty = 0;
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (newGrid[y][x].matched) empty++;
        else if (empty > 0) { newGrid[y + empty][x] = { ...newGrid[y][x], y: y + empty, matched: false }; newGrid[y][x] = createTile(x, y); }
      }
      for (let y = 0; y < empty; y++) newGrid[y][x] = createTile(x, y);
    }
    setGrid(newGrid);
    setTimeout(() => checkMatches(newGrid), 300);
  };

  const handleTileClick = (x: number, y: number) => {
    if (gameOver) return;
    if (!selectedTile) { setSelectedTile({ x, y }); return; }
    const dx = Math.abs(selectedTile.x - x), dy = Math.abs(selectedTile.y - y);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      swapTiles(selectedTile.x, selectedTile.y, x, y);
      setMoves(prev => { const n = prev - 1; if (n <= 0) setGameOver(true); return n; });
    }
    setSelectedTile(null);
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
        const t = revert[y1][x1]; revert[y1][x1] = { ...revert[y2][x2], x: x1, y: y1 }; revert[y2][x2] = { ...t, x: x2, y: y2 };
        setGrid(revert);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#e8eaf6' }}>
      <div className="relative rounded-[22px] p-6 max-w-2xl w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #8a66cc' }}>
        <GameHeader
          title="Gem Match"
          icon={<Diamond className="w-6 h-6" style={{ color: '#b388ff' }} />}
          badges={[
            { label: <><Sparkles className="w-3 h-3 inline" /> {score}</>, bg: '#b388ff', color: '#fff' },
            { label: `Moves: ${moves}`, bg: '#80e8ff' },
            ...(combo > 1 ? [{ label: `x${combo}`, bg: '#fff176' }] : []),
          ]}
          onClose={onClose}
        />

        {/* Board */}
        <div className="rounded-[16px] p-2 mx-auto" style={{ backgroundColor: '#ede7f6', border: '3px solid #d1c4e9', width: 'fit-content' }}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)` }}>
            {grid.map(row => row.map(tile => {
              const gem = GEM_STYLES[tile.type];
              const isSelected = selectedTile?.x === tile.x && selectedTile?.y === tile.y;
              return (
                <button key={tile.id} onClick={() => handleTileClick(tile.x, tile.y)} disabled={tile.matched}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    width: TILE_SIZE, height: TILE_SIZE, backgroundColor: gem.bg, borderRadius: 10,
                    boxShadow: `0 3px 0 0 ${gem.shadow}`, opacity: tile.matched ? 0 : 1,
                    transform: tile.matched ? 'scale(0)' : isSelected ? 'scale(1.15)' : 'scale(1)',
                    border: isSelected ? '3px solid #1a1040' : '2px solid rgba(255,255,255,0.5)',
                  }}>
                  <span style={{ fontSize: 20, color: '#1a1040', fontWeight: 'bold', opacity: 0.6 }}>{gem.symbol}</span>
                </button>
              );
            }))}
          </div>
        </div>

        <p className="mt-3 text-center text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>Click two adjacent gems to swap and match 3+</p>
      </div>

      {gameOver && (
        <GameOverModal
          title="Cave Explored!"
          titleColor="#1a1040"
          message={`Score: ${score}`}
          icon={<Diamond className="w-12 h-12 mx-auto" style={{ color: '#b388ff' }} />}
          onPlayAgain={() => { setScore(0); setMoves(25); setGameOver(false); initializeGrid(); }}
          onClose={onClose}
          shadowColor="#8a66cc"
          playBg="#b388ff"
          playShadow="#8a66cc"
          playLabel="Again"
        />
      )}
    </div>
  );
};
