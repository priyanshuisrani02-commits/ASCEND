'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { getRankings } from '@/lib/data/store';
import { Profile } from '@/lib/types';
import { Users, Search, ShieldCheck, ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRankings().then(u => setUsers(u));
  }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
              <Users className="w-4 h-4" />
              <span>User Database</span>
            </div>
            <h1 className="text-3xl font-black text-white">REGISTERED PLAYERS</h1>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search player username..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-violet-500 outline-none"
            />
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-4 px-6">Player</th>
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6">Total XP</th>
                <th className="py-4 px-6">Ranking Points</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-900/60">
                  <td className="py-4 px-6">
                    <Link href={`/profile/${u.username}`} className="flex items-center space-x-3 hover:text-violet-300">
                      <img src={u.avatar_url} alt={u.username} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{u.username}</span>
                          {u.is_admin && <ShieldCheck className="w-4 h-4 text-violet-400" />}
                        </div>
                        <div className="text-xs text-slate-400">{u.display_name}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-300">LVL {u.level}</td>
                  <td className="py-4 px-6 font-mono text-amber-400 font-bold">{u.xp.toLocaleString()} XP</td>
                  <td className="py-4 px-6 font-mono text-violet-400 font-bold">{u.ranking_points} RP</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.is_admin ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                      {u.is_admin ? 'ADMINISTRATOR' : 'PLAYER'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/profile/${u.username}`} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white inline-flex">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
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
