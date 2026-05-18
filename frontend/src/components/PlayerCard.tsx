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
          'w-20 h-28 rounded-xl border-2 flex items-center justify-center transition-all duration-300',
          player.isSpectator
            ? 'bg-[#2a3a4d] border-[#3a5068]'
            : isRevealed && player.vote !== null
              ? 'bg-white border-white'
              : player.vote !== null
                ? 'bg-[#3b5998] border-[#60a5fa]'
                : 'bg-[#2a3a4d] border-[#3a5068]'
        )}
      >
        {player.isSpectator ? (
          <span className="text-[#8fa3b8] text-xs">👁️</span>
        ) : isRevealed && player.vote !== null ? (
          <span className="text-2xl font-bold text-[#1a2332]">{player.vote}</span>
        ) : player.vote !== null ? (
          <span className="text-[#60a5fa] text-2xl">✓</span>
        ) : (
          <span className="text-[#3a5068] text-xs">-</span>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-medium text-white truncate max-w-24">
          {player.name}
        </span>
        {player.isSpectator && (
          <span className="text-xs text-[#8fa3b8]">Spectator</span>
        )}
      </div>
    </div>
  );
}
