'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { getActivities } from '@/lib/data/store';
import { ActivityEvent } from '@/lib/types';
import { Trophy, Gamepad2, Swords, Shield, Flame, ArrowRight, Activity, Sparkles, ChevronRight, LogIn, Crown, ShieldAlert } from 'lucide-react';

export default function HomePage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    getActivities().then(a => setActivities(a));
  }, []);

  const portalModules = [
    {
      title: 'Games Realm',
      subtitle: 'COMPETITIVE TITLES',
      desc: 'Dive into supported titles, track achievement milestones, and inspect global benchmarks.',
      href: '/games',
      icon: Gamepad2,
      badge: '6 Titles Active',
      accent: 'border-blue-500/40 hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]',
      iconBg: 'bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-900 border-blue-500/50 text-blue-400',
      actionText: 'Dive Into Games Realm',
    },
    {
      title: 'Weekly Trials',
      subtitle: 'LIVE QUEST EVENTS',
      desc: 'Conquer timed arena challenges, achieve high scores, and claim legendary RP payouts.',
      href: '/challenges',
      icon: Swords,
      badge: '3 Live Trials',
      accent: 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]',
      iconBg: 'bg-gradient-to-tr from-amber-950 via-slate-900 to-yellow-900 border-amber-500/50 text-amber-400',
      actionText: 'Enter Weekly Trials',
    },
    {
      title: 'Global Rankings',
      subtitle: 'PRESTIGE PODIUM',
      desc: 'Climb the global all-time and seasonal leaderboard. Turn your records into reputation.',
      href: '/rankings',
      icon: Trophy,
      badge: 'Live Standings',
      accent: 'border-violet-500/40 hover:border-violet-400 shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:shadow-[0_0_35px_rgba(124,58,237,0.35)]',
      iconBg: 'bg-gradient-to-tr from-violet-950 via-slate-900 to-purple-900 border-violet-500/50 text-violet-400',
      actionText: 'Conquer Standings',
    },
    {
      title: 'Achievement Vault',
      subtitle: 'PARCHMENT & CRESTS',
      desc: 'Explore achievements across Common, Rare, Epic, Legendary, and Mythic rarity tiers.',
      href: '/achievements',
      icon: Shield,
      badge: '1,250+ Scrolls',
      accent: 'border-purple-500/40 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]',
      iconBg: 'bg-gradient-to-tr from-purple-950 via-slate-900 to-pink-900 border-purple-500/50 text-purple-400',
      actionText: 'Explore Vault Scrolls',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-violet-600 selection:text-white">
      <NavbarWrapper />

      <main className="flex-1 flex flex-col justify-center">
        
        {/* CLEAN HIGH-IMPACT HERO SECTION */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 overflow-hidden">
          {/* AMBIENT BACKGROUND GLOW */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* BADGE */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span>Competitive Gaming Achievement Realm</span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02]">
              PLAY. ACHIEVE. <br />
              <span className="violet-gradient-text">ASCEND.</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed mx-auto mt-6">
              Turn your gaming achievements into competitive records, rankings, and global reputation.
            </p>

            {/* ACTION BUTTONS */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/games" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4 text-base tracking-wider font-bold">
                  <span>EXPLORE THE REALM</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-base tracking-wider font-bold">
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>SIGN IN TO PROFILE</span>
                </Button>
              </Link>
            </div>

            {/* COMPACT METRICS BAR */}
            <div className="pt-10 mt-10 border-t border-slate-800/80 max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">140K+</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Adventurers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-violet-400 font-mono">1,250+</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Quests & Scrolls</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">$50K+</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">RP Bounties</div>
              </div>
            </div>

          </div>
        </section>

        {/* TEMPTING VISITOR LOGIN / REALM ACCESS BANNER (PLACED PROMINENTLY NEAR TOP) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-violet-500/40 bg-gradient-to-r from-violet-950/40 via-slate-950 to-indigo-950/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/50 flex items-center justify-center text-violet-300 shrink-0">
                <Crown className="w-7 h-7 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">ENTER THE COMPETITIVE ARENA</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sign in or create your player profile to claim +1,000 Starting RP & unlock legendary quests.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="md" className="w-full sm:w-auto">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  <span>SIGN IN</span>
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  <span>CREATE ACCOUNT</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FLOATING INFINITE MARQUEE LIVE ACTIVITY TICKER */}
        <section className="border-y border-slate-800/80 bg-slate-950/90 py-4 overflow-hidden relative">
          <div className="flex items-center space-x-3 px-6 mb-2">
            <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">LIVE REALM ACTIVITY</h2>
          </div>

          <div className="overflow-hidden w-full relative">
            <div className="animate-marquee space-x-8 py-2">
              {/* Duplicate array to ensure seamless infinite loop */}
              {[...activities, ...activities, ...activities].map((act, i) => (
                <div key={`${act.id}-${i}`} className="inline-flex items-center space-x-3 glass-panel px-4 py-2 rounded-2xl border border-slate-800 shrink-0">
                  <img src={act.user_avatar} alt={act.username} className="w-7 h-7 rounded-lg object-cover border border-violet-500/50" />
                  <span className="font-bold text-white text-xs">{act.username}</span>
                  <span className="text-xs text-slate-300">{act.title}</span>
                  <span className="text-[10px] font-mono text-violet-400 font-bold">({act.created_at})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EYE-CATCHING STYLED PORTAL CARDS */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">REALM PORTALS</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">SELECT YOUR DESTINATION</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portalModules.map(mod => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.title}
                  href={mod.href}
                  className={`glass-panel portal-glow p-8 rounded-3xl border transition-all duration-300 group flex flex-col justify-between hover:-translate-y-2 ${mod.accent}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${mod.iconBg}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-slate-950/90 border border-slate-700/80 text-xs font-bold text-slate-200 font-mono shadow-inner">
                        {mod.badge}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">{mod.subtitle}</div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-violet-300 transition-colors tracking-wide">
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-normal">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-violet-300 group-hover:text-white relative z-10">
                    <span className="uppercase tracking-wider">{mod.actionText}</span>
                    <span className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CLEAN CTA */}
        <section className="pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-violet-500/30 relative">
            <div className="max-w-xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white">READY TO ASCEND?</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Join competitive gamers tracking achievements, claiming rewards, and conquering leaderboards.
              </p>
              <div className="pt-2">
                <Link href="/signup">
                  <Button variant="primary" size="lg" className="px-8 font-bold tracking-wider">
                    <span>CREATE PLAYER PROFILE</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
