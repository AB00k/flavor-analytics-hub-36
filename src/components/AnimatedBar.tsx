
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBarProps {
  value: number;
  maxValue?: number;
  className?: string;
  color?: string;
  height?: number;
  animated?: boolean;
  showValue?: boolean;
  label?: string;
}

export const AnimatedBar = ({
  value,
  maxValue = 100,
  className,
  color = 'bg-primary',
  height = 8,
  animated = true,
  showValue = false,
  label
}: AnimatedBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty('--progress-width', `${(value / maxValue) * 100}%`);
    }
  }, [value, maxValue]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{label}</span>
          {showValue && <span className="font-medium">{value}%</span>}
        </div>
      )}
      <div 
        className={cn("w-full rounded-full bg-muted/30 overflow-hidden", className)}
        style={{ height: `${height}px` }}
      >
        <div
          ref={barRef}
          className={cn(
            color,
            "h-full rounded-full",
            animated ? "animate-progress-fill" : ""
          )}
          style={{ 
            width: animated ? '0%' : `${(value / maxValue) * 100}%`,
            transition: animated ? 'none' : 'width 0.5s ease-out'
          }}
        ></div>
      </div>
      {!label && showValue && (
        <div className="mt-1 text-xs text-right text-muted-foreground">
          {value}%
        </div>
      )}
    </div>
  );
};

export default AnimatedBar;
