'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Trophy, Check, ArrowRight, Gamepad2, User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { createClient } from '@/lib/supabase/client';

const avatarOptions = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
];

const gameOptions = [
  { title: 'VALORANT', genre: 'Tactical Shooter' },
  { title: 'Counter-Strike 2', genre: 'Tactical Shooter' },
  { title: 'ELDEN RING', genre: 'Action RPG' },
  { title: 'Fortnite', genre: 'Battle Royale' },
  { title: 'Rocket League', genre: 'Sports / Action' },
  { title: 'Minecraft', genre: 'Sandbox Survival' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState(avatarOptions[0]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleGame = (title: string) => {
    setSelectedGames(current => current.includes(title) ? current.filter(g => g !== title) : [...current, title]);
  };

  const handleFinish = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Your session has expired. Please sign in again.');

      const finalUsername = username.trim();
      const finalDisplayName = displayName.trim() || finalUsername;
      if (!finalUsername || finalUsername.length < 3) throw new Error('Choose a username with at least 3 characters.');

      const { data: existing } = await supabase.from('profiles').select('id').eq('username', finalUsername).neq('id', user.id).maybeSingle();
      if (existing) throw new Error('That username is already taken.');

      const { error } = await supabase.from('profiles').update({
        username: finalUsername,
        display_name: finalDisplayName,
        avatar_url: avatarUrl,
        favorite_games: selectedGames,
      }).eq('id', user.id);

      if (error) throw error;
      router.push(`/profile/${encodeURIComponent(finalUsername)}`);
      router.refresh();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
          {[1, 2, 3].map(i => <div key={i} className="flex items-center space-x-2"><div className={clsx('w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center border transition-all', step === i ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' : step > i ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500')}>{step > i ? <Check className="w-4 h-4" /> : i}</div><span className="text-xs font-bold text-slate-300 hidden sm:block">{i === 1 ? 'IDENTITY' : i === 2 ? 'GAMES PLAYED' : 'AVATAR SELECTION'}</span></div>)}
        </div>

        {errorMsg && <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}

        {step === 1 && <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 space-y-6">
          <div><div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1"><Sparkles className="w-4 h-4" /><span>STEP 1 OF 3</span></div><h2 className="text-3xl font-black text-white">SET YOUR PLAYER IDENTITY</h2><p className="text-xs text-slate-400 mt-1">This is how you will appear on global leaderboards and challenge entries.</p></div>
          <div className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Username</label><input required minLength={3} maxLength={24} type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div>
            <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Display Name</label><input required type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div>
          </div>
          <div className="pt-4 flex justify-end"><Button variant="primary" size="lg" onClick={() => { if (username.trim().length >= 3) setStep(2); else setErrorMsg('Choose a username with at least 3 characters.'); }}><span>NEXT: SELECT GAMES</span><ArrowRight className="w-4 h-4 ml-2" /></Button></div>
        </div>}

        {step === 2 && <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 space-y-6">
          <div><div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1"><Gamepad2 className="w-4 h-4" /><span>STEP 2 OF 3</span></div><h2 className="text-3xl font-black text-white">CHOOSE YOUR COMPETITIVE GAMES</h2><p className="text-xs text-slate-400 mt-1">Select the titles you play to customize your achievement feed.</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{gameOptions.map(g => { const selected = selectedGames.includes(g.title); return <button type="button" key={g.title} onClick={() => toggleGame(g.title)} className={clsx('p-4 rounded-2xl border text-left transition-all flex items-center justify-between', selected ? 'bg-violet-950/40 border-violet-500/60 shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700')}><div><div className="font-bold text-white text-base">{g.title}</div><div className="text-xs text-slate-400">{g.genre}</div></div><span className={clsx('w-6 h-6 rounded-lg flex items-center justify-center border', selected ? 'bg-violet-600 border-violet-400 text-white' : 'border-slate-700')}>{selected && <Check className="w-4 h-4" />}</span></button>; })}</div>
          <div className="pt-4 flex justify-between"><Button variant="ghost" onClick={() => setStep(1)}>Back</Button><Button variant="primary" size="lg" onClick={() => setStep(3)}><span>NEXT: CHOOSE AVATAR</span><ArrowRight className="w-4 h-4 ml-2" /></Button></div>
        </div>}

        {step === 3 && <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 space-y-6">
          <div><div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1"><User className="w-4 h-4" /><span>STEP 3 OF 3</span></div><h2 className="text-3xl font-black text-white">PICK YOUR COMPETITOR AVATAR</h2><p className="text-xs text-slate-400 mt-1">Select an avatar for your public player card.</p></div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">{avatarOptions.map((url, idx) => <button type="button" key={url} onClick={() => setAvatarUrl(url)} className={clsx('aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all', avatarUrl === url ? 'border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.5)] scale-105' : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100')}><img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" /></button>)}</div>
          <div className="pt-4 flex justify-between"><Button variant="ghost" onClick={() => setStep(2)}>Back</Button><Button variant="primary" size="lg" onClick={handleFinish} isLoading={saving}><span>COMPLETE PROFILE & ASCEND</span><Trophy className="w-4 h-4 ml-2" /></Button></div>
        </div>}
      </main>
      <Footer />
    </div>
  );
}
