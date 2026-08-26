'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { getChallenges, createChallenge, getGames } from '@/lib/data/store';
import { Challenge, Game, ChallengeDifficulty } from '@/lib/types';
import { Swords, Plus } from 'lucide-react';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty>('HARD');
  const [xpReward, setXpReward] = useState('1500');
  const [rankingReward, setRankingReward] = useState('150');

  useEffect(() => {
    Promise.all([getChallenges(), getGames()]).then(([c, g]) => {
      setChallenges(c);
      setGames(g);
      if (g.length > 0) setGameId(g[0].id);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find(g => g.id === gameId) || games[0];
    if (!game) return;
    const created = await createChallenge({
      title,
      description,
      game_id: game.id,
      game_title: game.title,
      game_slug: game.slug,
      difficulty,
      xp_reward: parseInt(xpReward) || 1500,
      ranking_reward: parseInt(rankingReward) || 150,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'ACTIVE',
      requirements: '',
    });
    setChallenges([created, ...challenges]);
    setShowModal(false);
    setTitle('');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">
              <Swords className="w-4 h-4" /><span>Tournament Scheduler</span>
            </div>
            <h1 className="text-3xl font-black text-white">WEEKLY CHALLENGES CONTROL</h1>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /><span>SCHEDULE NEW CHALLENGE</span></Button>
        </div>
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><th className="py-4 px-6">Challenge Title</th><th className="py-4 px-6">Game</th><th className="py-4 px-6">Difficulty</th><th className="py-4 px-6">XP & RP Payout</th><th className="py-4 px-6">Entries</th></tr></thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {challenges.map(ch => <tr key={ch.id} className="hover:bg-slate-900/60"><td className="py-4 px-6 font-bold text-white"><div>{ch.title}</div><div className="text-xs text-slate-400 font-normal">{ch.description}</div></td><td className="py-4 px-6 font-mono text-slate-300">{ch.game_title || 'Game'}</td><td className="py-4 px-6 font-bold text-amber-400">{ch.difficulty}</td><td className="py-4 px-6 font-mono text-xs"><span className="text-amber-400 font-bold">+{ch.xp_reward} XP</span> / <span className="text-violet-400 font-bold">+{ch.ranking_reward} RP</span></td><td className="py-4 px-6 font-mono font-bold text-slate-300">{ch.participant_count.toLocaleString()}</td></tr>)}
            </tbody>
          </table>
        </div>
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"><div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-violet-500/30"><h2 className="text-xl font-black text-white mb-4">SCHEDULE WEEKLY CHALLENGE</h2><form onSubmit={handleCreate} className="space-y-4">
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Game</label><select value={gameId} onChange={e => setGameId(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none">{games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></div>
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Title</label><input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div>
          <div className="grid grid-cols-3 gap-3"><div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Difficulty</label><select value={difficulty} onChange={e => setDifficulty(e.target.value as ChallengeDifficulty)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"><option value="EASY">EASY</option><option value="MEDIUM">MEDIUM</option><option value="HARD">HARD</option><option value="EXPERT">EXPERT</option><option value="INSANE">INSANE</option></select></div><div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">XP Reward</label><input type="number" required value={xpReward} onChange={e => setXpReward(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div><div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">RP Reward</label><input type="number" required value={rankingReward} onChange={e => setRankingReward(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div></div>
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label><textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div>
          <div className="flex justify-end space-x-3 pt-2"><Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" variant="primary">Schedule Event</Button></div>
        </form></div></div>}
      </main>
      <Footer />
    </div>
  );
}
