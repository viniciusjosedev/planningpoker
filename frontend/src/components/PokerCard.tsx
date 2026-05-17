import { cn } from '@/lib/utils';

interface PokerCardProps {
  value: number | string;
  isSelected?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function PokerCard({
  value,
  isSelected = false,
  isRevealed = false,
  onClick,
  disabled = false,
}: PokerCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative w-16 h-24 perspective-1000',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 transform-style-3d',
          isRevealed && 'rotate-y-180',
          isSelected && 'scale-110'
        )}
      >
        {/* Front of card (face down) */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-lg border-2 flex items-center justify-center',
            'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700',
            'shadow-lg group-hover:shadow-xl transition-shadow',
            isSelected && 'border-white shadow-white/20'
          )}
        >
          <div className="text-2xl font-bold text-zinc-500">?</div>
        </div>

        {/* Back of card (face up - value) */}
        <div
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180 rounded-lg border-2 flex items-center justify-center',
            'bg-gradient-to-br from-white to-zinc-100 border-zinc-300',
            'shadow-lg'
          )}
        >
          <span className="text-2xl font-bold text-black">{value}</span>
        </div>
      </div>
    </button>
  );
}
