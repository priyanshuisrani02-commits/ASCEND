import React from 'react';
import { clsx } from 'clsx';

interface XPProgressProps {
  xp: number;
  level: number;
  showLabels?: boolean;
  className?: string;
}

export function getXPForLevel(lvl: number): number {
  if (lvl <= 1) return 0;
  return (lvl - 1) * 500 + (lvl - 1) * (lvl - 2) * 150;
}

export const XPProgress: React.FC<XPProgressProps> = ({ xp, level, showLabels = true, className }) => {
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const rangeXP = nextLevelXP - currentLevelXP;
  const progressInLevel = Math.max(0, xp - currentLevelXP);
  const progressPercent = Math.min(100, Math.floor((progressInLevel / (rangeXP || 1)) * 100));

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-violet-300 tracking-wider">LEVEL {level}</span>
          <span className="text-slate-400 font-mono">
            {xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP ({progressPercent}%)
          </span>
        </div>
      )}
      <div className="h-2.5 w-full bg-slate-900/90 rounded-full border border-slate-800 p-0.5 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(124,58,237,0.6)] relative"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/40 blur-[2px]" />
        </div>
      </div>
    </div>
  );
};
