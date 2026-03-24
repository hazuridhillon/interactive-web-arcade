/**
 * GameHeader — Shared header bar used by every mini-game.
 * Shows a title, optional stat badges, and a close (X) button.
 */

import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface Badge {
  label: ReactNode;
  bg: string;
  color?: string;
}

interface GameHeaderProps {
  title: string;
  icon?: ReactNode;
  badges?: Badge[];
  onClose: () => void;
}

export const GameHeader = ({ title, icon, badges = [], onClose }: GameHeaderProps) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-3">
      {icon}
      <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-xl">{title}</h2>
      {badges.map((b, i) => (
        <span key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: b.bg, color: b.color || '#1a1040', fontFamily: "'Poppins', sans-serif" }}>
          {b.label}
        </span>
      ))}
    </div>
    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5">
      <X className="w-5 h-5" style={{ color: '#1a1040' }} />
    </button>
  </div>
);
