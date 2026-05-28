import Confetti from 'react-confetti';
import { JoinForm } from '@/components/room/JoinForm';
import { GameArea } from '@/components/room/GameArea';
import { usePokerRoomPage } from '@/hooks/usePokerRoomPage';

export function PokerRoomPage() {
  const {
    name,
    setName,
    isSpectator,
    setIsSpectator,
    joined,
    room,
    selectedCard,
    showConfetti,
    isCurrentSpectator,
    isOwner,
    handleJoin,
    handleVote,
    handleReveal,
    handleReset,
    handleLeave,
  } = usePokerRoomPage();

  if (!joined) {
    return (
      <JoinForm
        name={name}
        onNameChange={setName}
        isSpectator={isSpectator}
        onSpectatorChange={setIsSpectator}
        onJoin={handleJoin}
      />
    );
  }

  if (!room) return null;

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <GameArea
        room={room}
        isCurrentSpectator={isCurrentSpectator}
        isOwner={isOwner}
        selectedCard={selectedCard}
        onVote={handleVote}
        onReveal={handleReveal}
        onReset={handleReset}
        onLeave={handleLeave}
      />
    </>
  );
}
