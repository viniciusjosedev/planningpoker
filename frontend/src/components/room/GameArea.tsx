import { Button } from '@/components/ui/button';
import { PokerCard } from '@/components/PokerCard';
import { PlayerCard } from '@/components/PlayerCard';
import { FIBONACCI_CARDS, type Room } from '@/types';
import { RefreshCw, Eye, LogOut } from 'lucide-react';

interface GameAreaProps {
  roomId: string | undefined;
  room: Room;
  isCurrentSpectator: boolean;
  selectedCard: number | null;
  showConfetti: boolean;
  onVote: (value: number) => void;
  onReveal: () => void;
  onReset: () => void;
  onLeave: () => void;
}

export function GameArea({
  roomId,
  room,
  isCurrentSpectator,
  selectedCard,
  onVote,
  onReveal,
  onReset,
  onLeave,
}: GameAreaProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a2332]">
      <header className="border-b border-[#3a5068] p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Planning Poker</h1>
            <span className="text-sm text-[#8fa3b8]">Room: {roomId}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLeave} className="gap-2 text-[#8fa3b8] hover:text-white">
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Players top */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {room.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isRevealed={room.revealed}
            />
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#2a3a4d] rounded-2xl p-12 mb-8 min-w-[300px] min-h-[150px] flex items-center justify-center border border-[#3a5068]">
          {room.revealed ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Votes Revealed!</h2>
              {room.average !== null && (
                <p className="text-[#8fa3b8]">
                  Average: <span className="text-white font-bold">{room.average.toFixed(1)}</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-[#8fa3b8] text-lg">Pick your cards!</p>
          )}
        </div>

        {/* Status */}
        <p className="text-[#8fa3b8] text-sm mb-4">
          {isCurrentSpectator ? 'Spectating' : 'Choose your card'}
        </p>

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

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={onReveal}
            disabled={isCurrentSpectator}
            className="gap-2 bg-[#3b5998] hover:bg-[#4a6fa5]"
          >
            <Eye className="w-4 h-4" />
            Reveal Votes
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="gap-2 border-[#3a5068] text-white hover:bg-[#2a3a4d]"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </main>
    </div>
  );
}
