
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import AnimatedBar from './AnimatedBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MetricCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  className?: string;
  showBar?: boolean;
  barColor?: string;
  isPercentage?: boolean;
  index?: number; // For staggered animation
}

export const MetricCard = ({
  title,
  value,
  icon,
  className,
  showBar = false,
  barColor = "bg-primary",
  isPercentage = false,
  index = 0
}: MetricCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + index * 100);
    
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card className={cn(
      "overflow-hidden h-full transition-all duration-500 hover:shadow-md",
      "opacity-0 translate-y-4",
      isVisible && "opacity-100 translate-y-0",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && (
            <Avatar className="h-10 w-10 bg-muted text-primary">
              <AvatarFallback className={cn(
                "text-white",
                barColor !== "bg-primary" && barColor.replace("bg-", "text-")
              )}>
                {icon}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-light">
            {isPercentage ? `${value}%` : value.toLocaleString()}
          </p>
          
          {showBar && (
            <div className="mt-4">
              <AnimatedBar 
                value={value} 
                color={barColor} 
                height={6} 
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
