'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getRecords, getGames, getAchievements, getChallenges, getRankings } from '@/lib/data/store';
import { RecordSubmission, Game, Achievement, Challenge, Profile } from '@/lib/types';
import { ShieldCheck, Users, Gamepad2, Trophy, Swords, FileCheck, ArrowRight, Activity, Settings, ScrollText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [pendingRecords, setPendingRecords] = useState<RecordSubmission[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (active) setAuthorized(false);
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
      const staff = profile?.is_admin === true;
      if (!active) return;
      setAuthorized(staff);
      if (!staff) return;

      const [records, gameData, achievementData, challengeData, rankingData] = await Promise.all([
        getRecords('PENDING'), getGames(), getAchievements(), getChallenges(), getRankings(),
      ]);
      if (!active) return;
      setPendingRecords(records);
      setGames(gameData);
      setAchievements(achievementData);
      setChallenges(challengeData);
      setUsers(rankingData);
    };
    void load().catch(() => active && setAuthorized(false));
    return () => { active = false; };
  }, []);

  if (authorized === null) return <div className="min-h-screen bg-[#080706] text-[#e8ddc5] flex items-center justify-center"><div className="text-center"><div className="ascend-seal w-16 h-16 rounded-full mx-auto animate-pulse"><span className="relative z-10 text-xl text-[#d7bd7a]">✦</span></div><p className="mt-6 text-[9px] uppercase tracking-[.38em] text-[#806c45]">Opening the council chamber</p></div></div>;
  if (!authorized) return <div className="min-h-screen bg-[#080706] text-[#e8ddc5] flex items-center justify-center"><div className="text-center ascend-reveal"><ShieldCheck className="w-12 h-12 mx-auto mb-4 text-[#722e35]" /><h1 className="ascend-display text-3xl">ACCESS DENIED</h1><p className="text-sm text-[#756d60] mt-2">Council permissions are required.</p><Link href="/" className="inline-flex items-center gap-2 mt-6 text-[10px] uppercase tracking-widest text-[#b89a5a]">Return to the world <ArrowRight className="w-3 h-3" /></Link></div></div>;

  return (
    <div className="min-h-screen text-[#e8ddc5] flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 py-12 w-full">
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
