import React from 'react';
import Link from 'next/link';
import { Game } from '@/lib/types';
import { Users, Trophy, ChevronRight } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
    >
      {/* GAME COVER ARTWORK */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={game.cover_url}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Genre Tag */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-violet-300 uppercase tracking-widest">
          {game.genre}
        </span>
      </div>

      {/* GAME DETAILS */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-black text-white group-hover:text-violet-300 transition-colors tracking-wide">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* METRICS & CTA */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span>{game.player_count.toLocaleString()}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{game.achievement_count} Achievements</span>
            </span>
          </div>

          <span className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 group-hover:bg-violet-600 group-hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
