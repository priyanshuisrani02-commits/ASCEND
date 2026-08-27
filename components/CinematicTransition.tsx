'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';

type SceneTone =
  | 'home'
  | 'games'
  | 'challenges'
  | 'rankings'
  | 'achievements'
  | 'relics'
  | 'profile'
  | 'settings'
  | 'admin'
  | 'auth';

type SceneEffect = 'awakening' | 'horizon' | 'trial' | 'ascension' | 'archive' | 'wilds' | 'dossier' | 'observatory' | 'council' | 'threshold';

type Scene = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tone: SceneTone;
  effect: SceneEffect;
  symbol: string;
  duration: number;
  chapter: string;
};

const scenes: Array<[string, Scene]> = [
  ['/admin', { eyebrow: 'THE INNER COUNCIL', title: 'THE COUNCIL CHAMBER', subtitle: 'Iron, ink and authority. The Order opens its most guarded chamber.', tone: 'admin', effect: 'council', symbol: '◈', duration: 4200, chapter: 'VII' }],
  ['/games', { eyebrow: 'THE KNOWN WORLD', title: 'THE TERRITORIES', subtitle: 'Ancient horizons emerge through the mist. Every run becomes part of your legend.', tone: 'games', effect: 'horizon', symbol: '✧', duration: 3800, chapter: 'II' }],
  ['/challenges', { eyebrow: 'ACTIVE TRIALS', title: 'THE TRIAL GROUNDS', subtitle: 'Steel answers steel. The arena wakes. Your next deed is waiting.', tone: 'challenges', effect: 'trial', symbol: '⚔', duration: 3900, chapter: 'III' }],
  ['/rankings', { eyebrow: 'THE HIGHEST RECORDS', title: 'HALL OF ASCENSION', subtitle: 'A silent hall of names. Only deeds carry their weight here.', tone: 'rankings', effect: 'ascension', symbol: '♜', duration: 4000, chapter: 'IV' }],
  ['/achievements', { eyebrow: 'THE GRAND ARCHIVE', title: 'THE DEEDS', subtitle: 'Pages turn in the dark. Relics awaken. The Order remembers what was earned.', tone: 'achievements', effect: 'archive', symbol: '✦', duration: 3900, chapter: 'V' }],
  ['/my-achievements', { eyebrow: 'YOUR PRIVATE VAULT', title: 'YOUR RELICS', subtitle: 'Green fireflies drift through the vault. Your collected deeds wait beyond the mist.', tone: 'relics', effect: 'wilds', symbol: '◇', duration: 3900, chapter: 'VI' }],
  ['/profile', { eyebrow: 'THE RECORD', title: 'THE DOSSIER', subtitle: 'Ink remembers what memory forgets. A history is a trail of choices.', tone: 'profile', effect: 'dossier', symbol: '☷', duration: 3700, chapter: 'I' }],
  ['/settings', { eyebrow: 'THE INNER CHAMBER', title: 'THE OBSERVATORY', subtitle: 'Stars wheel above the instruments. Calibrate the way you enter the Order.', tone: 'settings', effect: 'observatory', symbol: '◎', duration: 3700, chapter: 'VIII' }],
  ['/login', { eyebrow: 'THE THRESHOLD', title: 'RETURN TO THE ORDER', subtitle: 'The seal recognizes a familiar hand.', tone: 'auth', effect: 'threshold', symbol: '∴', duration: 3000, chapter: 'IX' }],
  ['/signup', { eyebrow: 'THE INITIATION', title: 'TAKE YOUR PLACE', subtitle: 'Every record begins with a first step into the unknown.', tone: 'auth', effect: 'threshold', symbol: '∴', duration: 3000, chapter: 'IX' }],
  ['/onboarding', { eyebrow: 'THE FIRST ASCENT', title: 'THE INITIATION', subtitle: 'Choose your path. The Order is waiting to know your name.', tone: 'auth', effect: 'awakening', symbol: '∴', duration: 3200, chapter: 'IX' }],
  ['/forgot-password', { eyebrow: 'THE LOST SEAL', title: 'RECOVER THE RECORD', subtitle: 'A quiet chamber. A single seal waiting to be restored.', tone: 'auth', effect: 'threshold', symbol: '∴', duration: 2800, chapter: 'IX' }],
  ['/reset-password', { eyebrow: 'THE RESTORED SEAL', title: 'RECLAIM THE CHAMBER', subtitle: 'The lock turns. Your path continues.', tone: 'auth', effect: 'awakening', symbol: '∴', duration: 2800, chapter: 'IX' }],
  ['/verify-email', { eyebrow: 'THE VERIFICATION CHAMBER', title: 'PROVE THE SEAL', subtitle: 'One final mark before the Order recognizes you.', tone: 'auth', effect: 'threshold', symbol: '∴', duration: 2800, chapter: 'IX' }],
];

function getScene(pathname: string): Scene {
  const match = scenes.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (match) return match[1];
  return { eyebrow: 'THE ORDER', title: 'THE FIRST AWAKENING', subtitle: 'The world stirs beyond the veil.', tone: 'home', effect: 'awakening', symbol: '✦', duration: 3200, chapter: 'X' };
}

export function CinematicTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scene, setScene] = useState<Scene>(() => getScene(pathname));
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const nextScene = getScene(pathname);
    setScene(nextScene);
    setVisible(true);
    document.documentElement.dataset.ascendScene = nextScene.tone;
    document.documentElement.dataset.ascendEffect = nextScene.effect;

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), nextScene.duration);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [pathname]);

  useEffect(() => () => {
    delete document.documentElement.dataset.ascendScene;
    delete document.documentElement.dataset.ascendEffect;
  }, []);

  if (!visible) return null;

  const cinematicStyle = { '--cin-duration': `${scene.duration}ms` } as CSSProperties;

  return (
    <div className={`ascend-cinematic ascend-cinematic--${scene.tone} ascend-cinematic--effect-${scene.effect}`} role="presentation" style={cinematicStyle}>
      <div className="ascend-cinematic__backdrop" />
      <div className="ascend-cinematic__scene" aria-hidden="true">
        <div className="ascend-cinematic__scene-sky" />
        <div className="ascend-cinematic__scene-horizon" />
        <div className="ascend-cinematic__scene-mist" />
        <div className="ascend-cinematic__scene-ground" />
      </div>
      <div className="ascend-cinematic__architecture" aria-hidden="true">
        <div className="ascend-cinematic__ceiling" />
        <div className="ascend-cinematic__floor" />
        <div className="ascend-cinematic__columns" />
      </div>
      <div className="ascend-cinematic__stars" />
      <div className="ascend-cinematic__rays" />
      <div className="ascend-cinematic__particles" />
      <div className="ascend-cinematic__effect" aria-hidden="true">
        <span className="effect-shape effect-shape--one" />
        <span className="effect-shape effect-shape--two" />
        <span className="effect-shape effect-shape--three" />
        <span className="effect-shape effect-shape--four" />
        <span className="effect-shape effect-shape--five" />
      </div>
      <div className="ascend-cinematic__portal" aria-hidden="true">
        <div className="ascend-cinematic__portal-core" />
        <div className="ascend-cinematic__portal-ring ascend-cinematic__portal-ring--one" />
        <div className="ascend-cinematic__portal-ring ascend-cinematic__portal-ring--two" />
      </div>
      <div className="ascend-cinematic__doors" aria-hidden="true" />
      <div className="ascend-cinematic__sigil" aria-hidden="true"><span>{scene.chapter}</span></div>
      <div className="ascend-cinematic__fog ascend-cinematic__fog--back" />
      <div className="ascend-cinematic__fog ascend-cinematic__fog--mid" />
      <div className="ascend-cinematic__fog ascend-cinematic__fog--front" />
      <div className="ascend-cinematic__content">
        <div className="ascend-cinematic__seal"><span>{scene.symbol}</span></div>
        <div className="ascend-cinematic__eyebrow">{scene.eyebrow}</div>
        <h1 className="ascend-cinematic__title">{scene.title}</h1>
        <p className="ascend-cinematic__subtitle">{scene.subtitle}</p>
        <div className="ascend-cinematic__line" />
      </div>
      <button type="button" onClick={() => setVisible(false)} className="ascend-cinematic__skip">Enter chamber</button>
    </div>
  );
}
