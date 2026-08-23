import React from 'react';
import Link from 'next/link';
import { Compass, ScrollText, Shield, Swords, Trophy } from 'lucide-react';

export const Footer: React.FC = () => (
  <footer className="w-full bg-[#070605] border-t border-[#b89a5a]/10 pt-16 pb-10 mt-20">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#b89a5a]/10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-5"><div className="ascend-seal w-9 h-9 rounded-full"><span className="relative z-10 text-[#b89a5a]">✦</span></div><span className="ascend-display text-xl tracking-[.22em] ascend-gold-text">ASCEND</span></div>
          <p className="text-sm text-[#756d60] leading-6">An order of deeds, trials and legends. Compete, leave your mark, and climb beyond the known.</p>
          <div className="mt-7 text-[8px] uppercase tracking-[.34em] text-[#504b43]">Archive seal • Season 01</div>
        </div>
        <div><h4 className="text-[9px] uppercase tracking-[.32em] text-[#806c45] mb-5">The World</h4><ul className="space-y-3 text-sm text-[#756d60]"><li><Link href="/games" className="hover:text-[#d7bd7a]">Territories</Link></li><li><Link href="/challenges" className="hover:text-[#d7bd7a]">Trial Grounds</Link></li><li><Link href="/rankings" className="hover:text-[#d7bd7a]">Hall of Ascension</Link></li><li><Link href="/achievements" className="hover:text-[#d7bd7a]">Archive</Link></li></ul></div>
        <div><h4 className="text-[9px] uppercase tracking-[.32em] text-[#806c45] mb-5">Your Path</h4><ul className="space-y-3 text-sm text-[#756d60]"><li><Link href="/my-achievements" className="hover:text-[#d7bd7a]">Deeds</Link></li><li><Link href="/profile" className="hover:text-[#d7bd7a]">Dossier</Link></li><li><Link href="/settings" className="hover:text-[#d7bd7a]">Settings</Link></li><li><Link href="/admin" className="hover:text-[#d7bd7a]">Inner Council</Link></li></ul></div>
        <div><h4 className="text-[9px] uppercase tracking-[.32em] text-[#806c45] mb-5">The Hierarchy</h4><div className="space-y-3 text-[10px] uppercase tracking-widest text-[#6c655b]"><div className="flex items-center gap-3"><Shield className="w-3.5 h-3.5 text-[#756d60]" /> Common</div><div className="flex items-center gap-3"><Swords className="w-3.5 h-3.5 text-[#87936f]" /> Rare</div><div className="flex items-center gap-3"><ScrollText className="w-3.5 h-3.5 text-[#9b7b53]" /> Epic</div><div className="flex items-center gap-3"><Trophy className="w-3.5 h-3.5 text-[#b89a5a]" /> Legendary</div><div className="flex items-center gap-3"><Compass className="w-3.5 h-3.5 text-[#8c719c]" /> Mythic</div></div></div>
      </div>
      <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] uppercase tracking-[.18em] text-[#4f4a43]"><span>© {new Date().getFullYear()} ASCEND • The Order records all deeds.</span><div className="flex gap-5"><a href="#" className="hover:text-[#8a806f]">Privacy</a><a href="#" className="hover:text-[#8a806f]">Terms</a><a href="#" className="hover:text-[#8a806f]">Security</a></div></div>
    </div>
  </footer>
);
