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
        'group relative w-14 h-20 perspective-1000',
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
        <div
          className={cn(
            'absolute inset-0 backface-hidden rounded-xl border-2 flex items-center justify-center',
            'bg-[#0f2940] border-[#4a90d9]',
            'shadow-lg group-hover:shadow-xl group-hover:border-[#6ab0ff] transition-all',
            isSelected && 'border-[#6ab0ff] shadow-[#4a90d9]/30 bg-[#1a5cb0]'
          )}
        >
          <span className={cn(
            'text-xl font-bold',
            isSelected ? 'text-white' : 'text-[#5a8aad]'
          )}>
            {value}
          </span>
        </div>

        <div
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 flex items-center justify-center',
            'bg-white border-[#4a90d9]',
            'shadow-lg'
          )}
        >
          <span className="text-xl font-bold text-[#0d1b2a]">{value}</span>
        </div>
      </div>
    </button>
  );
}
