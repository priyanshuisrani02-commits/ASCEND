'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CinematicRealm } from '@/components/CinematicRealm';

export default function HomePage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  const enterRealm = () => {
    if (entering) return;
    setEntering(true);
    window.setTimeout(() => router.push('/games'), 1250);
  };

  return (
    <main className={`ascend-landing${entering ? ' is-entering' : ''}`} aria-label="ASCEND title screen">
      <CinematicRealm />
      <div className="ascend-landing__grade" aria-hidden="true" />
      <div className="ascend-landing__vignette" aria-hidden="true" />

      <section className="ascend-landing__content">
        <h1 className="ascend-landing__title">ASCEND</h1>
        <button type="button" className="ascend-landing__enter" onClick={enterRealm} disabled={entering}>
          <span>Enter the field of unknown</span>
        </button>
      </section>

      <div className="ascend-landing__flash" aria-hidden="true" />
      <div className="ascend-landing__transition" aria-hidden="true" />
    </main>
  );
}
