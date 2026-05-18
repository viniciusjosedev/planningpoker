import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Plus } from 'lucide-react';

interface HomeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roomName: string;
  onRoomNameChange: (name: string) => void;
  roomId: string | null;
  copied: boolean;
  connected: boolean;
  creating: boolean;
  onCreateRoom: () => void;
  onCopyLink: () => void;
  onJoinRoom: () => void;
}

export function HomeModal({
  isOpen,
  onOpenChange,
  roomName,
  onRoomNameChange,
  roomId,
  copied,
  connected,
  creating,
  onCreateRoom,
  onCopyLink,
  onJoinRoom,
}: HomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full gap-2 bg-[#1a6b4a] hover:bg-[#228960] text-white">
          <Plus className="w-5 h-5" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#101d2f] border-[#1b2e44]">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Room</DialogTitle>
          <DialogDescription className="text-[#5a8aad]">
            Choose a name for your room and share the link with your team.
          </DialogDescription>
        </DialogHeader>

        {!roomId ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Room Name
              </label>
              <Input
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => onRoomNameChange(e.target.value)}
                className="bg-[#0d1b2a] border-[#264e63] text-white"
              />
            </div>

            <Button
              onClick={onCreateRoom}
              disabled={!roomName.trim() || !connected || creating}
              className="w-full bg-[#1a6b4a] hover:bg-[#228960] text-white disabled:opacity-50"
            >
              {!connected ? 'Connecting...' : creating ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-[#0d1b2a] rounded-lg border border-[#1b2e44]">
              <p className="text-sm text-[#5a8aad] mb-2">Room Link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-white truncate">
                  {window.location.origin}/{roomId}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onCopyLink}
                  className="h-8 w-8 text-[#5a8aad] hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-2">
                  Link copied to clipboard!
                </p>
              )}
            </div>

            <Button onClick={onJoinRoom} className="w-full bg-[#1a6b4a] hover:bg-[#228960] text-white">
              Join Room
            </Button>
          </div>
        )}

        <DialogFooter className="sm:justify-start">
          <p className="text-xs text-[#5a8aad]">
            Share the link with your team members
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
