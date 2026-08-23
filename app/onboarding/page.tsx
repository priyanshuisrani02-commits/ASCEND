'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Trophy, Check, ArrowRight, Gamepad2, User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('PlayerOne');
  const [displayName, setDisplayName] = useState('Player One');
  const [selectedGames, setSelectedGames] = useState<string[]>(['VALORANT', 'Counter-Strike 2']);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');

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

  const toggleGame = (title: string) => {
    if (selectedGames.includes(title)) {
      setSelectedGames(selectedGames.filter(g => g !== title));
    } else {
      setSelectedGames([...selectedGames, title]);
    }
  };

  const handleFinish = () => {
    router.push(`/profile/${encodeURIComponent(username || 'PlayerOne')}`);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        
        {/* STEP PROGRESS BAR */}
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-2">
              <div
                className={clsx(
                  'w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center border transition-all',
                  step === i
                    ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                    : step > i
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                )}
              >
                {step > i ? <Check className="w-4 h-4" /> : i}
              </div>
              <span className="text-xs font-bold text-slate-300 hidden sm:block">
                {i === 1 ? 'IDENTITY' : i === 2 ? 'GAMES PLAYED' : 'AVATAR SELECTION'}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>STEP 1 OF 3</span>
              </div>
              <h2 className="text-3xl font-black text-white">SET YOUR PLAYER IDENTITY</h2>
              <p className="text-xs text-slate-400 mt-1">This is how you will appear on global leaderboards and challenge entries.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                <span>NEXT: SELECT GAMES</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT GAMES */}
        {step === 2 && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">
                <Gamepad2 className="w-4 h-4" />
                <span>STEP 2 OF 3</span>
              </div>
              <h2 className="text-3xl font-black text-white">CHOOSE YOUR COMPETITIVE GAMES</h2>
              <p className="text-xs text-slate-400 mt-1">Select the titles you play to customize your achievement feed.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gameOptions.map(g => {
                const isSelected = selectedGames.includes(g.title);
                return (
                  <div
                    key={g.title}
                    onClick={() => toggleGame(g.title)}
                    className={clsx(
                      'p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between',
                      isSelected
                        ? 'bg-violet-950/40 border-violet-500/60 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    )}
                  >
                    <div>
                      <div className="font-bold text-white text-base">{g.title}</div>
                      <div className="text-xs text-slate-400">{g.genre}</div>
                    </div>
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-lg flex items-center justify-center border',
                        isSelected ? 'bg-violet-600 border-violet-400 text-white' : 'border-slate-700'
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button variant="primary" size="lg" onClick={() => setStep(3)}>
                <span>NEXT: CHOOSE AVATAR</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: AVATAR SELECTION */}
        {step === 3 && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase tracking-widest mb-1">
                <User className="w-4 h-4" />
                <span>STEP 3 OF 3</span>
              </div>
              <h2 className="text-3xl font-black text-white">PICK YOUR COMPETITOR AVATAR</h2>
              <p className="text-xs text-slate-400 mt-1">Select an avatar for your public player card.</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {avatarOptions.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => setAvatarUrl(url)}
                  className={clsx(
                    'aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all',
                    avatarUrl === url
                      ? 'border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.5)] scale-105'
                      : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button variant="primary" size="lg" onClick={handleFinish}>
                <span>COMPLETE PROFILE & ASCEND</span>
                <Trophy className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
