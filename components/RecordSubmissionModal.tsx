'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { Game } from '@/lib/types';
import { submitRecord } from '@/lib/data/store';
import { createClient } from '@/lib/supabase/client';

interface RecordSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onSuccess?: () => void;
}

export const RecordSubmissionModal: React.FC<RecordSubmissionModalProps> = ({ isOpen, onClose, games, onSuccess }) => {
  const [selectedGameId, setSelectedGameId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Speedrun');
  const [scoreValue, setScoreValue] = useState('');
  const [scoreUnit, setScoreUnit] = useState('seconds');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const effectiveGameId = selectedGameId || games[0]?.id || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanUnit = scoreUnit.trim();
    const score = Number(scoreValue);
    const game = games.find(g => g.id === effectiveGameId) || games[0];

    if (!cleanTitle || !cleanUnit || !game || !Number.isFinite(score)) {
      setErrorMsg('Complete every field with a valid value before submitting.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Please sign in before submitting a competitive record.');

      await submitRecord({
        user_id: user.id,
        username: '',
        user_avatar: '',
        game_id: game.id,
        game_title: game.title,
        title: cleanTitle,
        category,
        score_value: score,
        score_unit: cleanUnit,
        evidence_url: evidenceUrl.trim(),
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to submit your record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-violet-500/30 shadow-[0_0_50px_rgba(124,58,237,0.25)] relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white" aria-label="Close record submission">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 mb-3"><Upload className="w-5 h-5" /></div>
          <h2 className="text-2xl font-black text-white">SUBMIT COMPETITIVE RECORD</h2>
          <p className="text-xs text-slate-400 mt-1">Submit your speedrun, high score, or challenge proof for moderator verification.</p>
        </div>

        {errorMsg && <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold">{errorMsg}</div>}

        {successMsg ? (
          <div className="p-8 text-center space-y-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-300">RECORD SUBMITTED!</h3>
            <p className="text-xs text-slate-400">Your proof has been submitted to the moderation queue. Verified records earn RP!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Game</label>
              <select value={effectiveGameId} onChange={e => setSelectedGameId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none">
                {games.map(g => <option key={g.id} value={g.id}>{g.title} ({g.genre})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Record Title</label><input type="text" required maxLength={120} placeholder="e.g. Radahn Solo Hitless" value={title} onChange={e => setTitle(e.target.value)} className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"><option value="Speedrun">Speedrun</option><option value="Hitless Challenge">Hitless Challenge</option><option value="High Kills">High Kills</option><option value="Win Streak">Win Streak</option><option value="Freestyle Score">Freestyle Score</option></select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Score / Time</label><input type="number" step="any" required value={scoreValue} onChange={e => setScoreValue(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Unit</label><input type="text" required maxLength={40} value={scoreUnit} onChange={e => setScoreUnit(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div>
            </div>
            <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Proof / Video VOD URL</label><input type="url" required placeholder="https://youtube.com/watch?v=your-proof-vod" value={evidenceUrl} onChange={e => setEvidenceUrl(e.target.value)} className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /><span className="text-[11px] text-slate-500 mt-1 block">YouTube, Twitch clip, Medal.tv, or cloud storage evidence link.</span></div>
            <div className="pt-4 flex justify-end space-x-3"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" isLoading={loading}>SUBMIT FOR VERIFICATION</Button></div>
          </form>
        )}
      </div>
    </div>
  );
};
