'use client';

import React, { useState, useEffect } from 'react';
import { Challenge } from '@/lib/types';
import { Button } from './ui/Button';
import { Swords, Clock, Trophy, Flame, UserCheck, Sparkles, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { joinChallenge } from '@/lib/data/store';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
  const [joined, setJoined] = useState(challenge.user_joined ?? false);
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, mins: 30, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(challenge.end_date).getTime() - Date.now();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge.end_date]);

  const handleJoin = async () => {
    await joinChallenge(challenge.id, 'current');
    setJoined(true);
    if (onJoin) onJoin();
  };

  const difficultyColors = {
    EASY: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    MEDIUM: 'border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    HARD: 'border-purple-500/60 text-purple-300 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    EXPERT: 'border-amber-500/70 text-amber-300 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    INSANE: 'border-rose-500/80 text-rose-300 bg-rose-500/25 shadow-[0_0_25px_rgba(244,63,94,0.45)] animate-pulse',
  };

  return (
    <div className="glass-panel portal-glow p-6 rounded-3xl border border-violet-500/30 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:border-violet-400/80 hover:shadow-[0_0_40px_rgba(124,58,237,0.35)]">
      
      {/* ROTATING PORTAL LIGHT SWEEP */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl group-hover:scale-125 transition-all pointer-events-none" />

      <div>
        {/* HEADER: GAME TITLE & QUEST DIFFICULTY */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
            <Swords className="w-3.5 h-3.5 text-violet-400" />
            <span>{challenge.game_title || 'REALM TRIAL'}</span>
          </span>
          <span className={clsx('px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider', difficultyColors[challenge.difficulty])}>
            {challenge.difficulty}
          </span>
        </div>

        {/* QUEST TITLE & STORY DESCRIPTION */}
        <h3 className="text-xl font-black text-white group-hover:text-violet-300 transition-colors tracking-wide">
          {challenge.title}
        </h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
          {challenge.description}
        </p>

        {/* TIME REMAINING COUNTDOWN TIMER */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
            <Clock className="w-4 h-4 text-violet-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="tracking-wider">PORTAL CLOSES IN:</span>
          </div>
          <div className="font-mono text-sm font-black text-amber-300 tracking-widest">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
          </div>
        </div>
      </div>

      {/* FOOTER REWARDS & ENTER TRIAL CTA */}
      <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs font-mono">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>+{challenge.xp_reward} XP</span>
          </div>
          <div className="flex items-center space-x-1 text-violet-400 font-bold text-xs font-mono">
            <Trophy className="w-4 h-4 text-violet-400" />
            <span>+{challenge.ranking_reward} RP</span>
          </div>
        </div>

        {joined ? (
          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <UserCheck className="w-4 h-4" />
            <span>ENTERED TRIAL</span>
          </span>
        ) : (
          <Button variant="primary" size="sm" onClick={handleJoin} className="px-5 py-2 font-bold tracking-wider">
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>ENTER TRIAL</span>
          </Button>
        )}
      </div>
    </div>
  );
};
