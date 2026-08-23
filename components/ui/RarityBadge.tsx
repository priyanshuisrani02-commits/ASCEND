import React from 'react';
import { AchievementRarity } from '@/lib/types';
import { clsx } from 'clsx';

interface RarityBadgeProps {
  rarity: AchievementRarity;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, className, size = 'md' }) => {
  const styles: Record<AchievementRarity, string> = {
    COMMON: 'border-slate-500/40 text-slate-300 bg-slate-500/10',
    UNCOMMON: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    RARE: 'border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
    EPIC: 'border-purple-500/60 text-purple-300 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    LEGENDARY: 'border-amber-500/70 text-amber-300 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    MYTHIC: 'border-rose-500/80 text-rose-300 bg-rose-500/25 shadow-[0_0_25px_rgba(244,63,94,0.45)] animate-pulse',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-bold tracking-wider',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center uppercase font-bold tracking-widest rounded-md border backdrop-blur-md transition-all',
        styles[rarity],
        sizeClasses[size],
        className
      )}
    >
      {rarity}
    </span>
  );
};
