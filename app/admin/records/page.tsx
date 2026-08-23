'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getRecords } from '@/lib/data/store';
import { RecordSubmission } from '@/lib/types';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminRecordsPage() {
  const [records, setRecords] = useState<RecordSubmission[]>([]);

  useEffect(() => {
    getRecords().then(r => setRecords(r));
  }, []);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Records Registry</span>
          </div>
          <h1 className="text-3xl font-black text-white">SUBMITTED COMPETITIVE RECORDS</h1>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-6">Record Title</th>
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6">Game</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {records.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-900/60">
                  <td className="py-4 px-6 font-bold text-white">
                    <div>{rec.title}</div>
                    <div className="text-xs text-slate-400 font-normal">{rec.category}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-300">{rec.username}</td>
                  <td className="py-4 px-6 font-mono text-slate-300">{rec.game_title}</td>
                  <td className="py-4 px-6 font-mono font-bold text-amber-400">{rec.score_value} {rec.score_unit}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      rec.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : rec.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      <Footer />
    </div>
  );
}
