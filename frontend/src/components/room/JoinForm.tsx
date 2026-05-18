import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface JoinFormProps {
  roomId: string | undefined;
  name: string;
  onNameChange: (name: string) => void;
  isSpectator: boolean;
  onSpectatorChange: (isSpectator: boolean) => void;
  onJoin: () => void;
}

export function JoinForm({
  roomId,
  name,
  onNameChange,
  isSpectator,
  onSpectatorChange,
  onJoin,
}: JoinFormProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1a2332]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Join Room</h1>
          <p className="text-[#8fa3b8]">Room: {roomId}</p>
        </div>

        <div className="space-y-4 p-6 bg-[#243447] rounded-xl border border-[#3a5068]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="bg-[#1a2332] border-[#3a5068] text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="spectator"
              checked={isSpectator}
              onChange={(e) => onSpectatorChange(e.target.checked)}
              className="w-4 h-4 rounded border-[#3a5068]"
            />
            <label htmlFor="spectator" className="text-sm text-[#8fa3b8]">
              Join as Spectator
            </label>
          </div>

          <Button onClick={onJoin} disabled={!name.trim()} className="w-full bg-[#3b5998] hover:bg-[#4a6fa5]">
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}
