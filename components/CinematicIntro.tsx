'use client';

import { useEffect, useState } from 'react';

interface CinematicIntroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function CinematicIntro({ eyebrow, title, subtitle }: CinematicIntroProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 5200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="ascend-cinematic fixed inset-0 z-[100]"
      role="dialog"
      aria-label={`${title} opening sequence`}
    >
      <div className="ascend-cinematic__backdrop" />
      <div className="ascend-cinematic__fog ascend-cinematic__fog--one" />
      <div className="ascend-cinematic__fog ascend-cinematic__fog--two" />

      <div className="ascend-cinematic__doors" aria-hidden="true">
        <div className="ascend-cinematic__door ascend-cinematic__door--left" />
        <div className="ascend-cinematic__door ascend-cinematic__door--right" />
        <div className="ascend-cinematic__threshold" />
      </div>

      <div className="ascend-cinematic__content">
        <div className="ascend-cinematic__seal">✦</div>
        <div className="ascend-cinematic__eyebrow">{eyebrow}</div>
        <h1 className="ascend-cinematic__title">{title}</h1>
        <p className="ascend-cinematic__subtitle">{subtitle}</p>
        <div className="ascend-cinematic__line" />
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ascend-cinematic__skip"
        aria-label="Skip opening sequence"
      >
        Enter chamber
      </button>
    </div>
  );
}
