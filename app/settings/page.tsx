'use client';

import React, { useState, useEffect } from 'react';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { getRankings, updateProfile } from '@/lib/data/store';
import { Profile } from '@/lib/types';
import { User, Settings, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRankings().then(r => {
      if (r.length > 0) {
        const p = r[0];
        setProfile(p);
        setUsername(p.username);
        setDisplayName(p.display_name);
        setBio(p.bio);
        setAvatarUrl(p.avatar_url);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);

    await updateProfile(profile.id, {
      username,
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
            <Settings className="w-4 h-4" />
            <span>Account Controls</span>
          </div>
          <h1 className="text-3xl font-black text-white">PROFILE SETTINGS</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your public competitor profile and identity settings.</p>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <div className="glass-panel p-8 rounded-3xl border border-violet-500/30">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* AVATAR */}
            <div className="flex items-center space-x-6 pb-6 border-b border-slate-800">
              <img src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500" />
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            {/* USERNAME & DISPLAY NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            {/* BIO */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Competitor Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={loading}>
                <Save className="w-4 h-4 mr-2" />
                <span>SAVE CHANGES</span>
              </Button>
            </div>

          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}
