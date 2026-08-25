'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { AchievementCard } from '@/components/AchievementCard';
import { getAchievements, getGames } from '@/lib/data/store';
import { Achievement, Game, AchievementRarity } from '@/lib/types';
import { Search, Trophy, Shield, Filter } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [selectedGame, setSelectedGame] = useState<string>('ALL');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [aData, gData] = await Promise.all([getAchievements(), getGames()]);
        if (!active) return;
        setAchievements(aData);
        setGames(gData);
      } catch (error) {
        if (active) setErrorMsg(error instanceof Error ? error.message : 'Unable to load the achievement directory.');
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const rarities: (AchievementRarity | 'ALL')[] = ['ALL', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
  const filteredAchievements = achievements.filter(ach => {
    const matchesSearch = ach.title.toLowerCase().includes(search.toLowerCase()) || ach.description.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = selectedRarity === 'ALL' || ach.rarity === selectedRarity;
    const matchesGame = selectedGame === 'ALL' || ach.game_slug === selectedGame;
    return matchesSearch && matchesRarity && matchesGame;
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10"><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest mb-3"><Trophy className="w-4 h-4 text-violet-400" /><span>Platform Database</span></div><h1 className="text-4xl sm:text-5xl font-black text-white">ACHIEVEMENT DIRECTORY</h1><p className="text-sm text-slate-400 mt-2 max-w-2xl">Browse all competitive achievements, requirements, XP payouts, and dynamic global unlock rarities.</p></div>
        {errorMsg && <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 mb-10"><div className="grid grid-cols-1 md:grid-cols-12 gap-4"><div className="md:col-span-6 relative"><Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" /><input type="text" placeholder="Search achievement title or requirements..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div><div className="md:col-span-6"><select value={selectedGame} onChange={e => setSelectedGame(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"><option value="ALL">All Games</option>{games.map(g => <option key={g.id} value={g.slug}>{g.title}</option>)}</select></div></div><div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80"><span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2 flex items-center"><Filter className="w-3.5 h-3.5 mr-1" />Rarity:</span>{rarities.map(r => <button key={r} onClick={() => setSelectedRarity(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedRarity === r ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}>{r}</button>)}</div></div>
        {filteredAchievements.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredAchievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}</div> : <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-10"><Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-300">NO ACHIEVEMENTS FOUND</h3><p className="text-xs text-slate-500 mt-1">Try resetting your rarity or game filter options.</p></div>}
      </main>
      <Footer />
    </div>
  );
}
