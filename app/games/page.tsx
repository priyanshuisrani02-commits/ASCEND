'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { GameCard } from '@/components/GameCard';
import { getGames } from '@/lib/data/store';
import { Game } from '@/lib/types';
import { Search, Gamepad2 } from 'lucide-react';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getGames();
        if (active) setGames(data);
      } catch (error) {
        if (active) setErrorMsg(error instanceof Error ? error.message : 'Unable to load the games directory.');
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const genres = ['ALL', 'Tactical Shooter', 'Action RPG', 'Battle Royale', 'Sports / Action', 'Sandbox Survival'];
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) || game.description.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'ALL' || game.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10"><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest mb-3"><Gamepad2 className="w-4 h-4" /><span>Supported Titles</span></div><h1 className="text-4xl sm:text-5xl font-black text-white">GAMES DIRECTORY</h1><p className="text-sm text-slate-400 mt-2 max-w-2xl">Explore supported competitive titles, discover achievement challenges, and check top player benchmarks.</p></div>
        {errorMsg && <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10"><div className="relative w-full md:w-96"><Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" /><input type="text" placeholder="Search game titles or genres..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div><div className="flex flex-wrap items-center gap-2 w-full md:w-auto">{genres.map(genre => <button key={genre} onClick={() => setSelectedGenre(genre)} className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedGenre === genre ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>{genre}</button>)}</div></div>
        {filteredGames.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredGames.map(game => <GameCard key={game.id} game={game} />)}</div> : <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 my-12"><Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-300">NO GAMES FOUND</h3><p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or genre filter.</p></div>}
      </main>
      <Footer />
    </div>
  );
}
