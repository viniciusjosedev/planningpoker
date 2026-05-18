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
            'bg-[#2a3a4d] border-[#3a5068]',
            'shadow-lg group-hover:shadow-xl transition-all',
            isSelected && 'border-[#60a5fa] shadow-[#60a5fa]/20 bg-[#3b5998]'
          )}
        >
          <div className="text-xl font-bold text-[#8fa3b8]">?</div>
        </div>

        <div
          className={cn(
            'absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 flex items-center justify-center',
            'bg-white border-[#60a5fa]',
            'shadow-lg'
          )}
        >
          <span className="text-xl font-bold text-[#1a2332]">{value}</span>
        </div>
      </div>
    </button>
  );
}
