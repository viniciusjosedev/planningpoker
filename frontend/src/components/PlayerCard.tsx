import { cn } from '@/lib/utils';
import type { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isRevealed: boolean;
}

export function PlayerCard({ player, isRevealed }: PlayerCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'w-16 h-24 rounded-lg border-2 flex items-center justify-center transition-all duration-300',
          player.isSpectator
            ? 'bg-zinc-800 border-zinc-600'
            : isRevealed && player.vote !== null
              ? 'bg-white border-white'
              : 'bg-zinc-800 border-zinc-700'
        )}
      >
        {player.isSpectator ? (
          <span className="text-zinc-500 text-xs">👁️</span>
        ) : isRevealed && player.vote !== null ? (
          <span className="text-2xl font-bold text-black">{player.vote}</span>
        ) : player.vote !== null ? (
          <span className="text-zinc-500 text-2xl">?</span>
        ) : (
          <span className="text-zinc-600 text-xs">-</span>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-medium text-white truncate max-w-20">
          {player.name}
        </span>
        {player.isSpectator && (
          <span className="text-xs text-zinc-500">Spectator</span>
        )}
      </div>
    </div>
  );
}
