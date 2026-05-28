import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { getUserId } from '@/lib/user';

export function useHomePage() {
  const navigate = useNavigate();
  const { connected, send, on, off } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const createdRoomHandlerRef = useRef<((payload: any) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (createdRoomHandlerRef.current) {
        off('createdRoom', createdRoomHandlerRef.current);
      }
    };
  }, [off]);

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

  return {
    isOpen,
    roomName,
    setRoomName,
    roomId,
    copied,
    connected,
    creating,
    handleCreateRoom,
    handleCopyLink,
    handleJoinRoom,
    handleOpenChange,
  };
}
