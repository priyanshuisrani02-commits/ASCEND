'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { getRecords, moderateRecord } from '@/lib/data/store';
import { RecordSubmission } from '@/lib/types';
import { CheckCircle2, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SubmissionsModerationPage() {
  const [submissions, setSubmissions] = useState<RecordSubmission[]>([]);
  const [note, setNote] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadSubmissions = () => getRecords('PENDING').then(data => setSubmissions(data));

  useEffect(() => { loadSubmissions(); }, []);

  const handleAction = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    setProcessingId(id);
    await moderateRecord(id, status, note);
    setProcessingId(null);
    setNote('');
    loadSubmissions();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8"><div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2"><ShieldCheck className="w-4 h-4" /><span>Moderation Panel</span></div><h1 className="text-3xl font-black text-white">RECORD SUBMISSIONS QUEUE</h1><p className="text-xs text-slate-400 mt-1">Review proof VOD links and verify competitive record claims. Approvals automatically award +150 RP.</p></div>
        {submissions.length > 0 ? <div className="space-y-6">{submissions.map(sub => <div key={sub.id} className="glass-panel p-6 rounded-3xl border border-violet-500/30 space-y-4"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4"><div className="flex items-center space-x-3"><img src={sub.user_avatar || undefined} alt={sub.username} className="w-10 h-10 rounded-xl object-cover" /><div><div className="font-bold text-white text-base">{sub.title}</div><div className="text-xs text-slate-400">Player: <span className="text-violet-300 font-bold">{sub.username}</span> • {sub.game_title}</div></div></div><div className="text-right"><div className="font-mono font-black text-amber-400 text-lg">{sub.score_value} {sub.score_unit}</div><span className="text-[10px] text-slate-500 font-mono">Category: {sub.category}</span></div></div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"><span className="text-slate-400 font-semibold">Evidence Link:</span><a href={sub.evidence_url} target="_blank" rel="noreferrer" className="text-violet-400 font-mono hover:underline flex items-center space-x-1"><span>{sub.evidence_url}</span><ExternalLink className="w-3.5 h-3.5" /></a></div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4"><input type="text" placeholder="Moderator note (optional)..." value={note} onChange={e => setNote(e.target.value)} className="w-full sm:w-96 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none" /><div className="flex items-center space-x-3 w-full sm:w-auto"><Button variant="danger" size="sm" onClick={() => handleAction(sub.id, 'REJECTED')} isLoading={processingId === sub.id}><XCircle className="w-4 h-4 mr-1.5" /><span>REJECT</span></Button><Button variant="primary" size="sm" onClick={() => handleAction(sub.id, 'VERIFIED')} isLoading={processingId === sub.id}><CheckCircle2 className="w-4 h-4 mr-1.5" /><span>VERIFY & AWARD RP</span></Button></div></div>
        </div>)}</div> : <div className="glass-panel p-16 text-center rounded-3xl border border-slate-800"><CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-200">QUEUE IS CLEAR</h3><p className="text-xs text-slate-500 mt-1">There are no pending record submissions awaiting verification.</p></div>}
      </main>
      <Footer />
    </div>
  );
}
