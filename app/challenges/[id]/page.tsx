'use client';

import React, { useState, useEffect, use } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { getChallengeById, joinChallenge, getRankings } from '@/lib/data/store';
import { Challenge, Profile } from '@/lib/types';
import { Swords, Trophy, Flame, UserCheck } from 'lucide-react';

export default function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getChallengeById(id), getRankings()]).then(([ch, rankings]) => {
      if (!active) return;
      if (ch) { setChallenge(ch); setJoined(ch.user_joined ?? false); }
      setParticipants(rankings.slice(0, 5));
    }).catch(error => {
      if (active) setErrorMsg(error instanceof Error ? error.message : 'Unable to load this trial.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const handleJoin = async () => {
    if (!challenge) return;
    setErrorMsg('');
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Please sign in to enter a trial.');
      await joinChallenge(challenge.id, user.id);
      setJoined(true);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to enter this trial.');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between"><NavbarWrapper /><div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading challenge parameters...</div><Footer /></div>;
  if (!challenge) return <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between"><NavbarWrapper /><div className="max-w-7xl mx-auto px-4 py-20 text-center"><p className="text-slate-400">{errorMsg || 'Challenge not found.'}</p></div><Footer /></div>;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-violet-500/30 space-y-8 relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6"><div><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{challenge.game_title || 'Game Challenge'}</span><h1 className="text-3xl sm:text-5xl font-black text-white mt-1">{challenge.title}</h1></div><span className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider self-start sm:self-center">{challenge.difficulty} DIFFICULTY</span></div>
          <div className="space-y-4"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description & Requirements</h3><p className="text-sm sm:text-base text-slate-300 leading-relaxed">{challenge.description}</p><div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1"><div className="font-bold text-violet-400 uppercase tracking-wider">Submission Criterion:</div><div>{challenge.requirements}</div></div></div>
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6"><div className="flex items-center space-x-6"><div><div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">XP REWARD</div><div className="font-mono text-xl font-black text-amber-400 flex items-center space-x-1"><Flame className="w-5 h-5" /><span>+{challenge.xp_reward} XP</span></div></div><div><div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">RP REWARD</div><div className="font-mono text-xl font-black text-violet-400 flex items-center space-x-1"><Trophy className="w-5 h-5" /><span>+{challenge.ranking_reward} RP</span></div></div></div>{joined ? <span className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center space-x-2"><UserCheck className="w-5 h-5" /><span>CHALLENGE ENTERED</span></span> : <Button variant="primary" size="lg" onClick={handleJoin}><Swords className="w-5 h-5 mr-2" /><span>ENTER CHALLENGE NOW</span></Button>}</div>
          {errorMsg && <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}
        </div>
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800"><h3 className="text-xl font-black text-white mb-6">CHALLENGE COMPETITORS ({challenge.participant_count})</h3><div className="divide-y divide-slate-800">{participants.map((p, idx) => <div key={p.id} className="py-4 flex items-center justify-between"><div className="flex items-center space-x-4"><span className="font-mono font-bold text-slate-400 w-6">#{idx + 1}</span><img src={p.avatar_url || ''} alt={p.username} className="w-10 h-10 rounded-xl object-cover" /><div><div className="font-bold text-white text-sm">{p.username}</div><div className="text-xs text-slate-400">Level {p.level} • {p.ranking_points} RP</div></div></div><span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">IN PROGRESS</span></div>)}</div></div>
      </main>
      <Footer />
    </div>
  );
}
