import { cn } from '@/lib/utils';
import type { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isRevealed: boolean;
}

export function PlayerCard({ player, isRevealed }: PlayerCardProps) {
  const hasVoted = !player.isSpectator && player.vote !== null;
  const showFlip = isRevealed && hasVoted;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-28" style={{ perspective: '600px' }}>
        <div
          className={cn(
            'relative w-full h-full transition-transform duration-700 ease-in-out',
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: showFlip ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face (card back) */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl border-2 flex items-center justify-center overflow-hidden',
              player.isSpectator
                ? 'bg-[#0f2940] border-[#264e63]'
                : hasVoted
                  ? 'bg-[#2a7fff] border-[#4a90d9]'
                  : 'bg-[#0f2940] border-[#264e63]'
            )}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {!player.isSpectator && hasVoted && (
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 6px,
                    rgba(255,255,255,0.4) 6px,
                    rgba(255,255,255,0.4) 7px
                  ), repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 6px,
                    rgba(255,255,255,0.4) 6px,
                    rgba(255,255,255,0.4) 7px
                  )`,
                }}
              />
            )}
            {player.isSpectator ? (
              <span className="text-[#5a8aad] text-xs">👁️</span>
            ) : hasVoted ? (
              <span className="relative z-10 text-white text-2xl">✓</span>
            ) : (
              <span className="text-[#264e63] text-xs">-</span>
            )}
          </div>

          {/* Back face (revealed vote) */}
          <div
            className="absolute inset-0 rounded-xl border-2 bg-white border-[#4a90d9] flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-2xl font-bold text-[#0d1b2a]">
              {player.vote ?? ''}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-medium text-white truncate max-w-24">
          {player.name}
        </span>
        {player.isSpectator && (
          <span className="text-xs text-[#5a8aad]">Spectator</span>
        )}
      </div>
    </div>
  );
}
