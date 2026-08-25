'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { ChallengeCard } from '@/components/ChallengeCard';
import { getChallenges } from '@/lib/data/store';
import { Challenge } from '@/lib/types';
import { Swords, Sparkles, Crown } from 'lucide-react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED'>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getChallenges();
        if (active) setChallenges(data);
      } catch (error) {
        if (active) setErrorMsg(error instanceof Error ? error.message : 'Unable to load the trial grounds.');
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const filtered = challenges.filter(ch => statusFilter === 'ALL' || ch.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-violet-600 selection:text-white">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-950 to-violet-950/40 relative overflow-hidden mb-12 shadow-[0_0_50px_rgba(245,158,11,0.15)]"><div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" /><div className="max-w-3xl space-y-4 relative z-10"><div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest"><Swords className="w-4 h-4 text-amber-400 animate-bounce" /><span>Weekly Arena Trials & Quests</span></div><h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">CONQUER THE <span className="gold-gradient-text">WEEKLY TRIALS</span></h1><p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">Test your mechanical skill in timed arena challenges. Earn massive XP multipliers, climb prestige rankings, and claim legendary RP bounties.</p><div className="pt-2 flex flex-wrap gap-4 text-xs font-mono font-bold text-slate-300"><div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2"><Crown className="w-4 h-4 text-amber-400" /><span>$50,000 RP Bounty Pool</span></div><div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center space-x-2"><Sparkles className="w-4 h-4 text-violet-400" /><span>3 Active Arena Portals</span></div></div></div></div>
        {errorMsg && <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}
        <div className="flex items-center space-x-3 mb-10 border-b border-slate-800 pb-4">{(['ACTIVE', 'UPCOMING', 'COMPLETED', 'ALL'] as const).map(st => <button key={st} onClick={() => setStatusFilter(st)} className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === st ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-violet-400' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>{st} TRIALS</button>)}</div>
        {filtered.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filtered.map(ch => <ChallengeCard key={ch.id} challenge={ch} />)}</div> : <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800 my-10"><Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-300">NO {statusFilter} TRIALS FOUND</h3><p className="text-xs text-slate-500 mt-1">Check back soon for upcoming weekly realm quest drops!</p></div>}
      </main>
      <Footer />
    </div>
  );
}
