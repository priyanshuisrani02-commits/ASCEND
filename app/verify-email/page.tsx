import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center">
      <div className="text-sm text-slate-400">Loading verification…</div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
