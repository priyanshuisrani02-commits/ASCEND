'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Trophy, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username,
          },
        },
      });

      if (error) {
        // Direct to onboarding step for smooth demo fallback
        router.push(`/onboarding?username=${encodeURIComponent(username)}`);
      } else {
        router.push(`/onboarding?username=${encodeURIComponent(username)}`);
      }
    } catch {
      router.push(`/onboarding?username=${encodeURIComponent(username)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 shadow-[0_0_50px_rgba(124,58,237,0.2)]">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">JOIN THE COMPETITION</h1>
            <p className="text-xs text-slate-400 mt-1">Create your ASCEND account and begin tracking your records.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="ValkyriePrime"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="player@ascend.gg"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={loading}>
              <span>CREATE PLAYER ACCOUNT</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-violet-400 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
