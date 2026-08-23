import React from 'react';
import Link from 'next/link';
import { Trophy, Shield, Swords, Gamepad2, Globe, Share2, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-widest violet-gradient-text">ASCEND</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              PLAY. ACHIEVE. ASCEND. <br />
              Turn your gaming achievements into competitive records, rankings, and reputation.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 transition-colors">
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* PLATFORM LINKS */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/games" className="hover:text-violet-300 transition-colors">Supported Games</Link></li>
              <li><Link href="/achievements" className="hover:text-violet-300 transition-colors">Achievement Directory</Link></li>
              <li><Link href="/challenges" className="hover:text-violet-300 transition-colors">Weekly Challenges</Link></li>
              <li><Link href="/rankings" className="hover:text-violet-300 transition-colors">Global Leaderboards</Link></li>
            </ul>
          </div>

          {/* COMPETITION LINKS */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Competition</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/my-achievements" className="hover:text-violet-300 transition-colors">My Achievements</Link></li>
              <li><Link href="/rankings" className="hover:text-violet-300 transition-colors">Season Rankings</Link></li>
              <li><Link href="/challenges" className="hover:text-violet-300 transition-colors">Active Tournaments</Link></li>
              <li><Link href="/admin" className="hover:text-violet-300 transition-colors">Moderation & Verification</Link></li>
            </ul>
          </div>

          {/* RARITY HIERARCHY */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Rarity System</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center space-x-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-500" /><span>COMMON (50%+)</span></li>
              <li className="flex items-center space-x-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>UNCOMMON (25–49.9%)</span></li>
              <li className="flex items-center space-x-2 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500" /><span>RARE (10–24.9%)</span></li>
              <li className="flex items-center space-x-2 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500" /><span>EPIC (3–9.9%)</span></li>
              <li className="flex items-center space-x-2 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>LEGENDARY (0.5–2.9%)</span></li>
              <li className="flex items-center space-x-2 text-rose-400 animate-pulse"><span className="w-2 h-2 rounded-full bg-rose-500" /><span>MYTHIC (&lt;0.5%)</span></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div>&copy; {new Date().getFullYear()} ASCEND Platform Inc. All rights reserved. Built for competitive gamers.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
