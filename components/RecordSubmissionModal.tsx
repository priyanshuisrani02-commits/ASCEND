'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X, Upload, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Game } from '@/lib/types';
import { submitRecord } from '@/lib/data/store';

interface RecordSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onSuccess?: () => void;
}

export const RecordSubmissionModal: React.FC<RecordSubmissionModalProps> = ({
  isOpen,
  onClose,
  games,
  onSuccess,
}) => {
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Speedrun');
  const [scoreValue, setScoreValue] = useState('');
  const [scoreUnit, setScoreUnit] = useState('seconds');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !scoreValue || !evidenceUrl) return;

    setLoading(true);
    const game = games.find(g => g.id === selectedGameId) || games[0];

    await submitRecord({
      user_id: 'current',
      username: 'ValkyriePrime',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      game_id: game?.id || 'g-val-001',
      game_title: game?.title || 'VALORANT',
      title,
      category,
      score_value: parseFloat(scoreValue),
      score_unit: scoreUnit,
      evidence_url: evidenceUrl,
    });

    setLoading(false);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-violet-500/30 shadow-[0_0_50px_rgba(124,58,237,0.25)] relative">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 mb-3">
            <Upload className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-white">SUBMIT COMPETITIVE RECORD</h2>
          <p className="text-xs text-slate-400 mt-1">
            Submit your speedrun, high score, or challenge proof for moderator verification.
          </p>
        </div>

        {successMsg ? (
          <div className="p-8 text-center space-y-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-300">RECORD SUBMITTED!</h3>
            <p className="text-xs text-slate-400">
              Your proof has been submitted to the moderation queue. Verified records earn RP!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* GAME SELECT */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Game</label>
              <select
                value={selectedGameId}
                onChange={e => setSelectedGameId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
              >
                {games.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.genre})
                  </option>
                ))}
              </select>
            </div>

            {/* RECORD TITLE & CATEGORY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Record Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radahn Solo Hitless"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                >
                  <option value="Speedrun">Speedrun</option>
                  <option value="Hitless Challenge">Hitless Challenge</option>
                  <option value="High Kills">High Kills</option>
                  <option value="Win Streak">Win Streak</option>
                  <option value="Freestyle Score">Freestyle Score</option>
                </select>
              </div>
            </div>

            {/* SCORE VALUE & UNIT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Score / Time</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 134"
                  value={scoreValue}
                  onChange={e => setScoreValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. seconds, kills, wins"
                  value={scoreUnit}
                  onChange={e => setScoreUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            {/* EVIDENCE PROOF URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Proof / Video VOD URL</label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/watch?v=your-proof-vod"
                value={evidenceUrl}
                onChange={e => setEvidenceUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                YouTube, Twitch clip, Medal.tv, or cloud storage evidence link.
              </span>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 flex justify-end space-x-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={loading}>
                SUBMIT FOR VERIFICATION
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
