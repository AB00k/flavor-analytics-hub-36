
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface MetricCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  className?: string;
  showBar?: boolean;
  barColor?: string;
  isPercentage?: boolean;
  index?: number; // For staggered animation
  trend?: { value: number; isPositive: boolean };
}

export const MetricCard = ({
  title,
  value,
  icon,
  className,
  showBar = false,
  barColor = "bg-primary",
  isPercentage = false,
  index = 0,
  trend
}: MetricCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + index * 100);
    
    return () => clearTimeout(timer);
  }, [index]);
  
  useEffect(() => {
    if (isVisible && showBar) {
      setTimeout(() => {
        setProgressValue(value);
      }, 300);
    }
  }, [isVisible, value, showBar]);
  
  // Determine icon background color based on barColor
  const getIconBgColor = () => {
    switch(barColor) {
      case 'bg-platform-talabat': return 'bg-[#FF5A00]';
      case 'bg-platform-careem': return 'bg-[#4BB543]';
      case 'bg-platform-noon': return 'bg-[#FEEE00]';
      case 'bg-platform-deliveroo': return 'bg-[#00CCBC]';
      case 'bg-blue-500': return 'bg-[#2B7CD3]'; // Blue funnel icon
      case 'bg-red-500': return 'bg-[#E53E3E]';  // Red food icon
      case 'bg-purple-600': return 'bg-[#9333EA]'; // Purple menu icon
      case 'bg-green-500': return 'bg-[#4BB543]'; // Green menu icon
      default: return 'bg-primary';
    }
  };
  
  // Determine icon text color
  const getIconTextColor = () => {
    // For noon (yellow) and other light colors, use dark text for better contrast
    if (barColor === 'bg-platform-noon' || barColor === 'bg-photos') return 'text-gray-800';
    return 'text-white';
  };

  return (
    <Card className={cn(
      "overflow-hidden h-full transition-all duration-500 hover:shadow-md",
      "opacity-0 translate-y-4",
      isVisible && "opacity-100 translate-y-0",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Left side - Icon */}
          {icon && (
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
              getIconBgColor()
            )}>
              <div className={getIconTextColor()}>
                {icon}
              </div>
            </div>
          )}
          
          {/* Right side - Content */}
          <div className="space-y-2 flex-1">
            {/* Trend indicator if provided */}
            {trend && (
              <div className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "↗" : "↘"} {trend.value > 0 ? "+" : ""}{trend.value}
              </div>
            )}
            
            {/* Title */}
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            
            {/* Value */}
            <p className="text-3xl font-bold">
              {isPercentage ? `${value}%` : value.toLocaleString()}
            </p>
            
            {/* Progress bar */}
            {showBar && (
              <div className="mt-3">
                <Progress 
                  value={progressValue} 
                  className="h-1.5 bg-muted"
                  style={{ 
                    '--progress-background': '#333333'
                  } as React.CSSProperties}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
