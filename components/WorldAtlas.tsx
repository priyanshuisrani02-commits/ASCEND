'use client';

import Link from 'next/link';
import { ArrowUpRight, Compass, Lock, MapPin } from 'lucide-react';
import type { Game } from '@/lib/types';

type AtlasRegion = {
  name: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  position: string;
  unlocked: boolean;
};

const fixedRegions: AtlasRegion[] = [
  {
    name: 'THE TERRITORIES',
    subtitle: 'KNOWN LANDS',
    description: 'The first mapped lands of the Order. Their trials are open to all who enter.',
    href: '/games',
    accent: 'atlas-region--cyan',
    position: 'top-[18%] left-[8%]',
    unlocked: true,
  },
  {
    name: 'THE TRIAL GROUNDS',
    subtitle: 'CONTESTED LAND',
    description: 'Where deeds become records and records become reputation.',
    href: '/challenges',
    accent: 'atlas-region--ember',
    position: 'top-[50%] left-[36%]',
    unlocked: true,
  },
  {
    name: 'THE HALL',
    subtitle: 'HIGH COUNTRY',
    description: 'The highest names are carved here. Nothing is given without proof.',
    href: '/rankings',
    accent: 'atlas-region--gold',
    position: 'top-[16%] right-[8%]',
    unlocked: true,
  },
  {
    name: 'THE VEILED REACH',
    subtitle: 'UNMAPPED',
    description: 'A region glimpsed beyond the known borders. Its path has not yet been revealed.',
    href: '#',
    accent: 'atlas-region--violet',
    position: 'bottom-[8%] right-[30%]',
    unlocked: false,
  },
];

export function WorldAtlas({ games = [] }: { games?: Game[] }) {
  const gameRegions = games.slice(0, 3).map((game, index) => ({
    ...fixedRegions[index % 3],
    name: game.title.toUpperCase(),
    subtitle: game.genre.toUpperCase(),
    description: game.description,
    href: `/games/${game.slug}`,
  }));

  const regions = gameRegions.length ? [...gameRegions, fixedRegions[3]] : fixedRegions;

  return (
    <section className="world-atlas" aria-labelledby="world-atlas-title">
      <div className="world-atlas__header">
        <div>
          <div className="text-[9px] uppercase tracking-[.4em] text-[#806c45] mb-3">THE WORLD ATLAS</div>
          <h2 id="world-atlas-title" className="ascend-display text-4xl sm:text-5xl text-[#e8ddc5]">There is more beyond the horizon.</h2>
        </div>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[.25em] text-[#756d60]"><Compass className="w-4 h-4 text-[#b89a5a]" /> Explore the known world</div>
      </div>

      <div className="world-atlas__map">
        <div className="world-atlas__grid" />
        <div className="world-atlas__mist world-atlas__mist--one" />
        <div className="world-atlas__mist world-atlas__mist--two" />
        <div className="world-atlas__ridge world-atlas__ridge--one" />
        <div className="world-atlas__ridge world-atlas__ridge--two" />

        {regions.map((region, index) => {
          const content = (
            <>
              <span className="world-atlas__marker"><MapPin className="w-3.5 h-3.5" /></span>
              <span className="world-atlas__card-index">0{index + 1}</span>
              <span className="world-atlas__card-subtitle">{region.subtitle}</span>
              <strong>{region.name}</strong>
              <span className="world-atlas__description">{region.description}</span>
              <span className="world-atlas__enter">{region.unlocked ? <>Enter territory <ArrowUpRight className="w-3.5 h-3.5" /></> : <><Lock className="w-3.5 h-3.5" /> Beyond the veil</>}</span>
            </>
          );

          return region.unlocked ? (
            <Link key={`${region.name}-${index}`} href={region.href} className={`world-atlas__region ${region.accent} ${region.position}`}>{content}</Link>
          ) : (
            <div key={`${region.name}-${index}`} className={`world-atlas__region world-atlas__region--locked ${region.accent} ${region.position}`}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
