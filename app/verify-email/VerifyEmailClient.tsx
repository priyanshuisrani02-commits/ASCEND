'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Mail, ShieldCheck, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const CODE_LENGTH = 6;

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email')?.trim().toLowerCase() ?? '';
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) router.replace('/signup');
  }, [email, router]);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setErrorMsg('');
    if (digit && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((digit, index) => { next[index] = digit; });
    setCode(next);
    setErrorMsg('');
    inputs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = code.join('');
    if (token.length !== CODE_LENGTH) {
      setErrorMsg('Enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
      router.push('/onboarding');
      router.refresh();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'That verification code could not be confirmed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}` },
      });
      if (error) throw error;
      setCode(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to send another code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between">
      <NavbarWrapper />
      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-violet-500/30 shadow-[0_0_50px_rgba(124,58,237,0.2)]">
          <div className="text-center mb-8"><div className="w-14 h-14 rounded-2xl ascend-seal mx-auto mb-5"><ShieldCheck className="w-6 h-6 text-[#d7bd7a] relative z-10" /></div><div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[.22em] text-violet-400 uppercase mb-3"><Trophy className="w-3.5 h-3.5" /> ASCEND AUTHENTICATION</div><h1 className="text-2xl font-black text-white">ENTER YOUR CODE</h1><p className="text-xs text-slate-400 mt-2 leading-5">We sent a 6-digit verification code to</p><div className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200"><Mail className="w-3.5 h-3.5 text-violet-400" />{email}</div></div>
          {errorMsg && <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-semibold text-center">{errorMsg}</div>}
          <form onSubmit={handleVerify}><div className="flex justify-center gap-2 sm:gap-3 mb-6">{code.map((digit, index) => <input key={index} ref={element => { inputs.current[index] = element; }} value={digit} onChange={event => updateDigit(index, event.target.value)} onKeyDown={event => handleKeyDown(index, event)} onPaste={handlePaste} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} aria-label={`Verification digit ${index + 1}`} className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-black rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:border-[#b89a5a] focus:ring-2 focus:ring-[#b89a5a]/15 outline-none transition-all" />)}</div><Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}><span>VERIFY & CONTINUE</span><ArrowRight className="w-4 h-4 ml-2" /></Button></form>
          <div className="mt-6 text-center text-xs text-slate-400">Didn’t receive a code? <button type="button" onClick={handleResend} disabled={resending} className="font-bold text-violet-400 hover:underline disabled:opacity-50">{resending ? 'Sending...' : 'Resend code'}</button></div>
          <div className="mt-4 text-center text-xs text-slate-500"><Link href="/signup" className="hover:text-slate-300">Use a different email</Link></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
