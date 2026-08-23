'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { RarityBadge } from '@/components/ui/RarityBadge';
import { getAchievements, createAchievement, getGames } from '@/lib/data/store';
import { Achievement, Game, AchievementRarity } from '@/lib/types';
import { Trophy, Plus } from 'lucide-react';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState<AchievementRarity>('RARE');
  const [xpReward, setXpReward] = useState('500');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    Promise.all([getAchievements(), getGames()]).then(([a, g]) => {
      setAchievements(a);
      setGames(g);
      if (g.length > 0) setGameId(g[0].id);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find(g => g.id === gameId) || games[0];
    const created = await createAchievement({
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      game_id: game.id,
      game_title: game.title,
      game_slug: game.slug,
      title,
      description,
      icon_url: 'Trophy',
      rarity,
      xp_reward: parseInt(xpReward) || 500,
      requirements,
      is_active: true,
    });
    setAchievements([created, ...achievements]);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">
              <Trophy className="w-4 h-4" />
              <span>Achievement Creator</span>
            </div>
            <h1 className="text-3xl font-black text-white">ACHIEVEMENTS ENGINE</h1>
          </div>

          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span>CREATE ACHIEVEMENT</span>
          </Button>
        </div>

        {/* ACHIEVEMENTS TABLE */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-6">Achievement</th>
                <th className="py-4 px-6">Game</th>
                <th className="py-4 px-6">Rarity</th>
                <th className="py-4 px-6">XP Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {achievements.map(ach => (
                <tr key={ach.id} className="hover:bg-slate-900/60">
                  <td className="py-4 px-6 font-bold text-white">
                    <div>{ach.title}</div>
                    <div className="text-xs text-slate-400 font-normal">{ach.description}</div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">{ach.game_title || 'Game'}</td>
                  <td className="py-4 px-6">
                    <RarityBadge rarity={ach.rarity} size="sm" />
                  </td>
                  <td className="py-4 px-6 font-mono text-amber-400 font-bold">+{ach.xp_reward} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CREATE MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-violet-500/30">
              <h2 className="text-xl font-black text-white mb-4">CREATE NEW ACHIEVEMENT</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Game</label>
                  <select
                    value={gameId}
                    onChange={e => setGameId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"
                  >
                    {games.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Rarity</label>
                    <select
                      value={rarity}
                      onChange={e => setRarity(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none uppercase"
                    >
                      <option value="COMMON">COMMON</option>
                      <option value="UNCOMMON">UNCOMMON</option>
                      <option value="RARE">RARE</option>
                      <option value="EPIC">EPIC</option>
                      <option value="LEGENDARY">LEGENDARY</option>
                      <option value="MYTHIC">MYTHIC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">XP Reward</label>
                    <input
                      type="number"
                      required
                      value={xpReward}
                      onChange={e => setXpReward(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Requirements</label>
                  <input
                    type="text"
                    required
                    value={requirements}
                    onChange={e => setRequirements(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Create Record</Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
