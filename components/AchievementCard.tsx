import React from 'react';
import { Achievement } from '@/lib/types';
import { RarityBadge } from './ui/RarityBadge';
import { Lock, CheckCircle2, Zap, Flame, Trophy, Target, ShieldAlert, Crown, Crosshair, Sparkles, Scroll } from 'lucide-react';
import { clsx } from 'clsx';

interface AchievementCardProps {
  achievement: Achievement;
  onUnlock?: (id: string) => void;
}

function AchievementIcon({ iconName, unlocked }: { iconName: string; unlocked: boolean }) {
  const className = unlocked ? 'w-6 h-6 animate-pulse' : 'w-5 h-5 text-slate-600';
  if (!unlocked) return <Lock className={className} />;

  switch (iconName) {
    case 'Crosshair': return <Crosshair className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Target': return <Target className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Crown': return <Crown className={className} />;
    default: return <Trophy className={className} />;
  }
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onUnlock }) => {
  const isUnlocked = achievement.is_unlocked;
  const unlockPercentage = achievement.total_players_count > 0
    ? ((achievement.unlocked_count / achievement.total_players_count) * 100).toFixed(1)
    : '5.2';

  return (
    <div className="group relative transition-all duration-300">
      <div className="flex items-center space-x-3 mb-[-12px] relative z-20 px-3">
        <div
          className={clsx(
            'w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1',
            isUnlocked
              ? 'bg-gradient-to-tr from-violet-950 via-indigo-900 to-purple-900 border-violet-400 text-violet-200 shadow-[0_0_25px_rgba(124,58,237,0.5)]'
              : 'bg-slate-900 border-slate-700 text-slate-500'
          )}
        >
          <AchievementIcon iconName={achievement.icon_url} unlocked={isUnlocked} />
        </div>
        <div className="flex items-center space-x-2">
          <RarityBadge rarity={achievement.rarity} size="sm" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            {achievement.game_title || 'REALM QUEST'}
          </span>
        </div>
      </div>

      <div
        className={clsx(
          'glass-panel p-5 pt-7 rounded-3xl border transition-all duration-400 relative overflow-hidden',
          'group-hover:border-violet-400/60 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]',
          isUnlocked
            ? 'border-violet-500/30 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950'
            : 'border-slate-800 bg-slate-950/90 opacity-90'
        )}
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/25 transition-all pointer-events-none" />
        <div className="space-y-2">
          <h3 className={clsx('text-lg font-black tracking-wide', isUnlocked ? 'text-white group-hover:text-violet-300' : 'text-slate-300')}>
            {achievement.title}
          </h3>
          <div className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
            {achievement.description}
          </div>
          <div className="pt-2 text-[11px] text-violet-400 font-mono flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Scroll className="w-3.5 h-3.5" />
            <span>Criterion: {achievement.requirements}</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-amber-400 font-mono flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>+{achievement.xp_reward} XP</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">{unlockPercentage}% unlocked</span>
          </div>

          {isUnlocked ? (
            <span className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>REALM CLAIMED</span>
            </span>
          ) : (
            onUnlock && (
              <button
                onClick={() => onUnlock(achievement.id)}
                className="text-[11px] font-bold text-violet-400 hover:text-violet-300 uppercase tracking-wider underline underline-offset-2 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>UNFOLD SCROLL</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
