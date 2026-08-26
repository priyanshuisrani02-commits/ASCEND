'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { getGames, addGame } from '@/lib/data/store';
import { Game } from '@/lib/types';
import { Gamepad2, Plus } from 'lucide-react';

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Tactical Shooter');
  const [showModal, setShowModal] = useState(false);

  const defaultCoverUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80';
  const defaultBannerUrl = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80';

  useEffect(() => {
    getGames().then(data => setGames(data));
  }, []);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await addGame({
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      description,
      genre,
      cover_url: defaultCoverUrl,
      banner_url: defaultBannerUrl,
      player_count: 500,
      achievement_count: 10,
    });
    setGames([created, ...games]);
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
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-widest mb-2"><Gamepad2 className="w-4 h-4" /><span>Game Management</span></div>
            <h1 className="text-3xl font-black text-white">SUPPORTED TITLES</h1>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /><span>CREATE NEW GAME</span></Button>
        </div>
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><th className="py-4 px-6">Title</th><th className="py-4 px-6">Genre</th><th className="py-4 px-6">Players</th><th className="py-4 px-6">Achievements</th></tr></thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {games.map(g => <tr key={g.id} className="hover:bg-slate-900/60"><td className="py-4 px-6 font-bold text-white flex items-center space-x-3"><img src={g.cover_url || undefined} alt={g.title} className="w-9 h-12 rounded-lg object-cover" /><span>{g.title}</span></td><td className="py-4 px-6 font-mono text-slate-300">{g.genre}</td><td className="py-4 px-6 font-mono text-violet-400 font-bold">{g.player_count.toLocaleString()}</td><td className="py-4 px-6 font-mono text-amber-400 font-bold">{g.achievement_count}</td></tr>)}
            </tbody>
          </table>
        </div>
        {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"><div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-violet-500/30"><h2 className="text-xl font-black text-white mb-4">ADD NEW GAME</h2><form onSubmit={handleCreateGame} className="space-y-4">
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Game Title</label><input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Genre</label><input type="text" required value={genre} onChange={e => setGenre(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Description</label><textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /></div>
          <div className="flex justify-end space-x-3 pt-2"><Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button type="submit" variant="primary">Create Title</Button></div>
        </form></div></div>}
      </main>
      <Footer />
    </div>
  );
}
