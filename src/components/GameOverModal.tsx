/**
 * GameOverModal — Shared game-over overlay used by every mini-game.
 * Displays a title, message, optional icon, and Play Again / Back buttons.
 */

import { ReactNode } from 'react';

interface GameOverModalProps {
  title: string;
  titleColor?: string;
  message: string;
  icon?: ReactNode;
  onPlayAgain: () => void;
  onClose: () => void;
  playLabel?: string;
  shadowColor?: string;
  playBg?: string;
  playShadow?: string;
  playColor?: string;
}

export const GameOverModal = ({
  title, titleColor = '#ff0098', message, icon,
  onPlayAgain, onClose, playLabel = 'Play Again',
  shadowColor = '#cc4fa3', playBg = '#ff6fcf', playShadow = '#cc4fa3', playColor = '#fff',
}: GameOverModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
    <div className="rounded-[22px] p-8 text-center" style={{ backgroundColor: '#fff', boxShadow: `0 6px 0 0 ${shadowColor}` }}>
      {icon && <div className="mb-3">{icon}</div>}
      <h3 style={{ fontFamily: "'Bungee', cursive", color: titleColor }} className="text-3xl mb-2">{title}</h3>
      <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040' }} className="text-lg mb-5">{message}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onPlayAgain} className="y2k-btn" style={{ backgroundColor: playBg, boxShadow: `0 4px 0 0 ${playShadow}`, color: playColor }}>
          {playLabel}
        </button>
        <button onClick={onClose} className="y2k-btn" style={{ backgroundColor: '#80e8ff', boxShadow: '0 4px 0 0 #5cb8cc', color: '#1a1040' }}>
          Back
        </button>
      </div>
    </div>
  </div>
);
