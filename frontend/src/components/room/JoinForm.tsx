import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Users, Eye } from 'lucide-react';

interface JoinFormProps {
  name: string;
  onNameChange: (name: string) => void;
  isSpectator: boolean;
  onSpectatorChange: (isSpectator: boolean) => void;
  onJoin: () => void;
}

export function JoinForm({
  name,
  onNameChange,
  isSpectator,
  onSpectatorChange,
  onJoin,
}: JoinFormProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0d1b2a]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1b3a4b] border border-[#264e63] mb-2">
            <span className="text-3xl">♠️</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Planning Poker</h1>
          <p className="text-[#5a8aad] text-sm">Join the room and start estimating</p>
        </div>

        <div className="space-y-5 p-8 bg-[#101d2f] rounded-2xl border border-[#1b2e44] shadow-xl shadow-[#0a1420]/50">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5a8aad]">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && onJoin()}
              className="bg-[#0d1b2a] border-[#264e63] text-white h-12 text-base placeholder:text-[#2a4a63]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5a8aad]">Join as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSpectatorChange(false)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  !isSpectator
                    ? 'bg-[#1b3a4b] border-[#4a90d9] text-white'
                    : 'bg-[#0d1b2a] border-[#1b2e44] text-[#5a8aad] hover:border-[#264e63]'
                )}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Player</span>
                <span className="text-xs opacity-60">Vote on stories</span>
              </button>
              <button
                onClick={() => onSpectatorChange(true)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  isSpectator
                    ? 'bg-[#1b3a4b] border-[#4a90d9] text-white'
                    : 'bg-[#0d1b2a] border-[#1b2e44] text-[#5a8aad] hover:border-[#264e63]'
                )}
              >
                <Eye className="w-6 h-6" />
                <span className="text-sm font-medium">Spectator</span>
                <span className="text-xs opacity-60">Watch only</span>
              </button>
            </div>
          </div>

          <Button
            onClick={onJoin}
            disabled={!name.trim()}
            className="w-full h-12 text-base bg-[#1a6b4a] hover:bg-[#228960] text-white font-semibold disabled:opacity-40 transition-all"
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}
