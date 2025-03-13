
import { useState, useEffect } from 'react';
import { Platform, platformNames, platformColors } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  className?: string;
}

export const PlatformSelector = ({
  selectedPlatform,
  onSelectPlatform,
  className
}: PlatformSelectorProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const platforms: Platform[] = ['all', 'talabat', 'careem', 'noon', 'deliveroo'];

  return (
    <div className={cn("flex items-center space-x-2 overflow-x-auto py-2", className)}>
      {platforms.map((platform, index) => {
        const isSelected = selectedPlatform === platform;
        const baseClasses = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap";
        
        // Dynamic background color based on platform
        const getBgClass = () => {
          if (platform === 'all') {
            return isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
          }
          
          return isSelected 
            ? `bg-platform-${platform} text-white` 
            : `bg-platform-${platform}-light text-platform-${platform} hover:bg-platform-${platform}-light/80`;
        };
        
        return (
          <button
            key={platform}
            onClick={() => onSelectPlatform(platform)}
            className={cn(
              baseClasses,
              getBgClass(),
              isSelected && "shadow-sm",
              mounted ? `opacity-100` : `opacity-0 translate-y-2`,
              "transition-all duration-300 ease-out",
              {
                "delay-[0ms]": index === 0,
                "delay-[50ms]": index === 1,
                "delay-[100ms]": index === 2,
                "delay-[150ms]": index === 3,
                "delay-[200ms]": index === 4,
              }
            )}
          >
            {platformNames[platform]}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
