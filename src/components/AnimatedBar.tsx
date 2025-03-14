
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

  // Convert color class to CSS variable value
  const getProgressColor = () => {
    switch(color) {
      case 'bg-platform-talabat': return '#FF5A00';
      case 'bg-platform-careem': return '#4BB543';
      case 'bg-platform-noon': return '#FEEE00';
      case 'bg-platform-deliveroo': return '#00CCBC';
      case 'bg-primary': return 'hsl(var(--primary))';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{label}</span>
          {showValue && <span className="font-medium">{value}%</span>}
        </div>
      )}
      
      <Progress 
        value={progressValue} 
        className={cn("bg-muted/30", className)}
        style={{ 
          height: `${height}px`,
          '--progress-background': getProgressColor()
        } as React.CSSProperties}
      />
      
      {!label && showValue && (
        <div className="mt-1 text-xs text-right text-muted-foreground">
          {value}%
        </div>
      )}
    </div>
  );
};

export default AnimatedBar;
