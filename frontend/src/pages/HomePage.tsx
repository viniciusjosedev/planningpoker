import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { HomeModal } from '@/components/home/HomeModal';
import { getUserId } from '@/lib/user';

export function HomePage() {
  const navigate = useNavigate();
  const { connected, send, on, off } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const createdRoomHandlerRef = useRef<((payload: any) => void) | null>(null);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (createdRoomHandlerRef.current) {
        off('createdRoom', createdRoomHandlerRef.current);
      }
    };
  }, [off]);

  // Listen for errors during room creation
  useEffect(() => {
    const errorHandler = (message: string) => {
      alert(message);
      setCreating(false);
    };
    on('error', errorHandler);
    return () => {
      off('error', errorHandler);
    };
  }, [on, off]);

  const handleCreateRoom = useCallback(() => {
    if (!roomName.trim() || creating) return;

    setCreating(true);

    // Remove previous listener if exists
    if (createdRoomHandlerRef.current) {
      off('createdRoom', createdRoomHandlerRef.current);
    }

    const handler = (payload: { hash: string }) => {
      setRoomId(payload.hash);
      setCreating(false);
      navigate(`/${payload.hash}`);
    };

    createdRoomHandlerRef.current = handler;
    on('createdRoom', handler);

    send('createRoom', { name: roomName.trim(), userId: getUserId() });
  }, [roomName, creating, send, on, off, navigate]);

  const handleCopyLink = () => {
    if (!roomId) return;
    const link = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    if (roomId) navigate(`/${roomId}`);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setRoomName('');
      setRoomId(null);
      setCreating(false);
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0d1b2a]">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Planning Poker</h1>
          <p className="text-[#5a8aad]">
            Estimate story points with your team
          </p>
        </div>

        <HomeModal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          roomName={roomName}
          onRoomNameChange={setRoomName}
          roomId={roomId}
          copied={copied}
          connected={connected}
          creating={creating}
          onCreateRoom={handleCreateRoom}
          onCopyLink={handleCopyLink}
          onJoinRoom={handleJoinRoom}
        />
      </div>
    </div>
  );
}
