import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { JoinForm } from '@/components/room/JoinForm';
import { GameArea } from '@/components/room/GameArea';
import { getUserId, getUserName, setUserName } from '@/lib/user';
import type { Room } from '@/types';

export function PokerRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { send, on, off, connected } = useWebSocket();

  const [name, setName] = useState('');
  const [isSpectator, setIsSpectator] = useState(false);
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const savedName = getUserName();
    if (savedName) setName(savedName);
  }, []);

  useEffect(() => {
    if (connected && joined && roomId) {
      const savedName = getUserName();
      if (savedName) {
        send('joinRoom', {
          roomId,
          userId: getUserId(),
          name: savedName,
          isSpectator,
        });
      }
    }
  }, [connected]);

  useEffect(() => {
    const handleRoomJoined = (roomData: Room) => {
      setRoom(roomData);
      setJoined(true);
    };

    const handleRoomUpdated = (roomData: Room) => {
      setRoom(roomData);
      checkAllVotesEqual(roomData);
    };

    const handleVotesRevealed = (roomData: Room) => {
      setRoom(roomData);
      checkAllVotesEqual(roomData);
    };

    const handleVotesReset = (roomData: Room) => {
      setRoom(roomData);
      setSelectedCard(null);
      setShowConfetti(false);
    };

    const handlePlayerLeft = (roomData: Room) => {
      setRoom(roomData);
    };

    const handleError = (message: string) => {
      alert(message);
    };

    on('roomJoined', handleRoomJoined);
    on('roomUpdated', handleRoomUpdated);
    on('votesRevealed', handleVotesRevealed);
    on('votesReset', handleVotesReset);
    on('playerLeft', handlePlayerLeft);
    on('error', handleError);

    return () => {
      off('roomJoined', handleRoomJoined);
      off('roomUpdated', handleRoomUpdated);
      off('votesRevealed', handleVotesRevealed);
      off('votesReset', handleVotesReset);
      off('playerLeft', handlePlayerLeft);
      off('error', handleError);
    };
  }, [on, off]);

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
    setUserName(name.trim());
    send('joinRoom', {
      roomId,
      userId: getUserId(),
      name: name.trim(),
      isSpectator,
    });
  };

  const handleVote = (value: number) => {
    if (isSpectator || !joined) return;
    setSelectedCard(value);
    send('vote', { value });
  };

  const handleReveal = () => send('revealVotes');

  const handleReset = () => {
    send('resetVotes');
    setSelectedCard(null);
    setShowConfetti(false);
  };

  const handleLeave = () => {
    send('leaveRoom');
    navigate('/');
  };

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

  const currentPlayer = room.players.find((p) => p.name === name);
  const isCurrentSpectator = currentPlayer?.isSpectator ?? true;
  const isOwner = getUserId() === room.ownerId;

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
