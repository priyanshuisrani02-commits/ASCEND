'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

function startAmbientSound(contextRef: React.MutableRefObject<AudioContext | null>) {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  if (!contextRef.current) {
    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    master.gain.value = 0.035;
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    filter.Q.value = 1.2;
    filter.connect(master);
    master.connect(ctx.destination);

    const notes = [55, 82.41, 110];
    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.7 : 0.18;
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start();
    });

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.012;
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

  const particles = useMemo(() => Array.from({ length: 28 }, (_, index) => ({
    x: `${8 + ((index * 37) % 84)}%`,
    y: `${28 + ((index * 19) % 62)}%`,
    size: `${1 + (index % 3)}px`,
    duration: `${5 + (index % 6)}s`,
    delay: `${-(index % 7)}s`,
    dx: `${((index % 5) - 2) * 24}px`,
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
    window.setTimeout(() => router.push('/games'), 850);
  };

  return (
    <main className={`ascend-landing${entering ? ' is-entering' : ''}`} aria-label="ASCEND title screen">
      <div className="ascend-landing__sky" />
      <div className="ascend-landing__sun" />
      <div className="ascend-landing__beam" />

      <div className="ascend-landing__mountain ascend-landing__mountain--left" />
      <div className="ascend-landing__mountain ascend-landing__mountain--far" />
      <div className="ascend-landing__mountain ascend-landing__mountain--right" />

      <div className="ascend-landing__ruins" aria-hidden="true">
        <div className="ascend-landing__tower ascend-landing__tower--one" />
        <div className="ascend-landing__tower ascend-landing__tower--two" />
        <div className="ascend-landing__tower ascend-landing__tower--three" />
        <div className="ascend-landing__tower ascend-landing__tower--four" />
      </div>

      <div className="ascend-landing__water" />
      <div className="ascend-landing__fog ascend-landing__fog--one" />
      <div className="ascend-landing__fog ascend-landing__fog--two" />
      <div className="ascend-landing__fog ascend-landing__fog--three" />

      <div className="ascend-landing__particles" aria-hidden="true">
        {particles.map((particle, index) => (
          <i
            key={index}
            className="ascend-landing__particle"
            style={{
              '--x': particle.x,
              '--y': particle.y,
              '--s': particle.size,
              '--d': particle.duration,
              '--delay': particle.delay,
              '--dx': particle.dx,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="ascend-landing__sigil" aria-hidden="true">
        <span className="ascend-landing__sigil-mark">✦</span>
      </div>

      <section className="ascend-landing__content">
        <div className="ascend-landing__eyebrow">THE VEIL HAS OPENED</div>
        <h1 className="ascend-landing__title">ASCEND</h1>
        <div className="ascend-landing__subtitle">Beyond the known lies what remembers you</div>
        <button type="button" className="ascend-landing__enter" onClick={enterRealm} disabled={entering}>
          Enter the field of unknown
        </button>
        <div className="ascend-landing__crest" aria-hidden="true">✦ &nbsp; THE ORDER &nbsp; ✦</div>
      </section>

      <div className="ascend-landing__flash" aria-hidden="true" />
      <div className="ascend-landing__transition" aria-hidden="true" />
    </main>
  );
}
