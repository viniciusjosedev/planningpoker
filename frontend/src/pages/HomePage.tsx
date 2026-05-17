import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useSocket } from '@/hooks/useSocket';
import { Copy, Plus } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { connect, emit, on } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSpectator, setIsSpectator] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = () => {
    if (!name.trim()) return;

    connect();

    on('roomCreated', (id: string) => {
      setRoomId(id);
    });

    emit('createRoom', name.trim(), isSpectator);
  };

  const handleCopyLink = () => {
    if (roomId) {
      const link = `${window.location.origin}/${roomId}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Planning Poker</h1>
          <p className="text-zinc-400">
            Estimate story points with your team
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full gap-2">
              <Plus className="w-5 h-5" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>
                Enter your name and choose if you want to join as a spectator.
              </DialogDescription>
            </DialogHeader>

            {!roomId ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Your Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-900 border-zinc-700"
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

                <Button
                  onClick={handleCreateRoom}
                  disabled={!name.trim()}
                  className="w-full"
                >
                  Create Room
                </Button>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                  <p className="text-sm text-zinc-400 mb-2">Room Link</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-white truncate">
                      {window.location.origin}/{roomId}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopyLink}
                      className="h-8 w-8"
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

                <Button onClick={handleJoinRoom} className="w-full">
                  Join Room
                </Button>
              </div>
            )}

            <DialogFooter className="sm:justify-start">
              <p className="text-xs text-zinc-500">
                Share the link with your team members
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
