'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { getRankings, getGames } from '@/lib/data/store';
import { Profile, Game } from '@/lib/types';
import { Trophy } from 'lucide-react';

export default function RankingsPage() {
  const [rankings, setRankings] = useState<Profile[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL_TIME' | 'SEASON' | 'MONTH' | 'WEEK'>('ALL_TIME');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [rData, gData] = await Promise.all([getRankings(), getGames()]);
        if (!active) return;
        setRankings(rData);
        setGames(gData);
      } catch (error) {
        if (active) setErrorMsg(error instanceof Error ? error.message : 'Unable to load rankings.');
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  return <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between"><NavbarWrapper /><main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full"><div className="mb-10 text-center max-w-3xl mx-auto"><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest mb-3"><Trophy className="w-4 h-4 text-violet-400" /><span>Official Competitive Leaderboard</span></div><h1 className="text-4xl sm:text-6xl font-black text-white">GLOBAL RANKINGS</h1><p className="text-sm text-slate-400 mt-2">The world&apos;s highest performing competitive gamers ranked by verified achievements, challenge victories, and Ranking Points.</p></div><div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"><div className="flex items-center space-x-2">{(['ALL_TIME', 'SEASON', 'MONTH', 'WEEK'] as const).map(tf => <button key={tf} onClick={() => setTimeFilter(tf)} className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === tf ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>{tf.replace('_', ' ')}</button>)}</div><div className="w-full sm:w-64"><select value={selectedGame} onChange={e => setSelectedGame(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold focus:border-violet-500 outline-none uppercase"><option value="ALL">All Competitive Games</option>{games.map(g => <option key={g.id} value={g.slug}>{g.title}</option>)}</select></div></div>{errorMsg && <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}<LeaderboardTable rankings={rankings} /></main><Footer /></div>;
}
