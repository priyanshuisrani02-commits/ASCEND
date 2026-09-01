'use client';

import { useState } from 'react';
import { Skull, Shield, Swords, Zap, LockKeyhole } from 'lucide-react';
import { ChallengeCard } from '@/components/ChallengeCard';
import { Challenge } from '@/lib/types';

export function BossChallengeCard({ challenge }: { challenge: Challenge }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-500/35 bg-gradient-to-br from-rose-950/35 via-slate-950 to-violet-950/30 p-1 shadow-[0_0_45px_rgba(244,63,94,0.12)]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="relative z-10 px-5 pt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300"><Skull className="w-4 h-4" /></div><div><div className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-300">Boss Encounter</div><div className="text-sm font-black text-white">{challenge.boss_name || 'Unknown Ascendant'}</div></div></div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-300"><Shield className="w-3.5 h-3.5" /> {challenge.boss_phase_count ?? 1} phases</div>
      </div>
      <div className="px-5 pb-5 pt-3"><p className="mb-4 text-[11px] leading-relaxed text-slate-400">{challenge.boss_lore || 'A high-stakes encounter reserved for competitors ready to push beyond the normal trial.'}</p><div className="mb-4 grid grid-cols-2 gap-2"><div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><div className="text-[8px] uppercase tracking-widest text-slate-500">Risk</div><div className="mt-1 font-mono text-sm font-black text-rose-300">x{challenge.boss_risk_multiplier ?? 1}</div></div><div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><div className="text-[8px] uppercase tracking-widest text-slate-500">Reward</div><div className="mt-1 flex items-center gap-1 font-mono text-sm font-black text-amber-300"><Zap className="w-3.5 h-3.5" /> {challenge.xp_reward + challenge.ranking_reward}</div></div></div><button onClick={() => setOpen((value) => !value)} className="mb-3 inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-300 hover:bg-rose-500/20"><Swords className="w-3.5 h-3.5" /> {open ? 'Hide Encounter' : 'Study Encounter'}</button>{open && <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2"><ChallengeCard challenge={challenge} /></div>} {!open && <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-600"><LockKeyhole className="w-3 h-3" /> Reveal the encounter to enter</div>}</div>
    </div>
  );
}
