'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getRecords, getGames, getAchievements, getChallenges, getRankings } from '@/lib/data/store';
import { RecordSubmission, Game, Achievement, Challenge, Profile } from '@/lib/types';
import { ShieldCheck, Users, Gamepad2, Trophy, Swords, FileCheck, ArrowRight } from 'lucide-react';
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
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      const staff = profile?.role === 'MODERATOR' || profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';
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
    load().catch(() => active && setAuthorized(false));
    return () => { active = false; };
  }, []);

  if (authorized === null) return <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center">Checking access…</div>;
  if (!authorized) return <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center"><div className="text-center"><ShieldCheck className="w-12 h-12 mx-auto mb-4 text-red-400" /><h1 className="text-2xl font-black">ACCESS DENIED</h1><p className="text-slate-400 mt-2">Staff permissions are required.</p><Link href="/" className="inline-block mt-6 text-violet-400">Return home</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-2"><ShieldCheck className="w-4 h-4 text-violet-400" /><span>Platform Administration</span></div><h1 className="text-4xl font-black text-white">ADMIN CONTROL PANEL</h1></div>
          <Link href="/admin/submissions" className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-amber-500/30"><FileCheck className="w-4 h-4" /><span>MODERATION QUEUE ({pendingRecords.length})</span></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <Metric icon={<Users className="w-4 h-4" />} label="TOTAL USERS" value={users.length} />
          <Metric icon={<Gamepad2 className="w-4 h-4" />} label="GAMES" value={games.length} />
          <Metric icon={<Trophy className="w-4 h-4" />} label="ACHIEVEMENTS" value={achievements.length} />
          <Metric icon={<Swords className="w-4 h-4" />} label="CHALLENGES" value={challenges.length} />
          <Metric icon={<FileCheck className="w-4 h-4" />} label="PENDING RECS" value={pendingRecords.length} warning />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AdminLink href="/admin/submissions" icon={<FileCheck className="w-8 h-8 text-amber-400 mb-3" />} title="Moderate Submissions" text="Verify evidence for competitive records." />
          <AdminLink href="/admin/games" icon={<Gamepad2 className="w-8 h-8 text-blue-400 mb-3" />} title="Game Manager" text="Create and update competitive game metadata." />
          <AdminLink href="/admin/achievements" icon={<Trophy className="w-8 h-8 text-purple-400 mb-3" />} title="Achievement Creator" text="Define achievement requirements and rewards." />
          <AdminLink href="/admin/challenges" icon={<Swords className="w-8 h-8 text-emerald-400 mb-3" />} title="Challenge Scheduler" text="Schedule challenges and competitive rewards." />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Metric({ icon, label, value, warning = false }: { icon: React.ReactNode; label: string; value: number; warning?: boolean }) {
  return <div className={`glass-panel p-5 rounded-2xl border ${warning ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'}`}><div className={`flex items-center justify-between text-xs font-bold uppercase ${warning ? 'text-amber-400' : 'text-slate-400'}`}><span>{label}</span>{icon}</div><div className={`text-3xl font-black font-mono mt-2 ${warning ? 'text-amber-300' : 'text-white'}`}>{value}</div></div>;
}

function AdminLink({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return <Link href={href} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-violet-500/50 group transition-all">{icon}<h3 className="text-lg font-bold text-white group-hover:text-violet-300">{title}</h3><p className="text-xs text-slate-400 mt-1">{text}</p><div className="mt-4 flex items-center text-xs font-bold text-violet-400"><span>Open</span><ArrowRight className="w-4 h-4 ml-1" /></div></Link>;
}
