'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

function getScene(pathname: string) {
  if (pathname.startsWith('/admin')) {
    return {
      eyebrow: 'THE INNER COUNCIL',
      title: 'THE COUNCIL CHAMBER',
      subtitle: 'The doors open only for those entrusted with the Order.',
      tone: 'admin',
      duration: 3600,
    } as const;
  }

  if (pathname === '/') {
    return {
      eyebrow: 'THE ORDER OF DEEDS',
      title: 'ASCEND',
      subtitle: 'The doors open. The fog lifts. Your record begins.',
      tone: 'home',
      duration: 5600,
    } as const;
  }

  const scenes: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
    '/games': { eyebrow: 'THE KNOWN WORLD', title: 'THE TERRITORIES', subtitle: 'Beyond the threshold lie worlds waiting to be conquered.' },
    '/challenges': { eyebrow: 'ACTIVE TRIALS', title: 'THE TRIAL GROUNDS', subtitle: 'Every trial is a chance to leave your name in the record.' },
    '/rankings': { eyebrow: 'THE HIGHEST RECORDS', title: 'HALL OF ASCENSION', subtitle: 'Only deeds endure. Only the highest are remembered.' },
    '/achievements': { eyebrow: 'THE ARCHIVE', title: 'THE DEEDS', subtitle: 'Relics of every trial, preserved for those who earned them.' },
    '/my-achievements': { eyebrow: 'YOUR ARCHIVE', title: 'YOUR RELICS', subtitle: 'The Order remembers what you have accomplished.' },
    '/profile': { eyebrow: 'THE RECORD', title: 'THE DOSSIER', subtitle: 'Every name carries a history. Every deed leaves a trace.' },
    '/settings': { eyebrow: 'THE INNER CHAMBER', title: 'YOUR SETTINGS', subtitle: 'Shape how you enter the Order.' },
  };

  const key = Object.keys(scenes).find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const scene = key ? scenes[key] : { eyebrow: 'THE ORDER', title: 'ENTERING THE CHAMBER', subtitle: 'The threshold opens.' };

  return { ...scene, tone: 'standard' as const, duration: 3000 };
}

export function CinematicTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scene, setScene] = useState(() => getScene(pathname));
  const firstPath = useRef(pathname);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const nextScene = getScene(pathname);
    setScene(nextScene);
    setVisible(true);

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), nextScene.duration);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    if (firstPath.current !== pathname) firstPath.current = pathname;
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className={`ascend-cinematic ascend-cinematic--${scene.tone}`} role="presentation">
      <div className="ascend-cinematic__backdrop" />
      <div className="ascend-cinematic__stars" />
      <div className="ascend-cinematic__rays" />
      <div className="ascend-cinematic__particles" />

      <div className="ascend-cinematic__portal" aria-hidden="true">
        <div className="ascend-cinematic__portal-core" />
        <div className="ascend-cinematic__portal-ring ascend-cinematic__portal-ring--one" />
        <div className="ascend-cinematic__portal-ring ascend-cinematic__portal-ring--two" />
      </div>

      <div className="ascend-cinematic__doors" aria-hidden="true">
        <div className="ascend-cinematic__door ascend-cinematic__door--left">
          <div className="ascend-cinematic__door-frame" />
          <div className="ascend-cinematic__door-rune">ᚫ</div>
          <div className="ascend-cinematic__door-handle" />
        </div>
        <div className="ascend-cinematic__door ascend-cinematic__door--right">
          <div className="ascend-cinematic__door-frame" />
          <div className="ascend-cinematic__door-rune">◇</div>
          <div className="ascend-cinematic__door-handle" />
        </div>
      </div>

      <div className="ascend-cinematic__fog ascend-cinematic__fog--back" />
      <div className="ascend-cinematic__fog ascend-cinematic__fog--mid" />
      <div className="ascend-cinematic__fog ascend-cinematic__fog--front" />

      <div className="ascend-cinematic__content">
        <div className="ascend-cinematic__seal"><span>✦</span></div>
        <div className="ascend-cinematic__eyebrow">{scene.eyebrow}</div>
        <h1 className="ascend-cinematic__title">{scene.title}</h1>
        <p className="ascend-cinematic__subtitle">{scene.subtitle}</p>
        <div className="ascend-cinematic__line" />
      </div>

      <button type="button" onClick={() => setVisible(false)} className="ascend-cinematic__skip">
        Enter chamber
      </button>
    </div>
  );
}
