'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { AchievementCard } from '@/components/AchievementCard';
import { RarityBadge } from '@/components/ui/RarityBadge';
import { XPProgress } from '@/components/ui/XPProgress';
import { getMyAchievements, getRankings, getGames } from '@/lib/data/store';
import { Achievement, Profile, Game, AchievementRarity } from '@/lib/types';
import { Shield, Trophy, Flame, Crown, CheckCircle2, Search, Sparkles, Scroll, Filter } from 'lucide-react';

export default function MyAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [rarityFilter, setRarityFilter] = useState<string>('ALL');
  const [gameFilter, setGameFilter] = useState<string>('ALL');

  useEffect(() => {
    getMyAchievements('current').then(data => setAchievements(data));
    getRankings().then(r => setProfile(r[0]));
    getGames().then(g => setGames(g));
  }, []);

  const totalCount = achievements.length;
  const unlockedCount = achievements.filter(a => a.is_unlocked).length;

  const getRarityCount = (r: AchievementRarity) => {
    return achievements.filter(a => a.rarity === r && a.is_unlocked).length;
  };

  const rarityStats: { rarity: AchievementRarity; count: number; color: string }[] = [
    { rarity: 'COMMON', count: getRarityCount('COMMON'), color: 'border-slate-500/40 text-slate-300' },
    { rarity: 'UNCOMMON', count: getRarityCount('UNCOMMON'), color: 'border-emerald-500/50 text-emerald-400' },
    { rarity: 'RARE', count: getRarityCount('RARE'), color: 'border-blue-500/50 text-blue-400' },
    { rarity: 'EPIC', count: getRarityCount('EPIC'), color: 'border-purple-500/60 text-purple-300' },
    { rarity: 'LEGENDARY', count: getRarityCount('LEGENDARY'), color: 'border-amber-500/70 text-amber-300' },
    { rarity: 'MYTHIC', count: getRarityCount('MYTHIC'), color: 'border-rose-500/80 text-rose-300' },
  ];

  const filtered = achievements.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.requirements.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNLOCKED' && a.is_unlocked) ||
      (statusFilter === 'LOCKED' && !a.is_unlocked);
    const matchesRarity = rarityFilter === 'ALL' || a.rarity === rarityFilter;
    const matchesGame = gameFilter === 'ALL' || a.game_slug === gameFilter || a.game_id === gameFilter;
    return matchesSearch && matchesStatus && matchesRarity && matchesGame;
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-violet-600 selection:text-white">
      <NavbarWrapper />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* HERO ADVENTURER VAULT HEADER */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/40 bg-gradient-to-r from-violet-950/40 via-slate-950 to-indigo-950/40 relative overflow-hidden mb-12 shadow-[0_0_50px_rgba(124,58,237,0.2)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-violet-400 shadow-[0_0_25px_rgba(124,58,237,0.5)]"
                />
                <Crown className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Adventurer Quest Vault</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{profile?.username || 'ValkyriePrime'}</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">GLOBAL RANK #1 CHAMPION • {profile?.ranking_points || 3420} RP</p>
              </div>
            </div>

            <div className="w-full lg:w-96 glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <XPProgress xp={profile?.xp || 28450} level={profile?.level || 48} />
              <div className="flex justify-between items-center text-xs font-bold font-mono pt-1">
                <span className="text-slate-400">Vault Completion:</span>
                <span className="text-emerald-400">
                  {totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}% ({unlockedCount}/{totalCount} Quests)
                </span>
              </div>
            </div>

          </div>

          {/* 6 RARITY TIERS BREAKDOWN DASHBOARD */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-8 mt-8 border-t border-slate-800/80">
            {rarityStats.map(stat => (
              <div key={stat.rarity} className="glass-panel p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                <RarityBadge rarity={stat.rarity} size="sm" />
                <div className="text-xl font-black text-white font-mono mt-1">{stat.count} Earned</div>
              </div>
            ))}
          </div>

        </div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* SEARCH */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search quest scrolls, titles, or criteria..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
              />
            </div>

            {/* GAME SELECT */}
            <div className="md:col-span-6">
              <select
                value={gameFilter}
                onChange={e => setGameFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
              >
                <option value="ALL">All Competitive Titles</option>
                {games.map(g => (
                  <option key={g.id} value={g.slug}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* STATUS TABS & RARITY PILLS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center space-x-2">
              {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    statusFilter === st
                      ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-violet-400'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st === 'ALL' ? 'ALL SCROLLS' : st === 'UNLOCKED' ? 'CLAIMED QUESTS' : 'LOCKED CRESTS'}
                </button>
              ))}
            </div>

            {/* RARITY SELECT */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1 text-violet-400" />
                Rarity:
              </span>
              <select
                value={rarityFilter}
                onChange={e => setRarityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold focus:border-violet-500 outline-none uppercase"
              >
                <option value="ALL">All Tiers</option>
                <option value="COMMON">COMMON</option>
                <option value="UNCOMMON">UNCOMMON</option>
                <option value="RARE">RARE</option>
                <option value="EPIC">EPIC</option>
                <option value="LEGENDARY">LEGENDARY</option>
                <option value="MYTHIC">MYTHIC</option>
              </select>
            </div>
          </div>
        </div>

        {/* QUEST SCROLL UNROLLING BADGE GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(ach => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 my-10">
            <Scroll className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">NO QUEST CRESTS FOUND</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your quest search or rarity filter options.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
