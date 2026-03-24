/**
 * Match3Game.tsx — A match-3 tile puzzle (drag-to-swap version).
 * Drag adjacent tiles to swap them and match 3+ in a row/column.
 * Difficulty controls tile variety, moves, and optional time limit.
 */

import { useState, useEffect, useCallback } from 'react';
import { X, Home } from 'lucide-react';
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

const TILE_STYLES = [
  { bg: '#ff6fcf', shadow: '#cc4fa3', symbol: '✦' },
  { bg: '#fff176', shadow: '#ccc05e', symbol: '◆' },
  { bg: '#80e8ff', shadow: '#5cb8cc', symbol: '●' },
  { bg: '#b388ff', shadow: '#8a66cc', symbol: '★' },
  { bg: '#69f0ae', shadow: '#4cc08a', symbol: '▲' },
  { bg: '#ff8a65', shadow: '#cc6e50', symbol: '■' },
  { bg: '#f48fb1', shadow: '#c2607e', symbol: '◈' },
  { bg: '#ffab91', shadow: '#cc8a74', symbol: '♦' },
];

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
    x, y, matched: false,
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

  useEffect(() => { if (difficulty) { initializeGrid(); if (timeLimit) setTimeRemaining(timeLimit); } }, [difficulty, initializeGrid, timeLimit]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) { setGameOver(true); }
  }, [timeRemaining, gameOver]);

  const handleDifficultySelect = (diff: 'easy' | 'medium' | 'hard') => {
    if (diff === 'easy') { setMoves(40); setTileTypes(4); setTimeLimit(null); }
    else if (diff === 'medium') { setMoves(30); setTileTypes(6); setTimeLimit(null); }
    else { setMoves(25); setTileTypes(7); setTimeLimit(180); }
    setDifficulty(diff);
  };

  const checkMatches = useCallback((currentGrid: Tile[][]): boolean => {
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
      setScore(prev => prev + matchedPositions.size * 10);
      setTimeout(() => { dropTiles(newGrid); }, 300);
    }
    return hasMatches;
  }, []);

  const dropTiles = (currentGrid: Tile[][]) => {
    const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
    for (let x = 0; x < GRID_SIZE; x++) {
      let emptySpaces = 0;
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (newGrid[y][x].matched) { emptySpaces++; }
        else if (emptySpaces > 0) {
          newGrid[y + emptySpaces][x] = { ...newGrid[y][x], y: y + emptySpaces, matched: false };
          newGrid[y][x] = createTile(x, y, tileTypes);
        }
      }
      for (let y = 0; y < emptySpaces; y++) { newGrid[y][x] = createTile(x, y, tileTypes); }
    }
    setGrid(newGrid);
    setTimeout(() => { checkMatches(newGrid); }, 300);
  };

  const isAdjacent = (x1: number, y1: number, x2: number, y2: number) =>
    (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);

  const handleMouseDown = (x: number, y: number) => { if (!gameOver && moves > 0) setDraggingTile({ x, y }); };
  const handleMouseEnter = (x: number, y: number) => { if (draggingTile && !gameOver && isAdjacent(draggingTile.x, draggingTile.y, x, y)) setDragTarget({ x, y }); };
  const handleMouseUp = () => {
    if (draggingTile && dragTarget && !gameOver) { swapTiles(draggingTile, dragTarget); }
    setDraggingTile(null); setDragTarget(null);
  };

  const swapTiles = (t1: {x: number, y: number}, t2: {x: number, y: number}) => {
    const newGrid = grid.map(row => row.map(tile => ({ ...tile })));
    const temp = newGrid[t1.y][t1.x];
    newGrid[t1.y][t1.x] = { ...newGrid[t2.y][t2.x], x: t1.x, y: t1.y };
    newGrid[t2.y][t2.x] = { ...temp, x: t2.x, y: t2.y };
    setGrid(newGrid);
    setMoves(prev => prev - 1);
    setTimeout(() => {
      if (!checkMatches(newGrid)) {
        const revert = newGrid.map(row => row.map(tile => ({ ...tile })));
        const t = revert[t1.y][t1.x];
        revert[t1.y][t1.x] = { ...revert[t2.y][t2.x], x: t1.x, y: t1.y };
        revert[t2.y][t2.x] = { ...t, x: t2.x, y: t2.y };
        setGrid(revert);
        setMoves(prev => prev + 1);
      }
    }, 500);
  };

  useEffect(() => { if (moves === 0 && !gameOver) setGameOver(true); }, [moves, gameOver]);

  if (!difficulty) {
    return <DifficultySelector onSelect={handleDifficultySelect} onCancel={onClose} easyDesc="40 moves, 4 tile types" mediumDesc="30 moves, 6 tile types" hardDesc="25 moves, 7 tiles, 3min timer" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#fff3e0' }}>
      <div className="relative rounded-[22px] p-6" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc6e50' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-xl">Tile Match</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff176', color: '#1a1040' }}>
              Score: {score}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#80e8ff', color: '#1a1040' }}>
              Moves: {moves}
            </span>
            {timeRemaining !== null && (
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#ff6fcf', color: '#fff' }}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5"><X className="w-5 h-5" style={{ color: '#1a1040' }} /></button>
        </div>

        {/* Grid */}
        <div
          className="grid gap-1 mx-auto rounded-[16px] p-2"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`, backgroundColor: '#fce4ec', border: '3px solid #f48fb1' }}
          onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        >
          {grid.map((row) =>
            row.map((tile) => {
              const style = TILE_STYLES[tile.type];
              const isDragging = draggingTile?.x === tile.x && draggingTile?.y === tile.y;
              const isTarget = dragTarget?.x === tile.x && dragTarget?.y === tile.y;
              return (
                <div
                  key={tile.id}
                  onMouseDown={() => handleMouseDown(tile.x, tile.y)}
                  onMouseEnter={() => handleMouseEnter(tile.x, tile.y)}
                  className="flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200"
                  style={{
                    width: TILE_SIZE, height: TILE_SIZE,
                    backgroundColor: style.bg,
                    borderRadius: 10,
                    boxShadow: `0 3px 0 0 ${style.shadow}`,
                    opacity: tile.matched ? 0 : 1,
                    transform: tile.matched ? 'scale(0)' : isDragging ? 'scale(1.15)' : isTarget ? 'scale(1.08)' : 'scale(1)',
                    border: isDragging ? '3px solid #fff' : isTarget ? '3px solid #1a1040' : '2px solid rgba(255,255,255,0.4)',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ fontSize: 22, color: '#1a1040', fontWeight: 'bold', opacity: 0.7 }}>{style.symbol}</span>
                </div>
              );
            })
          )}
        </div>

        <p className="mt-3 text-center text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>
          Drag tiles to swap and match 3+
        </p>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-[22px] p-8 text-center" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc4fa3' }}>
            <h3 style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }} className="text-3xl mb-2">Game Over!</h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040' }} className="text-lg mb-6">Final Score: {score}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setScore(0); setGameOver(false); setDifficulty(null); }}
                className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1"
                style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#ff6fcf', boxShadow: '0 4px 0 0 #cc4fa3', color: '#fff' }}
              >
                <Home className="w-4 h-4 inline mr-1" /> Play Again
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1"
                style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#80e8ff', boxShadow: '0 4px 0 0 #5cb8cc', color: '#1a1040' }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
