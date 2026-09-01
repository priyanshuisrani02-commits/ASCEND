'use client';

import React, { useState, useEffect } from 'react';
import { Challenge } from '@/lib/types';
import { Button } from './ui/Button';
import { Swords, Clock, Trophy, Flame, UserCheck, Sparkles, Skull, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { joinChallenge } from '@/lib/data/store';
import { createClient } from '@/lib/supabase/client';

interface ChallengeCardProps { challenge: Challenge; onJoin?: () => void; }

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
  const [joined, setJoined] = useState(challenge.user_joined ?? false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [errorMsg, setErrorMsg] = useState('');
  const isBoss = challenge.is_boss === true;

  useEffect(() => {
    const update = () => {
      const diff = new Date(challenge.end_date).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), mins: Math.floor((diff / 60000) % 60), secs: Math.floor((diff / 1000) % 60) });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [challenge.end_date]);

  const handleJoin = async () => {
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Please sign in to enter a trial.');
      await joinChallenge(challenge.id, user.id);
      setJoined(true);
      onJoin?.();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to enter this trial.');
    }
  };

  const difficultyColors = {
    EASY: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    MEDIUM: 'border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    HARD: 'border-purple-500/60 text-purple-300 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    EXPERT: 'border-amber-500/70 text-amber-300 bg-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    INSANE: 'border-rose-500/80 text-rose-300 bg-rose-500/25 shadow-[0_0_25px_rgba(244,63,94,0.45)] animate-pulse',
  };

  return (
    <div className={clsx('glass-panel p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]', isBoss ? 'border border-rose-500/45 bg-gradient-to-br from-rose-950/35 via-slate-950 to-violet-950/30 hover:border-rose-400/80 hover:shadow-[0_0_45px_rgba(244,63,94,0.22)]' : 'portal-glow border border-violet-500/30 hover:border-violet-400/80 hover:shadow-[0_0_40px_rgba(124,58,237,0.35)]')}>
      <div className={clsx('absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl group-hover:scale-125 transition-all pointer-events-none', isBoss ? 'bg-gradient-to-br from-rose-600/20 via-violet-600/10 to-transparent' : 'bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent')} />
      <div>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">{isBoss ? <Skull className="w-3.5 h-3.5 text-rose-300" /> : <Swords className="w-3.5 h-3.5 text-violet-400" />}<span>{isBoss ? 'BOSS ENCOUNTER' : (challenge.game_title || 'REALM TRIAL')}</span></span>
          <span className={clsx('px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider', difficultyColors[challenge.difficulty])}>{challenge.difficulty}</span>
        </div>
        {isBoss && <div className="mb-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-rose-300"><Shield className="w-3.5 h-3.5" /><span>{challenge.boss_name || 'Unknown Ascendant'}</span><span className="text-slate-600">•</span><span>{challenge.boss_phase_count ?? 1} phases</span><span className="text-slate-600">•</span><span>x{challenge.boss_risk_multiplier ?? 1} risk</span></div>}
        <h3 className="text-xl font-black text-white group-hover:text-violet-300 transition-colors tracking-wide">{challenge.title}</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">{isBoss && challenge.boss_lore ? challenge.boss_lore : challenge.description}</p>
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold"><Clock className={clsx('w-4 h-4', isBoss ? 'text-rose-300' : 'text-violet-400')} /><span className="tracking-wider">{isBoss ? 'ENCOUNTER CLOSES IN:' : 'PORTAL CLOSES IN:'}</span></div>
          <div className={clsx('font-mono text-sm font-black tracking-widest', isBoss ? 'text-rose-200' : 'text-amber-300')}>{timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s</div>
        </div>
      </div>
      {errorMsg && <p className="mt-4 text-[11px] font-semibold text-rose-300">{errorMsg}</p>}
      <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4"><div className="flex items-center space-x-1 text-amber-400 font-bold text-xs font-mono"><Flame className="w-4 h-4" /><span>+{challenge.xp_reward} XP</span></div><div className="flex items-center space-x-1 text-violet-400 font-bold text-xs font-mono"><Trophy className="w-4 h-4" /><span>+{challenge.ranking_reward} RP</span></div></div>
        {joined ? <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-1.5"><UserCheck className="w-4 h-4" /><span>ENTERED {isBoss ? 'ENCOUNTER' : 'TRIAL'}</span></span> : <Button variant="primary" size="sm" onClick={handleJoin} className="px-5 py-2 font-bold tracking-wider"><Sparkles className="w-4 h-4 mr-1.5" /><span>{isBoss ? 'ENTER BOSS' : 'ENTER TRIAL'}</span></Button>}
      </div>
    </div>
  );
};
