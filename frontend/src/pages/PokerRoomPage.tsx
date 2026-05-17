import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PokerCard } from '@/components/PokerCard';
import { PlayerCard } from '@/components/PlayerCard';
import { useSocket } from '@/hooks/useSocket';
import { FIBONACCI_CARDS, type Player, type Room } from '@/types';
import { RefreshCw, Eye, LogOut } from 'lucide-react';

export function PokerRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { connect, disconnect, emit, on } = useSocket();

  const [name, setName] = useState('');
  const [isSpectator, setIsSpectator] = useState(false);
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    connect();

    on('roomJoined', (roomData: Room) => {
      setRoom(roomData);
      setJoined(true);
    });

    on('roomUpdated', (roomData: Room) => {
      setRoom(roomData);
      checkAllVotesEqual(roomData);
    });

    on('votesRevealed', (roomData: Room) => {
      setRoom(roomData);
      checkAllVotesEqual(roomData);
    });

    on('votesReset', (roomData: Room) => {
      setRoom(roomData);
      setSelectedCard(null);
      setShowConfetti(false);
    });

    on('playerLeft', (roomData: Room) => {
      setRoom(roomData);
    });

    on('error', (message: string) => {
      alert(message);
    });

    return () => {
      disconnect();
    };
  }, []);

  const checkAllVotesEqual = (roomData: Room) => {
    const voters = roomData.players.filter((p) => !p.isSpectator && p.vote !== null);
    if (voters.length < 2) return;

    const allEqual = voters.every((p) => p.vote === voters[0].vote);
    if (allEqual && roomData.revealed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleJoin = () => {
    if (!name.trim() || !roomId) return;
    emit('joinRoom', roomId, name.trim(), isSpectator);
  };

  const handleVote = (value: number) => {
    if (isSpectator || !joined) return;
    setSelectedCard(value);
    emit('vote', value);
  };

  const handleReveal = () => {
    emit('revealVotes');
  };

  const handleReset = () => {
    emit('resetVotes');
    setSelectedCard(null);
    setShowConfetti(false);
  };

  const handleLeave = () => {
    emit('leaveRoom');
    navigate('/');
  };

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Join Room</h1>
            <p className="text-zinc-400">Room: {roomId}</p>
          </div>

          <div className="space-y-4 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="spectator"
                checked={isSpectator}
                onChange={(e) => setIsSpectator(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600"
              />
              <label htmlFor="spectator" className="text-sm text-zinc-300">
                Join as Spectator
              </label>
            </div>

            <Button onClick={handleJoin} disabled={!name.trim()} className="w-full">
              Join Room
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const currentPlayer = room.players.find((p) => p.name === name);
  const isCurrentSpectator = currentPlayer?.isSpectator ?? true;

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header */}
      <header className="border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Planning Poker</h1>
            <span className="text-sm text-zinc-500">Room: {roomId}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLeave} className="gap-2">
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
        </div>
      </header>

      {/* Players */}
      <section className="p-6 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-medium text-zinc-400 mb-4">
            Players ({room.players.length})
          </h2>
          <div className="flex flex-wrap gap-4">
            {room.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isRevealed={room.revealed}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-8">
          {/* Status */}
          <div className="text-center space-y-2">
            {room.revealed ? (
              <>
                <h2 className="text-2xl font-bold text-white">Votes Revealed!</h2>
                {room.average !== null && (
                  <p className="text-zinc-400">
                    Average: <span className="text-white font-bold">{room.average.toFixed(1)}</span>
                  </p>
                )}
              </>
            ) : (
              <h2 className="text-2xl font-bold text-white">
                {isCurrentSpectator ? 'Spectating' : 'Choose your card'}
              </h2>
            )}
          </div>

          {/* Cards */}
          {!isCurrentSpectator && !room.revealed && (
            <div className="flex flex-wrap justify-center gap-3">
              {FIBONACCI_CARDS.map((value) => (
                <PokerCard
                  key={value}
                  value={value}
                  isSelected={selectedCard === value}
                  isRevealed={room.revealed}
                  onClick={() => handleVote(value)}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleReveal}
              disabled={isCurrentSpectator}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Reveal Votes
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
