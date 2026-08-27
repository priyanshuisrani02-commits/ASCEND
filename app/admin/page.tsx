'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getRecords, getGames, getAchievements, getChallenges, getRankings } from '@/lib/data/store';
import { RecordSubmission, Game, Achievement, Challenge, Profile } from '@/lib/types';
import { ShieldCheck, Users, Gamepad2, Trophy, Swords, FileCheck, ArrowRight, Activity, Settings, ScrollText, RotateCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type LoadState = 'loading' | 'ready' | 'denied' | 'error';

export default function AdminDashboardPage() {
  const [pendingRecords, setPendingRecords] = useState<RecordSubmission[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [status, setStatus] = useState<LoadState>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setStatus('loading');
    setLoadError(null);

    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw new Error(`Authentication check failed: ${authError.message}`);
      if (!user) {
        setStatus('denied');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw new Error(`Council permission check failed: ${profileError.message}`);
      if (profile?.is_admin !== true) {
        setStatus('denied');
        return;
      }

      const results = await Promise.allSettled([
        getRecords('PENDING'),
        getGames(),
        getAchievements(),
        getChallenges(),
        getRankings(),
      ]);

      const failures: string[] = [];
      const [records, gameData, achievementData, challengeData, rankingData] = results;

      if (records.status === 'fulfilled') setPendingRecords(records.value);
      else failures.push('records');
      if (gameData.status === 'fulfilled') setGames(gameData.value);
      else failures.push('games');
      if (achievementData.status === 'fulfilled') setAchievements(achievementData.value);
      else failures.push('achievements');
      if (challengeData.status === 'fulfilled') setChallenges(challengeData.value);
      else failures.push('challenges');
      if (rankingData.status === 'fulfilled') setUsers(rankingData.value);
      else failures.push('roster');

      if (failures.length > 0) {
        setLoadError(`Some council instruments could not be synchronized: ${failures.join(', ')}.`);
      }
      setStatus('ready');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'The council chamber could not be synchronized.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#080706] text-[#e8ddc5] flex items-center justify-center overflow-hidden">
        <div className="ascend-council-loading relative text-center">
          <div className="absolute inset-1/2 w-56 h-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#722e35]/20 animate-spin [animation-duration:12s]" />
          <div className="ascend-seal w-20 h-20 rounded-full mx-auto grid place-items-center"><span className="relative z-10 text-2xl text-[#d7bd7a]">◈</span></div>
          <div className="mt-7 text-[9px] uppercase tracking-[.42em] text-[#806c45]">Opening the council chamber</div>
          <div className="mt-3 text-[10px] uppercase tracking-[.2em] text-[#4f4740]">Verifying the Inner Council seal</div>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen bg-[#080706] text-[#e8ddc5] flex items-center justify-center">
        <div className="text-center ascend-reveal max-w-md px-6">
          <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-[#722e35]" />
          <h1 className="ascend-display text-3xl">ACCESS DENIED</h1>
          <p className="text-sm text-[#756d60] mt-2">Council permissions are required for this chamber.</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-6 text-[10px] uppercase tracking-widest text-[#b89a5a]">Return to the world <ArrowRight className="w-3 h-3" /></Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#080706] text-[#e8ddc5] flex items-center justify-center">
        <div className="text-center ascend-reveal max-w-lg px-6">
          <div className="w-16 h-16 mx-auto mb-5 grid place-items-center rounded-full border border-[#722e35]/40 bg-[#722e35]/10 text-[#b26b72]"><ShieldCheck className="w-7 h-7" /></div>
          <div className="text-[9px] uppercase tracking-[.4em] text-[#806c45]">Council synchronization failed</div>
          <h1 className="ascend-display text-3xl mt-3">THE CHAMBER IS SEALED</h1>
          <p className="text-sm text-[#756d60] mt-3 leading-6">{loadError}</p>
          <button type="button" onClick={() => void loadDashboard()} className="inline-flex items-center gap-2 mt-7 border border-[#b89a5a]/25 px-5 py-3 text-[10px] uppercase tracking-[.18em] text-[#cbb783] hover:border-[#b89a5a]/55 transition-colors"><RotateCw className="w-3.5 h-3.5" /> Retry synchronization</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#e8ddc5] flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 py-12 w-full">
        {loadError && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#b89a5a]/20 bg-[#b89a5a]/[.035] px-4 py-3 text-[10px] uppercase tracking-[.12em] text-[#9b8a67]">
            <span>{loadError}</span>
            <button type="button" onClick={() => void loadDashboard()} className="inline-flex items-center gap-2 text-[#d7bd7a] hover:text-[#efe0b7]"><RotateCw className="w-3 h-3" /> Resync</button>
          </div>
        )}

        <section className="ascend-reveal relative overflow-hidden border border-[#b89a5a]/20 bg-[#0b0a09]/75 p-7 sm:p-10 mb-8">
          <div className="absolute -right-16 -top-24 text-[15rem] ascend-display text-[#b89a5a]/[.025] select-none">✦</div>
          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-7">
            <div>
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-[.42em] text-[#806c45]"><span className="w-8 h-px bg-[#b89a5a]/50" /> Inner Council <span className="w-8 h-px bg-[#b89a5a]/50" /></div>
              <h1 className="ascend-display text-4xl sm:text-6xl mt-4 tracking-[.12em] ascend-gold-text">CONTROL CHAMBER</h1>
              <p className="max-w-xl text-sm leading-6 text-[#756d60] mt-4">Guard the records, shape the trials, and keep the world worthy of the Order.</p>
            </div>
            <Link href="/admin/submissions" className="group shrink-0 inline-flex items-center gap-3 border border-[#b89a5a]/25 bg-[#b89a5a]/[.04] px-5 py-3 hover:border-[#b89a5a]/50 transition-all"><FileCheck className="w-4 h-4 text-[#b89a5a]" /><span className="text-[10px] uppercase tracking-[.18em] text-[#cbb783]">Moderation queue</span><span className="font-mono text-sm text-[#d7bd7a]">{pendingRecords.length}</span><ArrowRight className="w-3.5 h-3.5 text-[#806c45] transition-transform group-hover:translate-x-1" /></Link>
          </div>
          <div className="ascend-divider mt-8" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 text-[9px] uppercase tracking-[.2em] text-[#625b50]"><span className="inline-flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-[#5e806c]" /> Systems online</span><span>Records monitored</span><span>Season active</span><span>Access: council</span></div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-[#b89a5a]/10 border border-[#b89a5a]/10 mb-10">
          <Metric icon={<Users className="w-4 h-4" />} label="WANDERERS" value={users.length} />
          <Metric icon={<Gamepad2 className="w-4 h-4" />} label="TERRITORIES" value={games.length} />
          <Metric icon={<Trophy className="w-4 h-4" />} label="DEEDS" value={achievements.length} />
          <Metric icon={<Swords className="w-4 h-4" />} label="TRIALS" value={challenges.length} />
          <Metric icon={<FileCheck className="w-4 h-4" />} label="AWAITING REVIEW" value={pendingRecords.length} warning />
        </section>

        <div className="flex items-center gap-3 mb-5"><span className="text-[9px] uppercase tracking-[.38em] text-[#806c45]">Council instruments</span><div className="flex-1 ascend-divider" /></div>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#b89a5a]/10 border border-[#b89a5a]/10">
          <AdminLink href="/admin/submissions" icon={<FileCheck />} title="The Evidence Vault" text="Review submitted records and decide which deeds enter the archive." index="01" />
          <AdminLink href="/admin/games" icon={<Gamepad2 />} title="Territory Forge" text="Create and curate the games that define each competitive territory." index="02" />
          <AdminLink href="/admin/achievements" icon={<Trophy />} title="Relic Foundry" text="Author achievements, requirements, and the rewards that mark progression." index="03" />
          <AdminLink href="/admin/challenges" icon={<Swords />} title="Trial Engine" text="Schedule challenges and shape the rewards awaiting worthy competitors." index="04" />
          <AdminLink href="/admin/users" icon={<Users />} title="The Registry" text="Inspect the living roster of the Order and manage its records." index="05" />
          <AdminLink href="/admin/records" icon={<ScrollText />} title="Hall Records" text="Review the competitive record ledger and its current decisions." index="06" />
          <AdminLink href="/admin/settings" icon={<Settings />} title="Chamber Settings" text="Configure the operational settings of the council chamber." index="07" />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Metric({ icon, label, value, warning = false }: { icon: React.ReactNode; label: string; value: number; warning?: boolean }) {
  return <div className={`ascend-panel p-5 sm:p-6 min-h-28 ${warning ? 'bg-[#b89a5a]/[.045]' : ''}`}><div className={`flex items-center justify-between text-[9px] font-bold uppercase tracking-[.16em] ${warning ? 'text-[#b89a5a]' : 'text-[#756d60]'}`}><span>{label}</span>{icon}</div><div className={`text-3xl font-black font-mono mt-4 ${warning ? 'text-[#d7bd7a]' : 'text-[#e8ddc5]'}`}>{value}</div></div>;
}

function AdminLink({ href, icon, title, text, index }: { href: string; icon: React.ReactNode; title: string; text: string; index: string }) {
  return <Link href={href} className="group relative ascend-panel ascend-panel-hover p-7 min-h-52 overflow-hidden"><span className="absolute right-5 top-5 font-mono text-[10px] tracking-widest text-[#b89a5a]/20">{index}</span><div className="w-10 h-10 grid place-items-center border border-[#b89a5a]/15 text-[#b89a5a] mb-7 transition-all group-hover:border-[#b89a5a]/45 group-hover:bg-[#b89a5a]/[.05] group-hover:shadow-[0_0_30px_rgba(184,154,90,.08)]">{icon}</div><h3 className="ascend-display text-xl text-[#d8ccb3] group-hover:text-[#d7bd7a] transition-colors">{title}</h3><p className="text-xs text-[#756d60] leading-5 mt-2 max-w-sm">{text}</p><div className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[.22em] text-[#806c45] group-hover:text-[#d7bd7a]">Enter instrument <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></div></Link>;
}
