import { Button } from '@/components/ui/button';
import { PokerCard } from '@/components/PokerCard';
import { PlayerCard } from '@/components/PlayerCard';
import { FIBONACCI_CARDS, type Room, type Player } from '@/types';
import { RefreshCw, Eye, LogOut } from 'lucide-react';
import { useMemo } from 'react';

interface GameAreaProps {
  room: Room;
  isCurrentSpectator: boolean;
  isOwner: boolean;
  selectedCard: number | null;
  onVote: (value: number) => void;
  onReveal: () => void;
  onReset: () => void;
  onLeave: () => void;
}

function distributePlayersAroundTable(players: Player[]) {
  const top: Player[] = [];
  const bottom: Player[] = [];
  const left: Player[] = [];
  const right: Player[] = [];

  const n = players.length;

  if (n <= 3) {
    top.push(...players);
  } else if (n <= 6) {
    const topCount = Math.ceil(n / 2);
    top.push(...players.slice(0, topCount));
    bottom.push(...players.slice(topCount));
  } else if (n <= 10) {
    const sideCount = Math.min(Math.floor((n - 4) / 2), 3);
    const topBottomCount = n - sideCount * 2;
    const topCount = Math.ceil(topBottomCount / 2);
    const bottomCount = topBottomCount - topCount;

    left.push(...players.slice(0, sideCount));
    top.push(...players.slice(sideCount, sideCount + topCount));
    right.push(...players.slice(sideCount + topCount, sideCount + topCount + sideCount));
    bottom.push(...players.slice(sideCount + topCount + sideCount));
  } else {
    const perSide = Math.ceil(n / 4);
    top.push(...players.slice(0, perSide));
    right.push(...players.slice(perSide, perSide * 2));
    bottom.push(...players.slice(perSide * 2, perSide * 3));
    left.push(...players.slice(perSide * 3));
  }

  return { top, bottom, left, right };
}

export function GameArea({
  room,
  isCurrentSpectator,
  isOwner,
  selectedCard,
  onVote,
  onReveal,
  onReset,
  onLeave,
}: GameAreaProps) {
  const { top, bottom, left, right } = useMemo(
    () => distributePlayersAroundTable(room.players),
    [room.players]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1b2a]">
      <header className="border-b border-[#1b2e44] bg-[#101d2f] p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Planning Poker</h1>
            <span className="text-sm text-[#5a8aad]">Room: {room.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLeave} className="gap-2 text-[#5a8aad] hover:text-white">
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Table + Players layout */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Left side players */}
          {left.length > 0 && (
            <div className="flex flex-col gap-4">
              {left.map((player) => (
                <PlayerCard key={player.id} player={player} isRevealed={room.revealed} />
              ))}
            </div>
          )}

          {/* Center column: top players + table + bottom players */}
          <div className="flex flex-col items-center gap-4">
            {/* Top players */}
            {top.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {top.map((player) => (
                  <PlayerCard key={player.id} player={player} isRevealed={room.revealed} />
                ))}
              </div>
            )}

            {/* Table */}
            <div className="bg-[#1b3a4b] rounded-2xl px-16 py-12 min-w-[320px] min-h-[160px] flex items-center justify-center border border-[#264e63] shadow-lg shadow-[#0a1420]/50">
              {room.revealed ? (
                <div className="text-center">
                  {isOwner && (
                    <Button
                      onClick={onReset}
                      className="gap-2 bg-[#1b3a4b] hover:bg-[#264e63] text-white border border-[#264e63]"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Start new voting
                    </Button>
                  )}
                </div>
              ) : isOwner ? (
                <Button
                  onClick={onReveal}
                  className="gap-2 bg-[#4a90d9] hover:bg-[#3a7fc8] text-white px-8 py-3 text-base"
                >
                  <Eye className="w-5 h-5" />
                  Reveal cards
                </Button>
              ) : (
                <p className="text-[#5a8aad] text-lg">Pick your cards!</p>
              )}
            </div>

            {/* Bottom players */}
            {bottom.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {bottom.map((player) => (
                  <PlayerCard key={player.id} player={player} isRevealed={room.revealed} />
                ))}
              </div>
            )}
          </div>

          {/* Right side players */}
          {right.length > 0 && (
            <div className="flex flex-col gap-4">
              {right.map((player) => (
                <PlayerCard key={player.id} player={player} isRevealed={room.revealed} />
              ))}
            </div>
          )}
        </div>

        {/* Vote Distribution */}
        {room.revealed && (() => {
          const voters = room.players.filter((p) => !p.isSpectator && p.vote !== null);
          const voteCounts: Record<number, number> = {};
          voters.forEach((p) => {
            voteCounts[p.vote!] = (voteCounts[p.vote!] || 0) + 1;
          });
          const maxCount = Math.max(...Object.values(voteCounts), 1);
          const sortedVotes = Object.entries(voteCounts)
            .map(([v, c]) => ({ value: Number(v), count: c }))
            .sort((a, b) => a.value - b.value);

          return (
            <div className="flex flex-wrap items-end justify-center gap-6 mb-6">
              {sortedVotes.map(({ value, count }) => (
                <div key={value} className="flex flex-col items-center gap-1">
                  <div
                    className="w-3 bg-[#4a90d9] rounded-t"
                    style={{ height: `${(count / maxCount) * 80}px`, minHeight: '8px' }}
                  />
                  <div className="w-12 h-16 rounded-lg border-2 border-[#264e63] bg-[#0f2940] flex items-center justify-center">
                    <span className="text-white font-bold">{value}</span>
                  </div>
                  <span className="text-xs text-[#5a8aad]">
                    {count} {count === 1 ? 'Vote' : 'Votes'}
                  </span>
                </div>
              ))}
              {room.average !== null && (
                <div className="flex flex-col items-center gap-1 ml-6 pl-6 border-l border-[#264e63]">
                  <span className="text-xs text-[#5a8aad]">Average</span>
                  <span className="text-2xl font-bold text-white">{room.average.toFixed(1)}</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Status */}
        {!room.revealed && (
          <p className="text-[#5a8aad] text-sm mb-4">
            {isCurrentSpectator ? 'Spectating' : 'Choose your card \uD83D\uDC47'}
          </p>
        )}

        {/* Cards */}
        {!isCurrentSpectator && !room.revealed && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FIBONACCI_CARDS.map((value) => (
              <PokerCard
                key={value}
                value={value}
                isSelected={selectedCard === value}
                isRevealed={room.revealed}
                onClick={() => onVote(value)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
