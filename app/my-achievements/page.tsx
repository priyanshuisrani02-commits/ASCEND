'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { AchievementCard } from '@/components/AchievementCard';
import { RarityBadge } from '@/components/ui/RarityBadge';
import { XPProgress } from '@/components/ui/XPProgress';
import { getMyAchievements, getGames } from '@/lib/data/store';
import { Achievement, Profile, Game, AchievementRarity } from '@/lib/types';
import { Crown, Search, Sparkles, Scroll, Filter, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MyAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [rarityFilter, setRarityFilter] = useState('ALL');
  const [gameFilter, setGameFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Please sign in to view your deeds.');
        const [{ data: profileData, error: profileError }, achievementData, gameData] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          getMyAchievements(user.id),
          getGames(),
        ]);
        if (profileError) throw profileError;
        if (!active) return;
        setProfile(profileData as Profile);
        setAchievements(achievementData);
        setGames(gameData);
      } catch (error) {
        if (active) setErrorMsg(error instanceof Error ? error.message : 'Could not load your deeds.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const totalCount = achievements.length;
  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const getRarityCount = (r: AchievementRarity) => achievements.filter(a => a.rarity === r && a.is_unlocked).length;
  const rarityStats = (['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'] as AchievementRarity[]).map(rarity => ({ rarity, count: getRarityCount(rarity) }));
  const filtered = achievements.filter(a => {
    const q = search.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.requirements.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'UNLOCKED' && a.is_unlocked) || (statusFilter === 'LOCKED' && !a.is_unlocked);
    const matchesRarity = rarityFilter === 'ALL' || a.rarity === rarityFilter;
    const matchesGame = gameFilter === 'ALL' || a.game_slug === gameFilter || a.game_id === gameFilter;
    return matchesSearch && matchesStatus && matchesRarity && matchesGame;
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/40 bg-gradient-to-r from-violet-950/40 via-slate-950 to-indigo-950/40 relative overflow-hidden mb-12">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6"><div className="relative">{profile?.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-violet-400" /> : <div aria-label="Avatar placeholder" className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-violet-400 grid place-items-center text-violet-300"><UserRound className="w-7 h-7" /></div>}<Crown className="w-6 h-6 text-amber-400 absolute -top-2 -right-2" /></div><div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-1"><Sparkles className="w-3.5 h-3.5" />Adventurer Quest Vault</div><h1 className="text-3xl sm:text-5xl font-black text-white">{profile?.username || 'Your Deeds'}</h1><p className="text-xs text-slate-400 font-mono mt-1">{profile?.ranking_points ?? 0} RP • LEVEL {profile?.level ?? 1}</p></div></div>
            <div className="w-full lg:w-96 glass-panel p-5 rounded-2xl border border-slate-800"><XPProgress xp={profile?.xp ?? 0} level={profile?.level ?? 1} /><div className="flex justify-between items-center text-xs font-bold font-mono pt-2"><span className="text-slate-400">Vault Completion</span><span className="text-emerald-400">{totalCount ? Math.round(unlockedCount / totalCount * 100) : 0}% ({unlockedCount}/{totalCount})</span></div></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-8 mt-8 border-t border-slate-800/80">{rarityStats.map(stat => <div key={stat.rarity} className="glass-panel p-3 rounded-2xl border border-slate-800 text-center"><RarityBadge rarity={stat.rarity} size="sm" /><div className="text-xl font-black text-white font-mono mt-1">{stat.count}</div></div>)}</div>
        </div>
        {errorMsg && <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 mb-10"><div className="grid grid-cols-1 md:grid-cols-12 gap-4"><div className="md:col-span-6 relative"><Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" /><input type="text" placeholder="Search deeds..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div><div className="md:col-span-6"><select value={gameFilter} onChange={e => setGameFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"><option value="ALL">All Competitive Titles</option>{games.map(g => <option key={g.id} value={g.slug}>{g.title}</option>)}</select></div></div><div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80"><div className="flex gap-2">{(['ALL', 'UNLOCKED', 'LOCKED'] as const).map(st => <button key={st} onClick={() => setStatusFilter(st)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${statusFilter === st ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>{st}</button>)}</div><div className="flex items-center gap-2"><Filter className="w-3.5 h-3.5 text-violet-400" /><select value={rarityFilter} onChange={e => setRarityFilter(e.target.value)} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold"><option value="ALL">All Tiers</option>{rarityStats.map(r => <option key={r.rarity} value={r.rarity}>{r.rarity}</option>)}</select></div></div></div>
        {loading ? <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 text-slate-400">Loading your deeds…</div> : filtered.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filtered.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}</div> : <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 my-10"><Scroll className="w-12 h-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-300">NO DEEDS FOUND</h3><p className="text-xs text-slate-500 mt-1">Try adjusting your filters.</p></div>}
      </main>
      <Footer />
    </div>
  );
}
