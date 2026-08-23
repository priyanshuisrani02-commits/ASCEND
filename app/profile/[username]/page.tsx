'use client';

import React, { useState, useEffect, use } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { XPProgress } from '@/components/ui/XPProgress';
import { AchievementCard } from '@/components/AchievementCard';
import { getProfileByUsername, getMyAchievements, getRecords, getActivities } from '@/lib/data/store';
import { Profile, Achievement, RecordSubmission, ActivityEvent } from '@/lib/types';
import { Trophy, Crown, Flame, Shield, Swords, CheckCircle2, Calendar, Award } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [records, setRecords] = useState<RecordSubmission[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    getProfileByUsername(username).then(p => {
      if (p) {
        setProfile(p);
        getMyAchievements(p.id).then(a => setAchievements(a));
        getRecords('VERIFIED').then(r => setRecords(r.filter(rec => rec.username?.toLowerCase() === p.username.toLowerCase())));
        getActivities().then(act => setActivities(act.filter(a => a.username.toLowerCase() === p.username.toLowerCase())));
      }
    });
  }, [username]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
        <NavbarWrapper />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading competitor profile...</div>
        <Footer />
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const rareCount = achievements.filter(a => a.is_unlocked && (a.rarity === 'RARE' || a.rarity === 'EPIC')).length;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 w-full pb-20">
        
        {/* PROFILE HEADER HERO */}
        <div className="relative pt-12 pb-16 bg-gradient-to-b from-violet-950/30 via-slate-950 to-[#090a0f] border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-violet-500/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                />
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-white">{profile.username}</h1>
                    {profile.is_admin && (
                      <span className="px-2.5 py-0.5 rounded-md bg-violet-600/30 border border-violet-500/50 text-violet-300 text-xs font-bold uppercase tracking-wider">
                        MODERATOR
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 max-w-lg leading-relaxed">{profile.bio}</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                    {profile.favorite_games.map(g => (
                      <span key={g} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* STATS POD */}
              <div className="glass-panel p-6 rounded-2xl border border-violet-500/30 w-full md:w-80 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-400">GLOBAL RANKING</span>
                  <span className="text-amber-400 font-mono text-base">#1,842</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-400">RANKING POINTS</span>
                  <span className="text-violet-400 font-mono text-base">{profile.ranking_points} RP</span>
                </div>
                <XPProgress xp={profile.xp} level={profile.level} />
              </div>

            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">EARNED ACHIEVEMENTS</div>
              <div className="text-2xl font-black text-white font-mono mt-1">{unlockedCount}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">RARE & EPIC</div>
              <div className="text-2xl font-black text-blue-300 font-mono mt-1">{rareCount}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">VERIFIED RECORDS</div>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1">{records.length}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">TOTAL XP</div>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-1">{profile.xp.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* PROFILE TABS / SECTIONS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* EARNED ACHIEVEMENTS SHOWCASE */}
          <div>
            <h3 className="text-2xl font-black text-white mb-6">COMPETITIVE ACHIEVEMENTS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(ach => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </div>

          {/* VERIFIED RECORDS */}
          {records.length > 0 && (
            <div>
              <h3 className="text-2xl font-black text-white mb-6">VERIFIED RECORDS</h3>
              <div className="space-y-4">
                {records.map(rec => (
                  <div key={rec.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-base">{rec.title}</div>
                      <div className="text-xs text-slate-400">{rec.game_title} • {rec.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-amber-400 text-lg">{rec.score_value} {rec.score_unit}</div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        VERIFIED PROOF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}
