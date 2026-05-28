import { HomeModal } from '@/components/home/HomeModal';
import { useHomePage } from '@/hooks/useHomePage';

export function HomePage() {
  const {
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
  } = useHomePage();

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
