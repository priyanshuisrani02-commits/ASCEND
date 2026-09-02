'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import { CinematicRealm } from '@/components/CinematicRealm';

function awakenSound(contextRef: MutableRefObject<AudioContext | null>) {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  if (!contextRef.current) {
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 360;
    low.Q.value = 0.8;
    master.gain.value = 0.018;
    low.connect(master);
    master.connect(ctx.destination);

    [32.7, 43.65, 65.41, 98].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = index < 2 ? 'sine' : 'triangle';
      osc.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.8 : 0.09;
      osc.connect(gain);
      gain.connect(low);
      osc.start();
    });

    const pulse = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    pulse.frequency.value = 0.035;
    pulseGain.gain.value = 0.007;
    pulse.connect(pulseGain);
    pulseGain.connect(master.gain);
    pulse.start();
    contextRef.current = ctx;
  }
  void contextRef.current.resume();
}

export default function HomePage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    const awaken = () => awakenSound(audioContext);
    window.addEventListener('pointerdown', awaken, { once: true });
    window.addEventListener('keydown', awaken, { once: true });
    return () => {
      window.removeEventListener('pointerdown', awaken);
      window.removeEventListener('keydown', awaken);
    };
  }, []);

  useEffect(() => () => {
    if (audioContext.current) void audioContext.current.close();
  }, []);

  const enterRealm = () => {
    if (entering) return;
    awakenSound(audioContext);
    setEntering(true);
    window.setTimeout(() => router.push('/games'), 1250);
  };

  return (
    <main className={`ascend-landing${entering ? ' is-entering' : ''}`} aria-label="ASCEND title screen">
      <CinematicRealm />
      <div className="ascend-landing__grade" aria-hidden="true" />
      <div className="ascend-landing__vignette" aria-hidden="true" />
      <div className="ascend-landing__sigil" aria-hidden="true">
        <span className="sigil-ring sigil-ring--outer" />
        <span className="sigil-ring sigil-ring--middle" />
        <span className="sigil-ring sigil-ring--inner" />
        <span className="sigil-axis sigil-axis--one" />
        <span className="sigil-axis sigil-axis--two" />
      </div>

      <section className="ascend-landing__content">
        <div className="ascend-landing__eyebrow"><i /> THE VEIL HAS OPENED <i /></div>
        <h1 className="ascend-landing__title">ASCEND</h1>
        <div className="ascend-landing__subtitle">Beyond the known lies what remembers you</div>
        <button type="button" className="ascend-landing__enter" onClick={enterRealm} disabled={entering}>
          <span className="enter-line enter-line--top" />
          <span className="enter-line enter-line--bottom" />
          <span className="enter-corner enter-corner--tl" />
          <span className="enter-corner enter-corner--tr" />
          <span className="enter-corner enter-corner--bl" />
          <span className="enter-corner enter-corner--br" />
          <span>Enter the field of unknown</span><b>↗</b>
        </button>
      </section>

      <div className="ascend-landing__lower-mark" aria-hidden="true"><span>◆</span> THE ORDER <span>◆</span></div>
      <div className="ascend-landing__flash" aria-hidden="true" />
      <div className="ascend-landing__transition" aria-hidden="true" />
    </main>
  );
}
