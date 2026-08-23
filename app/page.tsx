'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ActivityEvent } from '@/lib/types';
import { getActivities } from '@/lib/data/store';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/Footer';
import NavbarWrapper from '@/components/NavbarWrapper';
import { ArrowDown, ArrowRight, Compass, ScrollText, Swords, Trophy } from 'lucide-react';

const destinations = [
  { title: 'The Territories', eyebrow: 'THE KNOWN WORLD', desc: 'Enter the games recorded by the Order. Every territory holds its own trials, deeds and legends.', href: '/games', icon: Compass },
  { title: 'The Trial Grounds', eyebrow: 'ACTIVE TRIALS', desc: 'Timed challenges await. Enter, prove your skill and leave your name in the record.', href: '/challenges', icon: Swords },
  { title: 'Hall of Ascension', eyebrow: 'THE HIGHEST RECORDS', desc: 'Stand among the strongest. Discover who has climbed furthest through the current season.', href: '/rankings', icon: Trophy },
  { title: 'The Archive', eyebrow: 'DEEDS & RELICS', desc: 'Study the deeds you have earned and the relics that mark your journey through the Order.', href: '/my-achievements', icon: ScrollText },
];

export default function HomePage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => { getActivities().then(setActivities); }, []);

  return (
    <div className="min-h-screen bg-[#080706] text-[#e8ddc5] flex flex-col">
      <NavbarWrapper />

      <main className="flex-1">
        <section className="ascend-world min-h-[calc(100vh-76px)] flex items-center">
          <div className="ascend-fog" />
          <div className="ascend-vignette" />
          <div className="absolute left-[8%] top-[17%] ascend-rune text-5xl hidden md:block">ᚫ</div>
          <div className="absolute right-[10%] top-[30%] ascend-rune text-4xl hidden md:block" style={{ animationDelay: '2s' }}>◇</div>
          <div className="absolute right-[20%] bottom-[17%] ascend-rune text-6xl hidden lg:block" style={{ animationDelay: '4s' }}>✦</div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-24 text-center">
            <div className="ascend-reveal inline-flex items-center gap-3 text-[9px] uppercase tracking-[.42em] text-[#9b8d70] mb-8">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#b89a5a]/60" />
              THE ORDER IS WATCHING
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#b89a5a]/60" />
            </div>

            <div className="ascend-reveal ascend-reveal-delay-1 mx-auto mb-8 w-24 h-24 sm:w-28 sm:h-28 ascend-seal rounded-full">
              <div className="relative z-10 text-4xl sm:text-5xl text-[#d7bd7a]">✦</div>
            </div>

            <h1 className="ascend-reveal ascend-reveal-delay-1 ascend-display text-6xl sm:text-8xl lg:text-[9rem] font-semibold leading-[.86] tracking-[.12em] ascend-gold-text">
              ASCEND
            </h1>
            <p className="ascend-reveal ascend-reveal-delay-2 ascend-display text-lg sm:text-2xl text-[#c6b99e] mt-7 tracking-[.16em]">
              PLAY. PROVE. RISE.
            </p>
            <p className="ascend-reveal ascend-reveal-delay-2 max-w-xl mx-auto text-sm sm:text-base text-[#827b6e] leading-7 mt-5">
              A secret order records the deeds of those who dare to compete. Enter the unknown, survive the trials, and leave something behind.
            </p>

            <div className="ascend-reveal ascend-reveal-delay-3 flex flex-col sm:flex-row justify-center items-center gap-3 mt-10">
              <Link href="/games"><Button variant="primary" size="lg" className="min-w-52 tracking-[.12em]">ENTER THE WORLD <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              <Link href="/signup"><Button variant="outline" size="lg" className="min-w-52 tracking-[.12em]">JOIN THE ORDER</Button></Link>
            </div>

            <div className="mt-20 flex flex-col items-center text-[#655f55]">
              <span className="text-[8px] uppercase tracking-[.42em] mb-3">Descend into the unknown</span>
              <ArrowDown className="w-4 h-4 animate-bounce text-[#b89a5a]/60" />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <div className="text-[9px] uppercase tracking-[.4em] text-[#806c45] mb-3">THE FOUR GATES</div>
              <h2 className="ascend-display text-4xl sm:text-5xl text-[#e8ddc5]">Choose where your path leads.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#756d60]">The world is divided into territories. Your deeds are the only proof that you were there.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#b89a5a]/10 border border-[#b89a5a]/10">
            {destinations.map((destination, index) => {
              const Icon = destination.icon;
              return <Link key={destination.href} href={destination.href} className="group ascend-panel ascend-panel-hover min-h-64 p-7 sm:p-9 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 text-[9rem] ascend-display text-[#b89a5a]/[.025] group-hover:text-[#b89a5a]/[.06] transition-colors">0{index + 1}</div>
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-10"><span className="text-[9px] uppercase tracking-[.3em] text-[#806c45]">{destination.eyebrow}</span><Icon className="w-5 h-5 text-[#6c614e] group-hover:text-[#b89a5a] transition-colors" /></div>
                    <h3 className="ascend-display text-2xl sm:text-3xl text-[#e8ddc5] group-hover:text-[#d7bd7a] transition-colors">{destination.title}</h3>
                    <p className="text-sm text-[#756d60] leading-6 mt-3 max-w-md">{destination.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-8 text-[9px] uppercase tracking-[.25em] text-[#7d6b48] group-hover:text-[#d7bd7a] transition-colors">Enter chamber <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" /></div>
                </div>
              </Link>;
            })}
          </div>
        </section>

        <section className="border-y border-[#b89a5a]/10 bg-[#0b0a09] py-5 overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center gap-5">
            <div className="shrink-0 flex items-center gap-2 text-[9px] uppercase tracking-[.3em] text-[#806c45]"><Activity className="w-3.5 h-3.5" /> Recent Deeds</div>
            <div className="h-4 w-px bg-[#b89a5a]/15" />
            <div className="overflow-hidden flex-1">
              {activities.length ? <div className="flex gap-10 w-max ascend-marquee">{[...activities, ...activities].map((activity, index) => <div key={`${activity.id}-${index}`} className="flex items-center gap-3 text-xs whitespace-nowrap"><span className="text-[#d2c5a9]">{activity.username}</span><span className="text-[#5f594f]">recorded</span><span className="text-[#b89a5a]">{activity.title}</span></div>)}</div> : <div className="text-xs text-[#5f594f]">The records are quiet. Your deed could be the first.</div>}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-5 sm:px-8 py-28 text-center">
          <div className="ascend-divider mb-12" />
          <div className="ascend-seal w-16 h-16 rounded-full mx-auto mb-8"><span className="relative z-10 text-xl text-[#b89a5a]">✦</span></div>
          <div className="text-[9px] uppercase tracking-[.42em] text-[#806c45]">A fragment from the archive</div>
          <blockquote className="ascend-display text-2xl sm:text-4xl leading-relaxed text-[#cfc3ab] mt-5">“Every record is a mark left upon the unknown. Some marks become legends.”</blockquote>
          <p className="text-[9px] uppercase tracking-[.3em] text-[#5f594f] mt-6">— Archive Fragment 001</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
