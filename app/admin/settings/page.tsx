'use client';

import React, { useState } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform System Settings</span>
          </div>
          <h1 className="text-3xl font-black text-white">ADMIN SYSTEM CONFIGURATION</h1>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>System thresholds updated!</span>
          </div>
        )}

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Rarity Thresholds (%)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">COMMON</label>
                  <input type="text" defaultValue="50%" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-emerald-400 mb-1">UNCOMMON</label>
                  <input type="text" defaultValue="25%" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-blue-400 mb-1">RARE</label>
                  <input type="text" defaultValue="10%" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-purple-400 mb-1">EPIC</label>
                  <input type="text" defaultValue="3%" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-amber-400 mb-1">LEGENDARY</label>
                  <input type="text" defaultValue="0.5%" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-rose-400 mb-1">MYTHIC</label>
                  <input type="text" defaultValue="<0.5%" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary">
                <Save className="w-4 h-4 mr-2" />
                <span>SAVE SYSTEM SETTINGS</span>
              </Button>
            </div>
          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}
