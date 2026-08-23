'use client';

import React, { useState, useEffect, use } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { AchievementCard } from '@/components/AchievementCard';
import { ChallengeCard } from '@/components/ChallengeCard';
import { Button } from '@/components/ui/Button';
import { RecordSubmissionModal } from '@/components/RecordSubmissionModal';
import { getGameBySlug, getAchievements, getChallenges, getRankings, getRecords, getGames } from '@/lib/data/store';
import { Game, Achievement, Challenge, Profile, RecordSubmission } from '@/lib/types';
import { Trophy, Users, Swords, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [game, setGame] = useState<Game | null>(null);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [rankings, setRankings] = useState<Profile[]>([]);
  const [records, setRecords] = useState<RecordSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'records'>('overview');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  useEffect(() => {
    getGames().then(gList => setAllGames(gList));

    getGameBySlug(slug).then(foundGame => {
      if (foundGame) {
        setGame(foundGame);
        getAchievements(foundGame.slug).then(achData => setAchievements(achData));
        getChallenges().then(chData => setChallenges(chData.filter(c => c.game_slug?.toLowerCase() === slug.toLowerCase() || c.game_id === foundGame.id)));
        getRankings().then(rData => setRankings(rData));
        getRecords('VERIFIED').then(recData => setRecords(recData.filter(r => r.game_id === foundGame.id || r.game_title?.toLowerCase() === foundGame.title.toLowerCase())));
      }
    });
  }, [slug]);

  if (!game) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
        <NavbarWrapper />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading game profile...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 w-full pb-20">
        
        {/* GAME HERO BANNER */}
        <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-950">
          <img src={game.banner_url} alt={game.title} className="w-full h-full object-cover opacity-40 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/60 to-transparent" />
          
          <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-end space-x-6">
              <img
                src={game.cover_url}
                alt={game.title}
                className="w-28 h-36 sm:w-36 sm:h-48 rounded-2xl object-cover border-2 border-violet-500/50 shadow-2xl shrink-0"
              />
              <div>
                <span className="px-3 py-1 rounded-md bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 uppercase tracking-widest">
                  {game.genre}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">{game.title}</h1>
                <div className="flex items-center space-x-4 mt-2 text-xs font-semibold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span>{game.player_count.toLocaleString()} Competitors</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{game.achievement_count} Achievements</span>
                  </span>
                </div>
              </div>
            </div>

            <Button variant="primary" size="md" onClick={() => setSubmitModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              <span>SUBMIT COMPETITIVE RECORD</span>
            </Button>
          </div>
        </div>

        {/* CONTENT NAVIGATION TABS */}
        <div className="border-b border-slate-800 bg-slate-950/80 sticky top-20 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'achievements', label: `Achievements (${achievements.length})` },
              { key: 'challenges', label: `Weekly Challenges (${challenges.length})` },
              { key: 'records', label: `Verified Records (${records.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={clsx(
                  'py-4 text-sm font-bold border-b-2 transition-all',
                  activeTab === tab.key
                    ? 'border-violet-500 text-violet-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-2">About {game.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{game.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white mb-4">Featured Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.slice(0, 4).map(ach => (
                      <AchievementCard key={ach.id} achievement={ach} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Top Players in {game.title}</h3>
                  <div className="space-y-3">
                    {rankings.slice(0, 5).map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono font-bold text-amber-400">#{i + 1}</span>
                          <img src={p.avatar_url} alt={p.username} className="w-7 h-7 rounded-lg object-cover" />
                          <span className="font-bold text-slate-200">{p.username}</span>
                        </div>
                        <span className="font-mono text-violet-400 font-bold">{p.ranking_points} RP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map(ach => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map(ch => (
                <ChallengeCard key={ch.id} challenge={ch} />
              ))}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4">
              {records.length > 0 ? (
                records.map(rec => (
                  <div key={rec.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={rec.user_avatar} alt={rec.username} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white text-base">{rec.title}</div>
                        <div className="text-xs text-slate-400">{rec.username} • {rec.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-amber-400 text-lg">{rec.score_value} {rec.score_unit}</div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
                  <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No verified records yet for {game.title}. Be the first to submit!</p>
                </div>
              )}
            </div>
          )}

        </div>

        <RecordSubmissionModal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          games={allGames}
        />

      </main>

      <Footer />
    </div>
  );
}
