
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

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
  const [progressValue, setProgressValue] = useState(animated ? 0 : value);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setProgressValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animated, value]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
        {showValue && <span className="text-sm font-medium">{value}%</span>}
      </div>
      
      <Progress 
        value={progressValue} 
        className={cn("bg-muted/30", className)}
        style={{ 
          height: `${height}px`,
          '--progress-background': '#333333'
        } as React.CSSProperties}
      />
    </div>
  );
};

export default AnimatedBar;
