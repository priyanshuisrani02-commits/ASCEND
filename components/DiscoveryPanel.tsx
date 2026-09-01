'use client';

import { useEffect, useState } from 'react';
import { Compass, Eye, Lock, Sparkles, MapPin, ScrollText, Gem } from 'lucide-react';
import { Discovery } from '@/lib/types';
import { discoverSecret, getDiscoveries } from '@/lib/data/exploration';

const typeIcon = {
  SECRET: Eye,
  RELIC: Gem,
  LORE: ScrollText,
  LANDMARK: MapPin,
} as const;

const rarityClass: Record<Discovery['rarity'], string> = {
  COMMON: 'text-slate-300 border-slate-700',
  UNCOMMON: 'text-emerald-300 border-emerald-500/30',
  RARE: 'text-blue-300 border-blue-500/30',
  EPIC: 'text-violet-300 border-violet-500/40',
  LEGENDARY: 'text-amber-300 border-amber-500/40',
  MYTHIC: 'text-rose-300 border-rose-500/40',
};

export function DiscoveryPanel({ gameId }: { gameId: string }) {
  const [items, setItems] = useState<Discovery[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    void getDiscoveries(gameId).then((data) => alive && setItems(data)).catch((err) => alive && setError(err instanceof Error ? err.message : 'Unable to map discoveries.'));
    return () => { alive = false; };
  }, [gameId]);

  const reveal = async (id: string) => {
    setBusy(id);
    setError('');
    try {
      await discoverSecret(id);
      setItems((current) => current.map((item) => item.id === id ? { ...item, discovered: true, discovered_at: new Date().toISOString() } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in to record this discovery.');
    } finally {
      setBusy(null);
    }
  };

  if (!items.length && !error) return null;

  return (
    <section className="glass-panel rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300"><Compass className="w-4 h-4" /> Uncharted Signals</div>
          <h2 className="mt-2 text-2xl font-black text-white">Hidden Discoveries</h2>
          <p className="mt-1 text-xs text-slate-400">Not every landmark is placed on the map. Look closer.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-right"><div className="text-lg font-black text-white">{items.filter((item) => item.discovered).length}/{items.length}</div><div className="text-[9px] uppercase tracking-widest text-slate-500">Found</div></div>
      </div>
      {error && <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-[11px] text-rose-300">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = typeIcon[item.discovery_type];
          return (
            <div key={item.id} className={`group rounded-2xl border bg-slate-900/60 p-4 transition-all hover:-translate-y-0.5 hover:bg-slate-900 ${item.discovered ? 'border-emerald-500/30' : 'border-slate-800'}`}>
              <div className="flex gap-3">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-slate-950 ${item.discovered ? 'text-emerald-300 border-emerald-500/30' : 'text-slate-500 border-slate-800'}`}><Icon className="w-5 h-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2"><h3 className="font-bold text-slate-100 text-sm truncate">{item.discovered ? item.title : 'Unknown Signal'}</h3><span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${rarityClass[item.rarity]}`}>{item.rarity}</span></div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{item.discovered ? item.reveal_text : item.teaser}</p>
                  {item.discovered ? <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-300"><Sparkles className="w-3 h-3" /> +{item.xp_reward} XP claimed</div> : <button disabled={busy === item.id} onClick={() => void reveal(item.id)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"><Lock className="w-3 h-3" /> {busy === item.id ? 'Mapping...' : 'Uncover'}</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
