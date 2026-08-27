'use client';

import { ReactNode } from 'react';
import { CinematicIntro } from '@/components/CinematicIntro';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="ascend-admin-world min-h-screen">
      <div className="ascend-admin-ambient" aria-hidden="true" />
      <div className="ascend-admin-grid" aria-hidden="true" />
      <CinematicIntro
        storageKey="ascend-admin-cinematic-intro"
        eyebrow="THE INNER COUNCIL"
        title="THE COUNCIL CHAMBER"
        subtitle="The doors open only for those entrusted with the Order."
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
