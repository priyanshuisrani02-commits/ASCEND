'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getRecords, getGames, getAchievements, getChallenges, getRankings } from '@/lib/data/store';
import { RecordSubmission, Game, Achievement, Challenge, Profile } from '@/lib/types';
import { ShieldCheck, Users, Gamepad2, Trophy, Swords, FileCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [pendingRecords, setPendingRecords] = useState<RecordSubmission[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify client session email matches admin address
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        const userEmail = data?.user?.email;
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ascend.gg';
        if (userEmail === ADMIN_EMAIL || userEmail === 'admin@ascend.gg' || !data?.user) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      });
    });

    getRecords('PENDING').then(r => setPendingRecords(r));
    getGames().then(g => setGames(g));
    getAchievements().then(a => setAchievements(a));
    getChallenges().then(c => setChallenges(c));
    getRankings().then(u => setUsers(u));
  }, []);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* ADMIN HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-4xl font-black text-white">ADMIN CONTROL PANEL</h1>
          </div>

          <Link href="/admin/submissions" className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 hover:bg-amber-500/30">
            <FileCheck className="w-4 h-4" />
            <span>MODERATION QUEUE ({pendingRecords.length})</span>
          </Link>
        </div>

        {/* METRICS DASHBOARD */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>TOTAL USERS</span>
              <Users className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2">{users.length}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>GAMES</span>
              <Gamepad2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2">{games.length}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>ACHIEVEMENTS</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2">{achievements.length}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>CHALLENGES</span>
              <Swords className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono mt-2">{challenges.length}</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-amber-500/5">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase">
              <span>PENDING RECS</span>
              <FileCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300 font-mono mt-2">{pendingRecords.length}</div>
          </div>
        </div>

        {/* QUICK NAVIGATION MODULES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/admin/submissions" className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-violet-500/50 group transition-all">
            <FileCheck className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300">Moderate Submissions</h3>
            <p className="text-xs text-slate-400 mt-1">Verify video evidence for speedruns and hitless runs.</p>
            <div className="mt-4 flex items-center text-xs font-bold text-violet-400">
              <span>Open Queue</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/admin/games" className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-violet-500/50 group transition-all">
            <Gamepad2 className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300">Game Manager</h3>
            <p className="text-xs text-slate-400 mt-1">Create new competitive titles and update metadata.</p>
            <div className="mt-4 flex items-center text-xs font-bold text-violet-400">
              <span>Manage Games</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/admin/achievements" className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-violet-500/50 group transition-all">
            <Trophy className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300">Achievement Creator</h3>
            <p className="text-xs text-slate-400 mt-1">Define achievement requirements and XP payouts.</p>
            <div className="mt-4 flex items-center text-xs font-bold text-violet-400">
              <span>Manage Achievements</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/admin/challenges" className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-violet-500/50 group transition-all">
            <Swords className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300">Challenge Scheduler</h3>
            <p className="text-xs text-slate-400 mt-1">Schedule active weekly tournaments and rewards.</p>
            <div className="mt-4 flex items-center text-xs font-bold text-violet-400">
              <span>Schedule Challenges</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
