'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Trophy, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setErrorMsg('This password reset link is invalid or has expired.');
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setErrorMsg('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');

    setLoading(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSaved(true);
      await supabase.auth.signOut();
      setTimeout(() => router.push('/login'), 1200);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to update your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 shadow-[0_0_50px_rgba(124,58,237,0.2)]">
          <div className="text-center mb-8"><div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto mb-4"><Trophy className="w-6 h-6 text-white" /></div><h1 className="text-2xl font-black text-white">SET NEW PASSWORD</h1><p className="text-xs text-slate-400 mt-1">Choose a new password for your ASCEND account.</p></div>
          {errorMsg && <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold text-center">{errorMsg}</div>}
          {saved ? <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl"><CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" /><h3 className="text-base font-bold text-emerald-300">PASSWORD UPDATED</h3><p className="text-xs text-slate-400">Returning you to sign in…</p></div> : ready ? <form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">New Password</label><div className="relative"><Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" /><input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div></div><div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Confirm Password</label><div className="relative"><Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" /><input type="password" required minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none" /></div></div><Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}><span>UPDATE PASSWORD</span><ArrowRight className="w-4 h-4 ml-2" /></Button></form> : <div className="text-center text-sm text-slate-400">Open the password reset link from your email again, or <Link href="/forgot-password" className="text-violet-400 font-semibold hover:underline">request a new one</Link>.</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
