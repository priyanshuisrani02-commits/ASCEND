'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getGames } from '@/lib/data/store';
import { getDiscoveries } from '@/lib/data/exploration';
import { Discovery, Game } from '@/lib/types';
import { Compass, Eye, Gem, MapPin, ScrollText, Sparkles } from 'lucide-react';

const icons = { SECRET: Eye, RELIC: Gem, LORE: ScrollText, LANDMARK: MapPin } as const;

export default function DiscoveriesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const loadedGames = await getGames();
        const batches = await Promise.all(loadedGames.map((game) => getDiscoveries(game.id)));
        if (!alive) return;
        setGames(loadedGames);
        setDiscoveries(batches.flat());
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Unable to map the hidden regions.');
      }
    };
    void load();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => selectedGame === 'ALL' ? discoveries : discoveries.filter((item) => item.game_id === selectedGame), [discoveries, selectedGame]);
  const found = filtered.filter((item) => item.discovered).length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <header className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-violet-950/30 p-8 sm:p-12 mb-8">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative max-w-3xl"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300"><Compass className="w-4 h-4" /> World Atlas / Uncharted</div><h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight text-white">THE HIDDEN <span className="text-cyan-300">FRONTIER</span></h1><p className="mt-3 text-sm leading-relaxed text-slate-400">Some of ASCEND is deliberately left off the obvious path. Search the worlds, uncover secrets, and turn discoveries into permanent progression.</p></div>
        </header>
        {error && <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300">{error}</div>}
        <div className="mb-8 flex flex-wrap gap-2"><button onClick={() => setSelectedGame('ALL')} className={`rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${selectedGame === 'ALL' ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>All Realms</button>{games.map((game) => <button key={game.id} onClick={() => setSelectedGame(game.id)} className={`rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${selectedGame === game.id ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>{game.title}</button>)}</div>
        <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-black text-white">DISCOVERY LOG</h2><p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{found} / {filtered.length} uncovered</p></div><div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300"><Sparkles className="w-4 h-4" /> Permanent XP</div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map((item) => { const Icon = icons[item.discovery_type]; const game = games.find((entry) => entry.id === item.game_id); return <div key={item.id} className={`rounded-2xl border p-5 ${item.discovered ? 'border-emerald-500/25 bg-emerald-950/10' : 'border-slate-800 bg-slate-950/70'}`}><div className="flex items-start justify-between gap-3"><div className={`grid h-11 w-11 place-items-center rounded-xl border ${item.discovered ? 'border-emerald-500/30 text-emerald-300' : 'border-slate-800 text-slate-600'}`}><Icon className="w-5 h-5" /></div><span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{item.discovery_type}</span></div><div className="mt-5 text-[9px] font-black uppercase tracking-widest text-cyan-400">{game?.title || 'Unknown Realm'}</div><h3 className="mt-1 font-black text-white">{item.discovered ? item.title : 'Unmapped Signal'}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{item.discovered ? item.reveal_text : item.teaser}</p><div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest"><span className="text-slate-600">{item.rarity}</span>{item.discovered ? <span className="text-emerald-300">FOUND +{item.xp_reward} XP</span> : <Link href={`/games/${game?.slug || ''}`} className="text-cyan-300 hover:text-cyan-200">Search realm →</Link>}</div></div>; })}</div>
      </main>
      <Footer />
    </div>
  );
}
