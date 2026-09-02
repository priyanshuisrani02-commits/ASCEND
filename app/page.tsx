'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';

function startAmbientSound(contextRef: MutableRefObject<AudioContext | null>) {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  if (!contextRef.current) {
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    master.gain.value = 0.025;
    filter.type = 'lowpass';
    filter.frequency.value = 430;
    filter.Q.value = 1.1;
    filter.connect(master);
    master.connect(ctx.destination);

    [41.2, 55, 73.42, 110].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = index < 2 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.65 : 0.11;
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start();
    });

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.045;
    lfoGain.gain.value = 0.009;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
    contextRef.current = ctx;
  }

  void contextRef.current.resume();
}

export default function HomePage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);

  const particles = useMemo(() => Array.from({ length: 46 }, (_, index) => ({
    x: `${3 + ((index * 47) % 94)}%`,
    y: `${4 + ((index * 29) % 84)}%`,
    size: `${1 + (index % 3) * 0.7}px`,
    duration: `${6 + (index % 8)}s`,
    delay: `${-(index % 9)}s`,
    dx: `${((index % 7) - 3) * 28}px`,
  })), []);

  useEffect(() => {
    const awaken = () => startAmbientSound(audioContext);
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
    startAmbientSound(audioContext);
    setEntering(true);
    window.setTimeout(() => router.push('/games'), 1050);
  };

  return (
    <main className={`ascend-landing${entering ? ' is-entering' : ''}`} aria-label="ASCEND title screen">
      <div className="ascend-landing__sky" aria-hidden="true" />
      <div className="ascend-landing__stars" aria-hidden="true" />
      <div className="ascend-landing__moon" aria-hidden="true" />
      <div className="ascend-landing__halo" aria-hidden="true" />
      <div className="ascend-landing__beam ascend-landing__beam--one" aria-hidden="true" />
      <div className="ascend-landing__beam ascend-landing__beam--two" aria-hidden="true" />

      <div className="ascend-landing__mountains" aria-hidden="true">
        <svg viewBox="0 0 1600 720" preserveAspectRatio="none" role="presentation">
          <defs>
            <linearGradient id="farMountains" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#69716f" stopOpacity=".34" />
              <stop offset="1" stopColor="#222827" stopOpacity=".8" />
            </linearGradient>
            <linearGradient id="nearMountains" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#343c3a" />
              <stop offset="1" stopColor="#0b1111" />
            </linearGradient>
          </defs>
          <path fill="url(#farMountains)" d="M0 430 150 290 230 370 360 205 470 350 590 235 710 365 850 170 990 350 1115 255 1250 370 1390 205 1600 400V720H0Z" />
          <path fill="url(#nearMountains)" d="M0 560 135 410 250 500 405 280 535 490 680 340 810 535 960 315 1080 475 1210 365 1345 525 1480 345 1600 455V720H0Z" />
          <path fill="#111817" opacity=".82" d="M0 610 190 500 315 565 500 455 650 575 810 440 955 560 1110 470 1270 575 1440 465 1600 555V720H0Z" />
        </svg>
      </div>

      <div className="ascend-landing__ruins" aria-hidden="true">
        <div className="ruin ruin--far ruin--far-one"><span /></div>
        <div className="ruin ruin--far ruin--far-two"><span /></div>
        <div className="ruin ruin--left"><span /><i /><b /></div>
        <div className="ruin ruin--right"><span /><i /><b /></div>
        <div className="ruin ruin--center"><span /><i /><b /></div>
        <div className="ruin ruin--obelisk"><span /></div>
        <div className="ruin ruin--bridge"><i /><i /><i /><i /></div>
      </div>

      <div className="ascend-landing__floating" aria-hidden="true">
        <div className="floating-monolith floating-monolith--one"><span>◈</span></div>
        <div className="floating-monolith floating-monolith--two"><span>◇</span></div>
        <div className="floating-monolith floating-monolith--three"><span>✦</span></div>
      </div>

      <div className="ascend-landing__water" aria-hidden="true" />
      <div className="ascend-landing__fog ascend-landing__fog--back" aria-hidden="true" />
      <div className="ascend-landing__fog ascend-landing__fog--middle" aria-hidden="true" />
      <div className="ascend-landing__fog ascend-landing__fog--front" aria-hidden="true" />

      <div className="ascend-landing__particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <i key={index} className="ascend-landing__particle" style={{
            '--x': particle.x, '--y': particle.y, '--s': particle.size,
            '--d': particle.duration, '--delay': particle.delay, '--dx': particle.dx,
          } as CSSProperties} />
        ))}
      </div>

      <div className="ascend-landing__sigil" aria-hidden="true">
        <span className="ascend-landing__sigil-ring ascend-landing__sigil-ring--one" />
        <span className="ascend-landing__sigil-ring ascend-landing__sigil-ring--two" />
        <span className="ascend-landing__sigil-ring ascend-landing__sigil-ring--three" />
        <span className="ascend-landing__sigil-cross" />
        <span className="ascend-landing__sigil-mark">✦</span>
      </div>

      <section className="ascend-landing__content">
        <div className="ascend-landing__eyebrow"><span /> THE VEIL HAS OPENED <span /></div>
        <h1 className="ascend-landing__title" data-text="ASCEND">ASCEND</h1>
        <div className="ascend-landing__subtitle">Beyond the known lies what remembers you</div>
        <button type="button" className="ascend-landing__enter" onClick={enterRealm} disabled={entering}>
          <span className="enter-corner enter-corner--tl" /><span className="enter-corner enter-corner--tr" />
          <span className="enter-corner enter-corner--bl" /><span className="enter-corner enter-corner--br" />
          <span className="enter-label">Enter the field of unknown</span><span className="enter-arrow">↗</span>
        </button>
      </section>

      <div className="ascend-landing__lower-mark" aria-hidden="true"><span>◆</span> THE ORDER <span>◆</span></div>
      <div className="ascend-landing__flash" aria-hidden="true" />
      <div className="ascend-landing__transition" aria-hidden="true" />
    </main>
  );
}
