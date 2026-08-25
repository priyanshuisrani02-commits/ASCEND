import React from 'react';
import Link from 'next/link';
import { Profile } from '@/lib/types';
import { Trophy, Crown, ShieldCheck, ChevronRight, UserRound } from 'lucide-react';
import { clsx } from 'clsx';

interface LeaderboardTableProps { rankings: Profile[]; }

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ rankings }) => {
  const top3 = rankings.slice(0, 3);
  const remaining = rankings.slice(3);
  const podiumColors = [
    { border: 'border-amber-500/80', bg: 'bg-gradient-to-b from-amber-500/20 via-slate-900/90 to-slate-950', text: 'text-amber-300', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]', badge: 'bg-amber-500 text-slate-950', title: '1ST PLACE' },
    { border: 'border-slate-400/70', bg: 'bg-gradient-to-b from-slate-400/15 via-slate-900/90 to-slate-950', text: 'text-slate-200', glow: 'shadow-[0_0_20px_rgba(148,163,184,0.2)]', badge: 'bg-slate-300 text-slate-950', title: '2ND PLACE' },
    { border: 'border-amber-700/60', bg: 'bg-gradient-to-b from-amber-700/15 via-slate-900/90 to-slate-950', text: 'text-amber-500', glow: 'shadow-[0_0_20px_rgba(180,83,9,0.2)]', badge: 'bg-amber-700 text-white', title: '3RD PLACE' },
  ];

  return <div className="space-y-10">
    {top3.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">{[top3[1], top3[0], top3[2]].filter(Boolean).map((player, idx) => {
      const originalRank = player.username === top3[0]?.username ? 1 : player.username === top3[1]?.username ? 2 : 3;
      const style = podiumColors[originalRank - 1];
      const isFirst = originalRank === 1;
      return <Link key={player.id} href={`/profile/${player.username}`} className={clsx('glass-panel rounded-2xl p-6 border text-center transition-transform hover:-translate-y-2 relative overflow-hidden group', style.bg, style.border, style.glow, isFirst ? 'md:order-2 md:-translate-y-4 py-8' : originalRank === 2 ? 'md:order-1' : 'md:order-3')}>
        {isFirst && <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 text-amber-400 font-black text-xs tracking-widest"><Crown className="w-5 h-5 animate-bounce" /><span>CHAMPION</span></div>}
        <div className={clsx('w-8 h-8 rounded-full font-black text-sm flex items-center justify-center mx-auto mb-4 mt-2', style.badge)}>#{originalRank}</div>
        <div className="relative w-20 h-20 mx-auto mb-4">{player.avatar_url ? <img src={player.avatar_url} alt={player.username} className="w-full h-full rounded-2xl object-cover border-2 border-white/20 shadow-xl" /> : <div aria-hidden="true" className="w-full h-full rounded-2xl bg-slate-900 border-2 border-white/20 shadow-xl grid place-items-center text-slate-500"><UserRound className="w-7 h-7" /></div>}<div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-slate-900 border border-violet-500/50 text-[10px] font-bold text-violet-300 font-mono">LVL {player.level}</div></div>
        <h3 className="text-xl font-black text-white group-hover:text-violet-300 transition-colors">{player.username}</h3><p className="text-xs text-slate-400 truncate max-w-[200px] mx-auto mt-1">{player.display_name}</p>
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-xs"><div><div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Ranking Points</div><div className="font-black font-mono text-violet-400 text-sm">{player.ranking_points} RP</div></div><div><div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total XP</div><div className="font-black font-mono text-amber-400 text-sm">{player.xp.toLocaleString()}</div></div></div>
      </Link>;
    })}</div>}
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><th className="py-4 px-6">Rank</th><th className="py-4 px-6">Player</th><th className="py-4 px-6">Level</th><th className="py-4 px-6">XP</th><th className="py-4 px-6 text-right">Ranking Points</th><th className="py-4 px-6"></th></tr></thead><tbody className="divide-y divide-slate-800/60 text-sm">{rankings.map((player, index) => { const rankNum = index + 1; return <tr key={player.id} className="hover:bg-violet-950/20 transition-colors group"><td className="py-4 px-6 font-mono font-bold text-slate-400"><span className={clsx('inline-block w-7 text-center font-bold', rankNum <= 3 ? 'text-amber-400' : 'text-slate-400')}>#{rankNum}</span></td><td className="py-4 px-6"><Link href={`/profile/${player.username}`} className="flex items-center space-x-3 group-hover:text-violet-300">{player.avatar_url ? <img src={player.avatar_url} alt={player.username} className="w-9 h-9 rounded-xl object-cover border border-slate-700" /> : <div aria-hidden="true" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 grid place-items-center text-slate-500"><UserRound className="w-4 h-4" /></div>}<div><div className="font-bold text-white group-hover:text-violet-300 transition-colors flex items-center space-x-1.5"><span>{player.username}</span>{player.is_admin && <span title="Verified Admin"><ShieldCheck className="w-4 h-4 text-violet-400" /></span>}</div><div className="text-xs text-slate-400">{player.display_name}</div></div></Link></td><td className="py-4 px-6 font-bold text-slate-300"><span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono">LVL {player.level}</span></td><td className="py-4 px-6 font-mono text-amber-400 font-semibold">{player.xp.toLocaleString()} XP</td><td className="py-4 px-6 text-right font-mono font-black text-violet-400 text-base">{player.ranking_points} RP</td><td className="py-4 px-6 text-right"><Link href={`/profile/${player.username}`} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-violet-600 transition-all inline-flex"><ChevronRight className="w-4 h-4" /></Link></td></tr>; })}</tbody></table></div></div>
  </div>;
};
