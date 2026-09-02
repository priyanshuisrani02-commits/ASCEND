'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, CalendarDays, Crown, Flame, Gem, Gift, Globe2, Headphones, Lock, Map, Medal, ScrollText, Search, Shield, Sparkles, Swords, Users, Wand2, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const systems = [
  ['Exploration', 'Hidden discoveries, landmarks, lore fragments and secret finds.', Search, '/discoveries'],
  ['Boss Trials', 'Multi-phase elite challenges with risk-weighted rewards.', Swords, '/challenges'],
  ['Titles', 'Earn visible titles, rare variants and hidden status markers.', Crown, '#titles'],
  ['Skill Trees', 'Grow Wisdom, Valor and Exploration through earned points.', Zap, '#skills'],
  ['ASCEND Shards', 'A non-monetary progression currency for cosmetic unlocks.', Gem, '#shards'],
  ['Customization', 'Frames, banners, nameplates and profile effects.', Wand2, '#customize'],
  ['Relics', 'Collectible artifacts tied to achievements, regions and lore.', Medal, '#relics'],
  ['Streaks', 'Daily, weekly, challenge and milestone momentum with recovery.', Flame, '#streaks'],
  ['Seasons', 'Time-boxed worlds, challenges, rewards and environments.', Globe2, '#seasons'],
  ['Factions', 'Choose a path and build identity through faction progression.', Shield, '#factions'],
  ['Guilds / Crews', 'Create a crew identity and shared progression.', Users, '#guilds'],
  ['Guild Expeditions', 'Cooperative multi-stage objectives for crews.', Map, '#expeditions'],
  ['Challenge Chains', 'Connected quests that culminate in final trials.', ScrollText, '#chains'],
  ['Daily Discovery', 'A rotating featured activity with a small daily reward.', Gift, '#daily'],
  ['Journey Calendar', 'A visual record of milestones, discoveries and deeds.', CalendarDays, '#calendar'],
  ['Personal Analytics', 'Category strengths, pace and the next meaningful milestone.', Sparkles, '#analytics'],
  ['Recommendations', 'Context-aware next steps based on recent activity.', Wand2, '#recommendations'],
  ['Mystery Challenges', 'Obscured trials that reveal their purpose when approached.', Lock, '#mystery'],
  ['Lore Archive', 'Short connected fragments about the world, factions and relics.', ScrollText, '#lore'],
  ['World Events', 'Temporary global events that reshape available activities.', Globe2, '#events'],
  ['Hall of Legends', 'Permanent recognition for exceptional records and deeds.', Crown, '#legends'],
  ['Epic Moments', 'Rare environmental completion moments for major accomplishments.', Sparkles, '#moments'],
  ['Sound Design', 'Optional restrained cues for important actions.', Headphones, '#sound'],
  ['Secret Systems', 'Long-form hidden chains that reward patient exploration.', Lock, '#secrets'],
];

const titlePool = ['Wayfinder', 'Trialborn', 'Realmwalker', 'Lorekeeper', 'Unbroken', 'First Light'];
const lore = [
  'The Atlas is not a map of places. It is a record of places that noticed you.',
  'Some relics are not found. They are remembered by the world when the right deed is completed.',
  'The oldest trials were built to measure consistency, not spectacle.',
];

export default function JourneyPage() {
  const [xp, setXp] = useState(0);
  const [shards, setShards] = useState(120);
  const [streak, setStreak] = useState(3);
  const [title, setTitle] = useState('Wayfinder');
  const [faction, setFaction] = useState('The Wayfarers');
  const [guild, setGuild] = useState('Unbound');
  const [sound, setSound] = useState(true);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [skills, setSkills] = useState({ Wisdom: 2, Valor: 1, Exploration: 3 });

  useEffect(() => {
    const raw = localStorage.getItem('ascend-journey');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      setXp(data.xp ?? 0); setShards(data.shards ?? 120); setStreak(data.streak ?? 3);
      setTitle(data.title ?? 'Wayfinder'); setFaction(data.faction ?? 'The Wayfarers'); setGuild(data.guild ?? 'Unbound');
      setSound(data.sound ?? true); setRevealed(data.revealed ?? []); setSkills(data.skills ?? { Wisdom: 2, Valor: 1, Exploration: 3 });
    } catch { /* ignore malformed local state */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('ascend-journey', JSON.stringify({ xp, shards, streak, title, faction, guild, sound, revealed, skills }));
  }, [xp, shards, streak, title, faction, guild, sound, revealed, skills]);

  const level = 1 + Math.floor(xp / 1000);
  const totalSkill = Object.values(skills).reduce((a, b) => a + b, 0);
  const next = useMemo(() => {
    if (streak < 7) return `Reach a ${7}-day momentum streak.`;
    if (shards < 250) return 'Earn 130 more ASCEND Shards.';
    if (totalSkill < 12) return 'Invest in your next skill branch.';
    return 'Seek a hidden discovery in the Atlas.';
  }, [streak, shards, totalSkill]);

  function claimDaily() {
    setShards(v => v + 20); setXp(v => v + 75); setStreak(v => v + 1);
  }

  function invest(skill: keyof typeof skills) {
    if (shards < 25) return;
    setShards(v => v - 25); setSkills(v => ({ ...v, [skill]: v[skill] + 1 })); setXp(v => v + 50);
  }

  function reveal(index: number) {
    if (revealed.includes(index)) return;
    setRevealed(v => [...v, index]); setShards(v => v + 15); setXp(v => v + 40);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,.35),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,.2),transparent_30%)]" />
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[.35em] uppercase text-violet-400 font-bold">The Order's living codex</p>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-2">THE JOURNEY</h1>
              <p className="max-w-2xl text-slate-400 mt-4 leading-7">Every system of ASCEND now lives as part of one connected progression layer. Explore, specialize, collect, compete and leave a permanent mark on the realm.</p>
            </div>
            <Link href="/discoveries" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-violet-500/30 bg-violet-950/30 text-violet-200 font-bold text-sm">Open World Atlas <Map className="w-4 h-4" /></Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
            <Stat label="Level" value={`${level}`} />
            <Stat label="XP" value={`${xp}`} />
            <Stat label="ASCEND Shards" value={`${shards}`} />
            <Stat label="Momentum" value={`${streak} days`} />
            <Stat label="Title" value={title} />
          </div>
        </section>

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-5">
            <div className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-7">
              <div className="flex items-center justify-between mb-5"><div><p className="text-xs uppercase tracking-[.25em] text-slate-500 font-bold">Progression engine</p><h2 className="text-2xl font-black mt-1">Skill Trees</h2></div><span className="text-xs text-violet-300 font-mono">{totalSkill} points</span></div>
              <div className="grid sm:grid-cols-3 gap-3">
                {(Object.keys(skills) as Array<keyof typeof skills>).map(skill => <div key={skill} className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4"><div className="flex justify-between text-sm font-bold"><span>{skill}</span><span className="text-violet-300">{skills[skill]}</span></div><div className="h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden"><div className="h-full bg-violet-500" style={{ width: `${Math.min(skills[skill] * 10, 100)}%` }} /></div><button onClick={() => invest(skill)} className="mt-4 w-full rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 py-2 text-xs font-bold">Invest 25 Shards</button></div>)}
              </div>
              <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 p-4"><p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Recommended next step</p><p className="text-sm text-slate-200 mt-1">{next}</p></div>
            </div>

            <div className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-7">
              <div className="flex items-center gap-2 text-violet-300"><Flame className="w-5 h-5" /><span className="text-xs uppercase tracking-widest font-bold">Daily Discovery</span></div>
              <h2 className="text-2xl font-black mt-2">The Quiet Hour</h2>
              <p className="text-sm text-slate-400 mt-2 leading-6">Complete one meaningful deed today to keep momentum alive and collect a small shard cache.</p>
              <button onClick={claimDaily} className="w-full mt-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-black text-sm">Claim Today's Deed</button>
              <div className="grid grid-cols-2 gap-2 mt-3 text-center"><div className="rounded-xl bg-slate-900 p-3"><div className="text-lg font-black">+75</div><div className="text-[10px] text-slate-500 uppercase">XP</div></div><div className="rounded-xl bg-slate-900 p-3"><div className="text-lg font-black">+20</div><div className="text-[10px] text-slate-500 uppercase">Shards</div></div></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            {systems.map(([name, description, Icon, href], i) => <a key={name as string} href={href as string} className="group rounded-2xl border border-white/10 bg-slate-950/65 hover:bg-slate-900/80 hover:border-violet-500/30 p-5 transition-all"><div className="flex items-start justify-between"><div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/20 flex items-center justify-center"><Icon className="w-5 h-5 text-violet-300" /></div><span className="text-[9px] font-mono text-slate-600">SYS-{String(i + 2).padStart(2, '0')}</span></div><h3 className="font-black mt-4 group-hover:text-violet-300 transition-colors">{name as string}</h3><p className="text-sm text-slate-500 leading-6 mt-1">{description as string}</p></a>)}
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mt-6">
            <div id="titles" className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><Crown className="w-6 h-6 text-amber-300" /><h2 className="text-xl font-black mt-3">Titles & Identity</h2><p className="text-sm text-slate-500 mt-1">Your current title is earned, not cosmetic.</p><select value={title} onChange={e => setTitle(e.target.value)} className="mt-4 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm">{titlePool.map(t => <option key={t}>{t}</option>)}</select><div className="mt-4 text-xs text-slate-500">Faction: <span className="text-slate-200">{faction}</span></div><select value={faction} onChange={e => setFaction(e.target.value)} className="mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm"><option>The Wayfarers</option><option>The Vanguard</option><option>The Archivists</option></select></div>
            <div id="relics" className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><Medal className="w-6 h-6 text-violet-300" /><h2 className="text-xl font-black mt-3">Relic Vault</h2><p className="text-sm text-slate-500 mt-1">Three relic slots are ready for future rare finds.</p><div className="grid grid-cols-3 gap-2 mt-5">{['Aster','Veil','Crown'].map((x, i) => <button key={x} onClick={() => reveal(i)} className={`aspect-square rounded-xl border flex items-center justify-center ${revealed.includes(i) ? 'border-violet-400/50 bg-violet-950/40' : 'border-slate-800 bg-slate-900'}`}>{revealed.includes(i) ? <Gem className="w-5 h-5 text-violet-300" /> : <Lock className="w-4 h-4 text-slate-700" />}</button>)}</div></div>
            <div id="lore" className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"><ScrollText className="w-6 h-6 text-sky-300" /><h2 className="text-xl font-black mt-3">Lore Archive</h2><p className="text-sm text-slate-500 mt-1">Fragments unlock as you cross the world.</p><blockquote className="mt-5 text-sm leading-7 text-slate-300 italic">“{lore[revealed.length % lore.length]}”</blockquote><div className="mt-4 text-[10px] uppercase tracking-widest text-slate-600">Fragment {Math.min(revealed.length + 1, lore.length)} / {lore.length}</div></div>
          </div>

          <div id="guilds" className="mt-6 rounded-3xl border border-violet-500/20 bg-violet-950/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"><div><p className="text-[10px] uppercase tracking-widest text-violet-400 font-bold">Guild / Crew</p><h2 className="text-2xl font-black mt-1">{guild}</h2><p className="text-sm text-slate-400 mt-1">Shared identity, expedition progress and future crew objectives.</p></div><div className="flex gap-2"><button onClick={() => setGuild(guild === 'Unbound' ? 'Night Cartographers' : 'Unbound')} className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold">Change Crew</button><button onClick={() => { setXp(v => v + 100); setShards(v => v + 30); }} className="px-4 py-2.5 rounded-xl bg-violet-600 text-sm font-bold">Run Expedition</button></div></div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div id="sound" className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 flex items-center justify-between"><div><h3 className="font-black">Sound Design</h3><p className="text-sm text-slate-500 mt-1">Optional cues for discoveries, rewards and major completions.</p></div><button onClick={() => setSound(v => !v)} className={`px-4 py-2 rounded-xl text-xs font-bold ${sound ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>{sound ? 'ON' : 'OFF'}</button></div>
            <div id="secrets" className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5"><div className="flex items-center gap-2 text-amber-300"><Lock className="w-4 h-4" /><h3 className="font-black">Secret Systems</h3></div><p className="text-sm text-slate-400 mt-2">Some chains intentionally do not appear here. Exploration and unusual combinations are part of the game.</p></div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"><div className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">{label}</div><div className="text-lg font-black mt-1 truncate">{value}</div></div>;
}
